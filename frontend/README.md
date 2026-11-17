# Nexis Frontend

Next.js 15 / React 19 production frontend. Connects to FastAPI typed endpoints and consumes canonical `UserEvent` streams over Server-Sent Events (SSE) with `Last-Event-ID` resumption. Mock mode is active only when `NEXT_PUBLIC_MOCK_MODE=true`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

When backend is running on `http://localhost:8000`, regenerate OpenAPI TypeScript definitions:

```bash
pnpm gen:api
```

## Architecture Boundaries

- `lib/client.ts`: JWT authentication, structured error propagation, and typed schema clients.
- `lib/sse.ts`: Event framing, replay cursor resumption, event deduplication, automatic reconnects, and state synchronization.
- `stores/`: Pure client-side UI and view presentation state; orchestration is decoupled to the backend.
- `app/market/`: Declarative Skill discovery, inspection, installation, enablement, and lifecycle management.
- `e2e/`: Playwright end-to-end integration test suites with mock fallbacks.

Design system accent is emerald `#07C160` with icons by `lucide-react`. HITL V1 gates offer approve / refine / cancel interaction pathways.
