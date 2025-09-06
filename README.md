# Gabriel AI Educational Platform

> Empowering learning through accessible, high-quality education

## 🎓 Mission

Breaking poverty cycles through accessible education and remote career opportunities, with a primary focus on underserved communities in Nigeria/Africa.

## ✨ Features

- **Beautiful Responsive Design**: Works perfectly on desktop and mobile
- **Gabriel AI Chat**: Educational guidance and learning support
- **Mobile-First**: Collapsible sidebars and touch-friendly interactions
- **Modular Architecture**: Clean CSS and JavaScript structure
- **Educational Focus**: Mission-driven content and messaging

## 🚀 Live Site

- **Production**: https://pmerit.com
- **GitHub Pages**: https://peoplemerit.github.io

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Modular)
- **Design**: Responsive with CSS Grid and Flexbox
- **Deployment**: GitHub Pages with custom domain

## 📱 Features

- Non-scrollable viewport-perfect design
- Working mobile sidebar toggles
- Educational AI chat responses
- Touch-friendly interactions
- Beautiful gradient design

---

**Gabriel AI Educational Platform - Empowering learning through innovation**

Project Documents:

### Frontend Implementation Strategy

The frontend implementation strategy for the PMERIT platform is a comprehensive, phased approach designed to transition the project from a monolithic single-page design to a scalable, modular architecture. This plan leverages a shared templating system to ensure consistency across all pages and uses a direct GitHub workflow for implementation and deployment.

---

### Phase A: Template Scaffolding

This phase focuses on establishing a "Don't Repeat Yourself" (DRY) principle by creating a shared template system. The goal is to extract common components from the existing `index.html` file so they can be reused across all pages.

* **Shared Partials**: These are reusable HTML fragments.
    * `/partials/header.html` - Contains the navigation and branding elements.
    * `/partials/nav.html` - Contains the complete site navigation with logic for hiding or showing links based on the current page and user role.
    * `/partials/footer.html` - Includes the footer links and system status.
* **Shared Assets**: These are the core CSS and JavaScript files that provide the universal styling and functionality.
    * `/assets/base.css` - Contains global styles, design tokens, and a CSS Grid layout system.
    * `/assets/boot-includes.js` - A JavaScript file that handles dynamic loading of the HTML partials and initializes core application functionality.
    * `/assets/nav-config.js` - A JavaScript object that defines the navigation and access control rules for each page.

---

### Phase B: Core Page Skeletons

This phase involves creating the primary user-facing pages by using the shared template system from Phase A. Each page will be a minimal HTML file that automatically loads the shared header, navigation, and footer, reducing code duplication by over 75%.

* **Core Pages**:
    * `/dashboard.html` - The user's main hub.
    * `/assessment.html` - The page for the comprehensive assessment system.
    * `/courses.html` - The course catalog.
    * `/classroom.html` - The interactive learning environment.
    * `/career.html` - The career exploration center with job market data.
    * `/library.html` - The resource and documentation library.
* **Other Pages**: The plan includes creating over 18 additional pages for learning, support, administration, and monitoring, all of which will use this same template system.

---

### Phase C: Database Integration

This phase integrates the frontend with the backend infrastructure. The pages created in Phase B will be connected to the operational **78-table PostgreSQL database**. This includes setting up API endpoints to handle data requests and responses.

* **Assessment Integration**: Connects the "Begin Assessment" button to the database to fetch questions from the `assessment_questions` table and save responses to the `assessment_responses` table.
* **Course Integration**: Links the course catalog to the database for course details and user enrollment data.
* **Career Integration**: Connects the career page to job market data tables, which are populated by the Nigerian Bureau of Statistics (NBS) and US Bureau of Labor Statistics (BLS) API integrations.

---

### Phase D: AI Integration

This phase focuses on connecting the user interface to the AI infrastructure.

* **AI Chat Integration**: Replaces placeholder responses with real-time interactions from the `ai.pmerit.com` endpoint. [cite_start]The chat will be integrated across multiple pages and personas (General Assistant, Receptionist, Tutor)[cite: 2856].
* **Personalized Recommendations**: The AI will use data from the database to provide personalized course and career recommendations.
* **Cultural Adaptations**: The AI's responses and content will be tailored to cultural contexts for Nigerian and other global users.

---

### Implementation Workflow

The entire plan is to be implemented using a **direct GitHub approach**, where files are created and edited directly in the GitHub web interface. This bypasses the need for a local development environment and provides an element-by-element implementation that aligns with the user's preferred workflow.

* **Step-by-step instructions** are provided for creating each file and directory, including the content for all the shared partials and core pages.
* The process is designed to be incremental and low-risk, ensuring that each part of the system is validated before moving on to the next.
* [cite_start]An enhanced `index.html` file is provided that uses the new template system and rebrands "Gabriel AI" to "Pmerit AI" while preserving the user's original design preferences[cite: 3231, 3247].



****See "PMERIT Frontend Integration Patch - Ongoing Plan_vs2.txt", the frontend document as a Patch to this document.
***

### **PMERIT AI Educational Platform - Master Document (Integrated & Restructured)**

**Document Version:** 2.1
**Status:** Comprehensive Blueprint (Corrected)

---

### **1.0 Core Mission & Philosophical Foundation**
*   **Primary Mission:** To break cycles of poverty by providing accessible, high-quality education to underserved learners globally.
*   **Guiding Principle:** Founded on the biblical principle: "My people perish for a lack of knowledge" (Hosea 4:6).
*   **Revenue Philosophy:** Education must liberate, not indebt. The model is built on the principle that those who can pay will subsidize those who cannot, ensuring knowledge is never paywalled.

### **2.0 Strategic Objectives**
#### **2.1 Global Educational Access**
*   **Target Audience:** Underserved learners across Africa, South Asia, Latin America, and rural communities worldwide.
*   **Value Proposition:** Provide free, practical, high-quality education that leads directly to employment and economic empowerment.

#### **2.2 Dual-Market Launch Strategy**
*   **Primary Market (Nigeria & US):** 200M+ population, cultural familiarity, and direct integration with NBS/BLS job market data.
*   **Secondary Market (US):** Focus on rural communities, veterans, displaced workers, and underserved populations.
*   **Future Goal:** A scalable model for worldwide deployment.

#### **2.3 Technology-Enabled Learning**
*   **AI-Powered Tutoring:** Personalized learning using Phi-3, Mistral models, and a rule-based expert system.
*   **Accessibility:** Mobile-first design optimized for budget devices and 3G connectivity.
*   **Inclusivity:** Offline capabilities and multi-language support (English, Yoruba, Igbo, Hausa, Spanish).

#### **2.4 Career-Focused Outcomes**
*   **Market Alignment:** Integration with Nigerian Bureau of Statistics (NBS) and US Bureau of Labor Statistics (BLS) for real-time job market data.
*   **Career Services:** AI-powered career guidance, job matching, and a freelance marketplace for immediate income opportunities.

#### **2.5 AI-Powered Discovery & Assessment System**
*   **Personality & Workstyle Profile:** AI-driven assessment based on the Big Five (OCEAN) model to recommend optimal learning styles and career paths.
*   **Interest Profiler:** Maps user interests to NBS/BLS job market data to recommend viable Career Tracks.
*   **Skills Gap Assessment:** Provides a diagnostic of a user's current readiness and a personalized starting point within a learning path.

#### **2.6 Educational Service Tracks & Curriculum Strategy**
The platform is structured around three distinct service tracks to meet specific audience needs.

*   **A. Global Remote Career (GRC) Track**
    *   **Focus:** Digital skills for remote and international employment.
    *   **Target:** Users seeking opportunities in the global digital economy.
    *   **Sample Courses:** Digital Marketing, Software Development, Data Analysis, Project Management.

*   **B. Local Career Pathways (LCP) Track**
    *   **Focus:** Vocational skills for local employment and entrepreneurship.
    *   **Target:** Individuals seeking to enter or advance within their local job market.
    *   **Sample Courses:** Agricultural Technology, Small Business Management, Healthcare Support, Construction Trades.
    *   **Integration:** Directly aligned with real-time NBS and BLS/Burning Glass labor market data.

*   **C. Local Education (LEd) Track**
    *   **Focus:** Supporting formal education from Nursery through College.
    *   **Target:** Students within Nigerian and U.S. school systems.
    *   **Core Value:** Augments local curricula with AI-powered tutoring and career-aligned electives.
    *   **Structured Levels:**
        *   **Nursery & Primary:** Foundational literacy, numeracy, and digital readiness.
        *   **Secondary:** STEM, Humanities, Career preparation, and Entrepreneurship.
        *   **College Bridge:** Specialized tracks aligned to GRC and LCP courses for advanced study.

### **3.0 Technical Architecture & Functional Requirements**
#### **3.1 Core Platform Features**
*   **User Management:** Multi-tier authentication (Basic/Premium/Enterprise), role-based access control (Students, Instructors, Admins).
*   **Content Delivery:** Structured learning paths, interactive assessments, real-time progress tracking.
*   **Credentialing:** Blockchain-verified certificate generation.
*   **Content Development:** No-code course builder for administrators and educators.

#### **3.2 AI Integration Specifications ("PMERIT AI Tutor")**
*   **Foundation Model:** Rule-based expert system for contextual guidance.
*   **Advanced AI Tutoring:** Cloud LLM integration for personalized Q&A, adaptive learning paths, and progress assessment.
*   **RAG System:** Vector database with course materials for enhanced, curriculum-grounded responses.
*   **Grading Automation:** Self-hosted custom algorithms for most assessments with GPT-4 for complex assignments (premium feature).

