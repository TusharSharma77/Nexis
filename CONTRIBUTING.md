# Contributing to Nexis

Nexis maintains a unified architecture for the backend API, LangGraph orchestrator, worker contracts, and Next.js frontend. The primary goal of contribution is maintaining clean modular boundaries across all layers.

---

## Development Environment Setup

```powershell
git checkout -b feature/<short-name>
Copy-Item .env.example .env
uv sync --locked --all-packages --all-extras
Set-Location frontend
pnpm install --frozen-lockfile
```

- Python dependencies are strictly managed in the root `.venv`. Avoid installing packages into global Python.
- Frontend dependencies use `frontend/pnpm-lock.yaml` with `pnpm@9.15.9`.

---

## Architectural Boundaries

- **Backend Entry Point**: All FastAPI routing and configuration live in `backend/app`. Never create duplicate application roots.
- **Orchestration**: The master orchestrator strictly uses the LangGraph state machine located in `agents/agents/orchestrator_agent`.
- **Worker Isolation**: Worker agents do not call each other directly; all communication occurs asynchronously via Redis Streams using standard `AgentTask` and `AgentResult` contracts.
- **Model Gateways**: Agents do not directly instantiate vendor SDKs (OpenAI, Anthropic); all LLM calls route through the unified Router / LiteLLM proxy.
- **Tools**: Tool execution occurs strictly through Model Context Protocol (MCP) servers and approved schemas.
- **Skills**: Executable skills originate from `backend/skills/playbooks/*.yaml` and synchronize idempotently via `backend/scripts/bootstrap-skills.py`.
- **Event Dispatch**: Business events are dispatched exclusively via `event_publisher.publish_user_event`.
- **Database Migrations**: Database changes must be appended as Alembic migration revisions (`alembic revision --autogenerate`). Never edit applied migrations.
- **Frontend State**: Server message history is owned by TanStack Query cache. Zustand is reserved for UI and conversation interaction states to prevent race conditions during real-time SSE streaming.

---

## Code Verification Checklist

Run these quality and type checks before opening a Pull Request:

### Backend & Agents
```powershell
.\.venv\Scripts\ruff.exe check backend agents
.\.venv\Scripts\python.exe -m compileall -q backend/app agents/agents agents/mcp_servers
.\.venv\Scripts\python.exe -m pytest backend/tests -q
.\.venv\Scripts\python.exe -m pytest agents/tests test/test_agent_task_handlers.py -q
.\.venv\Scripts\python.exe backend/scripts/check-contracts.py
```

### Frontend
```powershell
Set-Location frontend
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Security & Secrets

- Never commit `.env` files, API keys, private tokens, or customer phone numbers.
- Any new environment variable must be documented in both `.env.example` and `README.md`.
- Sensitive credentials must not be logged in plaintext. All logs must pass through `RedactingFormatter` and regex scrubbing processors.
