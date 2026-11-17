# ARCHITECTURE.md

> **Location**: Target warehouse `docs/ARCHITECTURE.md`
> **For**: Engineers check specific technical decisions before/while writing code
> **Relationship**: CLAUDE.md (operation instructions) → ARCHITECTURE.md (technical details) → docs/3_Decision record (why we made this decision)
>
> **Version**: v3.0 (2026-05-05, aligned ADR-001-rev / ADR-013 / ADR-014 / ADR-015 / ADR-016)
>
> **v3.0 Key Changes**:
> - 🔄 Agent number reverse (ADR-001-rev): **Agent 2=Document/Agent 3=Picture/Agent 4=Video**
> - ✨ 7 AI roles (President Assistant + 4 tasks + HR + Financial Manager)
> - ✨ Three modes of group switching (Plan / Ask / Auto)
> - ✨ Agent personification (expression + status + interaction)
> - ✨ Simplify the left column (knowledge base / achievement base promotion)

---

## 1. Warehouse structure skeleton

The top level only retains **essential files in the root directory** + three major modules `backend/`, `agents/`, and `frontend/`.

```
./
├── CLAUDE.md
├── README.md
├── GETTING_STARTED.md
├── .env.example
│
├── backend/ # FastAPI, DB, API, Celery, operation and maintenance and engineering documents
│   ├── app/
│ ├── infrastructure/ # Docker / compose / k8s / litellm / postgres initialization
│ ├── docs/ # ARCHITECTURE, ADR, online runbook, copies of architecture documents, etc.
│   ├── scripts/
│ ├── skills/ # Skill YAML (main arrangement contract)
│   ├── flywheel/
│   ├── alembic/
│   └── tests/
│
├── agents/ # Agent module: Python package + MCP tool process
│ ├── agents/ # Importable package name `agents` (main orchestrator + 4 workers + _common)
│ │ ├── orchestrator/ # LangGraph main orchestrator
│   │   ├── text/ / document/ / image/ / av/
│   │   └── _common/
│ ├── mcp_servers/ # 7 MCP HTTP services (independent pyproject)
│   └── pyproject.toml
│
└── frontend/                     # Next.js 15
```


---

## 2. Complete technology selection (13 categories)

> All version numbers are the **minimum version limit**, which can go up but not down.

### 2.1 Runtime and basic language

| Item | Selection | Version |
|----|------|-----|
| Python | CPython | 3.12+ |
| Node | Node.js | 20 LTS+ |
| TypeScript | Force enabled | 5.4+ |
| Package management (backend)| **uv** | Latest |
| Package management (front-end) | **pnpm** | 9+ |
| Mirror basics | python:3.12-slim + node:20-alpine | |

### 2.2 Backend framework

| Item | Selection | Version | Purpose |
|----|------|-----|------|
| Web | **FastAPI** | 0.115+ | |
| ASGI | uvicorn | 0.32+ | --workers multi-process |
| Verification | **Pydantic v2** | 2.9+ | |
| Settings | Pydantic Settings | 2.6+ | |
| ORM | **SQLAlchemy 2.0 async** | 2.0+ | |
| DB driver | asyncpg | 0.30+ | |
| Migration | Alembic | 1.13+ | |
| Authentication | FastAPI Users | 12.x | JWT + SMS |
| Redis | redis-py async | 5.x | streams + pubsub + lua |
| HTTP | **httpx** | 0.27+ | Fully asynchronous |
| Task queue | Celery | 5.4+ | broker=Redis |
| Orchestration engine | **LangGraph** | 0.2+ | + langgraph-checkpoint-postgres |
| LLM Gateway | **LiteLLM Proxy** | 1.50+ | Standalone Container |
| MCP | mcp Python SDK + @modelcontextprotocol/sdk | latest | ADR-009 |
| Log | **structlog** | 24+ | JSON with task_id |
| Bug Tracking | Sentry SDK | 2.x | prod |
| Tracing | OpenTelemetry | 1.27+ | Jaeger backend(V1.5)|
| Code quality | **ruff** + **mypy --strict** | 0.7+ / 1.13+ | |

### 2.3 Data/Storage/Middleware

