# CONSTITUTION.md

> **Location**: Target warehouse `docs/CONSTITUTION.md`
> **For**: When someone wants to deviate from principles/decisions are conflicting
> **Relationship**: CLAUDE.md (operation instructions) → ARCHITECTURE.md (technical details) → **CONSTITUTION.md (why the decision is made + when it can be changed + how to resolve conflicts)**
>
> **Version**: v3.0 (2026-05-05, aligned ADR-001-rev / ADR-013 / ADR-014 / ADR-015 / ADR-016)
>
> **v3.0 core changes**:
> - 🔄 ADR-001 → ADR-001-rev: Agent number reverse (2=document/3=picture/4=video)
> - 🔄 ADR-008 Abandoned → ADR-014: Three-mode same-group switching
> - 🔄 ADR-012 Abandoned: V1 hero = short video + e-commerce details (return)
> - ✨ ADR-013 / 015 / 016 New

---

## 1. The purpose of this document

**It's not about teaching you to do things** (that's CLAUDE.md), **it's about explaining why you must do what you do** and **how to resolve conflicts**.

Any proposal that wants to "bypass" or "modify" the 16 principles/12 ADRs should first go back to this document and read it again → still think it should be changed → go through the governance process.

---

## 2. Detailed explanation of the 16 iron rules

### 2.1 Single Scheduler (Principle 1)

The main orchestration agent is the **only dispatcher** of the system. Between Agent 1-4:

- not mutual @
- No direct conversation
- No direct connection to HTTP/RPC
- Do not cross-tune handlers

**Why**:

- The main orchestrator is the "global view" - only it knows the overall progress of the task, can correctly allocate interruptions, and can keep accounts (cost/time-consuming/quality)
- Avoid circular dependencies and deadlocks
- Observability: All step states are in LangGraph state, so that the right column of the front end can be displayed correctly.
- Fault isolation: If an Agent fails, it will not be infected through cross-modulation chain

**Violation Scenario**: Someone wants Agent 4 to directly call Agent 1 to write the outline when doing PPT.

**Correct approach**: Explicitly split the Skill YAML into three steps: `ppt_outline (agent_1) → ppt_images (agent_2) → ppt_assemble (agent_4)`.

### 2.2 Agent number lock (Principle 2 / ADR-001-rev, v3.0 reverse lock)

```
Agent 1 = 文字       = agent_tasks:text
Agent 2 = 文档专员   = agent_tasks:document
Agent 3 = 设计师     = agent_tasks:image
Agent 4 = 影音师     = agent_tasks:av
```

**Why this mapping (v3.0 final version)**:

- Consistent with the product description of the final version of "Nexis" from the product side
- The digital progression corresponds to the "content creation link" (text → document → image → video, from light to heavy)
- The Agent correspondence between short video and e-commerce detail picture scenes has been corrected (decided by the product side)

**Historical changes**:

- v1.x Implementation Guide used Agent 2=Documentation/Agent 3=Picture/Agent 4=Video
- v2.0 ADR-001 changed to Agent 2=Picture/Agent 3=Video/Agent 4=Documentation
- v3.0 ADR-001-rev changed back to Agent 2=Document/Agent 3=Picture/Agent 4=Video (final version from the product side)

**v3.0 will not change after being locked**.

### 2.3 Explicit separation of cross-capability steps (Principle 3 / ADR-002)

Agent **cannot call** `call_other_agent`. The `call_other_agent` function in the code permanently raises `NotImplementedError`, as defensive programming.

**Correct paradigm**:

```yaml
# ❌ 错误
- step_id: ppt_create
  agent: agent_4
  prompt: |
    生成大纲(自己跨调 Agent 1)
    生成配图(自己跨调 Agent 2)
    组装 PPT

# ✅ 正确
- step_id: ppt_outline
  agent: agent_1
- step_id: ppt_images
  agent: agent_2
  depends_on: [ppt_outline]
- step_id: ppt_assemble
  agent: agent_4
  depends_on: [ppt_outline, ppt_images]
  inputs:
    outline: "{{ppt_outline.output}}"
    images: "{{ppt_images.output}}"
```

### 2.4 State uses references (Principle 4)

All products in LangGraph state only exist:

```python
class Artifact:
    artifact_id: UUID
    type: Literal["text", "image", "video", "structured", ...]
    reference: str               # oss://bucket/path
    metadata: dict
```

**Never Save**:
- `full_content: str` (a few MB of text)
- `image_bytes: bytes` (a few MB images)
- `transcript_full: str` (a few KB)

