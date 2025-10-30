# Phase 5 — Classroom Init Wire-up (portal/classroom.html)

## Objective
Render the Virtual Human inside the Classroom view using the same loader and assets.

## Scope & Tasks
- [ ] Add `<script type="module" src="/assets/avatars/avatar-init.js"></script>` near `</body>`.
- [ ] Add runtime init snippet (`DOMContentLoaded`) for `AvatarManager.init(...)`.
- [ ] Ensure a visible container exists on this page as well.
- [ ] Verify that Classroom page layout reserves enough space for the canvas.

## File Paths
- `portal/classroom.html`
- `assets/avatars/avatar-init.js`

## Acceptance Criteria
- [ ] Avatar visible in Classroom with no layout shifts.
- [ ] No errors after navigating between Home and Classroom.

## Labels
`phase-5`, `frontend`, `feature`, `priority`
