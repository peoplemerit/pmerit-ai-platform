# PMERIT AI Educational Platform

> Breaking poverty cycles through accessible, high-quality education

## Mission

Empowering underserved communities—with primary focus on the USA and Nigeria/Africa—through accessible education and remote career opportunities. The platform prioritizes free-tier access and low-bandwidth optimization to reach 3+ billion users globally over a 15-year roadmap.

## Live Site

**Production:** https://pmerit.com

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (Modular) |
| Hosting | Cloudflare Pages (Pro) |
| Backend | Cloudflare Workers |
| Database | Neon PostgreSQL (via Hyperdrive) |
| ORM | Drizzle |
| AI | Cloudflare Workers AI |
| TTS/STT | Cloudflare Workers AI |

## Features

### Core Platform
- **AI Chat Interface** - Educational guidance powered by Workers AI
- **Career Assessment** - 120-question personality test (Big Five + Holland Code)
- **Career Matching** - AI-powered recommendations using BLS labor statistics
- **Virtual Human Avatar** - Interactive learning companion
- **Text-to-Speech** - Accessibility and language support
- **Learner Portal** - Personalized dashboard with progress tracking

### Technical Features
- **MOSA Architecture** - Modular Open Systems Approach with reusable partials
- **Theme System** - Light/dark mode with persistence
- **Multi-language Support** - Google Translate integration
- **Accessibility** - WCAG AA compliant, keyboard navigation, screen reader support
- **Responsive Design** - Mobile-first, works on all devices
- **Offline-Capable** - Low-bandwidth optimized

## Architecture

### MOSA (Modular Open Systems Approach)

The platform uses a partials-based architecture where shared components are loaded dynamically:

```
partials/
├── header.html           # Site header with navigation
├── footer.html           # Footer with links & Google Translate
├── nav.html              # Navigation menu
├── body.html             # Main content wrapper
├── auth-modal.html       # Authentication modal
├── customer-service-modal.html
├── tech-help-modal.html
└── theme-init.html       # Theme initialization
```

The `layout-loader.js` dynamically injects these partials into each page, ensuring consistency across 16+ pages while minimizing code duplication.

### Repository Structure

```
pmerit-ai-platform/
├── assets/
│   ├── css/              # Modular stylesheets
│   │   ├── theme-variables.css   # CSS custom properties
│   │   ├── base.css              # Reset & foundation
│   │   ├── components.css        # Reusable UI components
│   │   ├── mobile.css            # Mobile styles
│   │   └── desktop.css           # Desktop styles
│   ├── js/               # JavaScript modules
│   │   ├── layout-loader.js      # MOSA partial loader
│   │   ├── chat.js               # AI chat interface
│   │   ├── assessment-*.js       # Assessment system
│   │   ├── auth-modal.js         # Authentication
│   │   └── theme-manager.js      # Theme switching
│   └── img/              # Images and assets
├── docs/                 # Documentation
├── functions/            # Cloudflare Workers API
│   ├── api/
│   │   ├── algorithms/       # CareerMatcher, BigFiveScoring
│   │   ├── db/               # DatabaseHelper
│   │   ├── integrations/     # BLS API client
│   │   ├── services/         # Business logic
│   │   └── v1/               # Versioned endpoints
│   │       ├── assessment/   # Assessment API
│   │       └── ai/           # AI chat endpoint
│   ├── tech-help/        # Support ticket system
│   └── tts/              # Text-to-speech
├── partials/             # Shared HTML components
├── admin/                # Admin interface
├── portal/               # Additional portal pages
└── [pages].html          # Application pages
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/assessment/start` | POST | Start assessment session |
| `/api/v1/assessment/save` | POST | Auto-save progress |
| `/api/v1/assessment/submit` | POST | Submit & calculate results |
| `/api/v1/assessment/results/:id` | GET | Retrieve results |
| `/api/v1/assessment/resume/:sessionId` | GET | Resume session |
| `/api/v1/ai/chat` | POST | AI chat interaction |
| `/api/tts` | POST | Text-to-speech |
| `/api/stt` | POST | Speech-to-text |

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with AI chat |
| `learner-portal.html` | User dashboard |
| `assessment-entry.html` | Assessment introduction |
| `assessment-questions.html` | 120-question personality test |
| `assessment-processing.html` | Results calculation |
| `assessment-results.html` | Career recommendations |
| `courses.html` | Course catalog |
| `career.html` | Career exploration |
| `classroom.html` | Interactive learning |
| `about-us.html` | Platform mission |
| `pricing.html` | Subscription tiers |
| `support.html` | Help & support |

## Development

### Prerequisites
- Node.js 18+
- Wrangler CLI (for Cloudflare Workers)

### Local Development

```bash
# Clone the repository
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform

# Install dependencies
npm install

# Start local server (static files)
npx wrangler pages dev .

# Or use Python for simple static serving
python3 -m http.server 8080
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://...

# Cloudflare
CF_ACCOUNT_ID=your_account_id
```

## Deployment

The platform deploys automatically to Cloudflare Pages:

1. Push to `main` branch triggers production deployment
2. Pull requests create preview deployments
3. Cloudflare Workers functions deploy with Pages

### Deployment Checklist
See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for full deployment guide.

## Related Repositories

| Repository | Description |
|------------|-------------|
| [pmerit-ai-platform](https://github.com/peoplemerit/pmerit-ai-platform) | Frontend (this repo) |
| [pmerit-api-worker](https://github.com/peoplemerit/pmerit-api-worker) | Backend API Worker |

## Documentation

### Project Documents (Primary)

| Document | Purpose |
|----------|---------|
| [Pmerit Project Document](./docs/project/Pmerit_Project_Document.md) | Master roadmap, consolidated planning, and strategic overview |
| [Brainstorm ASU-Like Schema](./docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md) | Feature specifications, schema design, and implementation details |
| [User & Admin Journey](./docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md) | Comprehensive user flows and admin journey narratives |

### Technical Documentation

- [API Documentation](./docs/tech/API_DOCUMENTATION.md)
- [Developer Guide](./docs/tech/DEVELOPER_GUIDE.md)
- [User Guide](./docs/tech/USER_GUIDE.md)
- [Deployment Guide](./docs/tech/DEPLOYMENT.md)
- [Career Matching Algorithm](./docs/tech/CAREER_MATCHING_ALGORITHM.md)
- [Layout Loader Usage](./docs/tech/LAYOUT_LOADER_USAGE.md)

### Governance (AADOS)

- [AADOS Governance](./docs/aados/GOVERNANCE.md) - Workflow rules and phase gates
- [Task Tracker](./docs/aados/TASK_TRACKER.md) - Living status tracker

## Contributing

This is a solo developer project with AI-assisted development:
- **Primary AI:** Claude (architecture, implementation)
- **Secondary AI:** GitHub Copilot (code completion, auditing)
- **Supplementary:** ChatGPT (research, documentation)

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following existing patterns
3. Test locally with Wrangler
4. Submit pull request for review
5. Automated linting via GitHub Actions
6. Merge to `main` for deployment

## License

Proprietary - All rights reserved © PeopleMerit

---

**PMERIT AI Educational Platform** - Empowering learning through accessible innovation