| Item | Selection | Usage |
|----|------|------|
| Relational database | PostgreSQL 16 + pgvector 0.7+ | Main database, 18 tables |
| Vector library (standalone)| **Qdrant 1.13+** | Workflow trace RAG(ADR-011)|
| Cache/Queue | Redis 7.2+ | |
| Object storage prod | Alibaba Cloud OSS | |
| Object storage dev | MinIO | |
| OSS client | oss2 / boto3 | |
| Chinese word segmentation | jieba 0.42+ | Skill keyword search |
| Embedding(retrieval)| **BGE-M3 Self-hosted** | 1024 dimensions |
| Embedding(preference)| **bge-base-zh-v1.5** | 256 dimensions |
| SMS | Alibaba Cloud SMS | |
| OCR | Tesseract + Alibaba Cloud OCR | MCP server packaging |

### 2.4 Front-end

| Item | Selection | Remarks |
|----|------|------|
| Framework | Next.js 15 App Router | RSC + Server Actions |
| UI | shadcn/ui + Radix | |
| Styles | Tailwind v4 | |
| icons | lucide-react | **no emoji** |
| Status | Zustand 4+ | |
| Data | TanStack Query v5 | |
| form | react-hook-form + zod | |
| Video | shaka-player + native video | HITL video preview |
| date | dayjs | |
| Markdown | react-markdown + remark-gfm | |
| code highlighting | shiki | |
| WS | Native + self-encapsulated reconnection | No socket.io |
| PWA | next-pwa | |
| Lint | ESLint 9 + Prettier 3 (or Biome) | |
| Single test | Vitest 2 | |
| E2E | Playwright 1.48 | |
| Package management | pnpm workspace | |

### 2.5 Agent System (MCP-first)

The tool is no longer hard-coded in the Agent handler, but is deployed independently in the form of **MCP server**.

V1 must go online with 7 MCP servers:

| Server | Implementation | tools |
|--------|------|------|
| `mcp-search` | Python | web_search / web_fetch |
| `mcp-image-tools` | Python | bg_remove / enhance / concat_long / quality_check |
| `mcp-video-tools` | Python(GPU)| compose / extract_frames / subtitle_align |
| `mcp-audio-tools` | Python | tts / asr / bgm_match |
| `mcp-document-tools` | Python | pptx / xlsx / docx / pdf |
| `mcp-oss` | Python | upload / download / sign_url |
| `mcp-platform-publish`(V1.5)| TypeScript | douyin / xhs / wechat |

**Agent handler calling paradigm**:

```python
from agents._common.mcp_client import mcp_client

# Not allowed: from tavily import TavilyClient
# allow:
results = await mcp_client.call_tool(
    server="search",
    tool="web_search",
    arguments={"query": "...", "max_results": 5}
)
```

**Exception**: Generative models (GPT-Image-2 / Veo-3 / Volcengine TTS) use LiteLLM, **not** use MCP.

See `docs/3_Decision Record/MCP Integration Solution.md` for details.

### 2.6 Model routing (L1 orchestration layer)

| Role | Model |
|------|------|
| Main force | `deepseek-v4-flash` |
| Preparation 1 | `claude-haiku-4-5` |
| Preparation 2 | `gpt-5-mini` |

Call points: Intent understanding, Skill matching, interruption classification, Brief maintenance, HITL user decision analysis, rollback target calculation, MCP tool decision-making.

### 2.7 Model routing (L2 execution layer)

Select a model by task_type. For the complete list, see `docs/4_Appendix/Model Routing Table.md`. Short video core:

| task_type | Main | Backup |
|-----------|------|-----|
| short_video_script | deepseek-v4-pro | kimi-k2 / claude-sonnet-4-6 |
| short_video_hook | claude-sonnet-4-6 | gpt-5 |
| image_generate(real)| gpt-image-2 | seedream-3 |
| image_generate(cartoon)| nano-banana-2 | seedream-3 |
| image_to_video | seedance-2 | kling-2 / veo-3 |
| text_to_video | veo-3 | seedance-2 |
| tts_generate | volcengine-tts | aliyun-tts |
| audio_to_text | whisper-v3 self-hosted | aliyun-asr |
| bgm_select | (material library, no LLM) | - |

