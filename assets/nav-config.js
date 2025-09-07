/**
 * PMERIT AI Platform - Navigation Configuration
 * Role-based navigation logic and access control
 * Follows Frontend Implementation Strategy.txt - DRY Principle
 * Version: 1.0.0
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
    'reports.html': [USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN]
  };
  
  /**
   * Navigation menu structure with role-based visibility
   */
  const NAVIGATION_MENU = {
    // Quick Actions (always visible in sidebar)
    quickActions: {
      virtualHuman: {
        id: 'vhToggle',
        label: 'Virtual Human Mode',
        icon: 'fas fa-user-astronaut',
        type: 'toggle',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Toggle immersive virtual human interface'
      },
      careerPaths: {
        id: 'careerPaths',
        label: 'Career Track & Explore Paths',
        icon: 'fas fa-compass',
        type: 'action',
        roles: [USER_ROLES.GUEST, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN_TIER_1, USER_ROLES.ADMIN_TIER_2, USER_ROLES.SUPER_ADMIN],
        description: 'Explore career paths aligned with job market data'
      },
      customerService: {
        id: 'supportToggle',
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
        id: 'dashBtn',
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
      this.init();
    }
    
    /**
     * Initialize navigation config
     */
    init() {
      // Load user data from state
      this.updateUserContext();
      
      // Listen for authentication changes
      if (window.PMERIT) {
        window.PMERIT.on('authStateChanged', (event) => {
          this.handleAuthChange(event.detail);
        });
        
        window.PMERIT.on('partialLoaded', (event) => {
          if (event.detail.partialName === 'nav') {
            this.updateNavigationVisibility();
          }
        });
      }
      
      // Update navigation when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        this.updateNavigationVisibility();
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
      // Quick navigation links
      const quickNav = document.getElementById('quickNav');
      if (quickNav) {
        const hasVisibleItems = Object.values(mainNav).some(item => item.visible);
        quickNav.style.display = hasVisibleItems ? 'flex' : 'none';
        quickNav.setAttribute('aria-hidden', !hasVisibleItems);
        
        // Update individual links
        Object.keys(mainNav).forEach(navKey => {
          const nav = mainNav[navKey];
          const element = document.getElementById(nav.id);
          
          if (element) {
            element.style.display = nav.visible ? 'flex' : 'none';
            element.setAttribute('aria-hidden', !nav.visible);
          }
        });
      }
    }
    
    /**
     * Update role-specific navigation
     */
    updateRoleSpecificNavigation(visibleItems) {
      // Instructor navigation
      const instructorItems = visibleItems.instructor || {};
      const hasInstructorItems = Object.keys(instructorItems).length > 0;
      
      // Admin navigation  
      const adminItems = visibleItems.admin || {};
      const hasAdminItems = Object.keys(adminItems).length > 0;
      
      // You can create specific instructor/admin navigation containers
      // and show/hide them based on role
      if (this.currentRole === USER_ROLES.INSTRUCTOR || 
          this.currentRole === USER_ROLES.ADMIN_TIER_1 || 
          this.currentRole === USER_ROLES.ADMIN_TIER_2 ||
          this.currentRole === USER_ROLES.SUPER_ADMIN) {
        // Show advanced features
        this.showAdvancedFeatures();
      } else {
        this.hideAdvancedFeatures();
      }
    }
    
    /**
     * Update dashboard button appearance
     */
    updateDashboardButton() {
      const dashBtn = document.getElementById('dashBtn');
      const mDashBtn = document.getElementById('m_dashBtn');
      
      [dashBtn, mDashBtn].forEach(btn => {
        if (btn) {
          if (this.currentRole === USER_ROLES.GUEST) {
            btn.classList.add('guest');
            btn.innerHTML = '<i class="fas fa-user-plus" aria-hidden="true"></i><span class="dashboard-text">Get Started</span>';
            btn.setAttribute('aria-label', 'Get started with PMERIT');
          } else {
            btn.classList.remove('guest');
            btn.innerHTML = '<i class="fas fa-gauge-high" aria-hidden="true"></i><span class="dashboard-text">Dashboard</span>';
            btn.setAttribute('aria-label', 'Go to your dashboard');
          }
        }
      });
    }
    
    /**
     * Update authentication-specific sections
     */
    updateAuthenticationSections() {
      const isAuthenticated = this.currentRole !== USER_ROLES.GUEST;
      
      // User profile section
      const userProfile = document.getElementById('userProfile');
      if (userProfile) {
        userProfile.style.display = isAuthenticated ? 'flex' : 'none';
        userProfile.setAttribute('aria-hidden', !isAuthenticated);
      }
      
      // Learning progress
      const learningProgress = document.getElementById('learningProgress');
      if (learningProgress) {
        learningProgress.style.display = isAuthenticated ? 'block' : 'none';
        learningProgress.setAttribute('aria-hidden', !isAuthenticated);
      }
      
      // Update user name if available
      const userName = document.getElementById('userName');
      if (userName && this.currentUser) {
        userName.textContent = this.currentUser.name || 'Student';
      }
      
      // Update user status/plan
      const userStatus = document.getElementById('userStatus');
      if (userStatus && this.currentUser) {
        const plan = this.currentUser.plan || 'free';
        userStatus.textContent = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
      }
    }
    
    /**
     * Show advanced features for instructors/admins
     */
    showAdvancedFeatures() {
      // Add any instructor/admin specific UI elements
      // This could include additional buttons, sections, etc.
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
          if (window.PMERIT?.chat) {
            window.PMERIT.chat.addMessage('PMERIT AI', 
              'Access denied. You don\'t have permission to access this page. Please contact your administrator if you believe this is an error.');
          }
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
    navigationConfig.updateNavigationVisibility();
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
  
  console.log('[PMERIT] Navigation configuration loaded');
  
})();
