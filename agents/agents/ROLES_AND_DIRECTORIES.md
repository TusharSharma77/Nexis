# `agents/` — Orchestrator & Four Specialized Worker Agents

This directory serves as the root implementation of the `agents` Python package, housing the multi-agent architecture:
**1 Lead Orchestrator Agent (executes inside the backend process)** + **4 Specialized Worker Agents (independent worker processes)**, sharing common protocols and utilities in `_common/`.

> **Naming Conventions**: In product context, the orchestrator is presented as the "Executive Assistant". In code, entrypoints live under `agents.orchestrator_agent` (e.g. `runner_factory`, `langgraph_runner`). Documentation and UI use product terminology, while source code, telemetry, and message queues use engineering taxonomy.

---

## Role & Agent Mapping Matrix

| Directory | Import Path | Role | Queue agent_id | Queue Channel |
|-----------|-------------|------|----------------|---------------|
| `orchestrator_agent/` | `agents.orchestrator_agent` | Lead Orchestrator (Skill Matching / Brief Analysis / LangGraph Execution / HITL / Redis Task Dispatch) | — *(internal scheduler)* | — |
| `text_agent/` | `agents.text_agent` | Text & Research Agent | `agent_1` | `agent_tasks:text` |
| `document_agent/` | `agents.document_agent` | Document & Data Processing Agent | `agent_2` | `agent_tasks:document` |
| `image_agent/` | `agents.image_agent` | Image & Visual Agent | `agent_3` | `agent_tasks:image` |
| `av_agent/` | `agents.av_agent` | Audio & Video Production Agent | `agent_4` | `agent_tasks:av` |
| `_common/` | `agents._common` | Shared Protocol & Utility Layer | — | — |

### Key Architectural Invariants

- **Directory naming = role descriptor + `_agent` suffix** (`text_agent`, `image_agent`, etc.).
- **agent_id = `agent_{N}`**: N is a fixed identifier (1–4) decoupled from folder naming.
  - `agent_1` through `agent_4` are stable keys in Redis task queues, logs, metrics, and billing accounting.
- **Queue channel = `agent_tasks:{kind}`**: channel is decoupled by media modality (text, document, image, av).

---

## Deployment & Execution Boundaries

| Dimension | Lead Orchestrator | Specialized Worker Agents |
|-----------|-------------------|---------------------------|
| Runtime Environment | In-process with FastAPI backend (asyncio task / LangGraph runner) | Independent worker daemon processes, deployed via K8s / Docker |
| Trigger Mechanism | HTTP / WebSocket / SSE events | Redis Stream consumer loop |
| Core Dependencies | LangGraph, Redis task dispatch, HITL approval interrupts | LiteLLM, Cloud Object Storage (OSS/S3), FFmpeg |
| Failure Semantics | Session-level recovery / user clarification | Task-level retry / Dead Letter Queue (DLQ) |

**Architectural Law (Rule 1 & Rule 2)**: Specialized worker agents NEVER invoke LangGraph or each other directly. The orchestrator never directly invokes low-level generation tools. All cross-boundary communication strictly flows through the `AgentTask` / `AgentResult` schema defined in `_common/protocol.py`.

---

## `_common/` Layer Responsibilities

`_common/` contains shared code imported across all 4 worker agents:
- **Protocol**: `protocol.py` (`AgentTask`, `AgentResult`, `ArtifactRef`)
- **Runtime**: `consumer.py` (Redis Streams consumer + handler dispatcher + ReAct engine)
- **Infrastructure**: `llm.py` (LiteLLM proxy wrapper), `oss_writer.py`, `flywheel_emitter.py`
- **Routing & Personas**: `react_personas.py`, `step_persona.py`

---

## Developer Guide: Where to Make Changes

| Objective | Target Path |
|-----------|-------------|
| Add a new Skill Playbook | `orchestrator_agent/` (register skill) + worker `{agent}/handlers/` (task implementation) |
| Add a new task type to an agent | `{agent}/handlers/{task_name}.py` + register in `{agent}/main.py` |
| Modify LLM routing strategy | `_common/llm.py` or worker handlers |
| Update task protocol schemas | `_common/protocol.py` (sync all 4 agent handlers) |
| Tune ReAct personas | `_common/react_personas.py` |
| Update orchestration graph | `orchestrator_agent/langgraph_runner/` |