**Why**:

- LangGraph PostgreSQL checkpointer serializes state for each update - storing the full text results in GB-level writes per second
- Serialization explosion when Agent transfers state across processes
- Printing state during debugging makes it difficult to see the key points

**Exception**: Small text < 1KB (such as brief field, user preference scalar) can be stored directly.

### 2.5 Long task asynchronous (Principle 5)

Video synthesis takes 5-10 minutes and cannot block the Agent process.

**accomplish**:

```python
async def video_compose_handler(task, model):
    workflow_id = celery_app.send_task("video_compose_workflow", args=[payload]).id
    return AgentResult(status="pending_external", external_workflow_id=workflow_id)
```

After Celery is completed, it calls `notify_langgraph_complete(callback_queue, ...)`, and the main orchestrator LangGraph monitors the queue recovery task.

**Judgment Criteria**: Any handler expected to take > 60 seconds must use Celery.

### 2.6 Always multiple choice questions (Principle 6)

Clarification does not allow users to fill in the blanks. 4 forms:

1. Single field radio selection (3-4 buttons)
2. Multi-field merging (2-3 fields are asked at one time)
3. Picture comparison (3 sample pictures)
4. Content version comparison (real-time adjustment of Agent 1 to generate version 3)

**constraint**:
- Each field must have a default (default will be used automatically after 60 seconds of timeout)
- No more than 5 rounds (use default for more than 5 rounds)
- Preference confidence ≥ 1.0 is automatically applied, no more questions asked

**Violation Example**: Ask the user to write a paragraph describing the style — ❌
**Correct example**: [Simple] [Natural] [Technological sense] [Customized] — ✓

### 2.7 LLM goes LiteLLM (Principle 7 / ADR-007)

**Forbidden**: `import openai` / `import anthropic` and other SDKs directly adjust the model.

**Unified entrance**:`from app.router import complete`

```python
response = await router.complete(
    task_type="short_video_script",          # 决定路由
    messages=[...],
    routing_hints={"primary": "deepseek-v4-pro"},
    response_format={"type": "json_object"}
)
```

**Why**:

- Automatic switching between active and standby models (health awareness)
- Unified cost audit (LiteLLM dashboard)
- Unified current limit
- No need to handle 4 model SDK differences per call point

**Exception**: Embedding models (BGE-M3 self-hosted) use their own HTTP API, not LiteLLM.

### 2.8 Prompt is not inlined (Principle 8)

**prohibit**:

```python
response = await router.complete(
    messages=[{"role": "system", "content": "你是一个短视频写作专家..."}]   # 字面量
)
```

**correct**:

```python
from app.config.prompts import SHORT_VIDEO_SCRIPT_PROMPT

response = await router.complete(
    messages=[{"role": "system", "content": SHORT_VIDEO_SCRIPT_PROMPT}]
)
```

**Why**:

- Prompt management unified (version number + grayscale)
- A/B test framework can replace prompts in batches
- Fix the prompt and go through PR review instead of secretly changing the business code
- Centralized maintenance of Prompt regression test set

### 2.9 Skill YAML is a contract (Principle 9)

Skill behavior changes:

- ✓ Change YAML + version bump(`v1.0 → v1.1`)
- ✗ Change the Python code (handler is universal, not specific to skills)

**Why**:

- Creators can write Skills (V1.5) without changing the code
- The Skill compilation result is cached to Redis according to `(skill_id, version)`, and is recompiled after the version is changed.
- Grayscale new version of Skill: v1.1 and v1.0 at the same time, A/B test

### 2.10 Dialog Priority Button (Principle 10)

**Talk to the President’s Assistant**:

- Create groups, change groups, and coordinate across groups
- Subscribe to Skills, search history
- System-level Q&A and preference management

**Go Button**:

- Enter an existing session
- Upload materials and download products
- Modify personal information, private chat Agent

**Judgment Criteria**: When it comes to "building/configuring/creating", use dialogue; "operate specific objects", use buttons.

### 2.11 Don’t write code for V2 (Principle 11)

V1 does not implement: C/D full version (C simplified version in V1), Skill creation market (V1.5), Agent learning, creator profit sharing, multi-person collaboration group, [Make the same style] button, voice message (V1.5).

**The interface can be reserved** (database table / API endpoint / configuration item), no actual logic is required.

**Why**:

- 8 thoughtful V1-P0 time is tight
- V2 function has not been verified by PMF, which is a waste
- Interface reservation ensures that V2 upgrade does not require destructive changes

