/**
 * PMERIT AI Platform - Navigation Configuration
 * Role-based navigation logic and access control
 * Follows Frontend Implementation Strategy.txt - DRY Principle
 * Version: 1.1.0 - Enhanced Toggle Integration
 */

(function() {
  'use strict';
  
  // ===== NAVIGATION CONFIGURATION =====
  
  /**
   * User roles and permissions
   */
  const USER_ROLES = {
    GUEST: 'guest',
    STUDENT: 'student', 
    INSTRUCTOR: 'instructor',
    ADMIN_TIER_1: 'admin_tier_1',    // Strategic admin
    ADMIN_TIER_2: 'admin_tier_2',    // Operational admin
    SUPER_ADMIN: 'super_admin'
  };
  
  /**
   * Page access permissions
   */
  const PAGE_PERMISSIONS = {
    // Public pages (accessible to all)
    'index.html': [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'about.html': [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'pricing.html': [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'support.html': [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'signin.html': [USER_ROLES.GUEST],
    'signup.html': [USER_ROLES.GUEST],
    
    // Assessment (guest can take, but results saved only when authenticated)
    'assessment.html': [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    
    // Student/authenticated user pages
    'dashboard.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'courses.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'classroom.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'career.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'library.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'profile.html': [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    
    // Instructor pages
    'instructor.html': [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'create-course.html': [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'manage-students.html': [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    
    // Admin pages
    'admin.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'user-management.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.SUPER_ADMIN],
    'system-config.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.SUPER_ADMIN],
    'content-moderation.html': [USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'analytics.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'reports.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'ai-police.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
    'incident-response.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
  };
  
  /**
   * Navigation menu structure with role-based visibility
   * Updated IDs to match actual nav.html elements
   */
  const NAVIGATION_MENU = {
    // Quick Actions (always visible in sidebar)
    quickActions: {
      virtualHuman: {
        id: 'vhModeSwitch',           // Updated to match nav.html
        label: 'Virtual Human Mode',
        icon: 'fas fa-user-astronaut',
        type: 'toggle',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Toggle immersive virtual human interface'
      },
      careerPaths: {
        id: 'careerTracksBtn',        // Updated to match nav.html
        label: 'Career Track & Explore Paths',
        icon: 'fas fa-compass',
        type: 'action',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Explore career paths aligned with job market data'
      },
      customerService: {
        id: 'customerServiceSwitch',  // Updated to match nav.html
        label: 'Customer Service Mode',
        icon: 'fas fa-headset',
        type: 'toggle',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Switch AI to customer service support mode'
      }
    },
    
    // Main navigation items
    main: {
      dashboard: {
        id: 'dashboardBtn',           // Updated to match nav.html
        label: 'Dashboard',
        icon: 'fas fa-gauge-high',
        url: '/dashboard.html',
        type: 'button',
        roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        guestLabel: 'Get Started',
        guestIcon: 'fas fa-user-plus',
        description: 'Access your personalized learning dashboard'
      },
      courses: {
        id: 'coursesLink',
        label: 'My Courses',
        icon: 'fas fa-book-open',
        url: '/courses.html',
        type: 'link',
        roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'View and manage your enrolled courses'
      },
      library: {
        id: 'libraryLink',
        label: 'Library',
        icon: 'fas fa-library',
        url: '/library.html',
        type: 'link',
        roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Access educational resources and documentation'
      },
      career: {
        id: 'careerLink',
        label: 'Career Center',
        icon: 'fas fa-briefcase',
        url: '/career.html',
        type: 'link',
        roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Explore career opportunities and job market data'
      }
    },
    
    // Settings items
    settings: {
      darkMode: {
        id: 'darkModeSwitch',         // Added settings toggles
        label: 'Dark Mode',
        icon: 'fas fa-moon',
        type: 'toggle',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Toggle dark mode theme'
      },
      textToSpeech: {
        id: 'ttsSwitch',              // Added TTS toggle
        label: 'Text-to-Speech',
        icon: 'fas fa-volume-up',
        type: 'toggle',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Enable text-to-speech functionality'
      },
      previewVoices: {
        id: 'previewVoicesBtn',       // Added preview voices
        label: 'Preview Voices',
        icon: 'fas fa-play-circle',
        type: 'action',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Preview available voice options'
      }
    },
    
    // Instructor-specific navigation
    instructor: {
      createCourse: {
        id: 'createCourseLink',
        label: 'Create Course',
        icon: 'fas fa-plus-circle',
        url: '/create-course.html',
        type: 'link',
        roles: [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Create new educational content'
      },
      manageStudents: {
        id: 'manageStudentsLink',
        label: 'Manage Students',
        icon: 'fas fa-users',
        url: '/manage-students.html',
        type: 'link',
        roles: [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'View and manage student progress'
      }
    },
    
    // Admin-specific navigation
    admin: {
      adminPanel: {
        id: 'adminLink',
        label: 'Admin Panel',
        icon: 'fas fa-cog',
        url: '/admin.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Administrative controls and settings'
      },
      userManagement: {
        id: 'userManagementLink',
        label: 'User Management',
        icon: 'fas fa-users-cog',
        url: '/user-management.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.SUPER_ADMIN],
        description: 'Manage platform users and permissions'
      },
      contentModeration: {
        id: 'contentModerationLink',
        label: 'Content Moderation',
        icon: 'fas fa-shield-alt',
        url: '/content-moderation.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Review and moderate platform content'
      },
      analytics: {
        id: 'analyticsLink',
        label: 'Analytics',
        icon: 'fas fa-chart-bar',
        url: '/analytics.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'View platform usage and performance metrics'
      },
      aiPolice: {
        id: 'aiPoliceLink',
        label: 'AI Police',
        icon: 'fas fa-shield-virus',
        url: '/ai-police.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Security monitoring and AI police dashboard'
      },
      incidentResponse: {
        id: 'incidentResponseLink',
        label: 'Incident Response',
        icon: 'fas fa-exclamation-triangle',
        url: '/incident-response.html',
        type: 'link',
        roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Security incident timeline and response'
      }
    }
  };
  
  /**
   * Feature flags and access control
   */
  const FEATURE_FLAGS = {
    // Core features
    assessment: {
      enabled: true,
      guestAccess: true,
      roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    virtualHuman: {
      enabled: true,
      guestAccess: true,
      roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    aiChat: {
      enabled: true,
      guestAccess: true,
      roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    careerTracks: {
      enabled: true,
      guestAccess: true,
      roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    customerService: {
      enabled: true,
      guestAccess: true,
      roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    
    // Premium features
    advancedAI: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
      requiresPremium: true
    },
    personalizedPaths: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    mentorSessions: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
      requiresPremium: true
    },
    
    // Instructor features
    courseCreation: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    studentManagement: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    
    // Admin features
    userManagement: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.SUPER_ADMIN]
    },
    systemConfig: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.SUPER_ADMIN]
    },
    contentModeration: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    analytics: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    },
    aiPolice: {
      enabled: true,
      guestAccess: false,
      roles: [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
    }
  };
  
  // ===== NAVIGATION CONTROL SYSTEM =====
  
  /**
   * Navigation configuration class
   */
  class NavigationConfig {
    constructor() {
      this.currentUser = null;
      this.currentRole = USER_ROLES.GUEST;
      this.currentPage = this.getCurrentPage();
      this.toggleStates = {};
      this.init();
    }
    
    /**
     * Initialize navigation config
     */
    init() {
      // Load user data from state
      this.updateUserContext();
      
      // Initialize toggle functionality
      this.initializeToggles();
      
      // Listen for authentication changes
      if (window.PMERIT) {
        window.PMERIT.on('authStateChanged', (event) => {
          this.handleAuthChange(event.detail);
        });
        
        window.PMERIT.on('partialLoaded', (event) => {
          if (event.detail.partialName === 'nav') {
            this.updateNavigationVisibility();
            this.initializeToggles();
          }
        });
      }
      
      // Update navigation when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        this.updateNavigationVisibility();
        this.initializeToggles();
      });
      
      // Listen for PMERIT initialization
      window.addEventListener('pmerit:initialized', () => {
        setTimeout(() => {
          this.updateNavigationVisibility();
          this.initializeToggles();
        }, 200);
      });
    }
    
    /**
     * Initialize toggle functionality
     */
    initializeToggles() {
      console.log('[PMERIT] Navigation Config: Initializing toggles...');
      
      // Settings toggle
      this.initSettingsToggle();
      
      // Switch toggles
      this.initSwitchToggles();
      
      // Action buttons
      this.initActionButtons();
      
      // Dashboard button
      this.initDashboardButton();
      
      // Load saved states
      this.loadSavedToggleStates();
      
      console.log('[PMERIT] Navigation Config: Toggles initialized');
    }
    
    /**
     * Initialize settings collapsible toggle
     */
    initSettingsToggle() {
      const settingsToggle = document.getElementById('settingsToggle');
      const settingsContent = document.getElementById('settingsContent');
      
      if (settingsToggle && settingsContent) {
        // Remove existing listeners
        settingsToggle.replaceWith(settingsToggle.cloneNode(true));
        const newSettingsToggle = document.getElementById('settingsToggle');
        
        newSettingsToggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          const isExpanded = newSettingsToggle.getAttribute('aria-expanded') === 'true';
          
          newSettingsToggle.setAttribute('aria-expanded', !isExpanded);
          settingsContent.style.display = isExpanded ? 'none' : 'block';
          
          const toggleIcon = newSettingsToggle.querySelector('.toggle-icon');
          if (toggleIcon) {
            toggleIcon.classList.toggle('rotated', !isExpanded);
          }
          
          console.log(`[PMERIT] Settings: ${!isExpanded ? 'expanded' : 'collapsed'}`);
        });
      }
    }
    
    /**
     * Initialize switch toggles
     */
    initSwitchToggles() {
      const switches = document.querySelectorAll('.switch');
      
      switches.forEach(switchEl => {
        // Remove existing listeners by cloning
        const newSwitch = switchEl.cloneNode(true);
        switchEl.parentNode.replaceChild(newSwitch, switchEl);
        
        newSwitch.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          const isActive = newSwitch.classList.contains('active');
          newSwitch.classList.toggle('active');
          newSwitch.setAttribute('aria-checked', !isActive);
          
          // Handle specific toggle actions
          this.handleToggleAction(newSwitch.id, !isActive);
          
          // Save state
          this.toggleStates[newSwitch.id] = !isActive;
          localStorage.setItem(`pmerit_${newSwitch.id}`, !isActive);
          
          console.log(`[PMERIT] Toggle ${newSwitch.id}: ${!isActive}`);
        });
      });
    }
    
    /**
     * Handle specific toggle actions
     */
    handleToggleAction(toggleId, isActive) {
      switch (toggleId) {
        case 'vhModeSwitch':
          this.toggleVirtualHuman(isActive);
          break;
        case 'customerServiceSwitch':
          this.toggleCustomerService(isActive);
          break;
        case 'darkModeSwitch':
          this.toggleDarkMode(isActive);
          break;
        case 'ttsSwitch':
          this.toggleTTS(isActive);
          break;
      }
    }
    
    /**
     * Toggle Virtual Human Mode
     */
    toggleVirtualHuman(active) {
      const badge = document.getElementById('virtualHumanBadge');
      const interface = document.getElementById('virtualHumanInterface');
      const chatArea = document.querySelector('.chat-container') || document.querySelector('#chat-container');
      
      if (active) {
        if (badge) badge.style.display = 'flex';
        if (interface) interface.style.display = 'block';
        if (chatArea) chatArea.style.display = 'none';
        
        console.log('[PMERIT] Virtual Human Mode activated');
      } else {
        if (badge) badge.style.display = 'none';
        if (interface) interface.style.display = 'none';
        if (chatArea) chatArea.style.display = 'block';
        
        console.log('[PMERIT] Virtual Human Mode deactivated');
      }
    }
    
    /**
     * Toggle Customer Service Mode
     */
    toggleCustomerService(active) {
      const badge = document.getElementById('supportAssistantBadge');
      const aiGreeting = document.querySelector('.ai-message') || document.querySelector('.chat-message');
      
      if (active) {
        if (badge) badge.style.display = 'flex';
        if (aiGreeting) {
          aiGreeting.textContent = 'Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?';
        }
        
        console.log('[PMERIT] Customer Service Mode activated');
      } else {
        if (badge) badge.style.display = 'none';
        if (aiGreeting) {
          aiGreeting.textContent = 'Welcome to PMERIT! I\'m here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?';
        }
        
        console.log('[PMERIT] Customer Service Mode deactivated');
      }
    }
    
    /**
     * Toggle Dark Mode
     */
    toggleDarkMode(active) {
      document.body.classList.toggle('dark-mode', active);
      console.log(`[PMERIT] Dark Mode: ${active ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Toggle Text-to-Speech
     */
    toggleTTS(active) {
      // TTS functionality would be implemented here
      console.log(`[PMERIT] Text-to-Speech: ${active ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Initialize action buttons
     */
    initActionButtons() {
      // Career tracks button
      const careerBtn = document.getElementById('careerTracksBtn');
      const overlay = document.getElementById('careerTracksOverlay');
      const closeBtn = document.getElementById('closeCareerTracks');
      
      if (careerBtn) {
        careerBtn.replaceWith(careerBtn.cloneNode(true));
        const newCareerBtn = document.getElementById('careerTracksBtn');
        
        newCareerBtn.addEventListener('click', (event) => {
          event.preventDefault();
          if (overlay) {
            overlay.style.display = 'flex';
            console.log('[PMERIT] Career tracks overlay opened');
          }
        });
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
          event.preventDefault();
          if (overlay) {
            overlay.style.display = 'none';
            console.log('[PMERIT] Career tracks overlay closed');
          }
        });
      }
      
      if (overlay) {
        overlay.addEventListener('click', (event) => {
          if (event.target === overlay) {
            overlay.style.display = 'none';
            console.log('[PMERIT] Career tracks overlay closed (backdrop)');
          }
        });
      }
      
      // Preview voices button
      const previewVoicesBtn = document.getElementById('previewVoicesBtn');
      if (previewVoicesBtn) {
        previewVoicesBtn.addEventListener('click', (event) => {
          event.preventDefault();
          console.log('[PMERIT] Preview voices clicked');
          // Voice preview functionality would be implemented here
        });
      }
    }
    
    /**
     * Initialize dashboard button
     */
    initDashboardButton() {
      const dashboardBtn = document.getElementById('dashboardBtn');
      
      if (dashboardBtn) {
        dashboardBtn.replaceWith(dashboardBtn.cloneNode(true));
        const newDashboardBtn = document.getElementById('dashboardBtn');
        
        newDashboardBtn.addEventListener('click', (event) => {
          event.preventDefault();
          
          const isAuthenticated = localStorage.getItem('pmerit_authenticated') === 'true';
          
          if (isAuthenticated) {
            // Navigate to dashboard
            this.navigateToPage('dashboard.html');
          } else {
            // Show sign-up prompt for guest users
            this.showSignUpPrompt();
          }
        });
      }
    }
    
    /**
     * Show sign-up prompt
     */
    showSignUpPrompt() {
      const message = 'Please sign up to access your personalized dashboard with courses, career center, and learning progress.';
      
      // Try to use existing modal system first
      if (window.PMERIT && window.PMERIT.auth && window.PMERIT.auth.showSignUp) {
        window.PMERIT.auth.showSignUp();
      } else {
        // Fallback to alert and redirect
        alert(message);
        window.location.href = '/signup.html';
      }
    }
    
    /**
     * Load saved toggle states
     */
    loadSavedToggleStates() {
      const switches = document.querySelectorAll('.switch');
      
      switches.forEach(switchEl => {
        const savedState = localStorage.getItem(`pmerit_${switchEl.id}`);
        if (savedState === 'true') {
          switchEl.classList.add('active');
          switchEl.setAttribute('aria-checked', 'true');
          this.toggleStates[switchEl.id] = true;
          
          // Apply the saved state
          this.handleToggleAction(switchEl.id, true);
        }
      });
    }
    
    /**
     * Get current page name
     */
    getCurrentPage() {
      const path = window.location.pathname;
      const page = path.split('/').pop() || 'index.html';
      return page.includes('.html') ? page : 'index.html';
    }
    
    /**
     * Update user context from state
     */
    updateUserContext() {
      if (window.PMERIT?.state) {
        const isAuth = window.PMERIT.state.get('pmerit_auth', false);
        const userData = window.PMERIT.state.get('pmerit_user', null);
        
        if (isAuth && userData) {
          this.currentUser = userData;
          this.currentRole = userData.role || USER_ROLES.STUDENT;
        } else {
          this.currentUser = null;
          this.currentRole = USER_ROLES.GUEST;
        }
      }
    }
    
    /**
     * Handle authentication state changes
     */
    handleAuthChange(authDetail) {
      if (authDetail.authenticated && authDetail.user) {
        this.currentUser = authDetail.user;
        this.currentRole = authDetail.user.role || USER_ROLES.STUDENT;
      } else {
        this.currentUser = null;
        this.currentRole = USER_ROLES.GUEST;
      }
      
      // Update navigation visibility
      setTimeout(() => this.updateNavigationVisibility(), 100);
    }
    
    /**
     * Check if user has access to a page
     */
    hasPageAccess(page, role = this.currentRole) {
      const permissions = PAGE_PERMISSIONS[page];
      return permissions ? permissions.includes(role) : false;
    }
    
    /**
     * Check if user has access to a feature
     */
    hasFeatureAccess(feature, role = this.currentRole) {
      const featureConfig = FEATURE_FLAGS[feature];
      if (!featureConfig || !featureConfig.enabled) {
        return false;
      }
      
      // Check if guest access is allowed
      if (role === USER_ROLES.GUEST && !featureConfig.guestAccess) {
        return false;
      }
      
      // Check role permissions
      if (!featureConfig.roles.includes(role)) {
        return false;
      }
      
      // Check premium requirements
      if (featureConfig.requiresPremium && this.currentUser) {
        const userPlan = this.currentUser.plan || 'free';
        return userPlan !== 'free';
      }
      
      return true;
    }
    
    /**
     * Get visible navigation items for current user
     */
    getVisibleNavigationItems() {
      const visibleItems = {};
      
      Object.keys(NAVIGATION_MENU).forEach(section => {
        visibleItems[section] = {};
        
        Object.keys(NAVIGATION_MENU[section]).forEach(itemKey => {
          const item = NAVIGATION_MENU[section][itemKey];
          
          if (item.roles.includes(this.currentRole)) {
            visibleItems[section][itemKey] = {
              ...item,
              visible: true
            };
          }
        });
      });
      
      return visibleItems;
    }
    
    /**
     * Update navigation visibility based on current user
     */
    updateNavigationVisibility() {
      const visibleItems = this.getVisibleNavigationItems();
      
      // Update quick actions
      this.updateQuickActions(visibleItems.quickActions);
      
      // Update main navigation
      this.updateMainNavigation(visibleItems.main);
      
      // Update role-specific navigation
      this.updateRoleSpecificNavigation(visibleItems);
      
      // Update dashboard button
      this.updateDashboardButton();
      
      // Hide/show sections based on authentication
      this.updateAuthenticationSections();
    }
    
    /**
     * Update quick actions visibility
     */
    updateQuickActions(quickActions) {
      Object.keys(quickActions).forEach(actionKey => {
        const action = quickActions[actionKey];
        const element = document.getElementById(action.id);
        
        if (element) {
          element.style.display = action.visible ? 'flex' : 'none';
          element.setAttribute('aria-hidden', !action.visible);
        }
      });
    }
    
    /**
     * Update main navigation visibility
     */
    updateMainNavigation(mainNav) {
      // Update individual navigation elements
      Object.keys(mainNav).forEach(navKey => {
        const nav = mainNav[navKey];
        const element = document.getElementById(nav.id);
        
        if (element) {
          element.style.display = nav.visible ? 'flex' : 'none';
          element.setAttribute('aria-hidden', !nav.visible);
        }
      });
    }
    
    /**
     * Update role-specific navigation
     */
    updateRoleSpecificNavigation(visibleItems) {
      // Instructor navigation
      const instructorItems = visibleItems.instructor || {};
      
      // Admin navigation  
      const adminItems = visibleItems.admin || {};
      
      // Update visibility based on role
      if (this.currentRole === USER_ROLES.INSTRUCTOR || 
          this.currentRole === USER_ROLES.ADMIN_TIER_1 || 
          this.currentRole === USER_ROLES.ADMIN_TIER_2 ||
          this.currentRole === USER_ROLES.SUPER_ADMIN) {
        this.showAdvancedFeatures();
      } else {
        this.hideAdvancedFeatures();
      }
    }
    
    /**
     * Update dashboard button appearance
     */
    updateDashboardButton() {
      const dashBtn = document.getElementById('dashboardBtn');
      
      if (dashBtn) {
        if (this.currentRole === USER_ROLES.GUEST) {
          dashBtn.innerHTML = '<i class="fas fa-user-plus" aria-hidden="true"></i> Get Started';
          dashBtn.setAttribute('aria-label', 'Get started with PMERIT');
        } else {
          dashBtn.innerHTML = '<i class="fas fa-gauge-high" aria-hidden="true"></i> Dashboard';
          dashBtn.setAttribute('aria-label', 'Go to your dashboard');
        }
      }
    }
    
    /**
     * Update authentication-specific sections
     */
    updateAuthenticationSections() {
      const isAuthenticated = this.currentRole !== USER_ROLES.GUEST;
      
      // Update role-based visibility classes
      document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = isAuthenticated ? 'none' : 'block';
      });
      
      document.querySelectorAll('.authenticated-only').forEach(el => {
        el.style.display = isAuthenticated ? 'block' : 'none';
      });
    }
    
    /**
     * Show advanced features for instructors/admins
     */
    showAdvancedFeatures() {
      // Add any instructor/admin specific UI elements
    }
    
    /**
     * Hide advanced features for regular users
     */
    hideAdvancedFeatures() {
      // Hide instructor/admin specific UI elements
    }
    
    /**
     * Navigate to page with access control
     */
    navigateToPage(page) {
      if (this.hasPageAccess(page)) {
        window.location.href = `/${page}`;
      } else {
        // Redirect to appropriate page based on role
        if (this.currentRole === USER_ROLES.GUEST) {
          // Show sign in modal or redirect to sign in
          if (window.PMERIT?.emit) {
            window.PMERIT.emit('showSignIn');
          } else {
            window.location.href = '/signin.html';
          }
        } else {
          // Show access denied message
          console.warn(`[PMERIT] Access denied to ${page} for role ${this.currentRole}`);
        }
      }
    }
    
    /**
     * Get user role display name
     */
    getRoleDisplayName(role = this.currentRole) {
      const roleNames = {
        [USER_ROLES.GUEST]: 'Guest',
        [USER_ROLES.STUDENT]: 'Student',
        [USER_ROLES.INSTRUCTOR]: 'Instructor',
        [USER_ROLES.ADMIN_TIER_1]: 'Admin',
        [USER_ROLES.ADMIN_TIER_2]: 'Moderator',
        [USER_ROLES.SUPER_ADMIN]: 'Super Admin'
      };
      
      return roleNames[role] || 'Unknown';
    }
  }
  
  // ===== GLOBAL EXPORT =====
  
  // Initialize navigation config
  const navigationConfig = new NavigationConfig();
  
  // Export to global scope
  window.PMERIT = window.PMERIT || {};
  window.PMERIT.navigation = window.PMERIT.navigation || {};
  
  // Add navigation config to global PMERIT object
  Object.assign(window.PMERIT.navigation, {
    config: navigationConfig,
    roles: USER_ROLES,
    permissions: PAGE_PERMISSIONS,
    menu: NAVIGATION_MENU,
    features: FEATURE_FLAGS,
    
    // Utility methods
    hasPageAccess: (page, role) => navigationConfig.hasPageAccess(page, role),
    hasFeatureAccess: (feature, role) => navigationConfig.hasFeatureAccess(feature, role),
    navigateTo: (page) => navigationConfig.navigateToPage(page),
    getCurrentRole: () => navigationConfig.currentRole,
    getCurrentUser: () => navigationConfig.currentUser,
    updateNavigation: () => navigationConfig.updateNavigationVisibility(),
    
    // Toggle methods
    toggleVirtualHuman: (active) => navigationConfig.toggleVirtualHuman(active),
    toggleCustomerService: (active) => navigationConfig.toggleCustomerService(active),
    toggleDarkMode: (active) => navigationConfig.toggleDarkMode(active),
    toggleTTS: (active) => navigationConfig.toggleTTS(active),
    
    // Role management
    setUserRole: (role) => {
      navigationConfig.currentRole = role;
      navigationConfig.updateNavigationVisibility();
    },
    
    // Feature flag checking
    isFeatureEnabled: (feature) => {
      const featureConfig = FEATURE_FLAGS[feature];
      return featureConfig && featureConfig.enabled;
    }
  });
  
  // Auto-update navigation when page loads
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      navigationConfig.updateNavigationVisibility();
      navigationConfig.initializeToggles();
    }, 300);
  });
  
  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      NavigationConfig,
      USER_ROLES,
      PAGE_PERMISSIONS,
      NAVIGATION_MENU,
      FEATURE_FLAGS
    };
  }
  
  console.log('[PMERIT] Navigation configuration loaded with toggle integration');
  
})();
