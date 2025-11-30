# PMERIT Developer Guide

Welcome to the PMERIT development guide! This comprehensive document will help you set up your development environment, understand the architecture, and contribute to the platform.

---

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - For development tools and Wrangler CLI
- **Git** - Version control
- **Cloudflare Account** - For Workers and Pages deployment (free tier available)
- **Code Editor** - VS Code recommended with extensions:
  - ESLint
  - Prettier
  - HTMLHint
  - Stylelint

**Optional but recommended:**
- **Python 3.8+** - For local HTTP server during development
- **PostgreSQL client** - For database debugging (psql)

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform
```

#### 2. Install Dependencies

While the frontend has no framework dependencies, you'll need tools for development:

```bash
# Install Wrangler CLI for Cloudflare Workers development
npm install -g wrangler

# Login to Cloudflare (optional for local dev, required for deployment)
wrangler login
```

#### 3. Environment Setup

Create a `.env` file in the project root (this file is gitignored):

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Cloudflare Account ID (found in Cloudflare dashboard)
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Database Connection (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/pmerit_db

# Optional: AI API Configuration
OLLAMA_API_URL=https://ai.pmerit.com/api
```

#### 4. Start Local Development Server

**Option A: Python HTTP Server (Simple)**

```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

**Option B: Wrangler Dev Server (Full Workers simulation)**

```bash
# Start Pages development server with Functions support
npx wrangler pages dev . --port 8080

# This simulates Cloudflare Pages + Workers Functions locally
```

**Option C: VS Code Live Server Extension**

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"

#### 5. Verify Setup

Visit these URLs to confirm everything works:

- `http://localhost:8080` - Homepage
- `http://localhost:8080/assessment-entry.html` - Assessment entry
- `http://localhost:8080/api/tts` - TTS API (POST request)
- `http://localhost:8080/api/chat` - Chat API (POST request)

---

## 🏗️ Architecture Overview

### Tech Stack

PMERIT follows the **MOSA (Mostly Vanilla) Architecture** - minimal dependencies, maximum performance.

#### Frontend
- **HTML5** - Semantic markup, accessibility-first
- **CSS3** - Modular stylesheets, CSS variables, Grid + Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, modular design
- **Web APIs** - WebGL, localStorage, Fetch, Web Workers

#### Backend
- **Cloudflare Workers** - Serverless edge functions
- **Workers AI** - Text-to-speech and AI inference
- **Cloudflare Pages** - Static site hosting with Functions

#### Database
- **Neon PostgreSQL** - Serverless Postgres database
- **Hyperdrive** - Cloudflare's connection pooler for Workers

#### Infrastructure
- **Cloudflare Pages** - Continuous deployment from GitHub
- **GitHub Actions** - CI/CD pipeline
- **Wrangler** - Cloudflare CLI for deployment

#### External APIs
- **Ollama** - Self-hosted LLM for AI chat (phi3:mini model)
- **BLS API** - Bureau of Labor Statistics for career data
- **O*NET** - Occupational data and career information

### Why This Stack?

- ✅ **$0/month infrastructure cost** - All services use free tiers
- ✅ **Global edge deployment** - Fast from anywhere
- ✅ **Zero cold starts** - Workers execute instantly
- ✅ **Serverless scaling** - Handles traffic spikes automatically
- ✅ **No framework dependencies** - Fast, maintainable, future-proof
- ✅ **Progressive enhancement** - Works without JavaScript for core features

---

## 📂 Project Structure

