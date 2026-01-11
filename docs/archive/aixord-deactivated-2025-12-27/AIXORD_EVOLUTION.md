# AIXORD Evolution History

**Document:** System Naming & Evolution Record
**Created:** December 24, 2025
**Session:** 77

---

## Current System: AIXORD (AI Execution Order)

**Definition:** A structured, guardrailed instruction framework issued by an AI system to a human operator, requiring sequential execution and explicit confirmation.

---

## Evolution Timeline

### Version 1.0-10.0: AADOS (2025)
**Name:** Audit and Artifact Delivery & Orchestration System
**Period:** Sessions 1-76

AADOS was the original naming convention focused on:
- Audit processes
- Artifact management (handoffs, documentation)
- Delivery workflows
- Orchestration of AI-human collaboration

**Key Components:**
- GOVERNANCE.md - Rules and workflows
- STATE.json - System state tracking
- TASK_TRACKER.md - Progress tracking
- Handoff documents - Session continuity

### Version 11.0: Transition to AIXORD (December 24, 2025)
**Name:** AI Execution Order
**Session:** 77

**Why the change:**

The AADOS name was process-focused ("Audit & Handoff") while the actual system behavior was directive-focused. The system functions as an **orders doctrine**:

```
AI issues intent + constraints → Human executes → Human confirms → Next step
```

This pattern mirrors military OPORD (Operations Order) doctrine but inverted for AI→Human direction.

**Key insight:** The system is not just organizing artifacts—it's issuing structured execution orders.

---

## AIXORD vs AADOS Comparison

| Aspect | AADOS | AIXORD |
|--------|-------|--------|
| **Focus** | Process & Documentation | Execution & Command |
| **Mental Model** | Filing system | Orders doctrine |
| **Direction** | Ambiguous | Clear: AI → Human |
| **Authority** | Procedural | Directive |
| **Heritage** | Ad-hoc evolution | OPORD-inspired |

---

## OPORD Mapping

AIXORD adopts concepts from military Operations Orders:

| OPORD Section | AIXORD Equivalent |
|---------------|-------------------|
| 1. Situation | System Context |
| 2. Mission | Objective |
| 3. Execution | Step-by-Step Tasks |
| 4. Sustainment | Constraints & Guardrails |
| 5. Command & Signal | Confirmation Rules |

---

## File Location History

| Version | Folder | Notes |
|---------|--------|-------|
| V1-V10 | `docs/aados/` | Original location |
| V11+ | `docs/aixord/` | Current location |

**Backward Compatibility:** Old `docs/aados/` folder retained as archive with symlink/redirect notice.

---

## Key Documents Renamed

| Old Name (AADOS) | New Name (AIXORD) |
|------------------|-------------------|
| GOVERNANCE.md | AIXORD_GOVERNANCE.md |
| VISUAL_WALKTHROUGH_PROTOCOL.md | AIXORD_VWP.md |
| GAP_REPORT_*.md | AIXORD_GAP_*.md |
| TASK_TRACKER.md | AIXORD_TRACKER.md |
| STATE.json | AIXORD_STATE.json |

---

## Credits

The AIXORD naming was developed through collaborative brainstorming:

- **Concept Origin:** Human Director identified the OPORD parallel
- **Name Selection:** "AI Execution Order" chosen for:
  - Clarity of direction (AI → Human)
  - Professional authority
  - OPORD heritage without military exclusivity
  - Expandability (AIXORD-AUDIT, AIXORD-VWP, etc.)

---

## References

- **OPORD (Operations Order):** US Military planning document format
- **Mission Command:** Doctrine emphasizing intent + constraints over micromanagement
- **Session 77:** K-12 Visual Walkthrough that revealed "built but not connected" gaps

---

*This document preserves the evolution history of the PMERIT governance system.*
*AADOS → AIXORD: From process management to execution orders.*
