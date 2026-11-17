# Agent module interface document

## Meta information

| Item | Content |
|---|---|
| Document version | v1.0 (automatically generated) |
| Generation time | 2026-05-09T10:56:38+08:00 |
| Git Commit | Git repository not detected |
| Git Branch | — |
| Scanning entrance | `backend/app` (FastAPI routing + `main.py` mounting), WebSocket push related `app/schemas/ws.py`, `app/ws/`, `agents/agents/orchestrator_agent` (`publish`/`ws_manager.publish` call) |
| Maintainer | Teacher Lai |

## Scan Summary

- Total number of scanned files: **21** (12 router modules, `main.py`, `app/schemas/ws.py`, `app/ws/manager.py` under `backend/app/api`, and `runner.py` / `interaction.py` / `hitl_gate.py` + in `agents/agents/orchestrator_agent` `app/services/brief_builder.py` / `app/services/agent_status.py`)
- Number of HTTP interfaces: **56** (✅ **52** / 🔨 **2** / ⏳ **2**)
- WebSocket: **1** connection endpoints; see "WebSocket module" for server-side push event types (there are other types in the enumeration that have not been implemented in push, see Appendix C)
- Number of other interfaces: **0** (no `StreamingResponse` / `EventSourceResponse` business route found in `backend/app`)
- Number of business modules: **11** (grouped by `prefix` + function of `main.py`)

## Interface summary list

List of all interfaces grouped by business modules:

| Number | Module | Protocol | Interface Name | Path/Event | Status | Code Location |
|---|---|---|---|---|---|---|
| 001 | Infrastructure | HTTP | Liveness Detection | GET /health | ✅ | backend/app/main.py:104 |
| 002 | Infrastructure | HTTP | Readiness Detection | GET /ready | ✅ | backend/app/main.py:110 |
| 003 | Infrastructure | HTTP | Prometheus Metrics | GET /metrics | ✅ | backend/app/main.py:159 |
| 004 | Authentication | HTTP | Send SMS verification code | POST /api/auth/sms/send | ✅ | backend/app/api/auth.py:44 |
| 005 | Authentication | HTTP | Login | POST /api/auth/login | ✅ | backend/app/api/auth.py:63 |
| 006 | Authentication | HTTP | Refresh Token | POST /api/auth/refresh | 🔨 | backend/app/api/auth.py:86 |
| 007 | Authentication | HTTP | Logout | POST /api/auth/logout | ✅ | backend/app/api/auth.py:93 |
| 008 | Authentication | HTTP | Current user | GET /api/auth/me | 🔨 | backend/app/api/auth.py:98 |
| 009 | Sessions | HTTP | Session List | GET /api/conversations | ✅ | backend/app/api/conversations.py:54 |
| 010 | Session | HTTP | Create Session | POST /api/conversations | ✅ | backend/app/api/conversations.py:67 |
| 011 | Session | HTTP | Session Details | GET /api/conversations/{conversation_id} | ✅ | backend/app/api/conversations.py:98 |
| 012 | Session | HTTP | Open a small window for private chat | POST /api/conversations/private-chat/{agent_id} | ✅ | backend/app/api/conversations.py:120 |
| 013 | Session | HTTP | Get Brief | GET /api/conversations/{conversation_id}/brief | ✅ | backend/app/api/conversations.py:157 |
| 014 | Session | HTTP | Reset Brief | POST /api/conversations/{conversation_id}/brief/reset | ✅ | backend/app/api/conversations.py:169 |
| 015 | Session | HTTP | Switch work mode | POST /api/conversations/{conversation_id}/switch-work-mode | ✅ | backend/app/api/conversations.py:183 |
| 016 | Session | HTTP | Group members and status | GET /api/conversations/{conversation_id}/members | ✅ | backend/app/api/conversations.py:250 |
| 017 | Memory | HTTP | Memory Context Pack | GET /api/conversations/{conversation_id}/memory/context-pack | ✅ | backend/app/api/memory.py:18 |
| 018 | Messages | HTTP | Send messages | POST /api/conversations/{conversation_id}/messages | ✅ | backend/app/api/messages.py:350 |
| 019 | Task | HTTP | Task details | GET /api/tasks/{task_id} | ✅ | backend/app/api/tasks.py:71 |
| 020 | Task | HTTP | External step receipt | POST /api/tasks/{task_id}/external-step-result | ✅ | backend/app/api/tasks.py:124 |
| 021 | Task | HTTP | Clarification Answer | POST /api/tasks/{task_id}/answer-clarification | ✅ | backend/app/api/tasks.py:151 |
| 022 | Tasks | HTTP | Conflict handling | POST /api/tasks/{task_id}/resolve-conflict | ✅ | backend/app/api/tasks.py:178 |
| 023 | Tasks | HTTP | Interrupt | POST /api/tasks/{task_id}/interrupt | ✅ | backend/app/api/tasks.py:203 |
| 024 | Tasks | HTTP | Rollback steps | POST /api/tasks/{task_id}/rollback | ✅ | backend/app/api/tasks.py:236 |
| 025 | Task | HTTP | Checkpoint History | GET /api/tasks/{task_id}/history | ✅ | backend/app/api/tasks.py:264 |
| 026 | Upload | HTTP | Pre-sign | POST /api/upload/sign | ✅ | backend/app/api/upload.py:45 |
| 027 | Upload | HTTP | Confirm upload | POST /api/upload/confirm | ✅ | backend/app/api/upload.py:63 |
| 028 | HITL | HTTP | HITL list | GET /api/tasks/{task_id}/hitl_gates | ✅ | backend/app/api/hitl.py:53 |
| 029 | HITL | HTTP | Approve | POST /api/tasks/{task_id}/hitl_gates/{gate_id}/approve | ✅ | backend/app/api/hitl.py:64 |
| 030 | HITL | HTTP | Fine-tuning | POST /api/tasks/{task_id}/hitl_gates/{gate_id}/modify | ✅ | backend/app/api/hitl.py:80 |
| 031 | HITL | HTTP | Cancel | POST /api/tasks/{task_id}/hitl_gates/{gate_id}/cancel | ✅ | backend/app/api/hitl.py:98 |
| 032 | HITL | HTTP | Gateway gate rollback | POST /api/tasks/{task_id}/hitl_gates/{gate_id}/rollback | ⏳ | backend/app/api/hitl.py:114 |
| 033 | Support/Quota | HTTP | Agent status list | GET /api/agent-status/me | ✅ | backend/app/api/support.py:51 |
| 034 | Support/Quota | HTTP | Quota Summary | GET /api/quota/me | ✅ | backend/app/api/support.py:62 |
| 035 | Support/Quota | HTTP | Monthly Billing | GET /api/quota/me/billing | ✅ | backend/app/api/support.py:76 |
| 036 | Support/Quota | HTTP | HR Chat | POST /api/support/hr/respond | ✅ | backend/app/api/support.py:99 |
| 037 | Support/Quota | HTTP | Financial Chat | POST /api/support/finance/respond | ✅ | backend/app/api/support.py:121 |
| 038 | Material/Knowledge Base | HTTP | Material List | GET /api/materials | ✅ | backend/app/api/library.py:56 |
| 039 | Materials/Knowledge Base | HTTP | Create Materials | POST /api/materials | ✅ | backend/app/api/library.py:71 |
| 040 | Material/Knowledge Base | HTTP | Delete material | DELETE /api/materials/{material_id} | ✅ | backend/app/api/library.py:95 |
| 041 | Material/Knowledge Base | HTTP | Prompt List | GET /api/prompts | ✅ | backend/app/api/library.py:124 |
| 042 | Material/Knowledge Base | HTTP | Create Prompt | POST /api/prompts | ✅ | backend/app/api/library.py:137 |
| 043 | Material/Knowledge Base | HTTP | Delete Prompt | DELETE /api/prompts/{prompt_id} | ✅ | backend/app/api/library.py:150 |
| 044 | Material/Knowledge Base | HTTP | Prompt usage count +1 | POST /api/prompts/{prompt_id}/use | ✅ | backend/app/api/library.py:163 |
| 045 | Material/Knowledge Base | HTTP | Achievements List | GET /api/artifacts | ✅ | backend/app/api/library.py:207 |
| 046 | Material/Knowledge Base | HTTP | Profile | GET /api/profile/me | ✅ | backend/app/api/library.py:250 |
| 047 | Material/Knowledge Base | HTTP | Update information | PATCH /api/profile/me | ✅ | backend/app/api/library.py:264 |
| 048 | Material/Knowledge Base | HTTP | Personal Statistics | GET /api/profile/me/stats | ✅ | backend/app/api/library.py:285 |
| 049 | Skills | HTTP | Skills Market List | GET /api/skills | ✅ | backend/app/api/skills.py:40 |
| 050 | Skills | HTTP | My Skills | GET /api/skills/mine | ✅ | backend/app/api/skills.py:82 |
| 051 | Skills | HTTP | Skill details | GET /api/skills/{skill_id} | ✅ | backend/app/api/skills.py:127 |
| 052 | Skills | HTTP | Subscribe | POST /api/skills/{skill_id}/subscribe | ✅ | backend/app/api/skills.py:179 |
| 053 | Skills | HTTP | Unsubscribe | DELETE /api/skills/{skill_id}/subscribe | ✅ | backend/app/api/skills.py:198 |
| 054 | Flywheel | HTTP | Preference Vector | GET /api/users/{user_id}/preference_vector | ✅ | backend/app/api/flywheel.py:18 |
| 055 | Flywheel | HTTP | Skill draft list | GET /api/users/{user_id}/skill_drafts | ✅ | backend/app/api/flywheel.py:32 |
| 056 | Flywheel | HTTP | Publish Draft | POST /api/skill_drafts/{draft_id}/publish | ⏳ | backend/app/api/flywheel.py:44 |
| 057 | WebSocket | WS | User Event Channel | GET /ws (WebSocket) | ✅ | backend/app/api/ws.py:17 |

