# Nexis Backend

## Quickstart

Configure `.env` in the repository root:

```bash
cd backend && uv sync
# cp ../.env.example ../.env

# Launch infrastructure containers from repo root
docker compose -f deploy/production/docker-compose.yml \
  -f deploy/production/docker-compose.mock.yml up -d

cd backend && uv run alembic upgrade head

# Orchestration package is located in ../agents
export PYTHONPATH="../agents${PYTHONPATH:+:$PYTHONPATH}"
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# PowerShell: $env:PYTHONPATH = "..\agents;" + $env:PYTHONPATH
```

## Testing & Quality Assurance

```bash
cd backend
uv run pytest tests/smoke/ -v       # Smoke tests
uv run pytest                       # Complete test suite
uv run ruff check .
uv run mypy app/
```

## Architecture & Layout

See `docs/ARCHITECTURE.md` and repository `README.md`.