#### **3.3 AI-Tutored Academic System: Database Architecture**
The platform is architected as a complete digital university powered by a structured database.
*   **Tier 4A: Administrative Management:** `admin_users`, `system_config`, `support_tickets`, `audit_logs`.
*   **Tier 4B: Curriculum Management:** `curriculums`, `curriculum_courses`, `course_prerequisites`.
*   **Tier 4C: AI Teaching Materials:** `ai_teaching_materials`, `multimodal_content` (for voice, images in multiple languages).
*   **Tier 4D: AI Tutoring Intelligence:** `ai_tutor_personalities`, `student_learning_profiles`, `adaptive_learning_paths`.

#### **3.4 Virtual Human Interface**
*   **Purpose:** Branded, interactive avatar for immersive student interaction and customer support.
*   **Features:** Voice-based conversation, cultural representation, image analysis for educational content.

#### **3.5 Multimedia Processing**
*   **Text-to-Speech (TTS):** Voice cloning, emotion control, support for local accents. Privacy-focused with local processing.
*   **Speech-to-Text (STT):** Real-time transcription using Whisper.cpp.

#### **3.6 Integrity & Fairness**
*   **Anti-Cheating:** Escalating hints system, plagiarism detection, CodeOcean integration for programming validation.
*   **Bias Mitigation:** Integrated tools: IBM AIF360, Fairlearn.

### **4.0 Sustainable Revenue Model Architecture**
#### **4.1 Refined "Pay for Failure" Model**
*   **Philosophy:** Creates accountability without blocking access.
*   **Structure:**
    *   First attempt: **FREE**
    *   Second attempt: **FREE** (with mandatory tutoring)
    *   Third attempt: Small fee ($0.50 - covers platform costs)
    *   Additional attempts: Graduated fee ($1, $2, etc.)
    *   **Exemptions:** Technical failures, documented hardships, completion of remedial activities.

#### **4.2 Multi-Stream Revenue Strategy**
*   **The "Ubuntu Model" (Community):** Pay-It-Forward system where successful graduates contribute voluntarily.
*   **Corporate Sponsorship Tiers:** Village Sponsor ($1k/mo), Regional Sponsor ($5k/mo), National Partner ($20k/mo).
*   **Freemium Education:**
    *   **Free Forever:** All course content, basic AI tutoring, community forums.
    *   **Premium Acceleration ($2.99/mo):** Advanced AI, personalized paths, mentor sessions.
    *   **Enterprise Platform ($500-$5k/mo):** White-label solutions, custom curriculum, API access.
*   **Certification & Validation:**
    *   Completion Certificate: **Free**
    *   Verified Certificate: **$5** (Blockchain-verified)
    *   Professional Certification: **$25** (Industry-recognized, proctored)
*   **Marketplace Model:** Platform-hosted services with an 80/20 revenue split for providers.
*   **Ethical Data Monetization (B2B/Government):** Sale of fully anonymized skills gap analysis and workforce readiness reports.
*   **Grants & Donations:** Targeted grants from major foundations with crypto and micro-donation options.

#### **4.3 Revenue Projections**
*   **Year 1 (Conservative):** $280,000 (10k users, 5% paying)
*   **Year 2 (Growth):** $950,000 (100k users, 5% paying + corporate clients)
*   **Year 3 (Scale):** $3,500,000 (500k users, 5% paying + 50 corporate clients)

### **5.0 Front-Facing Platform Requirements & System Capabilities**
#### **5.1 Front Page UI Component Requirements**
*   **Authentication-Aware UI:** A single "Dashboard" button triggers sign-up for guests and proceeds to dashboard.html for authenticated users.
*   **Dynamic Left Pane:** Contains Virtual Human Toggle, Career Track Explorer, **Customer Service Mode Toggle**, and Settings (Dark Mode, TTS).
*   **Central AI Chat Pane:** Branded "PMERIT AI" with mode indicators, character counter, and TTS functionality.
*   **Assessment Discovery Pane:** Houses three AI-powered assessment cards (Personality, Interest, Skills) with "Start Assessment" CTAs.

#### **5.2 AI System Capability Requirements**
*   **Dual-Purpose AI System:**
    *   **Educational Tutor Mode (Default):** Uses educational RAG for teaching and Socratic questioning.
    *   **Customer Service Mode:** Uses a separate support RAG index to handle account, technical, and platform queries.
*   **Integrated Assessment Engine:** Powers conversational, dynamic assessments for personality, interests, and skills gaps.

#### **5.3 User Journey Integration**
*   **Guest â†’ Registered Learner:** Guests can take assessments; results are cached and saved upon registration. Seamless transition to a personalized dashboard.
*   **Admin Tiers:** Tier 1 (Strategic) and Tier 2 (Operational) admins manage curriculum, enrollments, and system oversight via no-code tools.

### **6.0 Implementation Roadmap & Ethical Framework**
#### **6.1 Immediate Technical Actions**
*   Update homepage UI to be authentication-aware.
*   Implement Virtual Human, Career Track JSON, and Customer Service mode toggles.
*   Set up local storage for session management.

#### **6.2 Immediate Revenue Actions**
*   Launch with a Donation-First model to build trust.
*   Fast-Track B2B pilot programs with Nigerian companies.
*   Phased Monetization over 12 months (Free â†’ Certificates â†’ Premium â†’ Enterprise).

#### **6.3 Ethical Framework**
*   **Always Free:** Core education content, basic platform access, community support, first attempt at any course.
*   **Never Compromise:** Paywalling knowledge, selling user data, creating debt traps, or favoring wealthy students.


Of course. I will restructure, organize, and align your infrastructure plan. The core changes will be:
1.  **Removing all Oracle components** and replacing them with a **local PostgreSQL** database running in Docker.
2.  **Replacing ORDS** with a dedicated **API service** (like Node.js/Express or Python/FastAPI) to handle business logic and communicate with Postgres.
3.  **Integrating** this new API service into the Docker compose setup and Cloudflare Tunnel routing.
4.  **Updating all scripts, diagrams, and descriptions** to reflect the new, fully self-contained architecture.

Here is the reorganized and accurate plan.

---

### **Ongoing Plan for Pmerit Infrastructure (PostgreSQL Edition)**
**Current Phase:** HP Host, Docker Stack, Portable HDD/SSD
**Core Principle:** Complete Portability & Self-Containment. The entire infrastructure, including the database, can be moved with the portable drive.

### **Element 0 â€” Big Picture (What Runs Where)**
```mermaid
graph TD
    Browser["Web Browser"] --> HTTPS
    HTTPS --> Pages["Cloudflare Pages<br>(Frontend Static Site)"]
    Pages -->|fetch| Worker["Cloudflare Worker<br>(API Gateway / Proxy)"]

    Worker -->|API Calls| Tunnel[Cloudflare Tunnel]
    Worker -->|API Calls| Tunnel

    Tunnel -->|Routes traffic to| Docker["HP: Docker Stack"]
    
    subgraph Docker [Portable Docker Infrastructure]
        API[API Service<br>Node.js/Python]
        API --> Postgres["PostgreSQL<br>(Primary Database)"]
        Syncthing[Syncthing<br>(Files Sync)]
        Ollama[Ollama<br>(Phi-3 + Mistral)]
    end

    Tunnel -.-> API
    Tunnel -.-> Syncthing
```
**Why this fits Pmerit:** The frontend (Pages) and edge logic (Worker) remain serverless and scalable. The entire backend state (Database, AI Models, File Storage, Configs) is now portable within the Docker stack on your HDD/SSD. Unplug the drive and run it anywhere with Docker.

### **Element 1 â€” Portable Folder on the HDD/SSD**
```
/pmerit/
â””â”€â”€ infra_portable/
    â”œâ”€â”€ compose.yaml                 # Master Docker Compose file
    â”œâ”€â”€ .env                        # Real secrets (NOT checked into git)
    â”œâ”€â”€ .env.example                # Template for .env
    â”œâ”€â”€ api/                        # NEW: API Service Code
    â”‚   â”œâ”€â”€ src/
    â”‚   â”œâ”€â”€ package.json
    â”‚   â”œâ”€â”€ requirements.txt
    â”‚   â””â”€â”€ Dockerfile
    â”œâ”€â”€ data/
    â”‚   â”œâ”€â”€ postgres/               # NEW: PostgreSQL database files
    â”‚   â”œâ”€â”€ syncthing/
    â”‚   â”œâ”€â”€ cloudflared/
    â”‚   â””â”€â”€ ollama/
    â”œâ”€â”€ scripts/
    â”‚   â”œâ”€â”€ bootstrap.sh            # Setup script for a new machine
    â”‚   â”œâ”€â”€ pull_models.sh          # Pull Ollama models
    â”‚   â”œâ”€â”€ backup_database.sh      # NEW: Backup PostgreSQL
    â”‚   â”œâ”€â”€ backup_cloudflare.sh    # Backup Worker/Pages config
    â”‚   â”œâ”€â”€ backup_models.sh        # Backup Ollama models
    â”‚   â””â”€â”€ snapshot_configs.sh     # Backup all configs
    â””â”€â”€ systemd/
        â””â”€â”€ pmerit-compose.service  # Systemd service file
```
*Everything is relative to this folder â‡’ perfectly portable.*