---

## Module: Infrastructure (`main.py` direct connection)

> Module description: health check and operation and maintenance capture, no `/api` prefix.
> Code location: `backend/app/main.py`

### Interface 001 · liveness — whether the process is alive

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| path/event name | `/health` |
| Status | ✅ Implemented |
| Authentication | Not required (no `Depends`) |
| Code location | `backend/app/main.py:104` |

#### ask

No Path/Query/Body.

#### Response

**Success** (HTTP status code: 200):

```json
{
  "status": "ok",
  "env": "development",
  "version": "dev"
}
```

| Field | Type | Description |
|---|---|---|
| status | string | Fixed to the running environment identifier in the context |
| env | string | `settings.ENV` |
| version | string | Environment variable `APP_VERSION`, default `dev` |

---

### Interface 002 · readiness

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| path / event name | `/ready` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/main.py:110` |

#### Response

**Success** (HTTP **200** when the whole thing is normal; HTTP **503** when any item fails, JSON body is still returned):

```json
{
  "status": "ok",
  "checks": {
    "db": "ok",
    "redis": "ok",
    "litellm": "mock"
  }
}
```

| Field | Type | Description |
|---|---|---|
| status | string | `ok` or `degraded` |
| checks | object | Key `db` / `redis` / `litellm`, value `ok`, error summary starting with `fail:`, or `mock` (when `LITELLM_MOCK` is true) |

---

### Interface 003 · Prometheus Metrics

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| path/event name | `/metrics` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/main.py:159` |

#### Response

**Success** (HTTP 200, `Content-Type: text/plain; version=0.0.4`): The text is Prometheus text, generated by `render_prometheus_metrics()` (the structure is subject to the runtime output).

---

## Module: Authentication (`prefix=/api/auth`)

> Module description: SMS verification code and JWT.
> Code location: `backend/app/api/auth.py`

### Interface 004 · Send SMS verification code

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/auth/sms/send` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/auth.py:44` |

#### ask

**Body**：

```json
{
  "phone": "13800000000"
}
```

| Field | Type | Required | Default Value | Constraints | Description |
|---|---|---:|---|---|---|
| phone | string | Yes | — | `min_length=11`, `max_length=20` | Mobile phone number |

#### Response

**Success**: HTTP **204**, no body.

**fail**:

| HTTP Code | Description |
|---|---|
| 502 | SMS sending failed (`SmsError`, not `SMS_DEV_MODE`) |

---

### Interface 005 · Login

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/auth/login` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/auth.py:63` |

#### ask

```json
{
  "phone": "13800000000",
  "code": "123456"
}
```

| Field | Type | Required | Description |
|---|---|---:|---|
| phone | string | yes | mobile phone number |
| code | string | yes | SMS verification code |

#### Response

**Success** (200):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Description |
|---|---|---|
| access_token | string | JWT |
| token_type | string | default `bearer` |
| user_id | string | User UUID string |

**fail**:

| HTTP Code | Description |
|---|---|
| 401 | The verification code is incorrect or expired |

---

### Interface 006 · Refresh Token

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/auth/refresh` |
| Status | 🔨 Under development (`user_id` cannot be obtained through dependency injection, see Appendix C) |
| Authentication | The design intention is to require logged in users; the code is `Depends(lambda: None)`, which is inconsistent with `get_current_user_id` |
| Code location | `backend/app/api/auth.py:86` |

#### ask

No body.

#### Response

**Success** (200): Same as login `TokenResponse`.

**fail**:

| HTTP Code | Description |
|---|---|
| 401 | `user_id is None` → `"Unauthorized"` |

---

### Interface 007 · Logout

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/auth/logout` |
| Status | ✅ Implemented (function body is empty, no server logout status) |
| Certification | Not required |
| Code location | `backend/app/api/auth.py:93` |

#### Response

HTTP **204**, no body.

---

### Interface 008 · Current user

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/auth/me` |
| Status | 🔨 Under development (same as the `Depends(lambda: None)` problem of interface 006) |
| Authentication | Code not using `get_current_user_id` |
| Code location | `backend/app/api/auth.py:98` |

#### Response

**Success** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "13800000000",
"nickname": "User Nickname"
}
```

**fail**:

| HTTP Code | Description |
|---|---|
| 401 | Unauthorized |
| 404 | User does not exist |

---

## Module: Conversations (`prefix=/api/conversations`, `conversations.py`)

> Module description: Session CRUD, Brief, working mode, member list (v3.0 ADR-014, etc., see file header comments).
> Code location: `backend/app/api/conversations.py`