### 2.8 Deployment / DevOps

| Item | Selection |
|----|------|
| Containers | Docker + buildx |
| dev | Docker Compose v2 |
| prod | K8s 1.30+(Alibaba Cloud ACK)|
| GitOps | ArgoCD |
| Helm | 3.16+ |
| Secret | K8s Sealed Secrets |
| Gateway | Nginx Ingress Controller |
| CDN | Alibaba Cloud CDN (video mp4 key) |
| Container Warehouse | Alibaba Cloud ACR |
| Celery dashboard | Flower 2+ |
| LLM dashboard | LiteLLM comes with |

### 2.9 CI / CD

| Item | Selection |
|----|------|
| CI | GitHub Actions |
| CD | ArgoCD(main → staging automatic)|
| Image Scan | Trivy |
| Grayscale | K8s rolling + ArgoCD |
| Lint(Python) | ruff check |
| Type(Python) | mypy --strict |
| Test coverage | Backend 70% / Frontend 60% |
| Special CI check | MCP integration / HITL Playwright / Flywheel signal PR check / Prompt regression |

### 2.10 Monitoring / Observable

| Dimensions | Selection |
|-----|------|
| Metrics | Prometheus + Grafana |
| Log | Loki + Promtail |
| Tracing | Jaeger(V1.5)|
| Error Tracking | Sentry |
| Uptime | Alibaba Cloud Monitoring |

### 2.11 Test

| Dimensions | Selection |
|-----|------|
| Backend single test | pytest + pytest-asyncio + pytest-cov |
| Integration | pytest + httpx.AsyncClient + testcontainers |
| Prompt regression | Custom pytest fixtures + yaml |
| load | locust |
| E2E | Playwright |
| Front-end single test | Vitest + @testing-library/react |
| Mock | respx + fakeredis + pytest-mcp |

### 2.12 Security/Compliance

| Item | Selection |
|----|------|
| HTTPS | cert-manager + Let's Encrypt |
| CORS | Strict whitelist |
| Authentication | JWT in Authorization header |
| Content Security | Alibaba Cloud Content Security |
| Rate limit | slowapi (IP grouping, default 120 RPM; `/sms/send`, `/login` and then superimpose stricter quotas) |
| Filing | Algorithm Filing + Generative AI Service Filing |

### 2.13 Do not introduce these (discuss later)

| Useless | Reason |
|------|-----|
| Temporal | V1 Celery Enough |
| Kafka | Redis Streams Enough |
| ElasticSearch | Qdrant + pgvector + pg_trgm is enough |
| Socket.io | FastAPI WS + Redis Pub/Sub |
| GraphQL | REST Enough |
| Istio | K8s native service is enough |
| Vault | Sealed Secrets Enough |
| React Native | V1 PWA |

---

## 3. Overview of main orchestration 9 sub-modules (v3.0)

| # | Submodules | Tuning LLM | Main responsibilities | Model |
|---|--------|-------|---------|------|
| 1 | Intent Understander | ✅ | Natural Language → Intent JSON (including mode switching recognition) | L1 |
| 2 | Skill Matcher | 99% Improper | L1 Keyword / L2 Vector / L3 LLM | L1 Digging |
| 3 | Input validator | ❌ | Are the fields complete | - |
| 4 | Clarification Generator | Most Not Adjusted | 4 Clarification Forms | L1 |
| 5 | Task Orchestrator | ❌ | Jinja2 rendering + AgentTask packaging | - |
| 6 | Interrupt handler | ✅ | 8 types of interrupt classification (including V1 interrupt C rollback) | L1 |
| **7** | **Three-mode manager** | ✅(brief)| **Plan / Ask / Auto group switching** + brief maintenance | L1 |
| 8 | HITL Gateway Manager | Half | Pause waiting for user at critical node | L1 |
| **9** | **Agent Interaction Orchestrator**(v3.0)| ✅ | Arrange handover conversations between Agents when dispatching | L1 |

Detailed implementation: `docs/2_Engineering Implementation/Main Orchestration Agent Implementation Guide.md`

---

## 4. 4 sub-task Agent boundaries (v3.0 ADR-001-rev)

