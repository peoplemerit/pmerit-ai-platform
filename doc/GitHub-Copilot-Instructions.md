# GitHub Copilot Instructions - Phase A: Core Architecture Reset

## SINGLE OBJECTIVE
Strip three-column layout from index.html and implement mobile-first, single-conversation interface.

## CRITICAL SUCCESS CRITERIA
- Remove `.estate` grid system completely from index.html
- Implement hamburger navigation using existing `/partials/nav.html`
- Create single-center container for PMERIT AI conversation
- No scrolling on mobile (100vh viewport-fit)
- Test functionality on 375px mobile breakpoint only

---

## TASK 1: Backup and Strip Current Layout

### Step 1.1: Create Backup
```bash
# Create backup of current index.html
cp index.html index_backup_$(date +%Y%m%d).html
```

### Step 1.2: Remove Three-Column Layout
In `index.html`, **DELETE** these elements:
- Any `<div class="estate">` containers
- Left sidebar `<div id="left">` 
- Right sidebar content
- Three-column grid references

### Step 1.3: Replace with Single Container
Replace the removed layout with:
```html
<div class="page-container">
  <div id="header-container"></div>
  <main class="main-content">
    <!-- Single center conversation area -->
  </main>
</div>
```

---

## TASK 2: Implement Mobile-First CSS

### Step 2.1: Add to `/assets/css/components.css`
**REPLACE** the existing `.estate` grid rules with:
```css
/* Mobile-First Single Container Layout */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  max-width: 100%;
}

/* Hide desktop nav elements on mobile */
@media (max-width: 767px) {
  .nav-items {
    display: none;
  }
  
  .hamburger-toggle {
    display: block;
  }
}
```

### Step 2.2: Ensure Viewport Configuration
In `index.html` `<head>`, verify this meta tag exists:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## TASK 3: Integrate Hamburger Navigation

### Step 3.1: Load Navigation Partial
In `index.html`, ensure header loads navigation:
```html
<div id="header-container">
  <!-- Load /partials/nav.html content here -->
</div>
```

### Step 3.2: Verify Hamburger Menu Functionality
Ensure `/partials/nav.html` hamburger menu has these elements:
- `.hamburger-toggle` button visible on mobile
- `.hamburger-menu` with Facebook-style grid
- Links to existing HTML pages (courses.html, career.html, etc.)

---

## TASK 4: Implement Single Conversation Interface

### Step 4.1: Create Center Content Area
In `index.html` main content, implement:
```html
<main class="main-content">
  <div class="conversation-container">
    <div class="ai-greeting">
      <div class="ai-avatar">🤖</div>
      <h1>PMERIT AI</h1>
      <p>Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?</p>
    </div>
    
    <div class="chat-interface">
      <input type="text" placeholder="Ask about courses, learning paths, or your goals..." class="chat-input">
      <button class="send-btn">Send</button>
    </div>
    
    <div class="quick-actions">
      <button class="action-btn primary">Begin Assessment</button>
      <button class="action-btn">Explore Career Paths</button>
    </div>
  </div>
</main>
```

### Step 4.2: Style Conversation Interface
Add to `/assets/css/components.css`:
```css
.conversation-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.ai-greeting h1 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.chat-interface {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0;
}

.chat-input {
  flex: 1;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 50px;
  min-height: 44px;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: 1px solid var(--primary);
  background: white;
  color: var(--primary);
  min-height: 44px;
  cursor: pointer;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
}
```

---

## TASK 5: Remove Footer Tagline Waste

### Step 5.1: Eliminate Bottom Tagline
**DELETE** any footer elements containing:
- "Empowering Learning Through Innovation"
- "Accessible, high-quality education for global opportunities"

These messages should be integrated into the AI greeting text instead of consuming viewport space.

---

## TESTING REQUIREMENTS

### Test 1: Mobile Viewport (375px)
- Open DevTools, set to iPhone SE (375px width)
- Verify no horizontal scrolling
- Verify hamburger menu opens/closes correctly
- Verify conversation interface is centered and accessible

### Test 2: Real Device Test
- Test on actual iPhone or Android device
- Verify tap targets are 44px minimum
- Verify no layout shift between DevTools and real device

### Test 3: Functionality Check
- Hamburger toggle works smoothly
- Menu links navigate to existing HTML pages
- Assessment button is prominently displayed
- No three-column layout elements remain

---

## COMPLETION CRITERIA
✅ Three-column layout completely removed from index.html  
✅ Mobile-first single container implemented  
✅ Hamburger navigation functional using existing /partials/nav.html  
✅ Single conversation interface centered and responsive  
✅ Footer tagline removed, messages integrated into AI greeting  
✅ Viewport-fit layout prevents scrolling on mobile  
✅ All tests pass on 375px mobile breakpoint  

**STOP HERE** - Do not proceed to Phase B until these criteria are met and validated.