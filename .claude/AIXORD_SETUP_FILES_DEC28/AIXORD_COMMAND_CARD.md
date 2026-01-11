# AIXORD v2.1 — COMMAND CARD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🚗 AIXORD v2.1 DRIVER'S PANEL                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 STEERING — Where to Go                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PMERIT CONTINUE          → Platform work (frontend + backend)              │
│  PRODUCT CONTINUE         → Product work (AIXORD, KDP, Gumroad)             │
│                                                                             │
│  SCOPE: [name]            → Load specific SCOPE                             │
│  SCOPE: MASTER            → Load full project vision                        │
│                                                                             │
│  GENESIS: [name]          → Create new SCOPE (4-step protocol)              │
│  GENESIS DECOMPOSE: [name]→ Break SCOPE into SUB-SCOPEs                     │
│                                                                             │
│  ENV: FE                  → Switch to Frontend repo                         │
│  ENV: BE                  → Switch to Backend repo                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚙️ GEARS — Operating Modes                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ENTER DECISION MODE      → Open discussion, brainstorm, spec writing       │
│                             (Claude Web = Architect)                        │
│                                                                             │
│  ENTER EXECUTION MODE     → Frozen decisions, implement specs               │
│                             (Claude Code = Commander)                       │
│                             ⚠️ Requires approved HANDOFF                    │
│                                                                             │
│  ENTER AUDIT MODE         → Read-only investigation, no changes             │
│  AUDIT SCOPE: [name]      → Audit specific SCOPE against reality            │
│                                                                             │
│  VISUAL AUDIT: [name]     → Screenshot verification (UI SCOPEs)             │
│                                                                             │
│  STATUS                   → Report current state (no work)                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🛑 BRAKES — Stop & Control                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HALT                     → STOP everything, return to DECISION             │
│                             (Use anytime, no questions asked)               │
│                                                                             │
│  UNLOCK: [file]           → Allow modification of locked file               │
│  RELOCK: [file]           → Re-protect file after changes                   │
│                                                                             │
│  EXTEND ATTEMPTS: [task]  → Allow 5 attempts instead of 3                   │
│                                                                             │
│  APPROVED / PROCEED / YES → Explicit approval to continue                   │
│  REJECTED / NO / STOP     → Reject proposal, do not proceed                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 DASHBOARD — Quick Status Indicators                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Mode Indicator:                                                            │
│    🟢 DECISION    — Open discussion, safe to brainstorm                     │
│    🟡 EXECUTION   — Implementing, decisions frozen                          │
│    🔵 AUDIT       — Read-only, investigating                                │
│    🟣 VISUAL_AUDIT— Reviewing screenshots                                   │
│    🔴 HALTED      — Stopped, awaiting direction                             │
│                                                                             │
│  SCOPE States:                                                              │
│    ⬜ EMPTY       — File created, no content                                │
│    📋 AUDITED     — Reality documented                                      │
│    📝 SPECIFIED   — HANDOFF written                                         │
│    🔄 IN_PROGRESS — Execution active                                        │
│    👁️ VISUAL_AUDIT— UI verification                                         │
│    ✅ COMPLETE    — All verified                                            │
│    🔒 LOCKED      — Protected, needs UNLOCK                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🚨 AUTOMATIC HALT TRIGGERS (AI will stop and ask)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  • Ambiguous requirement          • Locked file touched                     │
│  • Missing specification          • 3 consecutive failures                  │
│  • Prerequisite not met           • Scope creep detected                    │
│  • Cross-repo conflict            • Visual discrepancy unresolved           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🔑 QUICK RECIPES                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Start Platform Work:                                                       │
│    → "PMERIT CONTINUE"                                                      │
│                                                                             │
│  Create New Feature:                                                        │
│    → "GENESIS: SCOPE_NEW_FEATURE"                                           │
│                                                                             │
│  Break Down Large SCOPE:                                                    │
│    → "GENESIS DECOMPOSE: SCOPE_SECURITY"                                    │
│                                                                             │
│  Fix Something in Locked File:                                              │
│    → "UNLOCK: path/to/file.ts"                                              │
│    → [make changes]                                                         │
│    → "RELOCK: path/to/file.ts"                                              │
│                                                                             │
│  Emergency Stop:                                                            │
│    → "HALT"                                                                 │
│                                                                             │
│  Approve and Execute:                                                       │
│    → "APPROVED. ENTER EXECUTION MODE"                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  📍 LOCATIONS                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AIXORD_ROOT:     C:\dev\pmerit\AIXORD_ROOT\                                │
│  Sandbox:         C:\dev\pmerit\sandbox\                                    │
│  Frontend SCOPEs: pmerit-ai-platform\.claude\scopes\                        │
│  Backend SCOPEs:  pmerit-api-worker\.claude\scopes\                         │
│  Product SCOPEs:  Pmerit_Product_Development\.claude\scopes\                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                    AIXORD v2.1 — Authority. Execution. Confirmation. Genesis.
```
