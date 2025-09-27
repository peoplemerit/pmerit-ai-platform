// PMERIT Mobile JavaScript Module
// Adapted from templates/script.js for mobile-first responsive design

// State management - Enhanced for mobile
const mobileState = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en',
  currentPage: '',
  isMobile: true,
  touchDevice: false
};

// Career tracks data - Same as original but mobile optimized
const MOBILE_TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.', icon:'fas fa-code'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.', icon:'fas fa-chart-bar'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.', icon:'fas fa-paint-brush'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.', icon:'fas fa-bullhorn'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.', icon:'fas fa-headset'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.', icon:'fas fa-tasks'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.', icon:'fas fa-cloud'},
];

// Mobile-specific DOM helpers
const MobileDOM = {
  // Get mobile-safe element
  get(selector) {
    return document.querySelector(selector);
  },
  
  // Get all mobile-safe elements
  getAll(selector) {
    return document.querySelectorAll(selector);
  },
  
  // Check if element exists
  exists(selector) {
    return document.querySelector(selector) !== null;
  },
  
  // Add event listener with touch support
  addListener(element, event, handler, options = {}) {
    if (!element) return;
    
    // Add touch events for mobile
    if (event === 'click' && mobileState.touchDevice) {
      element.addEventListener('touchstart', handler, options);
    }
    element.addEventListener(event, handler, options);
  },
  
  // Add class with animation support
  addClass(element, className, animate = false) {
    if (!element) return;
    
    if (animate) {
      element.style.transition = 'all 0.3s ease';
    }
    element.classList.add(className);
  },
  
  // Remove class with animation support
  removeClass(element, className, animate = false) {
    if (!element) return;
    
    if (animate) {
      element.style.transition = 'all 0.3s ease';
    }
    element.classList.remove(className);
  }
};

// Initialize mobile state from localStorage
function initMobileState() {
  try {
    mobileState.dark = localStorage.getItem('pmerit_dark') === 'true';
    mobileState.auth = localStorage.getItem('pmerit_auth') === 'true';
    mobileState.tts = localStorage.getItem('pmerit_tts') === 'true';
    mobileState.lang = localStorage.getItem('pmerit_lang') || 'en';
    mobileState.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  } catch (e) {
    console.error('Error loading mobile state from localStorage:', e);
  }
  
  // Apply initial state
  document.body.classList.toggle('dark', mobileState.dark);
  document.body.classList.toggle('touch-device', mobileState.touchDevice);
  
  // Set current page
  mobileState.currentPage = getCurrentPageName();
  
  console.log('Mobile state initialized:', mobileState);
}

// Get current page name from URL
function getCurrentPageName() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  return page;
}

// Save mobile state to localStorage
function saveMobileState(key, value) {
  try {
    localStorage.setItem(`pmerit_${key}`, String(value));
    mobileState[key] = value;
  } catch (e) {
    console.error('Error saving mobile state to localStorage:', e);
  }
}