### 2.12 Failure 3 layers of cover (Principle 12)

Any LLM/tool ​​calls must:

1. **Retry 1-3 times** (exponential backoff, temporary error)
2. **Cut backup model** (LiteLLM automatic)
3. **Return user-friendly error + suggest next steps**

**Never allowed**:

- `except: pass`
- Fail silently (return None)
- Throwing an exception causes the entire task to crash

---

### 2.13 MCP is the only standard for tool integration (Principle 13 / ADR-009)

See `docs/3_Decision Record/MCP Integration Solution.md` for details.

**Core Rules**:

- Tools (Tavily / Playwright / FFmpeg / PIL / python-pptx, etc.) → MCP server
- Model (GPT-Image-2 / Veo-3 / Volcengine TTS) → LiteLLM
- Agent handler is called via `mcp_client.call_tool(server, tool, arguments)`
- **Disable** direct `import tavily / from playwright import ...` (in handler)

**Exception**: Server implementations in the `mcp_servers/` directory can directly import the tool SDK - they are the backend of the MCP server.

### 2.14 Hero delivered with HITL gate (Principle 14 / ADR-010)

Video tasks require 3 gates:

1. **Script review**(version_select): The user selects A/B/C or requires rewriting
2. **Image review**(quality_review): User selection/replacement/regeneration
3. **Video Final Approval** (final_approval): Accept / Adjust / Roll Back (Interruption C)

The e-commerce detail map task requires at least 1 gate:

- **Picture review**: After the picture is generated in step 4, the user can regenerate the leaflet

**V1 must support interrupt C** (original V2 was postponed and advanced):

- The user chooses "Go back to step N and redo" in the final review
- Main choreography: Calculate affected_steps → Retain the old product plus version number → LangGraph rollback → Restart from N steps

**Why**:

- Video generation model success rate is 70-85%, no HITL equals gambling
- Redoing the entire 8 minutes is 3-5 times more expensive than "rolling back to step N"
- HITL is the critical moment when users feel that the "AI team" is working for them

### 2.15 Data Flywheel Category 4 signals must be precipitated (Principle 15 / ADR-011)

Each task completion must generate 4 types of signals:

| # | signal | storage | purpose |
|---|------|------|------|
| 1 | Complete track of workflow | Qdrant + OSS | RAG enhances understanding of main orchestration intent |
| 2 | User preference vector | Postgres pgvector (256 dimensions) | Dynamic ranking of candidate options |
| 3 | Failed → Reflexion | Postgres prompt_improvement_candidates | Improvement prompt(human review)|
| 4 | High Satisfaction → Skill Drafts | Postgres skill_drafts | Creator Flywheel (V1.5) |

**CI Mandatory**: Any PR that modifies the task completion path must retain Type 4 signal precipitation, otherwise it will fail.

**Why**:

- The probability of AI application products without a flywheel being eaten up by foundation model upgrades within 3 years is > 70% (SV CTO evaluation)
- Type 4 signals are all low-cost deposits and do not affect the main process.
- Once the flywheel starts spinning, product value continues to grow

### 2.16 Vertical Priority (Principle 16, v3.0: ADR-012 Obsolete)

V1 hero SKU = **Short video + e-commerce details** (Final version decision from the product side, 2026-05-05)

> ⚠️ There was ADR-012 "V1 hero locked short video" in the v2.0 era, which has been abandoned. The short video is downgraded to V1.5 and supplemented through the Skill Market.

2 must-do skills for V1:
- **Short video production** (community promotion / Douyin placement)
- **E-commerce detail map production** (SMB merchants)

V1.5 is supplemented through the Skill Market: short video production, posters, long articles, PPT, etc.

**Why**:

- Vertical products are easier to finance than horizontal agent platforms / PMF
- The short video track has a monthly active user base of over 900 million, with a strong willingness to pay.
- Short videos are government procurement (original V1 plan) and have no natural growth engine
- The horizontal agent platform is the Red Ocean (Manus, Coze, OpenAI Operator, etc.)

---

## 3. ADR index (v3.0, 12 items in effect + 3 items obsolete)

