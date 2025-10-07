# JavaScript Structure Tips - PMERIT Platform

## Core Principles
1. **Modular Code** - Small, focused functions with single responsibilities
2. **No Global Variables** - Use ES6 modules or IIFE patterns
3. **Event Delegation** - Efficient event handling
4. **Semantic Naming** - Descriptive function and variable names
5. **Modern ES6+** - Use const/let, arrow functions, template literals

---

## Module Pattern

### ✅ Good: ES6 Modules
```javascript
// menu.js
export const MenuController = {
  isOpen: false,
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.updateUI();
  },
  
  open() {
    this.isOpen = true;
    this.updateUI();
  },
  
  close() {
    this.isOpen = false;
    this.updateUI();
  },
  
  updateUI() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    
    menu.classList.toggle('open', this.isOpen);
    overlay.classList.toggle('active', this.isOpen);
    
    // Update ARIA
    const button = document.querySelector('[aria-controls="mobile-menu"]');
    button.setAttribute('aria-expanded', this.isOpen);
    menu.setAttribute('aria-hidden', !this.isOpen);
  }
};
```

### ❌ Bad: Global Variables
```javascript
// DON'T do this
var menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  // ...
}
```

---

## Variable Declarations

### ✅ Use const/let
```javascript
// Immutable reference
const config = {
  apiUrl: 'https://api.pmerit.com',
  timeout: 5000
};

// Mutable variable
let currentPage = 1;

// Never use var
// var oldSchool = true; // DON'T
```

### Naming Conventions
```javascript
// camelCase for functions and variables
const getUserProfile = () => {};
let isAuthenticated = false;

// PascalCase for classes/constructors
class UserManager {}

// SCREAMING_SNAKE_CASE for constants
const API_ENDPOINT = 'https://api.pmerit.com';
const MAX_RETRIES = 3;

// Descriptive names
const fetchUserData = () => {};  // ✅ Good
const getData = () => {};        // ❌ Vague
```

---

## Function Patterns

### Arrow Functions
```javascript
// Short, single expression
const double = (n) => n * 2;

// Multiple parameters
const add = (a, b) => a + b;

// Function body
const greet = (name) => {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
};

// Array methods
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
const doubled = numbers.map(n => n * 2);
```

### Async/Await
```javascript
// ✅ Modern async pattern
const fetchUserProfile = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// ❌ Callback hell (avoid)
function getUserProfile(userId, callback) {
  fetch(`/api/users/${userId}`, function(response) {
    response.json(function(data) {
      callback(data);
    });
  });
}
```

---

## Event Handling

### Event Listeners (Not Inline)
```javascript
// ✅ Good: Separate event listeners
document.getElementById('signin-btn').addEventListener('click', () => {
  showSignInModal();
});

// ❌ Bad: Inline onclick
// <button onclick="doSomething()">Bad</button>
```

### Event Delegation
```javascript
// ✅ Efficient: One listener for multiple elements
document.querySelector('.navigation-menu').addEventListener('click', (event) => {
  if (event.target.matches('.nav-item')) {
    const page = event.target.dataset.page;
    navigateTo(page);
  }
});

// ❌ Inefficient: Multiple listeners
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navigateTo(item.dataset.page);
  });
});
```

### Removing Event Listeners
```javascript
// Store reference for cleanup
const handleClick = () => {
  console.log('clicked');
};

button.addEventListener('click', handleClick);

// Later: remove listener
button.removeEventListener('click', handleClick);
```

---

## DOM Manipulation

### Query Selectors
```javascript
// ✅ Modern selectors
const menu = document.querySelector('#mobile-menu');
const buttons = document.querySelectorAll('.action-btn');

// ❌ Old methods (avoid)
const menu = document.getElementById('mobile-menu'); // OK but verbose
const buttons = document.getElementsByClassName('action-btn'); // Avoid
```

### Safe DOM Access
```javascript
// ✅ Check for existence
const toggleDarkMode = () => {
  const themeToggle = document.querySelector('#theme-toggle');
  
  if (!themeToggle) {
    console.warn('Theme toggle not found');
    return;
  }
  
  document.documentElement.classList.toggle('dark');
};

// ❌ Unsafe: May cause errors
const toggleDarkMode = () => {
  // What if element doesn't exist?
  document.querySelector('#theme-toggle').checked = true;
};
```