### **Element 2 â€” .env.example (Copy to .env and fill)**
```ini
# General
TZ=UTC
PUID=1000
PGID=1000
DATA_DIR=./data

# Syncthing
SYNCTHING_GUI_PORT=8384

# Cloudflared
CLOUDFLARED_TUNNEL_TOKEN=replace_me

# Ollama / AI
OLLAMA_PORT=11434
OLLAMA_NUM_PARALLEL=1
AI_PUBLIC_HOST=ai.pmerit.example

# API Service
API_PORT=3000
API_HOST=api.pmerit.example

# PostgreSQL Database - NEW
POSTGRES_DB=pmeritdb
POSTGRES_USER=pmerit
POSTGRES_PASSWORD=replace_me_with_strong_password
POSTGRES_PORT=5432
PGDATA=/var/lib/postgresql/data
```

### **Element 3 â€” compose.yaml (Syncthing + Cloudflared + Ollama + PostgreSQL + API Service)**
```yaml
version: '3.8'

services:
  # NEW: PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: ${PGDATA}
      TZ: ${TZ}
    volumes:
      - ${DATA_DIR}/postgres:${PGDATA} # Database data lives on HDD
    ports:
      - "127.0.0.1:${POSTGRES_PORT}:5432" # Exposed only locally
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    networks:
      - pmerit-net

  # NEW: API Service
  api:
    build: ./api # Builds from the ./api/Dockerfile
    container_name: api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      TZ: ${TZ}
    ports:
      - "127.0.0.1:${API_PORT}:3000" # Exposed locally for the tunnel
    depends_on:
      postgres:
        condition: service_healthy
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /app/node_modules/.tmp # If using Node
    networks:
      - pmerit-net

  # Existing Services
  syncthing:
    image: syncthing/syncthing:1.27
    container_name: syncthing
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    environment: [PUID=${PUID}, PGID=${PGID}, TZ=${TZ}]
    volumes:
      - ${DATA_DIR}/syncthing/config:/var/syncthing/config
      - ${DATA_DIR}/syncthing/data:/var/syncthing/data
      - ../pmerit_project:/var/syncthing/data/pmerit_project
    ports:
      - "127.0.0.1:${SYNCTHING_GUI_PORT}:8384"
    security_opt: [no-new-privileges:true]
    read_only: true
    tmpfs: [/tmp]
    networks:
      - pmerit-net

  cloudflared:
    image: cloudflare/cloudflared:2025.6.1
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${CLOUDFLARED_TUNNEL_TOKEN}
    volumes:
      - ${DATA_DIR}/cloudflared:/etc/cloudflared
    security_opt: [no-new-privileges:true]
    read_only: true
    tmpfs: [/tmp]
    networks:
      - pmerit-net

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    environment: [OLLAMA_NUM_PARALLEL=${OLLAMA_NUM_PARALLEL}, TZ=${TZ}]
    volumes:
      - ${DATA_DIR}/ollama:/root/.ollama
    ports:
      - "127.0.0.1:${OLLAMA_PORT}:11434"
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://127.0.0.1:11434/api/tags"]
      interval: 15s
      timeout: 5s
      retries: 20
    security_opt: [no-new-privileges:true]
    read_only: true
    tmpfs: [/tmp]
    networks:
      - pmerit-net

networks:
  pmerit-net:
    name: pmerit-network
    driver: bridge
```

### **Element 4 â€” API Service Example (Node.js)**
**`./api/Dockerfile`**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
```

**`./api/src/index.js` (Simplified Example)**
```javascript
const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// Connect to the local Postgres container
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Basic health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
  }
});

// Add your other API endpoints here
// app.post('/api/data', ...);
// app.get('/api/ai/chat', ...); // This would proxy to Ollama

app.listen(3000, '0.0.0.0', () => {
  console.log('API server listening on port 3000');
});
```

### **Element 5 â€” Cloudflare Tunnel & Worker Routing**
Update your `config.yml` for `cloudflared` or via the Cloudflare Dashboard to route traffic:
```yaml
tunnel: pmerit-tunnel
credentials-file: /etc/cloudflared/credentials.json

ingress:
  # Route API requests
  - hostname: api.pmerit.com
    service: http://api:3000

  # Route AI requests
  - hostname: ai.pmerit.com
    service: http://ollama:11434

  # Route Syncthing UI
  - hostname: sync.pmerit.com
    service: http://syncthing:8384

  # Catch-all rule
  - service: http_status:404
```
The Cloudflare Worker can now simplify to proxying requests to these internal tunnel routes, or can be removed entirely if the tunnel routing is sufficient.

### **Element 6 â€” Backups (Update for PostgreSQL)**
**`scripts/backup_database.sh` (NEW)**
```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$ROOT/backups/postgres-backup-${DATE}.sql.gz"

echo "[*] Backing up PostgreSQL database..."
docker compose exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} | gzip > "$BACKUP_FILE"

echo "[âœ“] Database backup complete: $BACKUP_FILE"
```

### **Element 7 â€” Systemd Service**
The `systemd/pmerit-compose.service` file remains unchanged. It will now start the entire enhanced stack.

### **Element 8 â€” Disaster Recovery Drill**
The process is now even more straightforward:
1.  Plug HDD into another machine.
2.  Install Docker.
3.  Run: `cd /pmerit/infra_portable && docker compose up -d`
4.  Everything starts: Database, API, AI, Sync.

### **Element 9 â€” Encryption at Rest (Patch)**
This element remains critically important and unchanged. Encrypt the HDD (LUKS) and backup files (GPG) to protect your self-contained data.

### **Revised Ranking & Scaling Path**
*   **Current (HP + HDD + Docker + Postgres):** **Better â†’ Best.** The system is now fully self-contained and independent of any external cloud databases.
*   **With Dell Laptop Helper:** **Super.** Run an identical stack on the Dell for failover.
*   **With Dell Server as Primary:** **Super-Superior.** Move the portable drive to a more powerful machine for better performance.

### **Summary of Changes Made:**
*   **Removed Oracle:** All mentions of Oracle ADB, ORDS, OCI, and related backup scripts have been purged.
*   **Added PostgreSQL:** Integrated a local PostgreSQL container as the primary database.
*   **Added API Service:** Introduced a custom API service to replace ORDS functionality, providing a clean interface between your application and the database.
*   **Updated Diagrams & Descriptions:** All architecture diagrams and explanations now reflect the new, fully local stack.
*   **Updated Backups:** Replaced `backup_oracle.sh` with `backup_database.sh` for PostgreSQL.
*   **Enhanced Network:** Added a dedicated Docker network (`pmerit-net`) for secure container communication.
*   **Simplified Tunnel Routing:** The tunnel now routes directly to the API and Ollama containers, potentially simplifying or eliminating the need for complex Cloudflare Worker logic.

This plan represents a robust, secure, and truly portable infrastructure for the Pmerit platform.


*****# ðŸŽ¯ PMERIT Frontend Integration Patch - Ongoing Plan_vs2.txt

**Document Version:** 3.0 - Frontend Integration Edition  
**Status:** Implementation Blueprint  
**Base Infrastructure:** âœ… Complete (78-table PostgreSQL, 16 elements)

---

## ðŸ“‹ Executive Summary

This patch document extends **Ongoing Plan_vs2.txt** with a comprehensive frontend implementation strategy that integrates with the completed 78-table PostgreSQL infrastructure. Following the successful element-by-element approach used for infrastructure, this plan implements a modular frontend system with full database integration, AI connectivity, and production deployment.

---

## ðŸŽ¯ Frontend Implementation Elements (F1-F12)

### **Element F1: Environment Access & Token Retrieval**
**Objective:** Gather all required credentials and configuration data from existing environments.

**Required Access:**
- **Cloudflare Dashboard:** Retrieve Pages deployment token, Workers API keys, Tunnel configurations
- **Database Credentials:** Extract PostgreSQL connection strings from infrastructure `.env`
- **AI Endpoint:** Verify `ai.pmerit.com` tunnel status and connectivity
- **BLS API:** Validate existing key `f3b54462bdd64a829a09dd23d1acb7cd`
- **GitHub Repository:** Confirm write access to existing repo structure

**Implementation Steps:**
1. Access Cloudflare Dashboard â†’ API Tokens â†’ Create custom token for Pages/Workers
2. Review `/pmerit/infra_portable/.env` for database credentials
3. Test AI endpoint: `curl https://ai.pmerit.com/api/tags`
4. Validate BLS API: `curl "https://api.bls.gov/publicAPI/v1/timeseries/data?registrationkey=f3b54462bdd64a829a09dd23d1acb7cd"`
5. Document all tokens in secure `.env.frontend` file

---

### **Element F2: Brand Identity & Design System Correction**
**Objective:** Implement proper PMERIT branding and white theme based on mobile reference design.

**Design Requirements:**
- **Base Document:** `!DOCTYPE html.txt` structure (preserve layout, correct colors)
- **Color Scheme:** Clean white theme (reference: OldMobile design.jpg)
- **Branding:** "PMERIT AI" (not Gabriel AI)
- **Layout:** Three-panel desktop, accordion mobile
- **Assessment:** Single "Discover Your Path (AI)" button

**CSS Design Tokens:**
```css
:root {
  --primary: #4F46E5;           /* PMERIT brand blue */
  --accent: #7C3AED;            /* Purple accent */
  --success: #10B981;           /* Green status */
  --bg-primary: #FFFFFF;        /* Clean white background */
  --bg-secondary: #F8FAFC;      /* Light gray panels */
  --text-primary: #1F2937;      /* Dark text */
  --card-bg: #FFFFFF;           /* Card backgrounds */
  --border: #E5E7EB;            /* Subtle borders */
}
```

---

### **Element F3: Template Scaffolding System**
**Objective:** Create DRY shared template system following Frontend Implementation Strategy.

