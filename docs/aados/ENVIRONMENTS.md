# 🌐 PMERIT Platform — Environments

**Purpose:** Define all development environments for AADOS coordination
**Version:** 2.0
**Last Updated:** 2025-12-21

---

## 🖥️ Local Development Environment

**Project Root:** `C:\dev\pmerit\` (migrated from E:\pmerit on 2025-12-21)

### Isolated Node.js Setup

The project uses a **local Node.js installation** to prevent system updates from affecting development.

| Component | Value |
|-----------|-------|
| **Node.js Path** | `C:\dev\pmerit\.node\node-v20.18.1-win-x64\` |
| **Node Version** | v20.18.1 LTS |
| **NPM Version** | v10.8.2 |
| **Activation (PS)** | `.\pmerit-env.ps1` |
| **Activation (CMD)** | `pmerit-env.cmd` |

### Before Any Development

```powershell
cd C:\dev\pmerit
.\pmerit-env.ps1
```

This sets up the PATH to use the local Node.js instead of any system-installed version.

---

## 🗺️ Environment Overview

| ID | Name | Type | Status |
|----|------|------|--------|
| `FE` | Frontend | Cloudflare Pages | ✅ Active |
| `BE` | Backend API | Cloudflare Workers | ✅ Active |
| `DB` | Database | Neon PostgreSQL | ✅ Active |
| `TR` | Translation | Azure Cognitive Services | ✅ Active |
| `DO` | DigitalOcean | Cloud Infrastructure | 🔒 Reserved |

---

## 📁 FE — Frontend (Primary)

**Type:** Static Site + JavaScript  
**Hosting:** Cloudflare Pages  

| Property | Value |
|----------|-------|
| **Repository** | `peoplemerit/pmerit-ai-platform` |
| **Local Path** | `C:\dev\pmerit\pmerit-ai-platform` |
| **Production URL** | https://pmerit.com |
| **Pages URL** | https://pmerit-ai-platform.pages.dev |
| **Branch** | `main` |

### Contains
- HTML pages (index.html, MOSA pages)
- CSS stylesheets
- JavaScript (layout-loader, language-manager, modals)
- Partials (header, footer, navigation)
- Documentation (`docs/`)

### When to Use
- UI changes
- Styling updates
- Client-side JavaScript
- Documentation updates
- Governance file changes

---

## ⚙️ BE — Backend API

**Type:** Serverless API  
**Hosting:** Cloudflare Workers  

| Property | Value |
|----------|-------|
| **Repository** | `peoplemerit/pmerit-api-worker` |
| **Local Path** | `C:\dev\pmerit\pmerit-api-worker` |
| **Production URL** | https://pmerit-api-worker.peoplemerit.workers.dev |
| **Branch** | `main` |
| **Language** | TypeScript 5.5.2 |

### API Endpoints

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **AI Chat** | `/api/v1/ai/chat`, `/support`, `/tutor`, `/assessment`, `/careers` | 5 persona chat system |
| **RAG** | `/api/v1/embeddings/generate`, `/vectorize/insert`, `/vectorize/query` | Knowledge retrieval |
| **TTS** | `/api/v1/tts`, `/api/v1/tts/quota` | Text-to-speech |
| **Avatars** | `/api/v1/virtual-human/avatars` | Virtual human list |
| **Database** | `/api/v1/db/verify`, `/api/v1/db/tables` | DB health checks |

### When to Use
- API endpoint changes
- AI persona modifications
- RAG/embedding updates
- TTS configuration
- Backend business logic

### Deploy Command
```bash
cd C:\dev\pmerit\pmerit-api-worker
npx wrangler deploy
```

---

## 🗄️ DB — Database

**Type:** Managed PostgreSQL  
**Hosting:** Neon  

| Property | Value |
|----------|-------|
| **Provider** | Neon PostgreSQL 17.5 |
| **Tables** | 54 tables |
| **Access** | Neon Dashboard |
| **Connection** | Via `pmerit-api-worker` bindings |

### Contains
- Career profiles (96 careers)
- Assessment data
- User sessions
- Usage analytics

### When to Use
- Schema changes
- Data migrations
- Query optimization
- Table management

### Access Method
1. Neon Dashboard (direct SQL)
2. Via Backend API (`/api/v1/db/*` endpoints)
3. Drizzle ORM in `pmerit-api-worker`

---

## 🌍 TR — Translation Service

**Type:** Managed API  
**Hosting:** Azure Cognitive Services  

| Property | Value |
|----------|-------|
| **Service** | Azure Translator |
| **Region** | East US 2 |
| **Endpoint** | https://api.cognitive.microsofttranslator.com |
| **Document Translation** | https://pmerit-translator.cognitiveservices.azure.com |
| **Access** | Azure Portal |

### When to Use
- Translation API integration
- Language support expansion
- API key rotation

### Access Method
Azure Portal → pmerit-translator → Keys and Endpoint

---

## ☁️ DO — DigitalOcean (Reserved)

**Type:** Cloud Infrastructure  
**Status:** 🔒 Reserved for future use  

| Property | Value |
|----------|-------|
| **Project** | pmerit-laptop-key |
| **Current Resources** | None active |
| **Planned Use** | GPU droplets for AI models |

### When to Use
- Future: Self-hosted AI models
- Future: Heavy compute workloads

---

## 🔀 Environment Switching Protocol

### Detecting Required Environment

When a task is identified, Claude must determine which environment(s) are needed:

| Task Type | Environment | Example |
|-----------|-------------|---------|
| UI/styling | `FE` | "Fix button color" |
| Client JS | `FE` | "Update language modal" |
| API endpoint | `BE` | "Add new chat endpoint" |
| AI behavior | `BE` | "Change tutor persona" |
| Database schema | `DB` | "Add new table" |
| Translation | `TR` | "Configure new language" |
| Full-stack | `FE` + `BE` | "Add new feature with UI and API" |

### Switching Commands

| Command | Effect |
|---------|--------|
| `ENV: FE` | Switch focus to Frontend |
| `ENV: BE` | Switch focus to Backend |
| `ENV: BOTH` | Coordinate both repos |

### Multi-Environment Task Flow

When a task requires multiple environments:

1. **Identify** all environments needed
2. **Plan** changes for each environment
3. **Execute** Backend first (API must exist before frontend calls it)
4. **Execute** Frontend second
5. **Test** end-to-end
6. **Commit** both repos

---

## 📋 Quick Reference

### Local Paths
```
Project Root: C:\dev\pmerit
Frontend:     C:\dev\pmerit\pmerit-ai-platform
Backend:      C:\dev\pmerit\pmerit-api-worker
Node.js:      C:\dev\pmerit\.node\node-v20.18.1-win-x64
```

### Production URLs
```
Site:     https://pmerit.com
API:      https://pmerit-api-worker.peoplemerit.workers.dev
```

### GitHub Repos
```
Frontend: github.com/peoplemerit/pmerit-ai-platform
Backend:  github.com/peoplemerit/pmerit-api-worker
```

---

*This document is referenced by GOVERNANCE.md and PMERIT_MASTER_INSTRUCTIONS.md*