### Creating Elements
```javascript
// ✅ Template literals for complex HTML
const createMessageBubble = (message, isUser) => {
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${isUser ? 'user' : 'ai'}`;
  
  bubble.innerHTML = `
    <div class="message-avatar">
      <img src="${isUser ? '/user-avatar.svg' : '/ai-avatar.svg'}" alt="">
    </div>
    <div class="message-content">
      <p>${escapeHtml(message)}</p>
      <span class="message-time">${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  
  return bubble;
};

// Helper: Escape HTML to prevent XSS
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

---

## State Management

### Simple State Object
```javascript
const AppState = {
  user: null,
  darkMode: false,
  menuOpen: false,
  currentPage: 'home',
  
  setUser(user) {
    this.user = user;
    this.notifyListeners('user');
  },
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
    this.notifyListeners('darkMode');
  },
  
  listeners: {},
  
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  },
  
  notifyListeners(key) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(this[key]));
    }
  }
};

// Usage
AppState.subscribe('user', (user) => {
  console.log('User updated:', user);
  updateUI();
});
```

---

## Component Patterns

### Menu Controller
```javascript
class MenuController {
  constructor() {
    this.menu = document.querySelector('#mobile-menu');
    this.overlay = document.querySelector('#menu-overlay');
    this.toggleBtn = document.querySelector('[aria-controls="mobile-menu"]');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    this.toggleBtn?.addEventListener('click', () => this.toggle());
    this.overlay?.addEventListener('click', () => this.close());
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.menu?.classList.add('open');
    this.overlay?.classList.add('active');
    this.toggleBtn?.setAttribute('aria-expanded', 'true');
    this.menu?.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.isOpen = false;
    this.menu?.classList.remove('open');
    this.overlay?.classList.remove('active');
    this.toggleBtn?.setAttribute('aria-expanded', 'false');
    this.menu?.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Initialize
const menuController = new MenuController();
```

### Modal Controller
```javascript
const ModalController = {
  activeModal: null,
  
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    this.activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first input
    const firstInput = modal.querySelector('input');
    firstInput?.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Trap focus in modal
    this.trapFocus(modal);
  },
  
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.activeModal = null;
  },
  
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
};
```

---

## Error Handling

### Try-Catch for Async Operations
```javascript
const saveUserSettings = async (settings) => {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save settings: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Settings saved successfully');
    return data;
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showErrorNotification('Failed to save settings. Please try again.');
    throw error;
  }
};
```

### Validation
```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (formData) => {
  const errors = [];
  
  if (!formData.email) {
    errors.push('Email is required');
  } else if (!validateEmail(formData.email)) {
    errors.push('Invalid email format');
  }
  
  if (!formData.password || formData.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

---

## Performance Optimization

### Debounce
```javascript
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Usage: Search input
const searchInput = document.querySelector('#search');
const performSearch = debounce((query) => {
  console.log('Searching for:', query);
  // API call here
}, 300);

searchInput.addEventListener('input', (e) => {
  performSearch(e.target.value);
});
```

### Throttle
```javascript
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Usage: Scroll event
window.addEventListener('scroll', throttle(() => {
  console.log('Scrolled');
}, 100));
```

---

## Common Utilities

```javascript
// Local Storage Helper
const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Format Date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Generate Unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
```

---

## Checklist for Every JS File

- [ ] Uses const/let (no var)
- [ ] Modular structure (no global variables)
- [ ] Event listeners (no inline onclick)
- [ ] Async/await for promises
- [ ] Error handling (try-catch)
- [ ] Safe DOM access (null checks)
- [ ] Descriptive function names
- [ ] JSDoc comments for complex functions
- [ ] No console.log in production code
- [ ] Proper event cleanup (removeEventListener)

---

**Remember:** Write JavaScript that is modular, predictable, and easy to maintain. Favor clarity over cleverness.