| Agent | Role | Queue | Main task_type | Long task |
|-------|-----|------|--------------|------|
| 1 | Researcher/Copywriter | `agent_tasks:text` | short/long/structured_writing / web_search | No |
| **2** | **Document Specialist** | `agent_tasks:document` | pptx_assemble / xlsx_assemble / pdf_extract / image_concat_long | No |
| **3** | **Designer** | `agent_tasks:image` | image_generate / batch_generate / image_download / quality_check | No |
| **4** | **AV** | `agent_tasks:av` | text_to_video / image_to_video / video_compose / tts / bgm_select | **YES**(Celery)|

**+ 2 supported Agents** (resident master session, ADR-013):

| Role | Implementation | Trigger |
|------|-----|------|
| HR | The main choreographer is rendered in the main session using HR_SYSTEM_PROMPT | intent_type=team_management |
| Financial Manager | The main orchestrator uses FINANCE_SYSTEM_PROMPT to render + call QuotaService in the main session | intent_type=quota_query |

**Collaboration Rules**:
- Do not call each other (ADR-002)
- Cross-ability steps are explicitly decomposed in Skill YAML
- Cross-language communication uses Redis Streams + AgentTask / AgentResult

Detailed handler implementation: `docs/2_project implementation/4 sub-task Agent implementation guide.md`

---

## 5. Database schema (overview of 18 tables)

### Users and Permissions
- `users`(basic information + plan)
- `user_preferences` (including `preference_vec VECTOR(256)`, signal 2)

### Sessions and Contexts (v3.0 ADR-014)
- `context_pools` (one pool per group)
- `conversations`(mode = main_session / **group** / private_chat;**Added `work_mode` column** = plan / ask / auto)
- ~~`conversation_links`~~(obsolete, v3.0 no longer has a discussion group derivative work group relationship)
- `mode_switch_log` (mode switching audit, optional)

### information
- `messages`

### Skill
- `skills`
- `skill_embeddings`(pgvector,Skill L2 retrieval)
- `user_skill_visibility`

### Task execution
- `tasks`
- `task_steps`
- `artifacts` (support version number, interrupt C old products are retained)

### Quota
- `quota_usage`

### BGM material
- `bgm_library`

### v2.0 added 5 new pictures
- `hitl_gates`(HITL gate history)
- `workflow_traces`(signal 1, Qdrant mirror)
- `prompt_improvement_candidates`(signal 3,Reflexion)
- `skill_drafts`(Signal 4, Creator Flywheel V1.5)
- `user_preferences.preference_vec` column (signal 2)

Complete DDL:`docs/5_Engineering Infrastructure/V1 Engineering Infrastructure List.md §4`

---

## 6. Front-end architecture

### 6.1 Key pages

- `/`: Main session (assistant to the president)
- `/[conversationId]`: Group chat (three columns)
- `/private/[agentId]`: Private chat Agent
- `/materials`: material library + knowledge base
- `/academy`:AI Academy
- `/market`: Skill market
- `/results`: results library
- `/settings`: settings

### 6.2 Zustand store slice

| store | responsibilities |
|-------|-----|
| `conversation` | Conversation list + current session |
| `task` | Task progress / steps / streaming |
| `ws` | WebSocket connection + reconnect + last_event_id |
| **`hitl`** | HITL gate queue / user decision |
| `user` | Current user/preferences |

### 6.3 Key interactive components

- Three-column layout (left navigation / middle chat / right execution flow)
- Group members column (top, the president’s assistant is always first)
- Clarifying bubbles (light green base, 4 forms)
- Product preview card ([Download] [Question] [Change])
- Right column execution flow (streaming append, 3 status icons)
- @call(@人/@FILE/@prompt word)
- **HITL review components 3** (ScriptApproval / ImageSelection / VideoFinalReview)

### 6.4 Visual specifications