**Phase A Implementation:**
```
/partials/
â”œâ”€â”€ header.html          # Navigation + PMERIT branding
â”œâ”€â”€ nav.html            # Role-based navigation logic  
â”œâ”€â”€ footer.html         # Footer links + system status
â””â”€â”€ modals.html         # Shared modal templates

/assets/
â”œâ”€â”€ base.css            # Design system + grid layout
â”œâ”€â”€ boot-includes.js    # Dynamic partial loader
â””â”€â”€ nav-config.js       # Navigation access rules
```

**Template Structure:**
- **Header:** Logo, language selector, auth buttons
- **Navigation:** Context-aware menu (guest/student/admin)
- **Footer:** Status indicators, support links
- **Modals:** Authentication, assessment, career tracks

---

### **Element F4: Core Page Architecture**
**Objective:** Implement all user journey pages using shared template system.

**Phase B Implementation:**
```
Primary Pages (User Journey):
â”œâ”€â”€ index.html          # Homepage (corrected design)
â”œâ”€â”€ dashboard.html      # User dashboard
â”œâ”€â”€ assessment.html     # Personality/skills assessment
â”œâ”€â”€ courses.html        # Course catalog
â”œâ”€â”€ classroom.html      # Learning environment
â”œâ”€â”€ career.html         # Career paths + job data
â””â”€â”€ library.html        # Resource library

Secondary Pages (Support):
â”œâ”€â”€ support.html        # Help center
â”œâ”€â”€ admin.html          # Administrative interface
â”œâ”€â”€ pricing.html        # Subscription plans
â””â”€â”€ about.html          # Platform information
```

**Page Template Pattern:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{page_title}} - PMERIT</title>
    <link rel="stylesheet" href="/assets/base.css">
</head>
<body>
    <div id="header-container"></div>
    <div id="nav-container"></div>
    <main id="page-content">
        <!-- Page-specific content -->
    </main>
    <div id="footer-container"></div>
    <script src="/assets/boot-includes.js"></script>
    <script src="/assets/{{page_name}}.js"></script>
</body>
</html>
```

---

### **Element F5: Database Integration Layer**
**Objective:** Connect frontend to 78-table PostgreSQL infrastructure.

**Phase C Implementation:**

**API Endpoint Structure:**
```
/functions/api/
â”œâ”€â”€ [[route]].js        # Cloudflare Workers main router
â”œâ”€â”€ auth/               # Authentication endpoints
â”œâ”€â”€ assessment/         # Personality/skills assessment
â”œâ”€â”€ courses/           # Course management
â”œâ”€â”€ career/            # Job market data (NBS/BLS)
â”œâ”€â”€ ai/                # AI chat proxy
â””â”€â”€ admin/             # Administrative functions
```

**Database Connection Pattern:**
```javascript
// Cloudflare Worker API Template
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Database connection
    const db = new Database(env.DATABASE_URL);
    
    // Route handling
    switch (path) {
      case '/api/assessment/start':
        return handleAssessmentStart(request, db);
      case '/api/career/tracks':
        return handleCareerTracks(request, db);
      case '/api/ai/chat':
        return proxyToAI(request, env.AI_ENDPOINT);
    }
  }
};
```

**Key Integration Points:**
- **Assessment System:** `pmerit_personality_assessments`, `assessment_questions`, `assessment_responses`
- **Career Tracks:** `nigerian_job_market`, `us_job_market`, `cross_market_analysis`  
- **User Management:** `users`, `user_profiles`, `student_learning_profiles`
- **Course System:** `courses`, `enrollments`, `progress_tracking`

---

### **Element F6: AI Integration & Chat System**
**Objective:** Implement real-time AI chat connecting to existing ai.pmerit.com endpoint.

**Phase D Implementation:**

**AI Chat Architecture:**
```javascript
// /assets/ai-chat.js
class PMERITChat {
  constructor() {
    this.endpoint = 'https://ai.pmerit.com';
    this.models = ['phi3:mini', 'mistral'];
    this.mode = 'tutor'; // tutor, receptionist, support
  }
  