### Interface 009 · List sessions

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/conversations` |
| Status | ✅ Implemented |
| Authentication | Required, `Depends(get_current_user_id)` |
| Code location | `backend/app/api/conversations.py:54` |

#### Response

**Success** (200): `ConversationOut` array.

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
"name": "New Session",
    "mode": "group",
    "work_mode": "plan",
    "status": "active"
  }
]
```

| Field | Type | Description |
|---|---|---|
| id | string(uuid) | session ID |
| name | string | name |
| mode | string | `main_session` \| `group` \| `private_chat` |
| work_mode | string \| null | `plan` \| `ask` \| `auto` |
| status | string | Session status (ORM field) |

---

### Interface 010 · Create session

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/conversations` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/conversations.py:67` |

#### ask

```json
{
  "mode": "group",
  "work_mode": "plan",
  "skill_id": "550e8400-e29b-41d4-a716-446655440000",
"name": "Project"
}
```

| Field | Type | Required | Default value | Description |
|---|---|---:|---|---|
| mode | string | no | `group` | `main_session` \| `group` \| `private_chat` |
| work_mode | string \| null | no | null | `plan` \| `ask` \| `auto` |
| skill_id | string(uuid) \| null | no | null | |
| name | string \| null | no | null | |

#### Response

201: **ConversationOut** (same as interface 009 single).

**fail**:

| HTTP Code | Description |
|---|---|
| 401 | User does not exist (`get(User)` failed before creation) |
| 402 | Group creation quota exceeded, `detail` is `{ "code", "detail" }` |

---

### Interface 011 · Get ​​a single session

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/conversations/{conversation_id}` |
| Status | ✅ Implemented |
| Authentication | **Not required** (code not verified `user_id`) |
| Code location | `backend/app/api/conversations.py:98` |

#### Response

200: `ConversationOut`, 404: `Conversation does not exist`.

---

### Interface 012 · Open a small window for private chat

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/conversations/private-chat/{agent_id}` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/conversations.py:120` |

#### Path

| Parameters | Type | Description |
|---|---|---|
| agent_id | string | Allowed Agents: `ceo_assistant`, `agent_1`~`agent_4`, `hr`, `finance_manager` |

#### Response

200：**ConversationOut**。

**Failed**: 400 Unknown `agent_id`.

---

### Interface 013 · Get ​​Brief

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/conversations/{conversation_id}/brief` |
| Status | ✅ Implemented |
| Authentication | Required and verified `conv.user_id == user_id` |
| Code location | `backend/app/api/conversations.py:157` |

#### Response

200: JSON object, the default structure contains at least:

```json
{
"Completeness": 0.0,
"Field": {},
"Decision Log": []
}
```

(Actually a `conv.brief` dictionary.)

---

### Interface 014 · Reset Brief

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/conversations/{conversation_id}/brief/reset` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/conversations.py:169` |

#### Response

200: Same as the default Brief object.

---

### Interface 015 · Switch working mode

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/conversations/{conversation_id}/switch-work-mode` |
| Status | ✅ Implemented |
| Authentication | **Not required** (`get_current_user_id` is not used) |
| Code location | `backend/app/api/conversations.py:183` |

#### ask

```json
{
  "target": "auto",
  "triggered_by": "user"
}
```

| Field | Type | Required | Default value | Description |
|---|---|---:|---|---|
| target | string | yes | — | `plan` \| `ask` \| `auto` |
| triggered_by | string | no | `user` | `user` \| `orchestrator` |

#### Response

200：

```json
{
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
"name": "New Session",
    "mode": "group",
    "work_mode": "auto",
    "status": "active"
  },
  "ws_event": {
    "type": "work_mode_changed",
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "from": "plan",
    "to": "auto"
  }
}
```

(`type` is taken from `WSEventType.WORK_MODE_CHANGED`.)

---

### Interface 016 · Session Members

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/conversations/{conversation_id}/members` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/conversations.py:250` |

#### Response

200: `AgentMember` array.

```json
[
  {
    "id": "ceo_assistant",
    "status": "idle"
  }
]
```

| Field | Type | Description |
|---|---|---|
| id | string | role id |
| status | string | `working` / `idle` / `fishing` / `training` (`idle` when data is missing) |

**Failure**: 403 Not authorized; 404 Session does not exist.

---

## Module: memory (`prefix=/api/conversations`, `memory.py`)

> Module description: Assemble session memory package (Brief+scrolling summary, etc.).
> Code location: `backend/app/api/memory.py`

### Interface 017 · Memory Context Pack

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/conversations/{conversation_id}/memory/context-pack` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/memory.py:18` |

#### Query

| Parameters | Type | Required | Default | Constraints |
|---|---|---:|---|---|
| recall_query | string \| null | no | null | max_length=500 |
| task_limit | integer | no | 5 | 1～20 |

#### Response

200：**MemoryContextPack**

```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
"brief_digest": "Summary text",
"rolling_summary": "rolling summary",
"preference_digest": "Preference Digest",
  "recent_tasks": [
    {
      "task_id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "completed",
"one_liner": "one sentence",
      "skill_id": "550e8400-e29b-41d4-a716-446655440002",
      "primary_ref": "oss://bucket/key"
    }
  ],
  "recalled_artifacts": [
    {
      "artifact_id": "550e8400-e29b-41d4-a716-446655440003",
"title": "title",
"summary": "summary",
      "type": "image",
      "reference_tail": "path/to/file",
      "score": 0.85
    }
  ],
  "meta": {}
}
```

**Failed**: 404 (`ValueError` translated).

---

## Module: messages (`prefix=/api`, `messages.py`)

>Module description: Main arrangement message entry (file module comment).
> Code location: `backend/app/api/messages.py`

### Interface 018 · Send message

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/conversations/{conversation_id}/messages` |
| Status | ✅ Implemented |
| Authentication | **Not used** `get_current_user_id`; only verifies session existence and `User` existence |
| Code location | `backend/app/api/messages.py:350` |