- The only accent color: WeChat Green #07C160
- Discussion group light blue avatar (#E3F2FD) + blue "Discussion" badge
- Work group light green avatar (#E8F5E9) + WeChat green "work" badge
- The avatar unifies the "Minecraft" pixel style/NFT style
- Line SVG icons, **no emoji**

### 6.5 WS event type

```typescript
type WSEvent =
  | { type: 'conversation_created'; conversation: Conversation }
  | { type: 'message_added'; message: Message }
  | { type: 'step_started'; task_id: string; step_id: string; agent_id: string }
  | { type: 'step_completed'; task_id: string; step_id: string; artifact: ArtifactPreview }
  | { type: 'step_streaming'; task_id: string; step_id: string; chunk: string }
  | { type: 'task_completed'; task_id: string; primary_artifact: Artifact }
  | { type: 'task_failed'; task_id: string; error: ErrorDetail }
  | { type: 'clarification_required'; task_id: string; clarification: Clarification }
  | { type: 'mode_choice_required'; conversation_id: string; options: ModeOption[] }
  | { type: 'work_group_proposed'; discuss_id: string; skill_id: string }
  | { type: 'brief_updated'; pool_id: string; brief: Brief }
  | { type: 'hitl_gate_opened'; task_id: string; gate: HITLGate; preview_artifact: Artifact }
  | { type: 'hitl_gate_closed'; task_id: string; resolution: 'approved'|'modified'|'rolled_back' }
  | { type: 'rollback_started'; task_id: string; from_step: string; to_step: string }
  | { type: 'quota_warning'; quota_type: string; remaining: number };
```

---

## 7. Key API endpoints

```
# Authentication
POST /api/auth/sms/send
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me

# Session (v3.0 ADR-014)
GET  /api/conversations
POST /api/conversations              Body: {mode, work_mode, skill_id?, name?}
GET  /api/conversations/:id
POST /api/conversations/:id/switch-work-mode ← v3.0 replacement derive-work-group/back-to-discuss
                                                Body: {target: plan|ask|auto, triggered_by: user|orchestrator}

#Context pool
GET  /api/context-pools/:id
PATCH /api/context-pools/:id/brief

# Task
GET  /api/tasks/:id
POST /api/tasks/:id/answer-clarification
POST /api/tasks/:id/interrupt

# HITL(v2.0)
GET  /api/tasks/:id/hitl_gates
POST /api/tasks/:id/hitl_gates/:gate_id/approve
POST /api/tasks/:id/hitl_gates/:gate_id/modify
POST /api/tasks/:id/hitl_gates/:gate_id/rollback

# Flywheel(v2.0)
GET  /api/users/:id/preference_vector
GET  /api/users/:id/skill_drafts
POST /api/skill_drafts/:id/publish

# Upload
POST /api/upload/sign
POST /api/upload/confirm

# WebSocket
WS   /ws?token=xxx&last_event_id=xxx
```

---

## 8. Deployment architecture

### 8.1 dev (Docker Compose one-click)

```
postgres + redis + minio + qdrant + litellm-mock
    ↓
backend(uvicorn)
    ↓
agents × 4 (independent container)
    ↓
mcp_servers × 7 (independent container)
    ↓
celery_worker_video (GPU node/CPU dev is also acceptable)
    ↓
frontend(next dev)
```

### 8.2 prod(K8s)

| Services | Copies | Resources |
|------|-----|------|
| backend | 4 | 1c / 2G |
| litellm-proxy | 2 | 0.5c / 1G |
| agent-text | 4 | 2c / 4G |
| agent-image | 4 | 4c / 8G |
| agent-av | 2 | 4c / 8G + GPU |
| agent-document | 2 | 2c / 4G |
| celery-video | 4 | 4c / 8G + GPU |
| mcp-search/oss/document/audio | 2 each | 0.5-2c / 1-4G |
| mcp-image-tools | 2 | 1c / 2G + GPU |
| mcp-video-tools | 2 | 4c / 8G + GPU |
| qdrant | 3(StatefulSet)| 2c / 8G + SSD |
| bge-m3-service | 2 | 4c / 8G + GPU |
| frontend(SSR)| 2 | 1c / 2G |

Total V1 resources: ~30 vCPU / 80 GB memory + 4 GPU nodes.

---

## 9. Cross-language Schema synchronization

**Backend is the source**: Pydantic model in `backend/app/schemas/`

**Front-end generation**:`pnpm gen:api` runs `openapi-typescript` to generate `frontend/lib/api-types.ts`

**MCP server schema**: Use `mcp.types` Python SDK to automatically generate JSON Schema

CI mandatory: PR modification to `schemas/` must re-run `pnpm gen:api` and commit.

---

## 10. Detailed Sprint Path

See CLAUDE.md §4 for per-Sprint acceptance. This article gives detailed deliverable:

### Sprint 0 (1 week): Infrastructure

- Warehouse directory skeleton (refer to §1 of this article)
- `../deploy/production/docker-compose.yml`
- `backend/alembic` + 18 tables migration
- `backend/app/config/{settings,prompts,templates}.py`
- `backend/app/router.py` (LiteLLM client)
- `backend/app/mcp_client.py`(MCP client)
- `backend/app/api/auth.py`
- `backend/app/ws/`

### Sprint 1 (1 week):MCP servers

- `mcp_servers/search/`(Tavily + Playwright)
- `mcp_servers/oss/`(MinIO compatible)
- `mcp_servers/document_tools/`(pdf basic)
- Integration test fixtures

### Sprint 2 (1.5 weeks): Main orchestration framework

- 8 sub-module skeleton
- `services/{conversation,context_pool,brief_builder,quota,oss,hitl,flywheel}.py`
- End-to-end intent understanding → Skill matching → Input verification and run-through

### Sprint 3 (1.5 weeks): Agent framework + short video happy path

- `agents/_common/`
- 4 Agent main.py
- 1 happy-path handler each
- End-to-end running of short video tasks (all mocks)

### Sprint 4 (1 week): Skill + HITL + Flywheel

- `skills/short_video.yaml`(v3.0 V1 hero)
- `skills/ecommerce_detail_image.yaml`
- Skill Compiler
- HITL gateway backend + interrupt C rollback
- `flywheel/` 4 types of signal pipeline

### Sprint 5 (2 weeks): Frontend

- Next.js 15 skeleton
- Zustand store 5 slices
- WS client
- Three-column layout + group chat page + right column execution flow
- 3 HITL audit components
- Mode selection UI

### Sprint 6 (1 week): joint debugging + launch

- CI (including MCP integration + HITL Playwright + Flywheel PR check)
- K8s manifests
- Monitor the market
- E2E runs 10 missions

**8 weeks total → V1-P0**

---

## 11. Performance and Cost Targets

| Metrics | V1 Goals |
|-----|--------|
| Main arranger call delay | < 1s |
| Total cost of single task for main orchestration | $0.001-0.003 |
| Total cost per short video (model + tool) | **¥6-8** (after optimization) |
| Total cost per detailed picture | ¥2-3 |
| Video task P95 end-to-end time | < 8 minutes |
| HITL gate User Response P50 | < 2 minutes |
| Flywheel signal precipitation rate | 100% |
| System Availability | 99.5% |

---

## 12. Relevant detailed documents (in-depth search)

| Topic | Document Path |
|------|---------|
| Detailed implementation of main orchestration | `docs/2_Project Implementation/Main Orchestration Agent Implementation Guide.md` |
| 4 Agent detailed implementation | `docs/2_engineering implementation/4 sub-task Agent implementation guide.md` |
| Technical details of three modes | `docs/2_Engineering implementation/Three modes technical implementation.md` |
| MCP Integration Solution | `docs/3_Decision Record/MCP Integration Solution.md` |
| Data Flywheel Design | `docs/3_Decision Record/Data Flywheel Design.md` |
| Business Model | `docs/3_Decision Record/Business Model and Unit Economics.md` |
| Skill YAML Template | `docs/3_Decision Record/Skill YAML Template.md` |
| System Prompt Complete Collection | `docs/4_Appendix/System Prompt Complete Collection.md` |
| Model routing table | `docs/4_Appendix/Model routing table.md` |
| V1 project infrastructure list | `docs/5_project infrastructure/V1 project infrastructure list.md` |
| Product Documentation | `docs/0_Overview/Product Function and Interaction Documentation.md` |
| ADR Complete Works | `docs/CONSTITUTION.md` and `docs/3_Decision Record/Open Issues and Resolutions.md` |