  async sendMessage(message, context = {}) {
    const response = await fetch(`${this.endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3:mini',
        prompt: this.buildPrompt(message, context),
        stream: false
      })
    });
    return response.json();
  }
  
  buildPrompt(message, context) {
    const systemPrompt = this.getSystemPrompt();
    const userContext = this.formatContext(context);
    return `${systemPrompt}\n\nUser Context: ${userContext}\n\nUser: ${message}\nPMERIT AI:`;
  }
}
```

**AI Personas:**
- **Tutor Mode:** Educational guidance, course help
- **Receptionist Mode:** Platform navigation, general queries  
- **Support Mode:** Technical issues, account problems

---

### **Element F7: Assessment System Integration**
**Objective:** Implement comprehensive personality/skills assessment system.

**Assessment Flow:**
1. **Start Assessment:** Create session in `pmerit_personality_assessments`
2. **Question Delivery:** Fetch from `assessment_questions` table
3. **Response Capture:** Save to `assessment_responses` table  
4. **Analysis:** Generate results using AI + scoring algorithms
5. **Recommendations:** Create personalized learning plan

**Assessment Components:**
- **Personality Assessment:** Big Five (OCEAN) model
- **Learning Style:** Visual, Auditory, Kinesthetic preferences
- **Skills Gap Analysis:** Technical and soft skills evaluation
- **Interest Profiler:** Career preference mapping

**Cultural Adaptations:**
- **Nigerian Context:** Questions adapted for local culture
- **Language Support:** YorÃ¹bÃ¡, Igbo, Hausa translations
- **Job Market Alignment:** Results tied to NBS data

---

### **Element F8: Career Tracks & Job Market Integration**
**Objective:** Connect career exploration to real-time NBS/BLS job market data.

**Career Track System:**
```javascript
// Career Tracks Integration
const careerTracks = [
  {
    id: 'grc_software',
    name: 'Global Remote Career - Software Development',
    market: 'US',
    source: 'BLS',
    skills: ['JavaScript', 'Python', 'React'],
    salary_range: '$50k-$120k',
    remote_friendly: true
  },
  {
    id: 'lcp_agriculture',
    name: 'Local Career - Agricultural Technology',
    market: 'Nigeria',
    source: 'NBS',
    skills: ['Farm Management', 'Irrigation', 'Crop Science'],
    salary_range: 'â‚¦2M-â‚¦8M',
    local_demand: 'High'
  }
];
```

**Job Market Data Integration:**
- **NBS API:** Nigerian employment statistics
- **BLS API:** US labor market data (key: `f3b54462bdd64a829a09dd23d1acb7cd`)
- **Cross-Market Analysis:** Skills transferability, salary comparison
- **Real-Time Updates:** Daily job market data refresh

---

### **Element F9: Authentication & User Management**
**Objective:** Implement secure user authentication with role-based access.

**User Roles:**
- **Guest:** Assessment access, course browsing
- **Student:** Full course access, progress tracking
- **Instructor:** Course creation, student management
- **Admin Tier 1:** Global settings, user management
- **Admin Tier 2:** Content moderation, support

**Authentication Flow:**
```javascript
// Authentication System
class PMERITAuth {
  async signUp(userData) {
    // Create user in database
    const user = await db.users.create(userData);
    
    // Send verification email
    await this.sendVerification(user.email);
    
    // Create initial profile
    await db.user_profiles.create({
      user_id: user.id,
      onboarding_complete: false
    });
    
    return user;
  }
  
  async signIn(email, password) {
    // Verify credentials
    const user = await db.users.authenticate(email, password);
    
    // Generate session token
    const token = await this.generateToken(user.id);
    
    // Update last login
    await db.users.updateLastLogin(user.id);
    
    return { user, token };
  }
}
```

---

### **Element F10: Mobile Responsiveness & PWA Features**
**Objective:** Ensure mobile-first design with offline capabilities.

**Responsive Design:**
- **Breakpoints:** Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Touch Targets:** Minimum 44px for accessibility
- **Accordion Panels:** Sidebar collapse on mobile
- **Gesture Support:** Swipe navigation, pull-to-refresh

**PWA Implementation:**
```javascript
// Service Worker for Offline Support
self.addEventListener('fetch', (event) => {
  // Cache strategy for educational content
  if (event.request.url.includes('/api/courses/')) {
    event.respondWith(
      caches.open('pmerit-courses').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

---

### **Element F11: Deployment & CI/CD Pipeline**
**Objective:** Automate deployment to Cloudflare Pages with continuous integration.

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy PMERIT Frontend
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: pmerit-platform
          directory: dist
          
      - name: Deploy Workers API
        run: npx wrangler publish
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Environment Variables:**
```env
# Cloudflare Pages Environment
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
DATABASE_URL=postgresql://user:pass@host:5432/pmerit
AI_ENDPOINT=https://ai.pmerit.com
BLS_API_KEY=f3b54462bdd64a829a09dd23d1acb7cd
NBS_API_ENDPOINT=https://nigerianstat.gov.ng/api
```

---

### **Element F12: Testing & Performance Optimization**
**Objective:** Ensure production-ready performance with comprehensive testing.

**Testing Strategy:**
- **Unit Tests:** Individual component functionality
- **Integration Tests:** Database + API integration
- **E2E Tests:** Complete user journey testing
- **Performance Tests:** Page load times, AI response times
- **Accessibility Tests:** WCAG compliance, screen reader support

**Performance Targets:**
- **Page Load:** <2 seconds first contentful paint
- **AI Response:** <3 seconds for chat responses
- **Assessment:** <5 seconds question loading
- **Mobile Score:** >90 on Lighthouse mobile audit

---

## ðŸš€ Implementation Timeline

### **Phase 1: Foundation (Week 1)**
- F1: Environment Access & Token Retrieval
- F2: Brand Identity & Design System
- F3: Template Scaffolding System

### **Phase 2: Core Pages (Week 2)** 
- F4: Core Page Architecture
- F10: Mobile Responsiveness

### **Phase 3: Integration (Week 3)**
- F5: Database Integration Layer
- F6: AI Integration & Chat System
- F9: Authentication & User Management

### **Phase 4: Advanced Features (Week 4)**
- F7: Assessment System Integration
- F8: Career Tracks & Job Market Integration

### **Phase 5: Production (Week 5)**
- F11: Deployment & CI/CD Pipeline
- F12: Testing & Performance Optimization

---

## ðŸ”§ Critical Dependencies

### **Infrastructure Requirements:**
- âœ… PostgreSQL Database (78 tables deployed)
- âœ… AI Endpoint (ai.pmerit.com operational)  
- âœ… Cloudflare Tunnel (routing configured)
- âœ… BLS API Access (key validated)

### **External Services:**
- **Cloudflare Pages:** Frontend hosting
- **Cloudflare Workers:** API layer
- **GitHub Actions:** CI/CD pipeline
- **Nigerian Bureau of Statistics:** Job market data

### **Development Tools:**
- **VS Code + GitHub Copilot:** Enhanced development
- **PostgreSQL Client:** Database management
- **Cloudflare CLI (Wrangler):** Deployment tools

---

## ðŸ“Š Success Metrics

### **Technical Metrics:**
- **Uptime:** >99.9% availability
- **Performance:** <2s page loads, <3s AI responses
- **Database:** <100ms query response times
- **Mobile:** >90 Lighthouse score

### **User Experience Metrics:**
- **Assessment Completion:** >80% completion rate
- **User Retention:** >70% return within 7 days
- **Course Enrollment:** >60% post-assessment enrollment
- **Career Track Engagement:** >50% explore career paths

### **Business Metrics:**
- **User Registration:** Track guest â†’ student conversion
- **Course Completion:** Monitor learning outcomes
- **Job Market Alignment:** Measure career path relevance
- **Cultural Adaptation:** Nigerian user engagement rates

---

## âš ï¸ Risk Mitigation

### **Technical Risks:**
- **Database Overload:** Implement connection pooling, query optimization
- **AI Endpoint Failure:** Add fallback responses, graceful degradation
- **Mobile Performance:** Optimize assets, implement lazy loading
- **Security Vulnerabilities:** Regular security audits, input validation

### **Integration Risks:**
- **API Rate Limits:** Implement caching, request batching
- **Third-party Dependencies:** Monitor service status, have fallbacks
- **Data Synchronization:** Implement eventual consistency patterns
- **Cross-browser Compatibility:** Comprehensive testing matrix

---

This comprehensive patch extends your successful infrastructure implementation with a complete frontend solution that maintains the same methodical, element-by-element approach. The plan ensures seamless integration with your 78-table database while delivering a world-class user experience that serves your mission of accessible, high-quality education for underserved learners globally.

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PMERIT â€” Accessible Global Education</title>

  <!-- Icons & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>

  <style>
    :root {
      /* Color Scheme based on Home Page Redesign */
      --primary: #2563EB;       /* Primary blue */
      --primary-dark: #1D4ED8;
      --accent: #7E22CE;        /* Accent purple */
      --success: #059669;       /* Success green */
      --text-primary: #1F2937;  /* Almost black */
      --text-secondary: #6B7280;/* Gray text */
      --text-inverse: #F9FAFB;  /* Light text for dark backgrounds */
      --bg-primary: #FFFFFF;    /* White background */
      --bg-secondary: #F3F4F6;  /* Light gray background */
      --bg-dark: #111827;       /* Dark background */
      --card-bg: #FFFFFF;       /* Card background */
      --border-color: #E5E7EB;  /* Border color */
      --header-height: 70px;
      --footer-height: 60px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --transition: all 0.2s ease-in-out;
    }

    .dark {
      --text-primary: #F9FAFB;
      --text-secondary: #D1D5DB;
      --bg-primary: #111827;
      --bg-secondary: #1F2937;
      --card-bg: #1F2937;
      --border-color: #374151;
      --shadow: 0 8px 28px rgba(0,0,0,.45);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: var(--transition);
    }

    body {
      display: flex;
      flex-direction: column;
      overflow: hidden; /* Non-scrollable like Google homepage */
    }

    /* Header Styles */
    header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow);
      z-index: 50;
    }

    .logo {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo::before {
      content: "ðŸŽ“";
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-btn, select {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: var(--transition);
      border: 1px solid var(--border-color);
      background-color: var(--card-bg);
      color: var(--text-primary);
      min-height: 44px;
    }

    .nav-btn:hover, select:hover {
      border-color: var(--primary);
      transform: translateY(-1px);
    }

    .nav-btn.primary {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .nav-btn.primary:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    /* Main Layout - 3 Column Grid */
    .estate {
      display: grid;
      grid-template-columns: 280px 1fr 320px;
      height: calc(100vh - var(--header-height) - var(--footer-height));
      overflow: hidden;
      gap: 0;
    }

    /* Left Pane Styles */
    #left {
      background-color: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      padding: 1.5rem 1rem;
      overflow-y: auto;
    }

    .pane-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .toggle, .action, .dashboard {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: var(--transition);
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      min-height: 44px;
    }

    .toggle:hover, .action:hover, .dashboard:hover {
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow);
    }

    .icon {
      color: var(--primary);
      margin-right: 0.5rem;
    }

    .switch {
      width: 40px;
      height: 20px;
      background: #ccc;
      border-radius: 34px;
      position: relative;
      transition: .4s;
    }

    .switch::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    .toggle.active .switch {
      background-color: var(--primary);
    }

    .toggle.active .switch::after {
      transform: translateX(20px);
    }

    .dashboard {
      justify-content: center;
      font-weight: 600;
      background-color: var(--primary);
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .dashboard.guest {
      background-color: var(--text-secondary);
    }

    .dashboard:hover {
      background-color: var(--primary-dark);
    }

    .dashboard.guest:hover {
      background-color: #4B5563;
    }

    .collapsible {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      background-color: var(--card-bg);
      margin-bottom: 0.5rem;
    }

    .collapsible .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      cursor: pointer;
      background-color: var(--bg-secondary);
      transition: var(--transition);
    }

    .collapsible .head:hover {
      background-color: var(--border-color);
    }

    .collapsible .body {
      display: none;
      padding: 0.75rem;
      background-color: var(--card-bg);
      border-top: 1px solid var(--border-color);
    }

    .avatar {
      display: none;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 1rem auto 0;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border: 3px solid var(--border-color);
    }

    .avatar.active {
      display: flex;
    }

    /* Center Chat Area Styles */
    main {
      background-color: var(--bg-primary);
      overflow: hidden;
    }

    .panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin: 1rem;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .panel-head {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--bg-secondary);
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .badges {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }

    .badge {
      background-color: var(--primary);
      color: white;
      font-size: 0.78rem;
      padding: 0.28rem 0.6rem;
      border-radius: 999px;
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
    }

    .badge.support {
      background-color: var(--success);
    }

    .badge.vh {
      background-color: var(--accent);
    }

    #textChat {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chat-body {
      flex: 1;
      padding: 1rem;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .bubble {
      display: flex;
      gap: 0.65rem;
      align-items: flex-start;
      background-color: rgba(37, 99, 235, 0.06);
      border: 1px solid rgba(37, 99, 235, 0.18);
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .ava {
      min-width: 36px;
      height: 36px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: white;
      background: linear-gradient(135deg, var(--primary), var(--accent));
    }

    .bubble h3 {
      margin: 0.1rem 0 0.35rem;
      color: var(--primary);
      font-size: 1rem;
    }

    .bubble p {
      margin: 0.3rem 0;
      line-height: 1.55;
    }

    .chat-input {
      border-top: 1px solid var(--border-color);
      background-color: var(--bg-secondary);
      padding: 0.75rem;
    }

    textarea {
      width: 100%;
      min-height: 80px;
      resize: none;
      background-color: var(--card-bg);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.65rem;
      padding: 0.7rem;
      font-family: inherit;
    }

    textarea:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      border-color: var(--primary);
    }

    .input-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.45rem;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .count {
      font-size: 0.92rem;
      color: var(--text-secondary);
    }

    .input-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .send {
      border: none;
      background-color: var(--primary);
      color: white;
      padding: 0.55rem 1rem;
      border-radius: 0.55rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .send:hover {
      background-color: var(--primary-dark);
      transform: translateY(-1px);
    }

    .footer-status {
      font-size: 0.8rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Virtual Human stage */
    #vhStage {
      display: none;
      flex-direction: column;
      height: 100%;
    }

    .stage {
      flex: 1;
      display: grid;
      place-items: center;
      padding: 1rem;
    }

    .human-frame {
      width: min(700px, 92%);
      height: min(420px, 55vh);
      border: 2px solid var(--primary);
      border-radius: 1rem;
      box-shadow: var(--shadow-lg);
      background: linear-gradient(135deg, #e2e8f0, #f8fafc);
      display: grid;
      place-items: center;
    }

    .dark .human-frame {
      background: linear-gradient(135deg, #1f2937, #111827);
    }

    .human-face {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      display: grid;
      place-items: center;
      font-size: 3rem;
      border: 4px solid white;
    }

    .dark .human-face {
      border-color: #1f2937;
    }

    .captions {
      border-top: 1px solid var(--border-color);
      background-color: var(--bg-secondary);
      padding: 0.75rem 1rem;
      color: var(--text-secondary);
      text-align: center;
    }

    /* Right Pane Styles */
    #right {
      background-color: var(--bg-secondary);
      border-left: 1px solid var(--border-color);
      padding: 1.5rem;
      overflow-y: auto;
    }

    .support-assistant {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow);
    }

    .support-assistant h4 {
      margin: 0;
      color: var(--success);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    #right h3 {
      margin: 0.25rem 0 0.75rem;
      position: relative;
      padding-bottom: 0.35rem;
      font-weight: 600;
      font-size: 1.1rem;
      color: var(--primary);
    }

    #right h3::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 3px;
      background-color: var(--primary);
      border-radius: 2px;
    }

    .discover {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .discover h4 {
      margin: 0.25rem 0;
      font-weight: 600;
    }

    .discover p {
      margin: 0.25rem 0 0.5rem;
      color: var(--text-secondary);
    }

    .discover .insights {
      border-top: 1px dashed var(--border-color);
      padding-top: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
      min-height: 2.2em;
      font-style: italic;
    }

    /* Footer Styles */
    footer {
      height: var(--footer-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      background-color: var(--card-bg);
      border-top: 1px solid var(--border-color);
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      z-index: 40;
    }

    .footer-status-main {
      font-weight: 600;
      color: var(--primary);
      font-size: 0.94rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .footer-links .nav-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      background: transparent;
      border: 1px solid var(--border-color);
    }

    .footer-links .nav-btn:hover {
      background-color: var(--bg-secondary);
      border-color: var(--primary);
    }

    /* Mobile Styles */
    @media (max-width: 1100px) {
      .estate {
        grid-template-columns: 1fr;
        height: calc(100vh - var(--header-height) - var(--footer-height));
        overflow-y: auto;
      }
      
      aside {
        display: none;
      }
      
      header {
        flex-wrap: wrap;
        gap: 0.6rem;
        height: auto;
        min-height: var(--header-height);
        padding: 0.75rem;
      }
      
      .logo {
        width: 100%;
        justify-content: center;
      }
      
      main {
        min-height: calc(100vh - var(--header-height) - var(--footer-height) - 2rem);
      }
      
      #mobileAccordions {
        display: block;
        margin: 0 1rem 1rem;
      }

      .mobile-accordion {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: var(--shadow);
        margin-bottom: 1rem;
        overflow: hidden;
      }

      .mobile-accordion summary {
        padding: 1.25rem;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-primary);
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        list-style: none;
        transition: var(--transition);
      }

      .mobile-accordion summary::-webkit-details-marker {
        display: none;
      }

      .mobile-accordion summary:hover {
        background-color: var(--border-color);
      }

      .mobile-accordion-content {
        padding: 1.25rem;
      }

      .mobile-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
      }

      .mobile-card {
        background-color: rgba(37, 99, 235, 0.06);
        border: 1px solid rgba(37, 99, 235, 0.18);
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        min-height: 80px;
        justify-content: center;
      }

      .mobile-card:hover {
        background-color: rgba(37, 99, 235, 0.1);
        transform: translateY(-1px);
      }
      
      footer {
        flex-direction: column;
        gap: 0.75rem;
        height: auto;
        min-height: var(--footer-height);
        padding: 1rem;
      }
      
      .footer-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .footer-status-main {
        order: 2;
        font-size: 0.85rem;
      }
      
      .footer-links {
        order: 1;
      }
    }

    @media (min-width: 1101px) {
      #mobileAccordions {
        display: none;
      }
    }

    /* Focus Styles */
    .nav-btn:focus, .action:focus, .toggle:focus, .dashboard:focus, textarea:focus, select:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* Modal Styles */
    dialog {
      border: none;
      border-radius: 12px;
      max-width: 560px;
      width: 92%;
      box-shadow: var(--shadow-lg);
      background-color: var(--card-bg);
      color: var(--text-primary);
      padding: 0;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }

    dialog form {
      margin: 0;
      padding: 1.5rem;
    }

    dialog h3 {
      margin: 0 0 1rem;
      color: var(--primary);
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1.25rem;
    }

    dialog label {
      display: grid;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }

    dialog input {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background-color: var(--card-bg);
      color: var(--text-primary);
      font-family: inherit;
    }

    dialog input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    dialog .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    /* Career Tracks Grid */
    .tracks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .track-card {
      background-color: rgba(37, 99, 235, 0.06);
      border: 1px solid rgba(37, 99, 235, 0.18);
      border-radius: 8px;
      padding: 1.25rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .track-card:hover {
      background-color: rgba(37, 99, 235, 0.1);
      border-color: var(--primary);
      transform: translateY(-1px);
    }

    .track-card h4 {
      margin: 0 0 0.5rem;
      color: var(--primary);
      font-weight: 600;
    }

    .track-card p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header>
    <div class="logo">PMERIT</div>
    <nav>
      <select class="nav-btn" id="lang" aria-label="Language">
        <option value="en">English</option>
        <option value="yo">YorÃ¹bÃ¡</option>
        <option value="ig">Igbo</option>
        <option value="ha">Hausa</option>
      </select>
      <button class="nav-btn" id="pricingBtn">Pricing</button>
      <button class="nav-btn" id="signInBtn">Sign In</button>
      <button class="nav-btn primary" id="startBtn">Start Learning</button>
    </nav>
  </header>

  <div class="estate">
    <!-- Left Pane -->
    <aside id="left" aria-label="Quick actions sidebar">
      <section>
        <div class="pane-title">Quick Actions</div>

        <button class="toggle" id="vhToggle">
          <span><i class="fas fa-user-astronaut icon"></i> Virtual Human Mode</span>
          <span class="switch" aria-hidden="true"></span>
        </button>

        <button class="action" id="careerPaths">
          <span><i class="fas fa-compass icon"></i> Career Track & Explore Paths</span>
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>

        <button class="toggle" id="supportToggle">
          <span><i class="fas fa-headset icon"></i> Customer Service Mode</span>
          <span class="switch" aria-hidden="true"></span>
        </button>

        <div class="collapsible" id="settingsBox">
          <div class="head">
            <strong><i class="fas fa-sliders-h"></i> Settings</strong>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="body">
            <button class="toggle" id="darkToggle">
              <span><i class="fas fa-moon icon"></i> Dark Mode</span>
              <span class="switch" aria-hidden="true"></span>
            </button>
            <button class="toggle" id="ttsToggle">
              <span><i class="fas fa-volume-up icon"></i> Text-to-Speech</span>
              <span class="switch" aria-hidden="true"></span>
            </button>
            <button class="action" id="voicesBtn">
              <span><i class="fas fa-headphones icon"></i> Preview Voices</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Single Dashboard button -->
        <button class="dashboard guest" id="dashBtn">
          <i class="fas fa-gauge-high"></i> Dashboard
        </button>

        <div class="avatar" id="vhAvatar" title="Virtual Human">
          <i class="fas fa-user-circle" aria-hidden="true"></i>
        </div>
      </section>
    </aside>

    <!-- Center -->
    <main>
      <section class="panel" aria-label="Chat panel">
        <div class="panel-head">
          <div class="badges">
            <span class="badge vh" id="vhBadge" style="display:none">
              <i class="fas fa-user-astronaut"></i> Virtual Human
            </span>
            <span class="badge support" id="supportBadge" style="display:none">
              <i class="fas fa-headset"></i> Support Assistant
            </span>
          </div>
        </div>

        <div id="textChat" role="region" aria-live="polite">
          <div class="chat-body" id="chatBody">
            <article class="bubble" id="welcomeMsg">
              <div class="ava"><i class="fas fa-user-circle"></i></div>
              <div>
                <h3>PMERIT AI:</h3>
                <p id="welcomeCopy">Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?</p>
              </div>
            </article>
          </div>
          <div class="chat-input">
            <textarea id="chatInput" maxlength="1000" placeholder="Ask about courses, learning paths, or your goals..." aria-label="Message"></textarea>
            <div class="input-bar">
              <span class="count" id="count">0/1000</span>
              <div class="input-actions">
                <button class="nav-btn" id="vhQuick">
                  <i class="fas fa-user-astronaut"></i> VH Mode
                </button>
                <button class="nav-btn" id="readAbout">
                  <i class="fas fa-book"></i> Read About
                </button>
                <span class="footer-status">
                  <i class="fas fa-circle-check"></i> Connected to Educational Services
                </span>
              </div>
              <button class="send" id="sendBtn">Send <i class="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>

        <!-- Virtual Human stage -->
        <div id="vhStage" role="region" aria-live="polite">
          <div class="stage">
            <div class="human-frame">
              <div class="human-face"><i class="fas fa-user-circle"></i></div>
            </div>
          </div>
          <div class="captions" id="captions">Virtual Human is speakingâ€¦</div>
        </div>
      </section>

      <!-- Mobile accordions -->
      <div id="mobileAccordions" aria-label="Mobile sections">
        <details class="mobile-accordion">
          <summary><i class="fas fa-bolt"></i> Quick Actions - Tap to expand â–¼</summary>
          <div class="mobile-accordion-content">
            <div class="mobile-grid">
              <button class="mobile-card" id="m_vhToggle">
                <i class="fas fa-user-astronaut"></i>
                <span>Virtual Human</span>
                <div class="switch"></div>
              </button>
              <button class="mobile-card" id="m_careerPaths">
                <i class="fas fa-compass"></i>
                <span>Career Paths</span>
              </button>
              <button class="mobile-card" id="m_supportToggle">
                <i class="fas fa-headset"></i>
                <span>Support Mode</span>
                <div class="switch"></div>
              </button>
              <button class="mobile-card" id="m_settings">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
              </button>
            </div>
            <button class="dashboard guest nav-btn" id="m_dashBtn" style="margin-top:1rem;width:100%">
              <i class="fas fa-gauge-high"></i> Dashboard
            </button>
          </div>
        </details>

        <details class="mobile-accordion">
          <summary><i class="fas fa-graduation-cap"></i> Discover Your Path - Tap to expand â–¼</summary>
          <div class="mobile-accordion-content">
            <div class="discover" style="margin:0">
              <h4>Personalized learning plan</h4>
              <p>Start a short flow that blends learning style, interests, and skills into a plan.</p>
              <button class="nav-btn primary" id="m_beginAssessment">Begin Assessment</button>
              <div class="insights" id="m_insights">Tip: Short, daily practice beats long, rare sessions.</div>
            </div>
          </div>
        </details>
      </div>
    </main>

    <!-- Right Pane -->
    <aside id="right" aria-label="Support and discover sidebar">
      <section>
        <div class="support-assistant">
          <h4><i class="fas fa-headset"></i> Support Assistant</h4>
          <p style="color: var(--text-secondary); margin: 0.5rem 0;">Ask me about PMERIT</p>
          <div style="display:flex;gap:.5rem;justify-content:center;margin-top:.75rem">
            <button class="nav-btn" style="border-color:var(--accent)" id="vhShort">
              <i class="fas fa-user-astronaut"></i> Virtual Human
            </button>
            <button class="nav-btn" style="border-color:var(--success)" id="supportShort">
              <i class="fas fa-headset"></i> Support
            </button>
          </div>
        </div>

        <h3>Discover Your Path (AI)</h3>
        <div class="discover">
          <h4>Personalized learning plan</h4>
          <p>Start a short flow that blends learning style, interests, and skills into a plan.</p>
          <button class="nav-btn primary" id="beginAssessment">Begin Assessment</button>
          <div class="insights" id="insights">Pro tip: Keep notes in your own words for better recall.</div>
        </div>
      </section>
    </aside>
  </div>

  <!-- Footer -->
  <footer>
    <span class="footer-status-main">
      <i class="fas fa-signal"></i> Connected to Educational Services
    </span>
    <div class="footer-links">
      <button class="nav-btn" id="privacyBtn">Privacy & Terms</button>
      <button class="nav-btn" id="contactBtn">Contact</button>
      <button class="nav-btn" id="partnershipsBtn">Partnerships</button>
      <button class="nav-btn" id="supportBtn">Support</button>
    </div>
  </footer>

  <!-- Modals -->
  <!-- Sign Up Modal -->
  <dialog id="signUpModal">
    <form method="dialog">
      <h3><i class="fas fa-user-plus"></i> Create your PMERIT account</h3>
      <label>
        <span>Full name</span>
        <input id="su_name" required placeholder="Your name"/>
      </label>
      <label>
        <span>Email</span>
        <input id="su_email" type="email" required placeholder="you@example.com"/>
      </label>
      <label>
        <span>Password</span>
        <input id="su_pwd" type="password" required placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"/>
      </label>
      <p style="font-size:0.9rem;color:var(--text-secondary);margin:1rem 0">
        By continuing you agree to our terms.
      </p>
      <div class="button-group">
        <button class="nav-btn" id="signUpCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="signUpCreate" type="button">Create account</button>
      </div>
    </form>
  </dialog>

  <!-- Sign In Modal -->
  <dialog id="signInModal">
    <form method="dialog">
      <h3><i class="fas fa-right-to-bracket"></i> Sign in to PMERIT</h3>
      <label>
        <span>Email</span>
        <input id="si_email" type="email" required placeholder="you@example.com"/>
      </label>
      <label>
        <span>Password</span>
        <input id="si_pwd" type="password" required placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"/>
      </label>
      <div style="margin-top:1rem">
        <a href="#forgot" style="font-size:0.9rem; color: var(--primary);">Forgot password?</a>
      </div>
      <div class="button-group">
        <button class="nav-btn" id="signInCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="signInGo" type="button">Sign In</button>
      </div>
    </form>
  </dialog>

  <!-- Voices Modal -->
  <dialog id="voicesModal">
    <form method="dialog">
      <h3><i class="fas fa-headphones"></i> Voice Sampler</h3>
      <label>
        <span>Sample text</span>
        <textarea id="voiceText" rows="3" style="border:1px solid var(--border-color);border-radius:0.5rem;padding:0.75rem;font-family:inherit;">Welcome to PMERIT. Empowering learning through innovation.</textarea>
      </label>
      <div class="button-group" style="margin-top: 1rem;">
        <button class="nav-btn" id="browserTts" type="button">Browser TTS</button>
        <button class="nav-btn" id="voicesClose" type="button">Close</button>
      </div>
    </form>
  </dialog>

  <!-- Career Tracks Modal -->
  <dialog id="tracksModal">
    <div style="margin:0;padding:1.5rem">
      <h3><i class="fas fa-compass"></i> Explore Career Tracks</h3>
      <div class="tracks-grid" id="tracksList"></div>
      <div id="trackDetail" style="margin-top:1rem;display:none;border-top:1px solid var(--border-color);padding-top:1rem"></div>
      <div class="button-group">
        <button class="nav-btn" id="tracksClose" type="button">Close</button>
      </div>
    </div>
  </dialog>

  <!-- Assessment Modal -->
  <dialog id="assessmentModal">
    <div style="margin:0;padding:1.5rem">
      <h3><i class="fas fa-graduation-cap"></i> Discover Your Path â€” Quick Assessment</h3>
      <ol style="line-height:1.6;margin:0 0 1rem 1.25rem">
        <li><strong>Learning style:</strong> a few preferences.</li>
        <li><strong>Interests:</strong> choose areas you enjoy.</li>
        <li><strong>Skills:</strong> rate comfort with common tools.</li>
      </ol>
      <p style="color:var(--text-secondary);margin:0 0 1rem">
        This assessment will help us create a personalized learning plan based on your preferences.
      </p>
      <div class="button-group">
        <button class="nav-btn" id="assessmentCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="assessmentStart" type="button">Start</button>
      </div>
    </div>
  </dialog>

  <script>
    // State management
    const state = {
      auth: false,
      dark: false,
      vh: false,
      support: false,
      tts: false,
      lang: 'en'
    };

    // Career tracks data
    const TRACKS = [
      {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
      {k:'data', name:'Data Analytics', blurb:'Spreadsheets â†’ SQL â†’ dashboards for real insights.'},
      {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
      {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
      {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
      {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
      {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
    ];

    // DOM Elements
    const body = document.body;
    const darkToggle = document.getElementById('darkToggle');
    const vhToggle = document.getElementById('vhToggle');
    const supportToggle = document.getElementById('supportToggle');
    const ttsToggle = document.getElementById('ttsToggle');
    const vhAvatar = document.getElementById('vhAvatar');
    const vhBadge = document.getElementById('vhBadge');
    const vhStage = document.getElementById('vhStage');
    const textChat = document.getElementById('textChat');
    const supportBadge = document.getElementById('supportBadge');
    const chatInput = document.getElementById('chatInput');
    const count = document.getElementById('count');
    const sendBtn = document.getElementById('sendBtn');
    const chatBody = document.getElementById('chatBody');
    const welcomeCopy = document.getElementById('welcomeCopy');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const settingsBox = document.getElementById('settingsBox');
    const settingsHead = settingsBox.querySelector('.head');
    const settingsBody = settingsBox.querySelector('.body');
    const dashBtn = document.getElementById('dashBtn');
    const signInBtn = document.getElementById('signInBtn');
    const startBtn = document.getElementById('startBtn');
    const pricingBtn = document.getElementById('pricingBtn');
    const careerPaths = document.getElementById('careerPaths');
    const beginBtn = document.getElementById('beginAssessment');
    const vhQuick = document.getElementById('vhQuick');
    const vhShort = document.getElementById('vhShort');
    const supportShort = document.getElementById('supportShort');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const assessmentModal = document.getElementById('assessmentModal');
    const tracksModal = document.getElementById('tracksModal');
    const voicesModal = document.getElementById('voicesModal');
    const insights = document.getElementById('insights');
    const m_insights = document.getElementById('m_insights');

    // Initialize state from localStorage
    function initState() {
      try {
        state.dark = localStorage.getItem('pmerit_dark') === 'true';
        state.auth = localStorage.getItem('pmerit_auth') === 'true';
        state.tts = localStorage.getItem('pmerit_tts') === 'true';
        state.lang = localStorage.getItem('pmerit_lang') || 'en';
      } catch (e) {
        console.error('Error loading state from localStorage:', e);
      }
      
      // Apply initial state
      body.classList.toggle('dark', state.dark);
      if (state.dark) {
        darkToggle.classList.add('active');
      }
      if (state.tts) {
        ttsToggle.classList.add('active');
      }
      
      document.getElementById('lang').value = state.lang;
      updateDashboardVisual();
    }

    // Save state to localStorage
    function save(key, value) {
      try {
        localStorage.setItem(key, String(value));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }

    // Update dashboard visual based on auth state
    function updateDashboardVisual() {
      dashBtn.classList.toggle('guest', !state.auth);
      const mDashBtn = document.getElementById('m_dashBtn');
      if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
    }

    // Set dark mode
    function setDark(on) {
      darkToggle.classList.toggle('active', on);
      state.dark = on;
      body.classList.toggle('dark', on);
      save('pmerit_dark', on);
    }

    // Set TTS
    function setTTS(on) {
      ttsToggle.classList.toggle('active', on);
      state.tts = on;
      save('pmerit_tts', on);
      if (!on && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }

    // Set support mode
    function setSupport(on) {
      supportToggle.classList.toggle('active', on);
      const mSupportToggle = document.getElementById('m_supportToggle');
      if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
      state.support = on;
      supportBadge.style.display = on ? 'inline-flex' : 'none';
      
      // Update welcome message based on mode
      if (welcomeCopy) {
        welcomeCopy.textContent = on
          ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
          : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
      }
    }

    // Set virtual human mode
    function setVH(on) {
      vhToggle.classList.toggle('active', on);
      const mVhToggle = document.getElementById('m_vhToggle');
      if (mVhToggle) mVhToggle.classList.toggle('active', on);
      state.vh = on;
      
      if (on) {
        textChat.style.display = 'none';
        vhStage.style.display = 'flex';
        vhAvatar.classList.add('active');
        vhBadge.style.display = 'inline-flex';
        document.getElementById('captions').textContent = "Virtual Human is ready.";
      } else {
        vhStage.style.display = 'none';
        textChat.style.display = 'flex';
        vhAvatar.classList.remove('active');
        vhBadge.style.display = 'none';
      }
    }

    // Go to dashboard or show sign up modal
    function goDashboard() {
      if (state.auth) {
        window.location.href = 'dashboard.html';
      } else {
        if (typeof signUpModal.showModal === 'function') {
          signUpModal.showModal();
        }
      }
    }

    // Open assessment modal
    function openAssessment() {
      if (typeof assessmentModal.showModal === 'function') {
        assessmentModal.showModal();
      }
    }

    // Add message to chat
    function addMessage(sender, text, isUser = false) {
      if (document.getElementById('welcomeMsg')) {
        welcomeMsg.remove();
      }

      const messageEl = document.createElement('article');
      messageEl.className = 'bubble';
      
      messageEl.innerHTML = `
        <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
          <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
        </div>
        <div>
          <h3>${sender}</h3>
          <p>${text}</p>
        </div>
      `;
      
      chatBody.appendChild(messageEl);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // If TTS is enabled and it's an AI message, speak it
      if (state.tts && !isUser && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
      
      // If VH mode is active, update captions
      if (state.vh && !isUser) {
        document.getElementById('captions').textContent = text;
      }
    }

    // Send message function
    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      
      addMessage('You', text, true);
      
      // Clear input
      chatInput.value = '';
      count.textContent = '0/1000';
      
      // Simulate AI response
      setTimeout(() => {
        const reply = state.support
          ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
          : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
        addMessage('PMERIT AI', reply);
      }, 1000);
    }

    // Render career tracks
    function renderTracks() {
      const tracksList = document.getElementById('tracksList');
      const trackDetail = document.getElementById('trackDetail');
      tracksList.innerHTML = '';
      
      TRACKS.forEach(t => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `<h4>${t.name}</h4><p>${t.blurb}</p>`;
        card.addEventListener('click', () => {
          trackDetail.style.display = 'block';
          trackDetail.innerHTML = `
            <h4 style="margin:0.25rem 0">${t.name}</h4>
            <p style="color:var(--text-secondary);margin:0.5rem 0">${t.blurb}</p>
            <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>
          `;
          document.getElementById('trackCta').addEventListener('click', () => {
            tracksModal.close();
            assessmentModal.showModal();
          });
        });
        tracksList.appendChild(card);
      });
    }

    // Rotating tips for insights
    const tips = [
      "Pro tip: Keep notes in your own words for better recall.",
      "Short, frequent study sessions are more effective than long cramming sessions.",
      "Relate new concepts to things you already understand for better retention.",
      "Teach what you've learned to someone else to solidify your understanding.",
      "Take breaks during study sessions to improve focus and retention."
    ];

    function rotateInsights(el) {
      if (!el) return;
      let i = 0;
      el.textContent = tips[0];
      setInterval(() => {
        i = (i + 1) % tips.length;
        el.textContent = tips[i];
      }, 5000);
    }

    // Initialize the application
    function init() {
      // Initialize state
      initState();
      
      // Set up event listeners
      darkToggle.addEventListener('click', () => setDark(!state.dark));
      ttsToggle.addEventListener('click', () => setTTS(!state.tts));
      supportToggle.addEventListener('click', () => setSupport(!state.support));
      supportShort.addEventListener('click', () => setSupport(true));
      vhToggle.addEventListener('click', () => setVH(!state.vh));
      vhQuick.addEventListener('click', () => setVH(true));
      vhShort.addEventListener('click', () => setVH(true));
      
      // Mobile toggles
      const mVhToggle = document.getElementById('m_vhToggle');
      const mSupportToggle = document.getElementById('m_supportToggle');
      const mSettings = document.getElementById('m_settings');
      
      if (mVhToggle) mVhToggle.addEventListener('click', () => setVH(!state.vh));
      if (mSupportToggle) mSupportToggle.addEventListener('click', () => setSupport(!state.support));
      if (mSettings) mSettings.addEventListener('click', () => {
        alert(`Settings: Dark Mode: ${state.dark ? 'On' : 'Off'}, TTS: ${state.tts ? 'On' : 'Off'}`);
      });
      
      // Settings collapsible
      settingsHead.addEventListener('click', () => {
        const isOpen = settingsBody.style.display === 'block';
        settingsBody.style.display = isOpen ? 'none' : 'block';
        settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
      });
      
      // Dashboard button
      dashBtn.addEventListener('click', goDashboard);
      const mDashBtn = document.getElementById('m_dashBtn');
      if (mDashBtn) mDashBtn.addEventListener('click', goDashboard);
      
      // Auth buttons
      signInBtn.addEventListener('click', () => {
        if (typeof signInModal.showModal === 'function') signInModal.showModal();
      });
      
      document.getElementById('signInCancel').addEventListener('click', () => signInModal.close());
      document.getElementById('signInGo').addEventListener('click', () => {
        const email = document.getElementById('si_email').value.trim();
        const password = document.getElementById('si_pwd').value.trim();
        if (!email || !password) {
          alert('Please enter your email and password.');
          return;
        }
        state.auth = true;
        save('pmerit_auth', true);
        updateDashboardVisual();
        signInModal.close();
        addMessage('PMERIT AI', `Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.`);
      });
      
      document.getElementById('signUpCancel').addEventListener('click', () => signUpModal.close());
      document.getElementById('signUpCreate').addEventListener('click', () => {
        const name = document.getElementById('su_name').value.trim();
        const email = document.getElementById('su_email').value.trim();
        const password = document.getElementById('su_pwd').value.trim();
        if (!name || !email || !password) {
          alert('Please complete all fields.');
          return;
        }
        state.auth = true;
        save('pmerit_auth', true);
        updateDashboardVisual();
        signUpModal.close();
        addMessage('PMERIT AI', `Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
      });
      
