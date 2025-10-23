# PMERIT AI Educational Platform

> Empowering learning through accessible, high-quality education

## 🎓 Mission

Breaking poverty cycles through accessible education and remote career opportunities, with a primary focus on underserved communities in Nigeria/Africa.

## ✨ Features

- **Beautiful Responsive Design**: Works perfectly on desktop and mobile
- **PMERIT AI Chat**: Educational guidance and learning support
- **Mobile-First**: Collapsible sidebars and touch-friendly interactions
- **Modular Architecture**: Clean CSS and JavaScript structure
- **Educational Focus**: Mission-driven content and messaging
- **Mock Authentication (Phase 1)**: Frontend-only authentication with localStorage

## 🚀 Live Site

- **Production**: https://pmerit.com
- **GitHub Pages**: https://peoplemerit.github.io
- **Preview (Phase 1)**: Branch `test/auth-mock-phase1-preview` for testing authentication features

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Modular)
- **Design**: Responsive with CSS Grid and Flexbox
- **Deployment**: GitHub Pages with custom domain
- **Authentication**: Mock implementation (Phase 1) - localStorage based

## 📱 Features

- Non-scrollable viewport-perfect design
- Working mobile sidebar toggles
- Educational AI chat responses
- Touch-friendly interactions
- Beautiful gradient design
- User authentication with sign-in/sign-out
- Protected routes with automatic redirect

## 🔧 Local Development (Phase 1)

### Prerequisites
- Python 3 (for local server)
- A modern web browser

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform
```

2. Checkout the Phase 1 preview branch:
```bash
git checkout test/auth-mock-phase1-preview
```

3. Start a local web server:
```bash
python3 -m http.server 8080
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

### Testing Authentication Flow

#### Sign In
1. Navigate to `/signin.html` or click "Sign In" in the header
2. Enter any email and a password with at least 6 characters
3. Click "Sign In"
4. You'll be redirected to the learner portal

#### Protected Pages
- `/learner-portal.html` - Main dashboard (protected)
- `/classroom.html` - Interactive classroom (protected)

When accessing a protected page without authentication, you'll be automatically redirected to `/signin.html`.

#### Sign Out
1. From any protected page, click the "Logout" button in the header
2. Confirm the logout action
3. You'll be redirected to `/signin.html`

### Environment Detection

The platform automatically detects the environment:
- **Development**: `localhost` or `127.0.0.1`
- **Staging**: URLs containing `.pages.dev` (Cloudflare Pages preview)
- **Production**: All other URLs (e.g., `pmerit.com`)

## 🔐 Phase 1 Authentication (Mock Implementation)

### Current Implementation
Phase 1 uses a **mock authentication system** that runs entirely in the browser:
- No backend API calls
- User data stored in `localStorage`
- Password validation (minimum 6 characters)
- Session persistence across page refreshes
- Automatic redirect to intended page after login

### Key Files
- `assets/js/config.js` - Environment configuration
- `assets/js/auth.js` - Mock authentication module
- `assets/js/auth-check.js` - Route guard for protected pages

### ⚠️ Important Notes
- This is a **frontend-only mock** for development and UI testing
- **Not secure** for production use
- No real user accounts are created
- All authentication data is cleared when localStorage is cleared

## 🚀 Phase 2 Preparation

Phase 2 will replace the mock authentication with a real backend API. The code is structured to make this transition seamless:

### TODO Markers
Search for `TODO (Phase 2):` in the codebase to find all locations that need updates:
- `assets/js/auth.js` - Contains commented examples of real API calls
- `assets/js/config.js` - Update `API_BASE_URL` with the actual backend URL

### API Integration Checklist
- [ ] Set up backend authentication API
- [ ] Update `CONFIG.API_BASE_URL` in `config.js`
- [ ] Replace mock functions in `auth.js` with real API calls
- [ ] Implement proper JWT token handling
- [ ] Add token refresh mechanism
- [ ] Switch from localStorage to secure httpOnly cookies
- [ ] Add CSRF protection
- [ ] Implement proper error handling for network failures

## 📋 Cloudflare Pages Deployment

### Preview Branch Setup
1. In Cloudflare Pages dashboard, go to Settings → Builds & Deployments
2. Enable Preview Deployments
3. Add `test/auth-mock-phase1-preview` to the list of preview branches
4. The preview URL will be: `https://<project-name>--test-auth-mock-phase1-preview.pages.dev`

### Testing Preview Deployment
Once deployed, test the complete authentication flow:
- ✅ Header "Sign In" opens `/signin.html`
- ✅ Invalid credentials show friendly error
- ✅ Valid mock sign-in redirects to portal
- ✅ Refresh portal remains signed in
- ✅ Logout returns to `/signin.html`
- ✅ Mobile viewport: form is responsive and readable

## 🎯 Development Workflow

1. **Make changes** on the `test/auth-mock-phase1-preview` branch
2. **Test locally** using the local server
3. **Push to GitHub** to trigger Cloudflare Pages preview deployment
4. **Review preview** deployment on the Cloudflare Pages URL
5. **Merge to main** once QA is complete

---

**PMERIT AI Educational Platform - Empowering learning through innovation**