// Mobile-specific utilities
const MobileUtils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },
  
  // Check if element is in viewport
  isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  // Smooth scroll to element
  scrollTo(element, offset = 0) {
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  },
  
  // Show mobile toast notification
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `mobile-toast mobile-toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
      info: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };
    toast.style.background = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
};

// Mobile navigation handler
const MobileNav = {
  isOpen: false,
  
  init() {
    const menuBtn = MobileDOM.get('#mobileMenuBtn');
    const nav = MobileDOM.get('#mobileNav');
    const closeBtn = MobileDOM.get('#mobileNavClose');
    const overlay = MobileDOM.get('#mobileNavOverlay');
    
    if (menuBtn) {
      MobileDOM.addListener(menuBtn, 'click', () => this.toggle());
    }
    
    if (closeBtn) {
      MobileDOM.addListener(closeBtn, 'click', () => this.close());
    }
    
    if (overlay) {
      MobileDOM.addListener(overlay, 'click', () => this.close());
    }
    
    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    console.log('Mobile navigation initialized');
  },
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },
  
  open() {
    const nav = MobileDOM.get('#mobileNav');
    const menuBtn = MobileDOM.get('#mobileMenuBtn');
    
    if (nav && menuBtn) {
      MobileDOM.addClass(nav, 'active', true);
      MobileDOM.addClass(menuBtn, 'active');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
    }
  },
  
  close() {
    const nav = MobileDOM.get('#mobileNav');
    const menuBtn = MobileDOM.get('#mobileMenuBtn');
    
    if (nav && menuBtn) {
      MobileDOM.removeClass(nav, 'active', true);
      MobileDOM.removeClass(menuBtn, 'active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  }
};

// Mobile theme handler
const MobileTheme = {
  init() {
    const darkToggle = MobileDOM.get('#darkToggle');
    
    if (darkToggle) {
      MobileDOM.addListener(darkToggle, 'click', () => this.toggle());
      darkToggle.classList.toggle('active', mobileState.dark);
    }
    
    console.log('Mobile theme handler initialized');
  },
  
  toggle() {
    mobileState.dark = !mobileState.dark;
    document.body.classList.toggle('dark', mobileState.dark);
    saveMobileState('dark', mobileState.dark);
    
    const darkToggle = MobileDOM.get('#darkToggle');
    if (darkToggle) {
      darkToggle.classList.toggle('active', mobileState.dark);
    }
    
    MobileUtils.showToast(
      `${mobileState.dark ? 'Dark' : 'Light'} mode activated`,
      'info'
    );
  }
};

// Mobile search handler
const MobileSearch = {
  init() {
    const searchInput = MobileDOM.get('#searchInput');
    
    if (searchInput) {
      MobileDOM.addListener(
        searchInput,
        'input',
        MobileUtils.debounce((e) => this.handleSearch(e.target.value), 300)
      );
    }
    
    console.log('Mobile search handler initialized');
  },
  
  handleSearch(query) {
    console.log('Search query:', query);
    // Implement search functionality based on current page
    
    if (mobileState.currentPage === 'courses') {
      this.searchCourses(query);
    } else if (mobileState.currentPage === 'learner-portal') {
      this.searchDashboard(query);
    }
  },
  
  searchCourses(query) {
    // Filter courses based on query
    const courseCards = MobileDOM.getAll('.mobile-course-card');
    
    courseCards.forEach(card => {
      const title = card.querySelector('.mobile-course-title')?.textContent?.toLowerCase();
      const description = card.querySelector('.mobile-course-description')?.textContent?.toLowerCase();
      
      const matches = title?.includes(query.toLowerCase()) || 
                     description?.includes(query.toLowerCase());
      
      card.style.display = matches || query === '' ? 'block' : 'none';
    });
  },
  
  searchDashboard(query) {
    // Filter dashboard items based on query
    console.log('Searching dashboard for:', query);
  }
};

// Mobile form handler
const MobileForms = {
  init() {
    // Handle all forms in mobile templates
    const forms = MobileDOM.getAll('form');
    
    forms.forEach(form => {
      MobileDOM.addListener(form, 'submit', (e) => this.handleSubmit(e));
    });
    
    // Handle input validation
    const inputs = MobileDOM.getAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      MobileDOM.addListener(input, 'blur', () => this.validateField(input));
    });
    
    console.log('Mobile forms handler initialized');
  },
  
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (this.validateForm(form)) {
      this.submitForm(form);
    }
  },
  
  validateField(field) {
    const isValid = field.checkValidity();
    
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid);
    
    return isValid;
  },
  
  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  },
  
  submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    MobileUtils.showToast('Form submitted successfully!', 'success');
    
    // Handle specific form types
    if (form.id === 'profileForm') {
      this.handleProfileUpdate(data);
    } else if (form.id === 'assessmentForm') {
      this.handleAssessmentSubmit(data);
    }
  },
  
  handleProfileUpdate(data) {
    // Save profile data
    Object.keys(data).forEach(key => {
      localStorage.setItem(key, data[key]);
    });
  },
  
  handleAssessmentSubmit(data) {
    // Process assessment data
    console.log('Assessment data:', data);
  }
};

// Mobile modal handler
const MobileModal = {
  activeModal: null,
  
  init() {
    // Handle modal triggers
    const modalTriggers = MobileDOM.getAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
      MobileDOM.addListener(trigger, 'click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        this.open(modalId);
      });
    });
    
    // Handle modal close buttons
    const closeButtons = MobileDOM.getAll('.mobile-modal-close');
    
    closeButtons.forEach(btn => {
      MobileDOM.addListener(btn, 'click', () => this.close());
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
    
    console.log('Mobile modal handler initialized');
  },
  
  open(modalId) {
    const modal = MobileDOM.get(`#${modalId}`);
    
    if (modal) {
      this.activeModal = modal;
      MobileDOM.addClass(modal, 'active', true);
      document.body.style.overflow = 'hidden';
    }
  },
  
  close() {
    if (this.activeModal) {
      MobileDOM.removeClass(this.activeModal, 'active', true);
      document.body.style.overflow = '';
      
      setTimeout(() => {
        this.activeModal = null;
      }, 300);
    }
  }
};

