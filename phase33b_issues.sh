#!/usr/bin/env bash
set -euo pipefail

# Helper to open issues with consistent metadata.
create_issue () {
  local TITLE="$1"; shift
  local BODY="$1"; shift
  gh issue create \
    --title "$TITLE" \
    --body "$BODY" \
    --label "phase:3.3-B" \
    --label "area:frontend" \
    "$@"
}

# 1) BUG: VH toggle shows generic assistant widget instead of WebGL avatar
create_issue "BUG: VH toggle renders generic widget, not WebGL avatar" \
"**Observed**
- Front page 'Virtual Human Mode' toggle opens a generic assistant widget instead of the intended WebGL avatar (Convai + Reallusion via Three.js). See screenshots in continuation context.

**Expected**
- When VH mode is ON, render the Three.js canvas with the avatar. The receptionist/chat-only widget should be reserved for *Customer Service Mode* (CSM).

**Scope**
- DOM hooks: ensure \`#vh-home\` (canvas wrap) & \`#vh-home-captions\` exist.
- JS: \`AvatarManager.setEnabled(true|false)\` drives mount/unmount of Three.js scene.
- Lazy-load Three.js + avatar bundle only when VH intent is ON.

**Acceptance**
- VH toggle ON: avatar visible with caption area; CSM widget NOT shown.
- VH toggle OFF: no avatar; page remains performant.
"

# 2) FEATURE: Customer Service Mode uses compact assistant widget (screenshot)
create_issue "FEATURE: Customer Service Mode uses compact Support widget" \
"**Goal**
- Reuse the compact assistant widget (as per screenshot) ONLY when *Customer Service Mode* is toggled ON.

**Details**
- Route events to 'support' domain intents (FAQ, pricing, how PMERIT works, etc.).
- Maintain separate state from VH (do not auto-enable VH).
- Ensure close/minimize state persists per-session.

**Acceptance**
- CSM toggle ON shows widget; OFF hides it. VH toggle unaffected.
" --label "mode:customer-service" --label "enhancement"

# 3) BUG: Brand regression (colors & fonts drifted from blueprint)
create_issue "BUG: Brand regression: colors & typography drifted from blueprint" \
"**Observed**
- Platform colors and fonts differ from original blueprint.

**Actions**
- Re-apply brand tokens from design system file(s): primary/secondary palette, surface/overlay, and typography stacks (headings, body, monospace).
- Add visual regression notes/tests (storybook snapshot or per-page CSS variables).

**Acceptance**
- Home page and VH area match blueprint palette & font stacks.
" --label "design" --label "bug"

# 4) TASK: DOM hooks & IDs for VH home
create_issue "TASK: Add DOM hooks/IDs for VH home (canvas + captions)" \
"**Add**
- \`<div id=\"vh-home\"></div>\` for Three.js mount.
- \`<div id=\"vh-home-captions\"></div>\` for TTS captions.
- Optional: \`data-role\` attributes for analytics selectors.

**Acceptance**
- Hooks present and empty when VH disabled; populated when enabled.
" --label "implementation"

# 5) TASK: AvatarManager wiring & lifecycle
create_issue "TASK: Wire AvatarManager lifecycle (enable/disable + lazy-load)" \
"**Implement**
- \`AvatarManager.setEnabled(bool)\` toggles mount/unmount.
- Lazy-load avatar bundle (dynamic import) when first enabled.
- Dispose scene/audio/analyzers on disable to prevent leaks.

**Acceptance**
- Memory footprint drops after disable; no double audio/scene instances.
" --label "implementation"

# 6) CSP/connect-src for audio + Convai/Reallusion endpoints
create_issue "TASK: Update CSP/connect-src for audio & provider endpoints" \
"**Need**
- Allow mic streaming, TTS audio, Convai websocket/HTTP, and Worker APIs.
- Document exact domains (prod & preview) and add them to CSP headers/meta.

**Acceptance**
- No CSP violations in console during VH/CSM sessions.
" --label "security" --label "infra"

# 7) PERFORMANCE: Audio-only fallback + reduced-motion support
create_issue "PERF: Audio-only fallback & prefers-reduced-motion support" \
"**Implement**
- If device is low-power or user prefers-reduced-motion, default to audio-only VH (no 3D) with captions.
- Provide toggle to switch to full 3D.

**Acceptance**
- Smooth experience on low-end devices; no layout jump.
" --label "performance" --label "accessibility"

# 8) ANALYTICS: Events for VH and CSM funnels
create_issue "ANALYTICS: Track VH/CSM toggles, first reply, CTA clicks" \
"**Events**
- \`vh_toggle_on/off\`
- \`vh_first_reply\`
- \`cta_assessment_click\`, \`cta_signup_click\` (anonymous)
- \`csm_toggle_on/off\`, \`csm_quick_action_click\`

**Acceptance**
- Events visible in analytics dashboard with session metadata (but no PII).
" --label "analytics"

# 9) ROUTING: Ensure 'Begin Assessment' & 'Sign Up' CTAs route correctly
create_issue "ROUTING: 'Begin Assessment' & 'Sign Up' CTAs route correctly" \
"**Fix**
- Keep CTAs visible in early layouts.
- Ensure CTAs navigate to correct routes under Worker gateway.
- Verify both VH/CSM modes do not hijack CTA clicks.

**Acceptance**
- Consistent routing in prod & preview.
" --label "routing"

# 10) TASK: Session summary MVP endpoint integration
create_issue "TASK: Integrate /api/session/summary Worker (MVP payload)" \
"**Payload**
\`\`\`json
{ \"userId\", \"cues\":[], \"startedAt\", \"endedAt\", \"durationSec\", \"lastPrompt\", \"vhMode\" }
\`\`\`
**Use**
- Persist on VH/CSM end-session; power analytics and resume UI.

**Acceptance**
- Network request succeeds; errors handled quietly in UI.
" --label "backend" --label "worker"

# 11) TASK: ENV template & asset paths for avatars
create_issue "TASK: ENV template & asset paths for avatars" \
"**Add**
- \`.env.example\` keys:
  - \`AVATAR_BASE_URL=/pmerit-avatars/\`
  - \`AVATAR_MODEL=pm_classic.glb\`
  - \`APP_WORKER_API=/api\`
- Ensure static hosting path works on Pages (prod & preview).

**Acceptance**
- Local and preview builds locate models without 404.
" --label "devx"

# 12) UI: VH section layout (canvas size, captions, status strip)
create_issue "UI: VH section layout (canvas size, captions, status strip)" \
"**Design**
- Apply blueprint spacing; keep status strip 'Virtual Human is ready.' below canvas.
- Captions area sits under canvas with truncation & scroll.

**Acceptance**
- Matches blueprint screenshot metrics within reasonable bounds.
" --label "design"

# 13) BUG: Mic permission & lip-sync alignment edge cases
create_issue "BUG: Mic permission flow & lip-sync alignment" \
"**Fix**
- Robust mic permission prompts.
- Handle muted mic gracefully.
- Verify viseme timing alignment with TTS on common browsers.

**Acceptance**
- No desync > 120ms in standard test prompts.
" --label "bug" --label "audio"

# 14) TASK: ReadAbout/VH Mode chips behavior (no-ops vs actions)
create_issue "TASK: Clarify chip actions: 'VH Mode' & 'Read About'" \
"**Decide & Implement**
- Define if chips trigger help tooltips or route to docs.
- Ensure keyboard focus order & ARIA labels.

**Acceptance**
- Chips are accessible and unambiguous.
" --label "ux" --label "accessibility"

# 15) DOCS: Phase 3.3-B README and operator runbook
create_issue "DOCS: Phase 3.3-B README + operator runbook" \
"**Include**
- Modes matrix (VH vs CSM).
- Feature flags/envs.
- Known limitations, test checklist, and rollback steps.

**Acceptance**
- New contributor can run VH and CSM locally in <10 min.
" --label "docs"

echo "✅ All Phase 3.3-B issues created successfully!"
echo "Created 15 issues with labels: phase:3.3-B, area:frontend, and specific tags"