```
pmerit-ai-platform/
├── assets/                       # Static assets
│   ├── css/                      # Modular stylesheets
│   │   ├── theme-variables.css   # CSS custom properties
│   │   ├── base.css              # Base styles
│   │   ├── typography.css        # Typography system
│   │   ├── components.css        # Reusable components
│   │   ├── assessment.css        # Assessment-specific styles
│   │   └── avatar.css            # 3D avatar styles
│   ├── js/                       # JavaScript modules
│   │   ├── config.js             # Configuration
│   │   ├── assessment-api.js     # Assessment API client
│   │   ├── assessment-entry.js   # Entry page logic
│   │   ├── assessment-questions.js # Question flow logic
│   │   ├── assessment-processing.js # Processing page
│   │   ├── assessment-results.js # Results display
│   │   ├── chat.js               # AI chat functionality
│   │   ├── auth.js               # Authentication module
│   │   ├── avatar/               # Avatar system
│   │   │   ├── AvatarManager.js  # Main avatar controller
│   │   │   ├── AudioPlayer.js    # TTS audio playback
│   │   │   ├── LipSyncVisemes.js # Lip sync engine
│   │   │   └── WebGLProvider.js  # 3D rendering
│   │   └── ui/                   # UI utilities
│   ├── data/                     # Static JSON data
│   │   ├── ipip-neo-120.json     # Personality questions
│   │   ├── holland-riasec.json   # Holland Code framework
│   │   ├── mock-careers.json     # Career database
│   │   └── constraints.json      # Career constraints
│   ├── images/                   # Images and icons
│   └── avatars/                  # 3D avatar models (GLB/GLTF)
│
├── functions/                    # Cloudflare Workers Functions
│   └── api/                      # API endpoints
│       ├── chat.js               # AI chat proxy endpoint
│       ├── tts.js                # Text-to-speech endpoint
│       ├── stt.js                # Speech-to-text endpoint
│       ├── algorithms/           # Core algorithms
│       │   ├── BigFiveScoring.js # Big Five calculation
│       │   ├── HollandCodeCalculator.js # RIASEC calculation
│       │   ├── CareerMatcher.js  # Career matching algorithm
│       │   └── README.md         # Algorithm documentation
│       ├── db/                   # Database layer
│       │   └── DatabaseHelper.js # Database operations wrapper
│       ├── services/             # Business logic services
│       │   ├── CareerMatchingService.js # Career recommendations
│       │   └── CareerEnrichmentService.js # Career data enhancement
│       ├── integrations/         # External API clients
│       │   └── BLSClient.js      # BLS API integration
│       └── v1/                   # API v1 endpoints
│           ├── assessment/       # Assessment endpoints
│           │   ├── start.js      # POST - Start session
│           │   ├── save.js       # POST - Save progress
│           │   ├── submit.js     # POST - Submit & process
│           │   ├── results/      # GET - Retrieve results
│           │   └── resume/       # GET - Resume session
│           └── db/               # Database endpoints
│               ├── health.js     # Database health check
│               ├── status.js     # Database status
│               └── tables.js     # List tables
│
├── docs/                         # Documentation
│   ├── USER_GUIDE.md             # End-user documentation
│   ├── DEVELOPER_GUIDE.md        # This file
│   ├── API_DOCUMENTATION.md      # API reference
│   ├── TROUBLESHOOTING.md        # Common issues
│   ├── CAREER_MATCHING_ALGORITHM.md # Algorithm details
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── MONITORING_SETUP.md       # Monitoring configuration
│
├── admin/                        # Admin tools and reports
│   ├── testing/                  # Test scripts
│   └── qa-reports/               # Quality assurance reports
│
├── partials/                     # HTML partials loaded dynamically
│   ├── header.html               # Site header
│   ├── footer.html               # Site footer
│   └── sidebar.html              # Navigation sidebar
│
├── scripts/                      # Build and utility scripts
│
├── index.html                    # Homepage
├── assessment-entry.html         # Assessment start page
├── assessment-questions.html     # 120-question assessment
├── assessment-processing.html    # Processing/loading page
├── assessment-results.html       # Results display
├── signin.html                   # Authentication page
├── privacy.html                  # Privacy policy
├── support.html                  # Support page
│
├── wrangler.toml                 # Cloudflare Workers configuration
├── _headers                      # Custom HTTP headers
├── CNAME                         # Custom domain configuration
├── .eslintrc.json                # ESLint configuration
├── .stylelintrc.json             # Stylelint configuration
├── .htmlhintrc                   # HTMLHint configuration
├── .gitignore                    # Git ignore rules
└── README.md                     # Project README
```

### Key Directories Explained

**`/assets/css/`** - Modular CSS architecture with clear separation of concerns. Each file has a specific purpose and can be loaded independently.

**`/assets/js/`** - ES6 modules with no framework dependencies. Each module is responsible for a specific feature area.

**`/assets/data/`** - Static JSON files containing assessment questions, career data, and configuration. These are loaded dynamically as needed.

**`/functions/api/`** - Serverless functions deployed as Cloudflare Workers. Each file becomes an API endpoint at `/api/{filename}`.

**`/docs/`** - Comprehensive documentation for users and developers.

---

## 🎨 Design System

### CSS Variables

PMERIT uses CSS custom properties for consistent theming:

