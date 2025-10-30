# Phase 5 — Home Page Init Wire-up (index.html)

## Objective
Render the Virtual Human on the Home page using `AvatarManager` and new `.glb`.

## Scope & Tasks
- [ ] Add `<script type="module" src="/assets/avatars/avatar-init.js"></script>` near `</body>`.
- [ ] Add the runtime init snippet for DOMContentLoaded calling `AvatarManager.init(...)`.
- [ ] Ensure a visible container exists: `<div id="vh-canvas"></div>` with height via CSS/inline style.
- [ ] Validate resize handling and no duplicate canvases on route changes.

## File Paths
- `index.html`
- `assets/avatars/avatar-init.js`

## Acceptance Criteria
- [ ] Avatar visible on Home at first load and after toggling VH mode.
- [ ] No console errors; FPS stable.

## Labels
`phase-5`, `frontend`, `feature`, `priority`
