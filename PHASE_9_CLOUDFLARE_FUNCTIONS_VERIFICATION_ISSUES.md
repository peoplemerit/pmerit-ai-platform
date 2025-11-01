# Phase 9 — Cloudflare Functions Verification (Issues Bundle)

> Repository: `peoplemerit/pmerit-ai-platform`  
> Scope: End-to-end verification of **chat.js**, **tts.js**, **stt.js** with Cloudflare Pages/Workers/Workers AI bindings, secrets, routing, and guardrails.  
> Upstream context: Phase 7 (analytics shim + telemetry) and Phase 8 (mobile polish) are complete/underway.

**Phase Goal**  
Production-ready Pages/Workers integration for Chat + TTS + STT with stable routing, secrets, observability, throttling, and rollback paths.

**Global Definition of Done**
- No console errors; no CSP violations.
- Cloudflare Preview → Production promotion path documented and tested.
- All endpoints have input validation, timeouts, and rate limits.
- Telemetry events emitted (`cf_request`, `cf_error`, `model_infer_start/stop`, `stt_stream_start/stop`, `tts_start/stop`).
- Smoke tests pass on every deploy (preview & prod).
- Runbooks and .env.sample updated.

---

## Issue 9.1 — Inventory & Bindings Audit
**Why**  
Ensure all required environment bindings exist and match code expectations.

**Tasks**
- Document required bindings in `/docs/cloudflare-bindings.md`:
  - `WORKERS_AI_MODEL_CHAT`, `WORKERS_AI_MODEL_TTS`, `WORKERS_AI_MODEL_STT`
  - `AI_GATEWAY_URL` (optional), `RAG_API_URL` (optional)
  - `KV_CACHE` (optional), `D1_DB` (optional future), `LOG_DRAIN_URL` (optional)
- Verify `wrangler.toml` for Pages Functions/Workers; add `compatibility_date` and `node_compat` as needed.
- Add `.env.example` with comments.

**Acceptance Criteria**
- `npx wrangler print` shows all bindings; README lists them clearly.

**Labels**: `phase-9`, `infra`, `docs`  
**Estimate**: 3 points

---

## Issue 9.2 — Chat Endpoint Verification (`/api/chat`)
**Why**  
Back chat UI with Workers AI (or proxy) reliably.

**Tasks**
- Validate request body (message array, system prompt, traceId).
- Add timeout (e.g., 25s) and abort on client disconnect.
- Return streamed chunks (SSE) or buffered JSON; align with `chat.js`.
- Map/normalize provider errors to `{ code, message }`.

**Acceptance Criteria**
- Round-trip chat works in Preview & Production; analytics events visible.
- Handles network abort without orphaned tasks.

**Labels**: `phase-9`, `backend`, `workers`  
**Estimate**: 5 points

---

## Issue 9.3 — TTS Endpoint Verification (`/api/tts`)
**Why**  
Reliable synthesis with correct headers and streaming.

**Tasks**
- Accept `{ text, voice, format }`; sanitize text length.
- Stream audio (preferred) or return binary with `audio/*` MIME.
- Cache short responses with `Cache-Control: private, max-age=60`.

**Acceptance Criteria**
- Latency budget: first audio < 1.5s (lab), full < 6s typical.
- Audio plays on mobile Safari & Chrome without user-gesture deadlocks.

**Labels**: `phase-9`, `workers`, `audio`  
**Estimate**: 5 points

---

## Issue 9.4 — STT Endpoint Verification (`/api/stt`)
**Why**  
Speech capture pipeline must be stable and secure.

**Tasks**
- Accept WebM/PCM; limit size/duration; verify MIME.
- Optional streaming via WebSocket/SSE; otherwise batch.
- Return transcript with timestamps when available.

**Acceptance Criteria**
- 60-second audio transcribes < 15s typical.
- Handles empty/noisy audio gracefully; clear error messages.

**Labels**: `phase-9`, `workers`, `audio`, `realtime`  
**Estimate**: 8 points

---

## Issue 9.5 — Input Validation & Schema Guards
**Why**  
Prevent abuse and undefined behavior.

**Tasks**
- Add shared validators (zod or custom) for chat/tts/stt payloads.
- Enforce size limits, charset, and allowed `voice/format` enums.
- Reject requests without `Origin`/`Referer` from allowed domains.

**Acceptance Criteria**
- Fuzz tests show no unhandled exceptions; 400 vs 5xx split is correct.

**Labels**: `phase-9`, `security`, `backend`  
**Estimate**: 3 points

---