```css
/* Primary Colors */
:root {
  --color-primary: #2A5B8C;
  --color-primary-light: #3A7BC8;
  --color-primary-dark: #1A3A5C;
  --color-secondary: #6B5CE7;
  --color-accent: #FF6B6B;
  
  /* Neutral Colors */
  --color-background: #FFFFFF;
  --color-surface: #F8F9FA;
  --color-text: #1A1A1A;
  --color-text-light: #6C757D;
  --color-border: #DEE2E6;
  
  /* Semantic Colors */
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-error: #DC3545;
  --color-info: #17A2B8;
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  
  /* Typography */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-heading: 'Montserrat', sans-serif;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 2rem;     /* 32px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;      /* 4px */
  --radius-md: 0.5rem;       /* 8px */
  --radius-lg: 1rem;         /* 16px */
  --radius-full: 9999px;     /* Fully rounded */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Responsive Breakpoints

PMERIT follows a mobile-first approach:

```css
/* Mobile First - Base styles apply to mobile */
.container {
  padding: var(--spacing-md);
}

/* Small tablets and large phones (landscape) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

/* Tablets */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* Small desktops */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

/* Large desktops */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

### Component Patterns

**Buttons:**
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

---

## 🔌 API Reference

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

### Quick Reference: Key Endpoints

#### Assessment Flow

```javascript
// 1. Start Assessment
POST /api/v1/assessment/start
Body: {
  userId: null,  // or user ID if authenticated
  consent: { privacy: true, data: true, terms: true }
}
Response: { success: true, sessionId: "uuid" }

// 2. Save Progress (auto-save every 5 questions)
POST /api/v1/assessment/save
Body: {
  sessionId: "uuid",
  currentQuestion: 10,
  answers: { "O1_1": 4, "O1_2": 3, ... }
}

// 3. Submit Complete Assessment
POST /api/v1/assessment/submit
Body: {
  sessionId: "uuid",
  answers: { /* all 120 answers */ }
}
Response: {
  success: true,
  resultId: "uuid",
  bigFive: { ... },
  hollandCode: "IAE",
  careerMatches: [ ... ]
}

// 4. Get Results
GET /api/v1/assessment/results/:resultId
Response: { complete results object }

// 5. Resume Assessment
GET /api/v1/assessment/resume/:sessionId
Response: { session data with saved answers }
```

#### AI Chat

```javascript
POST /api/chat
Body: {
  model: "phi3:mini",
  messages: [
    { role: "user", content: "What careers match high openness?" }
  ],
  stream: false
}
Response: {
  model: "phi3:mini",
  message: { role: "assistant", content: "..." },
  done: true
}
```

#### Text-to-Speech

```javascript
POST /api/tts
Body: {
  text: "Welcome to PMERIT!",
  voice: "alloy",
  speed: 1.0
}
Response: {
  audioUrl: "data:audio/mp3;base64,...",
  visemes: [ { v: "aa", t: 0.1 }, ... ],
  duration: 3.5
}
```

---

## 🧪 Testing

### Manual Testing

#### 1. Local Development Testing

```bash
# Start local server
python3 -m http.server 8080

# Test checklist:
# ✅ Homepage loads
# ✅ Navigation works
# ✅ Assessment flow (entry → questions → results)
# ✅ Virtual avatar loads and speaks
# ✅ AI chat responds
# ✅ PDF download works
# ✅ Mobile responsive (use DevTools device emulation)
```

#### 2. Frontend Testing

```bash
# Install testing dependencies
npm install --save-dev eslint stylelint htmlhint

# Run linters
npm run lint:js    # ESLint for JavaScript
npm run lint:css   # Stylelint for CSS
npm run lint:html  # HTMLHint for HTML

# Or run all linters:
npm run lint
```

#### 3. API Testing

Use curl or tools like Postman/Insomnia:

```bash
# Test health endpoint
curl https://pmerit.com/api/v1/db/health

# Test assessment start
curl -X POST https://pmerit.com/api/v1/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": null,
    "consent": {
      "privacy": true,
      "data": true,
      "terms": true
    }
  }'

# Test TTS
curl -X POST http://localhost:8080/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voice": "alloy"}'
```

### Browser Testing

#### Supported Browsers

Test in these browsers to ensure compatibility:

- **Chrome 90+** ✅ (Primary target)
- **Firefox 88+** ✅
- **Safari 14+** ✅
- **Edge 90+** ✅
- **Mobile Chrome** ✅
- **Mobile Safari** ✅

