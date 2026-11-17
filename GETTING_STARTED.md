# Getting Started

The default core development mode starts two containers and three application processes:

- **Infrastructure**: PostgreSQL, Redis
- **Application Services**: FastAPI backend, Unified Agent Worker, Next.js frontend

It defaults to `LITELLM_MOCK=true` without external API dependencies, allowing you to test the complete end-to-end workflow: **Frontend → Backend → LangGraph → Agent Workers → Human-in-the-Loop → Deliverable Storage**.

---

## Quickstart (Windows PowerShell)

Run the following in the repository root:

```powershell
.\scripts\core.ps1 setup
.\scripts\core.ps1 start
```

The script initializes a dedicated `.venv`, installs locked dependencies, runs Alembic migrations, starts all services, and displays the running URLs:
- Backend dynamically selects free ports starting from `8001`.
- Frontend dynamically selects free ports starting from `3000`.

### Checking Status and Logs

```powershell
.\scripts\core.ps1 status
Get-Content .runtime\backend.error.log -Wait
Get-Content .runtime\frontend.log -Wait
```

### Stopping Services

```powershell
.\scripts\core.ps1 stop
docker compose -f compose.core.yml down
```

---

## Quickstart (macOS / Linux / WSL)

```bash
cp .env.example .env
make setup
make up
```

`make up` reads the root `Procfile`. Press `Ctrl+C` to stop the application processes, and run `make infra-down` to terminate background containers.

---

## Authentication & Verification

The local development verification code is `123456`. After logging in, create an `Auto` session and send a sample request:

```text
Create a short video. Topic: Night City Running; Style: Documentary; Audience: Working Professionals; Duration: 30s; Platform: TikTok; Hook: Don't rush home right after work.
```

Review and approve the three confirmation cards. Once approved, the chat displays the generated deliverable reference and records it in your Deliverables Library. Mock mode validates the orchestration pipeline, state transitions, approval gates, and database storage without consuming paid API quotas.

---

## Switching to Real Model Providers

When ready to connect real model APIs, disable mock mode:

```dotenv
LITELLM_MOCK=false
SMS_DEV_MODE=false
```

Configure your LiteLLM Proxy or direct vendor credentials (OpenRouter, DeepSeek, OpenAI, Anthropic), SMS provider keys, and S3-compatible object storage. Refer to `deploy/production/README.md` for production clustering and Kubernetes deployments.