| ID | Title | Status |
|----|------|-----|
| **ADR-001-rev** | **Agent number reverse (v3.0): 1=text/2=document/3=picture/4=video** | **Effective** |
| ~~ADR-001~~ | ~~Agent number v2.0 (2=Picture/3=Video/4=Document)~~ | Obsolete |
| ADR-002 | Agent does not actively cross-deploy other Agents | Effective |
| ADR-003 | Unified Master Orchestration Implementation Guidelines | Effective |
| ADR-004 | Principles/Engineering split | Effective |
| ADR-005-rev | Audio belongs to Agent 4 Video Engineer (v3.0) | Valid |
| ADR-006 | Brief anti-shake batch update strategy | Effective |
| ADR-007 | Model routing is divided into two layers (L1/L2) | Effective |
| ~~ADR-008~~ | ~~Two independent groups: discussion group/working group~~ | Obsolete, replaced by ADR-014 |
| ADR-009 | MCP protocol as the only standard for tool integration | Effective |
| ADR-010 | Hero deliverables must have HITL gate | To take effect |
| ADR-011 | Data flywheel type 4 signal precipitation must be done | Valid |
| ~~ADR-012~~ | ~~V1 hero locks short video~~ | Canceled, V1 hero returns to short video + e-commerce details |
| **ADR-013** | **2 Support Agents (HR + Financial Manager)** | **Effective** |
| **ADR-014** | **Three modes intra-group switching (Plan/Ask/Auto)** | **Effective** |
| **ADR-015** | **Agent Personification V1 Must Do** | **Effective** |
| **ADR-016** | **Simplified left column navigation** | **Effective** |

See `docs/3_Decision Record/Open Issues and Resolutions.md` for details.

---

## 4. What not to do (category 7 hard prohibition)

### 4.1 Architectural Taboos

- ❌ `call_other_agent` cross-call
- ❌ Agent uses HTTP/RPC direct connection
- ❌ The main editor generates content by himself
- ❌ Skill full text into LLM
- ❌ State save the full text
- ❌ Directly adjust the tool SDK in the Agent handler (MCP client must be used)
- ❌ New tools are not exposed as MCP server

### 4.2 Model/Prompt Taboo

- ❌ `import openai` / `import anthropic` and other SDKs to adjust the model
- ❌ Prompt literal inline code
- ❌ Agent decides the model by itself (routing_hints must be used)
- ❌ Skip Pydantic JSON Schema validation
- ❌ Change prompt to not update regression test yaml

### 4.3 User experience taboos

- ❌ Let users fill in the blanks for clarification
- ❌ Add buttons to replace dialogue (violates principle 10)
- ❌ emoji (using lucide-react)
- ❌ Expose the internal process of Agent collaboration (users only see Agent appearances, not scheduling)
- ❌ A group of multi-taskers
- ❌ Hero mission has no HITL gate
- ❌ V1 does not support interrupt C

### 4.4 Data/Status Taboos

- ❌ Share messages across groups (each group is independent)
- ❌ Provincial LangGraph PostgreSQL checkpointer
- ❌ Send OSS credentials to the client
- ❌ Store token / API key in plain text in database
- ❌ Skip quota checks
- ❌ No flywheel type 4 signal is written when the task is completed
- ❌ Training data without user authorization

### 4.5 Range taboos

V1 does not implement:

- Interrupt D (change direction, fork graph)
- Skill Creation Market (V1.5)
- Agent training (V2)
- Creator profit sharing mechanism (V2)
- Multi-person collaboration group (V2)
- Merge multiple discussion groups (V2)
- [Make the same style] / [Join this team] One-click replica button (V2)
- Voice messages (V1.5)
- Poster template / long article creation / PPT (V1.5)
- Change Agent number mapping
- Change task_type naming
- Give up MCP and go back to direct connection

### 4.6 Business Taboos

- ❌ Go online directly without making a paid version ("pay later" is a financing deception)
- ❌ Directly release the free quota without counting the unit economy
- ❌ Continue investing in channels with CAC > LTV/3
- ❌ Watch the creator flywheel "increase users" and ignore active GTM

### 4.7 Engineering Taboos

- ❌ Save MCP integration testing
- ❌ Save HITL Playwright Test
- ❌ PR check for data-saving flywheel signal precipitation
- ❌ A single container can run multiple agents
- ❌ Agent runs GPU-intensive tasks (should use Celery GPU node)
- ❌ Directly connect to prod database across namespaces
- ❌ Submit .env into git
- ❌ Skip Alembic migration
- ❌ Use print to log (use structlog)
- ❌ except Exception: pass

---

## 5. Decision matrix (how to resolve conflicts)

### 5.1 Document Conflict

```
CLAUDE.md 与 ARCHITECTURE.md 冲突 → 以 CLAUDE.md 为准(操作指令更新更频繁)
ARCHITECTURE.md 与 docs/2_工程实现 冲突 → 以 ARCHITECTURE.md 为准(更顶层)
ADR 与 任何文档 冲突 → 以 ADR 为准(治理决策最高)
```