#### Testing Checklist

- [ ] Homepage renders correctly
- [ ] Navigation works (desktop & mobile)
- [ ] Assessment flow completes
- [ ] Virtual avatar displays (WebGL check)
- [ ] TTS audio plays
- [ ] PDF download works
- [ ] Forms validate properly
- [ ] Responsive design (320px to 4K)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

### Lighthouse Audits

Run Lighthouse audits to ensure performance, accessibility, and SEO:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://pmerit.com \
  --output html \
  --output-path ./report.html

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to "Lighthouse" tab
# 3. Click "Generate report"
```

#### Target Scores

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 90+
- **SEO:** 95+

---

## 🚀 Deployment

### Deploy to Cloudflare Pages

#### Automatic Deployment (Recommended)

PMERIT uses GitHub Actions for continuous deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **Automatic Deployment:**
   - GitHub Actions automatically triggers
   - Runs linters and checks
   - Deploys to Cloudflare Pages
   - Available at `https://pmerit.com` (production)

#### Manual Deployment

If you need to deploy manually:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy Pages project
wrangler pages deploy . \
  --project-name pmerit-ai-platform \
  --branch main

# Deploy Workers Functions
wrangler deploy
```

### Environment Variables

Set these in the Cloudflare Pages dashboard (Settings → Environment variables):

#### Production Variables

```
DATABASE_URL=postgresql://user:password@host.neon.tech/pmerit_db
CLOUDFLARE_ACCOUNT_ID=your_account_id
AI_API_URL=https://ai.pmerit.com/api
TTS_DEFAULT_MODEL=@cf/deepgram/aura-2-en
```

#### Preview/Development Variables

You can set different values for preview deployments:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/pmerit_dev
```

### Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Linters pass (no errors)
- [ ] Security checks complete (CodeQL)
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] API endpoints tested
- [ ] Lighthouse score reviewed
- [ ] Mobile testing complete

---

## 📝 Contributing

We welcome contributions to PMERIT! Here's how to get started.

### Branch Strategy

```
main              # Production branch - always deployable
├── develop       # Development branch - integration testing
├── feature/*     # New features (feature/career-search)
├── bugfix/*      # Bug fixes (bugfix/avatar-loading)
├── hotfix/*      # Urgent production fixes
└── docs/*        # Documentation updates
```

### Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes:**
   ```bash
   # Edit files
   # Test locally
   git add .
   git commit -m "feat: add career search feature"
   ```

3. **Push and Create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Then create Pull Request on GitHub
   ```

4. **Code Review:**
   - Automated checks run (linting, tests)
   - Team reviews code
   - Address feedback

5. **Merge:**
   - PR approved
   - Squash and merge to `develop`
   - Delete feature branch

6. **Release:**
   - When ready, merge `develop` → `main`
   - Automatic deployment to production

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Code style (formatting, semicolons, etc)
refactor: # Code restructuring
test:     # Adding tests
chore:    # Build process, dependencies

# Examples:
feat(assessment): add progress bar
fix(avatar): resolve lip sync timing issue
docs(api): update endpoint documentation
style(css): improve button hover state
refactor(db): optimize query performance
test(career): add matching algorithm tests
chore(deps): update dependencies
```

### Pull Request Process

1. **Before Creating PR:**
   - [ ] Code follows style guide
   - [ ] All tests pass locally
   - [ ] Linters pass (no errors)
   - [ ] Documentation updated if needed
   - [ ] No console.log statements left in code

2. **PR Title:**
   ```
   feat(scope): brief description
   ```

3. **PR Description Template:**
   ```markdown
   ## What does this PR do?
   Brief description of changes

   ## Why?
   Explain the motivation

   ## How to test?
   Step-by-step testing instructions

   ## Screenshots (if UI change)
   [Add screenshots]

   ## Checklist
   - [ ] Tests pass
   - [ ] Linters pass
   - [ ] Documentation updated
   - [ ] Mobile tested
   - [ ] Accessibility checked
   ```

4. **Review Process:**
   - At least 1 approval required
   - All automated checks must pass
   - Resolve all comments
   - Keep PR focused (< 500 lines changed ideally)

5. **After Merge:**
   - Delete branch
   - Monitor deployment
   - Update related issues

### Code Style

#### JavaScript