      startBtn.addEventListener('click', openAssessment);
      beginBtn.addEventListener('click', openAssessment);
      const mBeginBtn = document.getElementById('m_beginAssessment');
      if (mBeginBtn) mBeginBtn.addEventListener('click', openAssessment);
      
      document.getElementById('assessmentCancel').addEventListener('click', () => assessmentModal.close());
      document.getElementById('assessmentStart').addEventListener('click', () => {
        assessmentModal.close();
        const results = [
          "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights through dashboards and reports.",
          "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered problem solving.",
          "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities and match your interpersonal strengths."
        ];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        addMessage('PMERIT AI', randomResult);
      });
      
      // Chat functionality
      chatInput.addEventListener('input', () => {
        count.textContent = `${chatInput.value.length}/1000`;
      });
      
      sendBtn.addEventListener('click', sendMessage);
      
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      
      // Career paths
      careerPaths.addEventListener('click', () => {
        renderTracks();
        tracksModal.showModal();
      });
      
      const mCareerPaths = document.getElementById('m_careerPaths');
      if (mCareerPaths) {
        mCareerPaths.addEventListener('click', () => {
          renderTracks();
          tracksModal.showModal();
        });
      }
      
      document.getElementById('tracksClose').addEventListener('click', () => tracksModal.close());
      
