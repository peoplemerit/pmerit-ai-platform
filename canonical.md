# canonical.md  
**Artifact Type:** Governance & Implementation Guide  
**Scope:** PMERIT Front Page (Desktop + Mobile)  
**Purpose:** Standardize layout, naming, and navigation for professional, accessible, and emotionally resonant design.

---

## 🧭 Global Navigation

### ✅ Requirements
- Persistent top navigation across all pages
- Grouped sections with clear hierarchy
- Dynamic button labels based on user authentication state
- Accessible language toggle with proper labels and icons
- Mobile-friendly hamburger menu for secondary actions

### 🛠️ Implementation Notes
- Use semantic `<nav>` elements with proper ARIA labels
- Replace "Start Learning" with dynamic logic:
  - `if !signedIn → "Sign Up"`
  - `if signedIn && !assessed → "Begin Assessment"`
  - `if assessed → "View Learning Plan"`
- Group "Donate" and language selector in collapsed menu for mobile
- Ensure minimum 44px tap targets for mobile interfaces

---

## 🏷️ Button & Label Standards

### ✅ Requirements
- Use clear, action-oriented language instead of jargon
- Maintain consistent naming conventions across all pages
- Provide context through tooltips or helper text when needed
- Follow accessibility guidelines for button labeling

### 🛠️ Button Rename Mapping
- "VH Mode" → "Virtual Human Support"
- "Read About" → "Learn About PMERIT"
- "Connected to Educational Services" → "Education Services Portal"
- "Reset About" → "Reset Preferences"
- "Customer Service Mode" → "Support Assistant Mode"

### 🎯 Implementation Notes
- Add hover tooltips with descriptive text
- Use icons consistently with text labels
- Ensure button purpose is clear from label alone
- Test with screen readers for accessibility

---

## 📱 Mobile Screen Modularization

### ✅ Requirements
- Responsive layout that adapts across all page types
- Reduce visual clutter through collapsible sections
- Prioritize essential actions in main view
- Use accordion-style expandable categories
- Maintain accessibility on touch devices

### 🛠️ Mobile Layout Structure
```
Primary Actions (Always Visible):
- Search/Chat Input
- Sign In/Dashboard (based on auth state)
- Support Contact

Expandable Sections:
- "Quick Actions" (Virtual Human, Career Paths, Settings)
- "Learn & Explore" (Assessment, Course Catalog)
- "Support & Help" (Documentation, Contact, Tutorials)
```

### 📐 Implementation Notes
- Use `<details>` elements or accordion components for expandable sections
- Implement sticky positioning for essential UI elements
- Optimize for one-handed mobile usage
- Ensure minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text

---

## 💬 Chat Interface Enhancement

### ✅ Requirements
- Conversational message threading with visual distinction
- Sticky "Send" button that remains accessible during scroll
- Proper message history and state management
- Visual feedback for user interactions
- Accessibility support for screen readers

### 🛠️ Chat Layout Specifications
- AI messages: Left-aligned with avatar and light background
- User messages: Right-aligned with distinct styling
- Add timestamps for message sequences
- Include typing indicators during AI response generation
- Implement "View History" or export functionality

### 🎯 Implementation Notes
- Use `position: sticky` for send button with `bottom: 0`
- Implement auto-scroll to bottom on new messages
- Add fade-in animations for new message appearance
- Store chat history in localStorage for session persistence

---

## 🎨 Accessibility & Visual Design

### ✅ Requirements
- WCAG 2.1 AA compliance for contrast and text sizing
- Light/dark theme toggle with proper contrast in both modes
- Text scaling options (100%, 125%, 150%)
- Keyboard navigation support for all interactive elements
- Screen reader compatibility with proper ARIA labels

### 🛠️ Accessibility Implementation
- Implement `prefers-color-scheme` media query for automatic theme detection
- Provide manual theme toggle in easily accessible location
- Use semantic HTML structure with proper headings hierarchy
- Add `aria-label` and `aria-describedby` attributes where needed
- Test with keyboard-only navigation

### 🌈 Color Contrast Standards
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio for borders/focus states
- Ensure color is not the only way to convey information

---

## 🧠 User Experience & Emotional Resonance

### ✅ Requirements
- Role-based interface adaptation (student, educator, career seeker)
- Personalized greetings and contextual prompts
- Progress indicators for assessments and learning paths
- Motivational elements that inspire continued engagement
- Clear onboarding flow for new users

### 🛠️ Personalization Features
- Display user name and progress in dashboard greeting
- Show relevant learning paths based on user role
- Implement assessment progress indicators
- Add motivational quotes or tips in appropriate contexts
- Provide clear "next steps" guidance throughout the interface

---

## 🔧 Technical Implementation Standards

### 🗃️ File Structure
```
/assets/css/
  - base.css (foundational styles)
  - brand.css (color scheme and brand elements)
  - components.css (reusable UI components)
  - responsive.css (mobile and tablet optimizations)

/assets/js/
  - main.js (core application logic)
  - auth.js (authentication state management)
  - chat.js (chat interface functionality)
  - accessibility.js (accessibility enhancements)
```

### 🎯 Development Guidelines
- Use CSS custom properties for consistent theming
- Implement progressive enhancement for JavaScript features
- Ensure graceful degradation when JavaScript is disabled
- Follow BEM methodology for CSS class naming
- Use semantic HTML5 elements for proper document structure

---

## 📋 Testing & Validation Checklist

### ✅ Before Deployment
- [ ] Test all button interactions and navigation flows
- [ ] Verify WCAG compliance using accessibility auditing tools
- [ ] Test responsive design on multiple screen sizes (320px to 1920px)
- [ ] Validate keyboard navigation and screen reader compatibility
- [ ] Ensure chat functionality works with sticky send button
- [ ] Test light/dark theme switching
- [ ] Verify all renamed buttons have clear, understandable labels
- [ ] Test mobile accordion functionality on touch devices

### 🔍 Cross-Browser Testing
- [ ] Chrome/Edge (Desktop + Mobile)
- [ ] Firefox (Desktop + Mobile)
- [ ] Safari (Desktop + iOS)
- [ ] Test on actual mobile devices when possible

---

## 🏛️ Governance Notes

- This document serves as the canonical reference for front page design standards
- All UI changes must align with these specifications
- Contributors should reference this document when making interface modifications
- Any deviations from these standards require documentation and approval
- Regular audits should be conducted to ensure ongoing compliance

**Last Updated:** September 2025  
**Version:** 1.0  
**Maintained by:** PMERIT Development Team