```javascript
// ✅ Good
function calculateScore(answers) {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  return score / answers.length;
}

// ❌ Bad
function calc(a){
  var s=0;
  for(var i=0;i<a.length;i++)s+=a[i];
  return s/a.length
}
```

**Standards:**
- Use ES6+ syntax (const/let, arrow functions, template literals)
- 2-space indentation
- Semicolons required
- Single quotes for strings
- Descriptive variable names
- JSDoc comments for functions
- No unused variables

#### CSS

```css
/* ✅ Good */
.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

/* ❌ Bad */
.btn-primary{display:inline-flex;padding:8px 24px;background:#2A5B8C}
```

**Standards:**
- 2-space indentation
- BEM naming convention preferred
- Use CSS variables
- Mobile-first media queries
- Avoid `!important` (use specificity)
- Alphabetize properties within blocks

#### HTML

```html
<!-- ✅ Good -->
<button 
  type="button" 
  class="btn btn-primary" 
  id="submit-btn"
  aria-label="Submit assessment"
>
  Submit
</button>

<!-- ❌ Bad -->
<button class=btn>Submit</button>
```

**Standards:**
- Semantic HTML5 elements
- Accessibility attributes (ARIA)
- Proper indentation
- Close all tags
- Use lowercase for tags and attributes
- Quote all attribute values

---

## 🐛 Debugging

### Common Issues

#### Issue: Avatar Not Loading

**Symptoms:** Black screen where avatar should be, console error about WebGL

**Solutions:**

1. **Check WebGL Support:**
   ```javascript
   const canvas = document.createElement('canvas');
   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
   if (!gl) {
     console.error('WebGL not supported');
   }
   ```

2. **Check Browser:**
   - Update to latest version
   - Enable hardware acceleration
   - Try different browser

3. **Check Console:**
   ```javascript
   // Look for errors in DevTools (F12)
   console.log('Avatar debug:', {
     webglSupported: !!gl,
     modelPath: avatarConfig.modelPath,
     loaded: avatarManager.isLoaded()
   });
   ```

---

#### Issue: Database Connection Timeout

**Symptoms:** API endpoints return 500 error, "connection timeout" in logs

**Solutions:**

1. **Check Hyperdrive Connection:**
   ```javascript
   // In Cloudflare Worker
   const db = new DatabaseHelper(env.DB);
   const isConnected = await db.testConnection();
   console.log('DB Connected:', isConnected);
   ```

2. **Verify Environment Variables:**
   - Check Cloudflare Pages dashboard
   - Ensure `DATABASE_URL` is set correctly
   - Restart Workers after changing env vars

3. **Cold Start Issue:**
   - First request after inactivity may be slow
   - Subsequent requests should be fast
   - Consider implementing retry logic

---

#### Issue: CORS Errors

**Symptoms:** Browser console shows "CORS policy" error when calling API

**Solutions:**

1. **Check Headers in API Function:**
   ```javascript
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',  // Or specific domain
     'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type'
   };

   // Return headers with response
   return new Response(JSON.stringify(data), {
     headers: {
       'Content-Type': 'application/json',
       ...corsHeaders
     }
   });
   ```

2. **Handle OPTIONS Preflight:**
   ```javascript
   if (request.method === 'OPTIONS') {
     return new Response(null, { 
       status: 204, 
       headers: corsHeaders 
     });
   }
   ```

3. **Production vs Development:**
   - Development: Use `'*'` for testing
   - Production: Set specific origin: `'https://pmerit.com'`

---

### Logging

#### Client-Side Logging

```javascript
// Development logging
if (window.location.hostname === 'localhost') {
  console.log('[DEBUG] Assessment progress:', progress);
}

// Production error logging
window.addEventListener('error', (event) => {
  // Send to error tracking service (e.g., Sentry)
  console.error('Global error:', event.error);
});

// Custom logger
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data)
};
```

#### Server-Side Logging (Workers)

```javascript
// In Cloudflare Worker
export async function onRequestPost(context) {
  try {
    console.log('[/api/v1/assessment/start] Request received');
    
    const result = await processAssessment();
    
    console.log('[/api/v1/assessment/start] Success:', {
      sessionId: result.sessionId,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error('[/api/v1/assessment/start] Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500
    });
  }
}
```

**View Logs:**

```bash
# Real-time logs
wrangler tail --project-name pmerit-ai-platform

# Or view in Cloudflare dashboard:
# Workers & Pages → pmerit-ai-platform → Logs
```