      // Voices
      document.getElementById('voicesBtn').addEventListener('click', () => voicesModal.showModal());
      document.getElementById('voicesClose').addEventListener('click', () => voicesModal.close());
      document.getElementById('browserTts').addEventListener('click', () => {
        const text = document.getElementById('voiceText').value.trim();
        if (!text) return;
        if (!('speechSynthesis' in window)) {
          alert('Browser TTS not supported.');
          return;
        }
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      });
      
      // Footer buttons
      document.getElementById('privacyBtn').addEventListener('click', () => {
        addMessage('PMERIT AI', 'Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
      });
      
      document.getElementById('contactBtn').addEventListener('click', () => {
        addMessage('PMERIT AI', 'You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
      });
      
      document.getElementById('partnershipsBtn').addEventListener('click', () => {
        addMessage('PMERIT AI', 'PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
      });
      
      document.getElementById('supportBtn').addEventListener('click', () => {
        setSupport(true);
        addMessage('PMERIT AI', 'Support mode activated! I\'m now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?');
      });
      
      // Initialize rotating tips
      rotateInsights(insights);
      rotateInsights(m_insights);
      
      // Language selector
      document.getElementById('lang').addEventListener('change', function() {
        state.lang = this.value;
        save('pmerit_lang', state.lang);
        addMessage('PMERIT AI', `Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
      });

      // Pricing button
      pricingBtn.addEventListener('click', () => {
        addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
      });
    }

    // Start the application when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>

