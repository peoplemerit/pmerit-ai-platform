# Phase 5 — Smoke Tests (Avatar Visibility)

## Objective
Confirm the avatar renders correctly across environments and pages.

## Scope & Tasks
- [ ] Home: hard refresh twice; ensure one canvas and no memory leaks.
- [ ] Classroom: init on load; resize window; verify canvas resizes and remains visible.
- [ ] Check console for CSP and CORS errors.
- [ ] Network: `.glb` returns `200` and `Content-Type: model/gltf-binary`.
- [ ] Lighthouse Performance >= 70 with avatar visible (desktop).

## Acceptance Criteria
- [ ] All checks pass locally and on Cloudflare Pages preview.

## Labels
`phase-5`, `testing`, `frontend`
