# HTML Style Guide - PMERIT Platform

## General Principles
1. **Always use semantic elements** - Use proper HTML5 semantic tags
2. **Keep it accessible** - Include ARIA labels and alt text
3. **Mobile-first** - Design for small screens, enhance for large
4. **Consistent indentation** - Use 2 spaces per level

---

## Document Structure

### Required Meta Tags
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="PMERIT - Accessible Global Education">
  <title>Page Title - PMERIT</title>
</head>
```

### Viewport Configuration
```html
<!-- Standard viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- For iOS safe area support -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## Semantic HTML

### ✅ Use Semantic Elements
```html
<!-- Good: Semantic structure -->
<header class="site-header">
  <nav class="main-navigation">...</nav>
</header>

<main class="site-content">
  <section class="hero">...</section>
  <article class="content-block">...</article>
</main>

<footer class="site-footer">...</footer>
```

### ❌ Avoid Generic Divs
```html
<!-- Bad: Too many divs -->
<div class="header">
  <div class="nav">...</div>
</div>

<div class="content">
  <div class="section">...</div>
</div>
```

---

## Accessibility

### ARIA Labels
```html
<!-- Button with icon needs label -->
<button aria-label="Close menu" class="close-btn">
  <i class="fas fa-times"></i>
</button>

<!-- Toggle switches need labels -->
<label class="toggle">
  <input type="checkbox" aria-label="Enable dark mode">
  <span class="slider"></span>
</label>
```

### Alt Text
```html
<!-- Decorative images -->
<img src="decoration.svg" alt="" role="presentation">

<!-- Meaningful images -->
<img src="logo.png" alt="PMERIT platform logo">

<!-- Functional images -->
<button>
  <img src="search.svg" alt="Search">
</button>
```

### Heading Hierarchy
```html
<!-- Correct hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

<!-- ❌ Wrong: Skipping levels -->
<h1>Title</h1>
  <h3>Skip h2</h3> <!-- Don't do this -->
```

---

## Mobile-Specific Patterns

### Touch-Friendly Buttons
```html
<!-- Minimum 44px height/width for touch targets -->
<button class="mobile-btn" style="min-height: 44px; min-width: 44px">
  Tap Me
</button>
```

### Safe Area Support (iOS)
```html
<!-- Footer with safe area -->
<footer class="mobile-footer" style="padding-bottom: env(safe-area-inset-bottom)">
  Privacy & Terms
</footer>
```

### Hamburger Menu Pattern
```html
<button 
  class="hamburger-btn" 
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="mobile-nav">
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
</button>

<nav id="mobile-nav" class="mobile-nav" aria-hidden="true">
  <!-- Menu content -->
</nav>
```

---

## Component Examples

### Header (Mobile)
```html
<header class="site-header mobile-header">
  <!-- Left: Logo -->
  <div class="header-left">
    <img src="logo.svg" alt="PMERIT" class="logo">
    <span class="brand-name">PMERIT</span>
  </div>
  
  <!-- Right: Actions -->
  <div class="header-right">
    <select aria-label="Select language" class="lang-switcher">
      <option>EN</option>
      <option>ES</option>
    </select>
    <button aria-label="Open menu" class="hamburger">☰</button>
    <button class="signin-btn">Sign In</button>
  </div>
</header>
```

### Header (Desktop)
```html
<header class="site-header desktop-header">
  <div class="header-container">
    <div class="logo-section">
      <img src="logo.svg" alt="PMERIT" class="logo">
    </div>
    <nav class="main-nav">
      <a href="/dashboard">Dashboard</a>
      <a href="/courses">Courses</a>
      <a href="/career">Career</a>
    </nav>
    <div class="user-actions">
      <button class="signin-btn">Sign In</button>
    </div>
  </div>
</header>
```

### Modal Pattern
```html
<div 
  id="signin-modal" 
  class="modal" 
  role="dialog" 
  aria-labelledby="modal-title"
  aria-hidden="true">
  
  <div class="modal-overlay" aria-hidden="true"></div>
  
  <div class="modal-content" role="document">
    <button 
      class="modal-close" 
      aria-label="Close sign-in modal">
      ×
    </button>
    
    <h2 id="modal-title">Sign In to PMERIT</h2>
    
    <form class="signin-form">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email"
        required
        aria-required="true">
      
      <button type="submit">Sign In</button>
    </form>
  </div>
</div>
```

---

## Comments

### Use Clear Section Comments
```html
<!-- ========================================
     MOBILE HEADER
     ======================================== -->
<header class="mobile-header">
  <!-- Left: Logo and brand -->
  <div class="header-left">...</div>
  
  <!-- Right: Language, menu, sign-in -->
  <div class="header-right">...</div>
</header>

<!-- ========================================
     MAIN CONTENT AREA
     ======================================== -->
<main class="main-content">
  ...
</main>
```

---

## Common Mistakes to Avoid

### ❌ Don't Use
```html
<!-- Inline styles -->
<div style="color: blue; margin: 10px;">Bad</div>

<!-- Inline JavaScript -->
<button onclick="doSomething()">Bad</button>

<!-- Non-semantic wrappers -->
<div class="header">
  <div class="menu">
    <div class="item">Bad</div>
  </div>
</div>

<!-- Missing alt text -->
<img src="important.jpg">

<!-- Skipped heading levels -->
<h1>Title</h1>
<h4>Subtitle</h4>
```

### ✅ Do Use
```html
<!-- External CSS -->
<div class="text-primary margin-2">Good</div>

<!-- Event listeners in JS -->
<button id="action-btn">Good</button>

<!-- Semantic elements -->
<header class="site-header">
  <nav class="main-nav">
    <a class="nav-link">Good</a>
  </nav>
</header>

<!-- Proper alt text -->
<img src="important.jpg" alt="Description of image">

<!-- Correct heading hierarchy -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

---

## Checklist for Every HTML File

- [ ] `<!DOCTYPE html>` declaration present
- [ ] `<html lang="en">` attribute set
- [ ] Proper meta tags (charset, viewport)
- [ ] Semantic HTML5 elements used
- [ ] All images have alt text
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] ARIA labels on interactive elements
- [ ] No inline styles or inline JavaScript
- [ ] Touch targets minimum 44px on mobile
- [ ] Safe-area-inset used on mobile footer
- [ ] Consistent 2-space indentation
- [ ] Clear section comments

---

**Remember:** Good HTML is the foundation of accessible, maintainable web applications. Prioritize semantics and accessibility in every decision.