#### ask

```json
{
"content": "User-submitted text",
  "role": "user",
  "mentions": []
}
```

| Field | Type | Required | Default value | Description |
|---|---|---:|---|---|
| content | string | yes | — | message text |
| role | string | no | `user` | |
| mentions | array[string] | No | [] | @'s Agent id list |

#### Response

200：**SendMessageResponse**

```json
{
  "message_id": "550e8400-e29b-41d4-a716-446655440000",
  "decision": "task_started",
  "payload": {}
}
```

| Field | Type | Description |
|---|---|---|
| message_id | string(uuid) | Written user message id |
| decision | string | Code comment enumeration: `task_started` / `clarification_required` / `chitchat` / `mode_switched` / `mention_replied` / `plan_discussion` / `task_conflict` / `interrupt_handled`, etc. (**Any string**, subject to actual return) |
| payload | object | The structure changes with `decision`, the type is **`dict[str, Any]`** (see Appendix C) |

**fail**:

| HTTP Code | Description |
|---|---|
| 404 | Session does not exist |
| 401 | The user belonging to the session does not exist |
| 402 | Plan round and other quotas: `detail` is a string (this interface path, `HTTPException(..., e.detail)`) |

---

## Module: tasks (`prefix=/api/tasks`)

> Module description: task query, external receipt, clarification, conflict, interruption, rollback, history.
> Code location: `backend/app/api/tasks.py`

### Interface 019 · Task details

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/tasks/{task_id}` |
| Status | ✅ Implemented |
| Authentication | Required, `get_current_user_id`; non-owner returns 404 |
| Code location | `backend/app/api/tasks.py:71` |

#### Response 200 · TaskDetailOut

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "skill_id": "550e8400-e29b-41d4-a716-446655440001",
  "progress": {
    "current": 3,
    "total": 5
  },
  "orchestration_run_id": "550e8400-e29b-41d4-a716-446655440002",
  "trace_id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "memory_card": {},
  "failure_digest": null
}
```

| Field | Type | Description |
|---|---|---|
| progress | object | JSON, default contains `current`/`total` (Task model) |
| orchestration_run_id | string \| null | up to 36 characters |
| trace_id | string \| null | up to 64 characters |
| memory_card | object \| null | |
| failure_digest | string \| null | Deduced from `error_detail` |

---

### Interface 020 · External step receipt

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/tasks/{task_id}/external-step-result` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/tasks.py:124` |

#### Body · ExternalStepResultBody

`status` 类型为 **`AgentStatus`**：`pending` \| `running` \| `completed` \| `failed` \| `pending_external`。

**ArtifactRef**：

```json
{
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "image",
  "reference": "oss://bucket/path",
  "extra_metadata": {}
}
```

| Field | Type | Required | Default |
|---|---|---:|---|
| step_id | string | yes | — |
| status | string(enum) | yes | — |
| output | object \| null | no | null |
| extra_artifacts | array | no | [] |
| cost_usd | number \| null | no | null |
| duration_ms | integer \| null | no | null |
| model_used | string \| null | no | null |
| error_detail | object \| null | no | null |
| external_workflow_id | string \| null | no | null |

#### Response 200

```json
{
  "status": "published"
}
```

---

