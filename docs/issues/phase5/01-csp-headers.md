# Phase 5 — CSP & Headers for GLB + WebGL on Cloudflare Pages

## Objective
Allow `.glb` (and optional Draco/wasm) to load on Cloudflare Pages without CSP violations.

## Scope & Tasks
- [ ] Update `/_headers` with correct `Content-Type` for `.glb` (`model/gltf-binary`) and caching.
- [ ] Add `Content-Security-Policy` to allow `https://unpkg.com` (Three.js), `blob:` and `data:` for WebGL textures.
- [ ] Verify no `wasm`/`draco` needed; if used, set `application/wasm`.
- [ ] Confirm gzip/brotli not corrupting `.glb` (leave binary untransformed).
- [ ] Add docs in `docs/CSP_AVATAR_ASSETS.md` summary section.

## File Paths
- `/_headers`
- `docs/CSP_AVATAR_ASSETS.md`

## Acceptance Criteria
- [ ] Home & Classroom load `.glb` with **no CSP errors**.
- [ ] Network tab shows `Content-Type: model/gltf-binary`.
- [ ] No console errors related to Three.js module import.

## Labels
`phase-5`, `frontend`, `infra`, `priority`