### 5.2 Conflict of principles

```
铁律 (原则 16 条) 与 任何"代码风格 / 个人偏好" 冲突 → 以铁律为准
铁律之间冲突(罕见) → 走治理流程开 issue
```

### 5.3 V1 scope conflict

```
"产品想要 X" 但 X 在 V2 范围 → 拒绝,接口预留
"工程觉得 V2 的 Y 应该提到 V1" → 评估:必要性 + 工时 + ADR-011 飞轮影响
  → 必须修订 ADR(走治理流程)
```

### 5.4 Conflicts between ADRs

rare. If it happens (such as ADR-002 without cross-modulation vs ADR-009 MCP tool reuse):

- Write new ADR (ADR-NNN-revision) tag supersedes old version
- The old ADR status changed to "obsolete"
- Do not modify old ADR directly

---

## 6. Governance Process

### 6.1 New ADR

1. Add "Draft ADR-NNN" at the end of `docs/3_Decision Record/Open Issues and Resolutions.md`
2. Engineering + product double signing
3. Change the status to "Adopted" and update relevant documents (CLAUDE.md / ARCHITECTURE.md / business documents)
4. Tick the landing status

### 6.2 Revised ADR

1. **Do not change the content of the adopted ADR** (retain history)
2. Added ADR-NNN-revision, marked supersedes old version
3. The old ADR status changes to "obsolete"
4. Synchronously update all documents referencing the old ADR

### 6.3 prompt changes

Add version number + checksum to each prompt:

```python
ORCHESTRATOR_INTENT_PROMPT = """..."""
ORCHESTRATOR_INTENT_PROMPT_VERSION = "v1.0.0"
```

New version of prompt online process:

1. Write a new version, marked v1.0.1
2. LiteLLM routing `prompt_version_split: {v1.0.0: 90%, v1.0.1: 10%}`
3. Monitor key indicators 24 hours a day
4. Full/rollback

### 6.4 Skill changes

1. Skill YAML change + version bump(v1.0 → v1.1)
2. Launch v1.0 and v1.1 at the same time, A/B test
3. Observe user satisfaction within 7 days
4. Full/rollback

### 6.5 Business/Unit Economy Changes

1. Update `docs/3_Decision Record/Business Model and Unit Economics.md`
2. Synchronization CLAUDE.md §4
3. Add ADR if necessary

---

## 7. V1 / V1.5 / V2 range

### V1 (8 weeks to P0, 3 months to full)

V1-P0:
- Main orchestration 8 sub-modules
- 4 Agents + 1 happy-path handler each
- **Short Video Skill** (hero, 3 HITL gate + interrupt C)
- 7 MCP servers (can only be happy path)
- Data Flywheel Category 4 Signal
- Three columns on the front end + HITL component
- Docker Compose dev

V1-P1(within 3 months):
- E-commerce details map Skill
- Complete quota system
- Reflexion / Skill Drafter pipeline real run
- K8s production deployment
- Monitor the market + alert

V1-P2(within 6 months):
- Continue running offline
- Cross-group message search
- Preference portrait visualization
- BGM material library expansion

### V1.5(June-September)

- Skill creation market (open to creator flywheel)
- Preference portrait visualization
- Platform publishing integration (Douyin/Video account/Xiaohongshu API)
- Poster template / long article / PPT Skill online

### V2(9-18 months)

- Interrupt D (change direction, fork graph)
- Agent training (corpus + LoRA fine-tuning)
- Profit sharing for creators
- Multi-person collaboration group
- Overseas markets (English TikTok)
- Self-developed short video model

---

## 8. Any proposal to modify the V1 scope must go through the process

```
1. 在 docs/3_决策记录/开放问题与决议.md 提"草案"
2. 评估:
   - 必要性(用户调研支持?)
   - 工时(本 Sprint 还是后续 Sprint?)
   - ADR-011 飞轮影响
   - 单位经济影响
3. 工程 + 产品 + 增长 三方签字
4. 修订相关 ADR(必要时)
5. 同步 CLAUDE.md / ARCHITECTURE.md
```

**Forbidden**: "Do it first and then talk about it later" without changing the document.

---

## 9. One sentence

> **The iron rule is to save everyone decision-making time - not to restrict you**.
>
> If you feel that a certain iron law is blocking the right thing, **Ask yourself first**: Is this iron law wrong, or is the direction you want to deviate from wrong?
>
> 90% of the time it's the latter. The remaining 10% goes through the governance process.