### Interface 021 · Clarification answer

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/tasks/{task_id}/answer-clarification` |
| Status | ✅ Implemented |
| Authentication | Not required (the code does not use `get_current_user_id`) |
| Code location | `backend/app/api/tasks.py:151` |

#### Body

| Field | Type | Required | Description |
|---|---|---:|---|
| clarification_id | string | yes | |
| field | string | yes | |
| value | any | is | Pydantic for `Any` |

#### Response 200

```json
{
  "status": "accepted"
}
```

---

### Interface 022 · Conflict handling

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/tasks/{task_id}/resolve-conflict` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/tasks.py:178` |

#### Body

```json
{
  "action": "queue"
}
```

| Field | Type | Required | Description |
|---|---|---:|---|
| action | string | yes | `queue` \| `cancel_current` \| `new_group` |

#### Response 200

- `cancel_current` → `{"status":"cancelled","next":"send_message_again"}`
- `queue` → `{"status":"queued"}`
- `new_group` → `{"status":"client_navigate","next":"create_new_group"}`

**Failed**: 400 `Unknown action: {action}`

---

### Interface 023 · Interrupt

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/tasks/{task_id}/interrupt` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/tasks.py:203` |

#### Body

```json
{
  "interrupt_class": "A",
  "payload": {}
}
```

| Field | Type | Required | Default |
|---|---|---:|---|
| interrupt_class | string | yes | — |
| payload | object \| null | no | null |

#### Response 200

```json
{
  "status": "received",
  "interrupt_class": "A",
  "action": "pause_task"
}
```

(`action` is returned by `handle_interrupt` and is of type dynamic value in code.)

**Failure**: 400 Interrupt class not supported by V1 (C/D and other prompt messages).

---

### Interface 024 · Rollback steps

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/tasks/{task_id}/rollback` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/tasks.py:236` |

#### Body

| Field | Type | Required |
|---|---|---:|
| target_step_id | string | yes |
| instruction | string \| null | no |

#### Response 200

```json
{
  "status": "rolled_back",
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "target_step_id": "step_1",
  "cleared_steps": ["step_2"],
  "rollback_count": 1
}
```

---

### Interface 025 · Checkpoint History

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | GET |
| Path | `/api/tasks/{task_id}/history` |
| Status | ✅ Implemented |
| Certification | Not required |
| Code location | `backend/app/api/tasks.py:264` |

#### Response 200

`list[dict]`，每项含 `checkpoint_id`、`next`、`values_summary`（见 `LangGraphTaskRunner.get_history`）。

---

## Module: Upload (`prefix=/api/upload`)

> Module description: OSS pre-signed upload.
> Code location: `backend/app/api/upload.py`

### Interface 026 · Pre-signed

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/upload/sign` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/upload.py:45` |

#### Body · SignRequest

| Field | Type | Required | Default | Constraints |
|---|---|---:|---|---|
| file_name | string | yes | — | |
| content_type | string | yes | — | |
| purpose | string | No | `user_upload` | `user_upload` / `artifact` / `bgm`; verification logic is used for the avatar path |
| size_bytes | integer \| null | no | null | `>0` (if provided) |

#### Response 200 · SignResponse

```json
{
  "upload_url": "https://oss.example.com/presigned",
  "object_key": "user_upload/foo.bin",
  "expires_in": 3600
}
```

---

### Interface 027 · Confirm upload

| Item | Content |
|---|---|
| Protocol | HTTP |
| Method | POST |
| Path | `/api/upload/confirm` |
| Status | ✅ Implemented |
| Certification | Required |
| Code location | `backend/app/api/upload.py:63` |

#### Body · ConfirmRequest

| Field | Type | Required | Constraints |
|---|---|---:|---|
| object_key | string | yes | |
| size_bytes | integer | yes | `>0` |
| sha256 | string \| null | no | |

#### Response 200

`avatar_url` is additionally returned when the avatar path is used; otherwise `{"object_key":"...","status":"confirmed"}` is returned.

---

## Module: HITL (`prefix=/api/tasks`, `hitl.py`)

> Module description: HITL gate approval/fine-tuning/cancellation/rollback (V1 rollback is not implemented).
> Code location: `backend/app/api/hitl.py`

### Interface 028 · List HITL

**GET** `/api/tasks/{task_id}/hitl_gates`, requires authentication and the task owner. Response: `HITLGateOut` array (`id`, `task_id`, `step_id`, `gate_type`, `resolution`).

### Interface 029 · Approved

**POST** `.../approve`, Body: `{"user_choice": {}}` (`user_choice` optional). Response: `{"status":"approved","dispatched_next": ...}` (bool or runtime value).

### Interface 030 · Fine-tuning

**POST** `.../modify`, Body: `target_step` (required), `parameters` (optional object). Response: `{"status":"modified","redispatched": ...}`.

### Interface 031 · Cancel

**POST** `.../cancel`, Body: `reason` optional. Response: `{"status":"cancelled"}`.

### Interface 032 · Gateway gate rollback

**POST** `.../rollback`. Response **501**, the detail is fixed to the Chinese description in the code (V2 function).

---

## Module: support/quota (`prefix=/api`, `support.py`)

> Code location: `backend/app/api/support.py`

### 033 GET `/api/agent-status/me`

Certification required. Response: `list[dict[str,str]]` (the structure returned by `list_status`, the fields are subject to runtime).

### 034 GET `/api/quota/me`

Certification required. Response: **dict** (with `limits_table`, `warnings`, financial summary, etc., no single Pydantic model).

### 035 GET `/api/quota/me/billing`

Query: `month` optional, format `YYYY-MM`. response:

```json
{
  "month": "2026-05",
  "by_quota_type": {
    "auto_tasks_daily": 3
  },
  "total_items": 3
}
```

### 036 POST `/api/support/hr/respond`

Body: `SupportRequest`. Response: **SupportResponse** (`message_id`, `role`, `content`, `quota_warning`).

### 037 POST `/api/support/finance/respond`

Same as above, `role` is `finance_manager`, `quota_warning` may not be empty.

---

## Module: material library/personal data (`prefix=/api`, `library.py`)

> Code location: `backend/app/api/library.py` (Materials, Prompt, Artifacts, Profile, Stats).

### 038 GET `/api/materials`

Query: `folder`, `mime_prefix`. Response: **MaterialOut** list.

### 039 POST `/api/materials`

Body: **MaterialIn**. Response: 201 **MaterialOut**.

### 040 DELETE `/api/materials/{material_id}`

Response: **204**.

### 041～044 Prompt CRUD + use

See `PromptIn`/`PromptOut`; `POST .../use` returns `{"id":"...","used_count": 2}`.

### 045 GET `/api/artifacts`

Query: `artifact_type`, `conversation_id`, `only_final`. Response: **ArtifactRow** list.

### 046 GET `/api/profile/me` / 047 PATCH `/api/profile/me`

**ProfileOut** / **ProfilePatch** (PATCH prohibits direct modification of `avatar_url`, will result in 400).

### 048 GET `/api/profile/me/stats`

Response: `{"artifacts": 12, "skills_used": 3}`.

---

## Module: Skills (`prefix=/api`, `skills.py`)

> Code location: `backend/app/api/skills.py`

### 049 GET `/api/skills`

Query: `domain`, `scenario`. Certification required. Returns a list of **SkillCard** (the controller assembles its own dict).

### 050 GET `/api/skills/mine`

Certification required. **SkillCard** list.

### 051 GET `/api/skills/{skill_id}`

Certification required. **SkillDetail** (including `yaml_definition`, `inputs_schema`, `workflow_summary`, etc.).

### 052 POST `/api/skills/{skill_id}/subscribe`

Response: `{"skill_id":"...","status":"subscribed"}`.

### 053 DELETE `/api/skills/{skill_id}/subscribe`

Response: **204**.

---

## Module: Flywheel (`prefix=/api`, `flywheel.py`)

> Code location: `backend/app/api/flywheel.py`

### 054 GET `/api/users/{user_id}/preference_vector`

No certification. None `response_model`. 200: Contains `preferences`, `preference_vec`.

### 055 GET `/api/users/{user_id}/skill_drafts`

No certification. Returns the draft list (`id`, `name`, `status`, `created_at`).

### 056 POST `/api/skill_drafts/{draft_id}/publish`

**501**, detail: `Skill creation market is V1.5 scope`.

---

## Module: WebSocket

> Module description: Single connection + server push via Redis broadcast; client sends `ping` or passive `pong` with timeout.
> Code location: `backend/app/api/ws.py`, `app/ws/manager.py`

### Interface 057 · WebSocket connection

| Item | Content |
|---|---|
| Protocol | WebSocket |
| Methods | GET (upgrade) |
| path | `/ws` |
| Status | ✅ Implemented |
| Authentication | Query `token`: When `settings.is_dev` is in the code or when token is not passed, `user_id` is **`anonymous`**; when it is not dev and token is passed, use JWT to solve `user_id` |
| Code location | `backend/app/api/ws.py:17` |

#### Client → Server

| Message | Description |
|---|---|
| `"ping"` | Text frame; server reply JSON `{"type":"pong"}` |
| (timeout) | When there is no message, the server sends `{"type":"pong"}` every `WS_HEARTBEAT_SECONDS` seconds |

#### Server → Client (within connection)

| type field | description |
|---|---|
| pong | heartbeat response (see above) |

### Server push event (via `ws_manager.publish` / `LangGraphTaskRunner.publish`)

The following **`type` string** comes from the actual `publish` call (**including** the `WSEventType` enumeration value); if it is inconsistent with the Pydantic model field in `app/schemas/ws.py`, the **dict** in the push code shall prevail.

| type | representative payload field (actual code) | code source |
|---|---|---|
| conversation_status_changed | `conversation_id`, `status`, `task_id` | `messages.py` |
| task_failed | `task_id`, `reason` | `messages.py`; also used for LangGraph step failure |
| work_mode_changed | `conversation_id`, `from`, `to` | `messages.py` |
| message_added | `conversation_id`, `message` (nested fields vary depending on the branch: `content`+`kind` or `text`+`kind`+`from_agent`, etc.) | `messages.py`, `interaction.py` |
| brief_updated | `conversation_id`, `brief` | `brief_builder.py` |
| mode_choice_required | `conversation_id`, `suggestion`, `reason`, `score` | `brief_builder.py` |
| agent_status_changed | `agent_id`, `status`, `last_active_at`, `conversation_id` | `agent_status.py` |
| step_started | `task_id`, `step_id` (**None** `agent_id` field) | `runner.py` |
| step_completed | `task_id`, `step_id`, `artifact` (can be an object containing `artifact_id`/`type`/`reference`/`metadata` or null) | `runner.py` |
| task_completed | `task_id`, `primary_artifact` | `runner.py` |
| hitl_gate_opened | **Two shapes**: (A) `hitl_gate.py`: `task_id`, `gate`, `preview_artifact`; (B) `runner.py` Interruption path: `task_id`, `step_id`, `preview` | `hitl_gate.py` / `runner.py` |

**Note**: The `WSEventType` enumeration also contains `conversation_created`, `step_streaming`, `clarification_required`, `quota_warning`, `hitl_gate_closed` and other values, which are not sent in the Python `publish` call of this scan** (see Appendix C).

---

## Appendix A: Common response format

**None** Unified outer packaging (such as `code`/`data`/`msg`). When successful, it is mostly Pydantic `response_model` model, or direct `dict`/`list`/`Response`. The exception is rendered by FastAPI by default **`{"detail": ...}`** (the `detail` of `HTTPException` can be `str` or `dict`, depending on where it is thrown).

## Appendix B: Summary list of error codes (summarized from `HTTPException` in `backend/app`)

| Meaning (in summary) | HTTP Status | Typical detail / condition | Throw location (example) |
|---|---|---|---|
| Parameter/business error | 400 | Unknown operation; unknown Agent; only group supports mode switching; avatar URL is modified directly; file name is illegal, etc. | `tasks.py`, `conversations.py`, `library.py`, `avatar.py` |
| Unauthorized / Verification Code / Token | 401 | Missing/Invalid Bearer; Unauthorized; Wrong verification code; Session user does not exist | `auth.py`, `messages.py` |
| Payment/Quota | 402 | Quota exceeded (`detail` is str or `{code,detail}`) | `messages.py`, `conversations.py` |
| Permissions | 403 | Not authorized to operate tasks; not authorized to access sessions; avatar ownership | `hitl.py`, `conversations.py`, `avatar.py` |
| Does not exist | 404 | Various resources do not exist | Many places |
| SMS gateway | 502 | SMS sending failed | `auth.py` |
| Not implemented | 501 | HITL gate rollback; flywheel release draft | `hitl.py`, `flywheel.py` |
| ready downgrade | 503 | `/ready` dependency failed | `main.py` |

(There is also a verification layer **422** (request body verification), which is generated by FastAPI by default.)

##Appendix C: Not implemented/To be confirmed list

| Location | Type | Description |
|---|---|---|
| `auth.py` `refresh` / `me` | To be confirmed by Teacher Lai | Using `Depends(lambda: None)`, `user_id` is always `None`, which is inconsistent with `get_current_user_id`, `refresh`/`me` cannot actually inject users through normal JWT // To be confirmed by Teacher Lai |
| `messages.py` `send_message` | Waiting for confirmation from Teacher Lai | Route does not require `Authorization`, only accessed by `conversation_id` // Waiting for confirmation from Teacher Lai |
| `conversations.py` `get_conversation` / `switch_work_mode` | To be confirmed by Teacher Lai | No user verification, inconsistent with interfaces such as Brief/members // To be confirmed by Teacher Lai |
| `flywheel.py` `GET .../preference_vector`, etc. | Waiting for confirmation by Teacher Lai | The path contains any `user_id`, without `get_current_user_id` // Waiting for confirmation by Teacher Lai |
| `schemas/ws.py` enumeration | Awaiting teacher Lai’s confirmation | `conversation_created`, `step_streaming`, `clarification_required`, `quota_warning`, `hitl_gate_closed` and other `publish` that are not within the scope of this scan are sent // Awaiting teacher Lai’s confirmation |
| `flywheel.py` `publish_skill_draft` | Implemented error throwing | Fixed `501`, docstring says V1.5 |
| `hitl.py` `rollback_gate` | Implemented throwing error | Fixed `501` |

## Appendix D: Scan Log

- **Skip**: `backend/.venv`, binary and `.git` do not exist, causing the commit to be unavailable.
- **Odor (Statistics)**:
- Some routes do not declare `response_model` (such as most `tasks` sub-paths, `support` GET, `flywheel` all, `auth` except login, `conversations` partial paths, etc.).
- `SendMessageResponse.payload`, `InterruptRequest.payload`, etc. **`dict[str, Any]`** No fixed JSON Schema.
- `messages.py` has `except NotImplementedError` branch (interrupt handling), non-HTTP interface layer behavior.