---

## 📚 Additional Resources

### Official Documentation

- **Cloudflare Docs:** [developers.cloudflare.com](https://developers.cloudflare.com/)
- **Workers AI:** [developers.cloudflare.com/workers-ai](https://developers.cloudflare.com/workers-ai/)
- **Cloudflare Pages:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/)
- **Neon PostgreSQL:** [neon.tech/docs](https://neon.tech/docs/)
- **Hyperdrive:** [developers.cloudflare.com/hyperdrive](https://developers.cloudflare.com/hyperdrive/)

### Psychological Models

- **IPIP-NEO-120:** [ipip.ori.org](https://ipip.ori.org/)
- **Big Five Personality:** [en.wikipedia.org/wiki/Big_Five_personality_traits](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- **Holland Code (RIASEC):** [en.wikipedia.org/wiki/Holland_Codes](https://en.wikipedia.org/wiki/Holland_Codes)
- **O*NET Online:** [onetonline.org](https://www.onetonline.org/)

### Tools & Libraries

- **Wrangler CLI:** [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler/)
- **Chart.js:** [chartjs.org](https://www.chartjs.org/) (for radar charts)
- **jsPDF:** [github.com/parallax/jsPDF](https://github.com/parallax/jsPDF) (for PDF generation)
- **Three.js:** [threejs.org](https://threejs.org/) (for 3D avatars)

### Learning Resources

- **MDN Web Docs:** [developer.mozilla.org](https://developer.mozilla.org/)
- **Web.dev:** [web.dev](https://web.dev/) (performance and best practices)
- **A11y Project:** [a11yproject.com](https://www.a11yproject.com/) (accessibility)

---

## 🤝 Community

### Get Help

- **GitHub Issues:** [github.com/peoplemerit/pmerit-ai-platform/issues](https://github.com/peoplemerit/pmerit-ai-platform/issues)
- **GitHub Discussions:** [github.com/peoplemerit/pmerit-ai-platform/discussions](https://github.com/peoplemerit/pmerit-ai-platform/discussions)
- **Email:** developers@pmerit.com

### Contributing

We're always looking for contributors! Areas where help is needed:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🌍 Translations and internationalization
- ♿ Accessibility enhancements
- 🧪 Testing and quality assurance
- 🎨 UI/UX improvements

See our [Contributing Guidelines](../CONTRIBUTING.md) for more details.

---

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead, email: security@pmerit.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We'll respond within 48 hours and work with you to resolve the issue.

### Security Best Practices

When contributing:

- ✅ Never commit secrets or API keys
- ✅ Use environment variables for sensitive config
- ✅ Validate all user input
- ✅ Sanitize data before database queries
- ✅ Use HTTPS for all API calls
- ✅ Implement proper CORS policies
- ✅ Follow OWASP security guidelines

---

## 📊 Performance Tips

### Frontend Optimization

1. **Lazy Load Images:**
   ```html
   <img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" alt="Description">
   ```

2. **Code Splitting:**
   ```javascript
   // Load modules only when needed
   if (needsAvatarFeature) {
     import('./avatar/AvatarManager.js').then(module => {
       const AvatarManager = module.default;
       // Use AvatarManager
     });
   }
   ```

3. **Cache Static Assets:**
   ```javascript
   // In _headers file
   /assets/*
     Cache-Control: public, max-age=31536000, immutable
   ```

### Backend Optimization

1. **Database Query Optimization:**
   ```javascript
   // ✅ Good - Select only needed columns
   const results = await db.query(
     'SELECT id, title, fit_score FROM careers WHERE fit_score > $1',
     [minScore]
   );

   // ❌ Bad - Select all columns
   const results = await db.query('SELECT * FROM careers');
   ```

2. **Use Hyperdrive Connection Pooling:**
   ```javascript
   // Hyperdrive automatically pools connections
   // Just use env.DB binding - no manual pooling needed
   const db = new DatabaseHelper(env.DB);
   ```

3. **Cache API Responses:**
   ```javascript
   // Use Cloudflare Cache API
   const cache = caches.default;
   const cachedResponse = await cache.match(request);
   if (cachedResponse) return cachedResponse;
   
   // Generate response and cache it
   const response = await generateResponse();
   context.waitUntil(cache.put(request, response.clone()));
   return response;
   ```

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintainer:** PMERIT Development Team

**Ready to contribute? Check out open issues on GitHub!** 🚀
