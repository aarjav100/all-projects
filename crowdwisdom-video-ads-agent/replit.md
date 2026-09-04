# CrowdWisdom Trading Video Ads Agent

An inspectable Python agent pipeline that turns market research and proprietary trading data into three safe, source-aware vertical video ad drafts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `python -m app.main --mode demo` — run the complete Python demo pipeline
- `pytest` — run the Python validation suite

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `app/agents/` — typed research, strategy, script, storyboard, rendering, and QA agents
- `app/orchestrator/pipeline.py` — ordered pipeline and persisted stage outputs
- `app/models/schemas.py` — Pydantic contracts passed between agents
- `app/tools/` — API adapters, cache, provenance-aware data loader, Hermes adapter, and FFmpeg renderer
- `data/proprietary/` — assessment inputs; never hard-code their contents
- `outputs/` — generated research, scripts, storyboards, MP4s, QA, and reports

## Architecture decisions

- Demo mode is deterministic and explicitly labeled when external research credentials are absent.
- The OpenMontage-compatible storyboard contract is kept separate from the local FFmpeg renderer so a production renderer can be swapped in.
- Every research statistic carries source file and location metadata; dated signal values are not rewritten as promises.
- Hermes is supported through its upstream Python-library checkout, with a clear deterministic fallback because Hermes is not distributed as a requirements wheel.

## Product

Run one command to research, analyze, strategize, script, storyboard, render, and QA three CrowdWisdom video ads. Inspect every intermediate JSON and the final report, or run individual stages with the CLI.

## User preferences

The project brief requires real MP4 output, exactly three concepts, structured JSON, transparent provenance, financial-content safety, and no hard-coded proprietary data.

## Gotchas

- Use `--force-refresh` when live research should bypass caches.
- FFmpeg must be available for MP4 rendering; lower `VIDEO_WIDTH` and `VIDEO_HEIGHT` on constrained machines.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