// Mobile performance optimizer
const MobilePerformance = {
  init() {
    // Lazy load images
    this.lazyLoadImages();
    
    // Optimize animations
    this.optimizeAnimations();
    
    // Handle slow connections
    this.handleSlowConnection();
    
    console.log('Mobile performance optimization initialized');
  },
  
  lazyLoadImages() {
    const images = MobileDOM.getAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  },
  
  optimizeAnimations() {
    // Reduce animations on slow devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduce-animations');
    }
    
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-animations');
    }
  },
  
  handleSlowConnection() {
    // Check for slow connection
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        MobileUtils.showToast('Slow connection detected. Optimizing experience...', 'warning');
      }
    }
  }
};

// Main mobile initialization function
function initializeMobileApp() {
  console.log('🚀 Initializing PMERIT Mobile App...');
  
  // Initialize state
  initMobileState();
  
  // Initialize core modules
  MobileNav.init();
  MobileTheme.init();
  MobileSearch.init();
  MobileForms.init();
  MobileModal.init();
  MobilePerformance.init();
  
  // Page-specific initialization
  initializePageSpecific();
  
  console.log('✅ PMERIT Mobile App initialized successfully');
}

// Initialize page-specific functionality
function initializePageSpecific() {
  const page = mobileState.currentPage;
  
  switch (page) {
    case 'index':
      initializeHomepage();
      break;
    case 'learner-portal':
      initializeLearnerPortal();
      break;
    case 'courses':
      initializeCourses();
      break;
    case 'assessment':
      initializeAssessment();
      break;
    case 'profile':
      initializeProfile();
      break;
    default:
      console.log(`No specific initialization for page: ${page}`);
  }
}

// Page-specific initialization functions
function initializeHomepage() {
  console.log('Initializing homepage...');
  
  // Hero button handlers
  const heroStartBtn = MobileDOM.get('#heroStartBtn');
  const heroAssessBtn = MobileDOM.get('#heroAssessBtn');
  
  if (heroStartBtn) {
    MobileDOM.addListener(heroStartBtn, 'click', () => {
      window.location.href = '/courses.html';
    });
  }
  
  if (heroAssessBtn) {
    MobileDOM.addListener(heroAssessBtn, 'click', () => {
      window.location.href = '/assessment.html';
    });
  }
}

function initializeLearnerPortal() {
  console.log('Initializing learner portal...');
  
  // Quick action handlers
  const quickActions = MobileDOM.getAll('.quick-action-btn');
  
  quickActions.forEach(action => {
    MobileDOM.addListener(action, 'click', (e) => {
      e.preventDefault();
      const href = action.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
}

function initializeCourses() {
  console.log('Initializing courses page...');
  
  // View toggle functionality
  const gridViewBtn = MobileDOM.get('#gridViewBtn');
  const listViewBtn = MobileDOM.get('#listViewBtn');
  const coursesGrid = MobileDOM.get('#coursesGrid');
  
  if (gridViewBtn && listViewBtn && coursesGrid) {
    MobileDOM.addListener(gridViewBtn, 'click', () => {
      MobileDOM.addClass(gridViewBtn, 'active');
      MobileDOM.removeClass(listViewBtn, 'active');
      MobileDOM.removeClass(coursesGrid, 'list-view');
    });
    
    MobileDOM.addListener(listViewBtn, 'click', () => {
      MobileDOM.addClass(listViewBtn, 'active');
      MobileDOM.removeClass(gridViewBtn, 'active');
      MobileDOM.addClass(coursesGrid, 'list-view');
    });
  }
}

function initializeAssessment() {
  console.log('Initializing assessment page...');
  // Assessment-specific functionality is handled in the assessment template
}

function initializeProfile() {
  console.log('Initializing profile page...');
  // Profile-specific functionality is handled in the profile template
}

// Export mobile app functions for global access
window.PMERIT = window.PMERIT || {};
window.PMERIT.Mobile = {
  state: mobileState,
  utils: MobileUtils,
  dom: MobileDOM,
  nav: MobileNav,
  theme: MobileTheme,
  search: MobileSearch,
  forms: MobileForms,
  modal: MobileModal,
  performance: MobilePerformance,
  init: initializeMobileApp
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMobileApp);
} else {
  initializeMobileApp();
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - pausing non-essential tasks');
  } else {
    console.log('Page visible - resuming tasks');
  }
});

console.log('📱 PMERIT Mobile JavaScript Module Loaded');