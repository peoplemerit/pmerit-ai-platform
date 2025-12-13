# PMERIT SUB-SCOPE: Homepage Gate

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** COMPLETE
**Phase:** GATE (H1-H10)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Homepage Production-Ready Gate |
| **Phase** | Homepage Gate (H1-H10) |
| **Pages** | `index.html` |
| **JavaScript** | `chatbox.js`, `auth-modal.js`, `layout-loader.js`, `config.js` |
| **CSS** | `styles.css`, `auth-modal.css` |
| **API Endpoints** | `/api/v1/ai/chat`, `/api/v1/ai/support` |
| **Partials** | `header.html`, `footer.html`, `auth-modal.html` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| HP-001 | Layout | Google-style centered chatbox | Clean, minimal, professional | 27 |
| HP-002 | AI Receptionist | Claude/Llama via Workers AI | Always available, no human needed | 29 |
| HP-003 | Auth Modal | Overlay modal, not separate page | Seamless UX, no navigation break | 31 |
| HP-004 | Language System | Custom modal with search | Azure Translator integration | 27 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### Homepage Gate Requirements

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| H1 | No console errors | Complete | Initialization logs only |
| H2 | Google-style design | Complete | Centered chatbox, minimal |
| H3 | AI chatbox functional | Complete | Streaming responses |
| H4 | Left panel actions | Complete | Dashboard, Pathways, etc. |
| H5 | Sign-Up modal triggers | Complete | Auth modal loads |
| H6 | Customer Service badge | Complete | Button in sidebar |
| H7 | Language system | Partial | Modal shows "No languages found" |
| H8 | Header/Footer correct | Complete | Dynamic loading works |
| H9 | Mobile responsive | Complete | Hamburger menu |
| H10 | No broken assets | Complete | All CSS/JS/fonts load |

### Gate Status: 9/10 (Conditionally Complete)

H7 is a known issue but does not block other phases.

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 49 (2025-12-11)
- Fixed hamburger menu JS (added .active class toggle)
- Dark mode styling for menu/toggles

### Session 29 (2025-12-06)
- AI backend fixed (env.AI binding working)
- H3 fully verified

### Session 27 (2025-12-05)
- Full production audit
- H1-H10 verification

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Enables** | ALL PHASES | Gate must pass first |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| H7 Language modal shows "No languages found" | Low | Needs debugging |

---

*Last Updated: 2025-12-12 by Claude Code (Session 50)*