## Issue 9.6 — Rate Limiting & Abuse Protection
**Why**  
Protect cost exposure and fairness.

**Tasks**
- Implement IP+fingerprint buckets via `KV` or `Durable Objects`.
- Sliding window limits per endpoint (e.g., chat 60/min, tts 12/min, stt 6/min — tune later).
- Return `429` with `Retry-After`.

**Acceptance Criteria**
- Load test shows limits enforced; no cross-tenant bleed.

**Labels**: `phase-9`, `security`, `cost-control`  
**Estimate**: 5 points

---

## Issue 9.7 — Observability: Logs, Traces, Metrics
**Why**  
See what's happening at the edge.

**Tasks**
- Structured logs: `{ traceId, route, durationMs, status, bytesOut }`.
- Forward logs to Analytics shim (Phase 7) and optional `LOG_DRAIN_URL`.
- Expose `/admin/edge-health` (auth-gated) to view recent stats.

**Acceptance Criteria**
- Can correlate a UI action to Worker request by `traceId`.

**Labels**: `phase-9`, `observability`  
**Estimate**: 5 points

---

## Issue 9.8 — CORS & CSP Alignment
**Why**  
Avoid browser blocks.

**Tasks**
- Tight CORS: allowed origins (Pages domains + prod), allowed headers, methods.
- Update `_headers` CSP for audio streams, SSE, and model domains.
- Verify `Cross-Origin-Resource-Policy` and `Cross-Origin-Opener-Policy` do not break audio.

**Acceptance Criteria**
- Zero CORS/CSP errors during a full chat → TTS → STT cycle.

**Labels**: `phase-9`, `security`, `headers`  
**Estimate**: 3 points

---

## Issue 9.9 — E2E Test Suite (Preview + Prod)
**Why**  
Catch regressions automatically.

**Tasks**
- Playwright tests:
  - Send chat message and receive AI reply.
  - TTS synthesis plays (mock audio sink).
  - STT upload returns text.
- Record traces/video on failure; run in CI on Pages Preview.

**Acceptance Criteria**
- CI green in Preview; manual promotion to Prod triggers the same suite.

**Labels**: `phase-9`, `testing`, `e2e`  
**Estimate**: 8 points

---

## Issue 9.10 — Fallback & Offline Modes
**Why**  
Keep UX usable during outages.

**Tasks**
- Detect Worker errors/429 and surface UI fallback messages.
- Provide local mock responses in Dev; exponential backoff retries.
- Disable expensive features automatically after N failures.

**Acceptance Criteria**
- QA can simulate Worker down and still chat in mock mode.

**Labels**: `phase-9`, `resilience`, `frontend`  
**Estimate**: 3 points

---

## Issue 9.11 — Performance & Cost Budgets
**Why**  
Prevent surprise bills.

**Tasks**
- Define per-feature budget docs: max tokens/min, max audio secs/min/user.
- Add Cloudflare Analytics or Logs-push queries to monitor usage.
- Alert thresholds with email/webhook.

**Acceptance Criteria**
- Budget dashboard screenshot added to repo docs; alert fires in test.

**Labels**: `phase-9`, `cost-control`, `perf`  
**Estimate**: 5 points

---

## Issue 9.12 — Deployment Workflow & Rollback
**Why**  
Safe releases.

**Tasks**
- Pages Preview checks; require green E2E to promote.
- Versioned env vars and feature flags.
- Document rollback and kill-switch steps.

**Acceptance Criteria**
- Dry-run shows <5 min rollback from a bad deploy.

**Labels**: `phase-9`, `devops`  
**Estimate**: 3 points

---

## Issue 9.13 — Documentation & Runbooks
**Why**  
Operational clarity.

**Tasks**
- `/docs/runbook-workers.md` (how to debug, trace, throttle).
- `/docs/faq-workers.md` (common errors, audio MIME issues).
- Update root README with "Local vs Cloudflare" matrix.

**Acceptance Criteria**
- New team member can stand up Preview following docs only.

**Labels**: `phase-9`, `docs`  
**Estimate**: 2 points

---

### Milestone & Ordering
Recommended: 9.1 → 9.2 → 9.3 → 9.4 → 9.5 → 9.6 → 9.8 → 9.7 → 9.9 → 9.10 → 9.11 → 9.12 → 9.13

### References
- `PRODUCTION_INTEGRATION_REQUIREMENTS_FINAL.md`
- `TASK_DIVISION_CLAUDE_CHATGPT.md`
- `running-chat-history.txt`
- Frontend modules: `chat.js`, `tts.js`, `stt.js`, `router.js`, `main.js`
