/**
 * PMERIT Platform - Navigation Configuration
 * Role-based Navigation & Access Control
 * ================================================
 * Version: 3.0.0
 * Purpose: Define navigation structure and access rules
 */

(function() {
  'use strict';
  
  // Navigation Configuration
  const NAV_CONFIG = {
    // Main navigation structure
    navigation: {
      primary: [
        {
          id: 'home',
          label: 'Home',
          icon: '🏠',
          url: '/index.html',
          access: ['public'],
          description: 'Platform homepage with AI chat and assessment'
        },
        {
          id: 'assessment',
          label: 'Assessment',
          icon: '🧠',
          url: '/assessment.html',
          access: ['public'],
          description: 'Personality and skills assessment'
        },
        {
          id: 'courses',
          label: 'Courses',
          icon: '📚',
          url: '/courses.html',
          access: ['public'],
          description: 'Course catalog and enrollment'
        },
        {
          id: 'career',
          label: 'Career Paths',
          icon: '🎯',
          url: '/career.html',
          access: ['public'],
          description: 'Explore career opportunities and job market data'
        },
        {
          id: 'library',
          label: 'Library',
          icon: '📖',
          url: '/library.html',
          access: ['public'],
          description: 'Educational resources and documentation'
        }
      ],
      
      authenticated: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: '📊',
          url: '/dashboard.html',
          access: ['student', 'instructor', 'admin'],
          description: 'Personal learning dashboard'
        },
        {
          id: 'my-courses',
          label: 'My Courses',
          icon: '🎓',
          url: '/courses.html?filter=enrolled',
          access: ['student', 'instructor'],
          description: 'Enrolled courses and progress'
        },
        {
          id: 'classroom',
          label: 'Classroom',
          icon: '🏫',
          url: '/classroom.html',
          access: ['student', 'instructor'],
          description: 'Interactive learning environment'
        },
        {
          id: 'progress',
          label: 'Progress',
          icon: '📈',
          url: '/dashboard.html#progress',
          access: ['student'],
          description: 'Learning progress and achievements'
        }
      ],
      
      admin: [
        {
          id: 'admin-panel',
          label: 'Admin Panel',
          icon: '⚙️',
          url: '/admin.html',
          access: ['admin'],
          description: 'Platform administration'
        },
        {
          id: 'content-management',
          label: 'Content',
          icon: '📝',
          url: '/admin.html#content',
          access: ['admin', 'instructor'],
          description: 'Manage courses and content'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: '📊',
          url: '/admin.html#analytics',
          access: ['admin'],
          description: 'Platform analytics and insights'
        },
        {
          id: 'ai-police',
          label: 'AI Police',
          icon: '🛡️',
          url: '/ai-police.html',
          access: ['admin'],
          description: 'AI monitoring and security'
        },
        {
          id: 'incident-response',
          label: 'Incidents',
          icon: '🚨',
          url: '/incident-response.html',
          access: ['admin'],
          description: 'Security incident management'
        }
      ],
      
      support: [
        {
          id: 'support',
          label: 'Support',
          icon: '❓',
          url: '/support.html',
          access: ['public'],
          description: 'Help center and support'
        },
        {
          id: 'about',
          label: 'About',
          icon: 'ℹ️',
          url: '/about.html',
          access: ['public'],
          description: 'About PMERIT platform'
        }
      ]
    },
    
    // User roles and their hierarchy
    roles: {
      guest: {
        level: 0,
        permissions: ['view_public']
      },
      student: {
        level: 1,
        permissions: ['view_public', 'access_courses', 'track_progress', 'take_assessments']
      },
      instructor: {
        level: 2,
        permissions: ['view_public', 'access_courses', 'track_progress', 'take_assessments', 'create_content', 'manage_students']
      },
      admin: {
        level: 3,
        permissions: ['all']
      }
    },
    
    // Page metadata and configuration
    pages: {
      'home': {
        title: 'PMERIT - Empowering Learning Through Innovation',
        description: 'Accessible, high-quality education for global opportunities',
        keywords: 'education, learning, AI tutoring, career development',
        requiresAuth: false,
        layout: 'home'
      },
      'assessment': {
        title: 'Assessment - PMERIT',
        description: 'Discover your learning style and career path',
        keywords: 'personality assessment, skills evaluation, career guidance',
        requiresAuth: false,
        layout: 'standard'
      },
      'courses': {
        title: 'Courses - PMERIT',
        description: 'Explore our comprehensive course catalog',
        keywords: 'courses, education, learning paths, skills training',
        requiresAuth: false,
        layout: 'standard'
      },
      'career': {
        title: 'Career Paths - PMERIT',
        description: 'Explore career opportunities and job market insights',
        keywords: 'careers, jobs, employment, market data',
        requiresAuth: false,
        layout: 'standard'
      },
      'dashboard': {
        title: 'Dashboard - PMERIT',
        description: 'Your personalized learning dashboard',
        keywords: 'dashboard, progress, learning, personal',
        requiresAuth: true,
        layout: 'authenticated'
      },
      'classroom': {
        title: 'Classroom - PMERIT',
        description: 'Interactive learning environment',
        keywords: 'classroom, learning, interactive, AI tutor',
        requiresAuth: true,
        layout: 'immersive'
      },
      'admin': {
        title: 'Admin Panel - PMERIT',
        description: 'Platform administration and management',
        keywords: 'admin, management, analytics, content',
        requiresAuth: true,
        requiredRole: 'admin',
        layout: 'admin'
      },
      'ai-police': {
        title: 'AI Police - PMERIT',
        description: 'AI monitoring and security dashboard',
        keywords: 'security, monitoring, AI, alerts',
        requiresAuth: true,
        requiredRole: 'admin',
        layout: 'admin'
      }
    },
    
    // Mobile navigation configuration
    mobile: {
      maxPrimaryItems: 4,
      collapseThreshold: 768,
      showIcons: true,
      showLabels: false
    },
    
    // Breadcrumb configuration
    breadcrumbs: {
      enabled: true,
      maxDepth: 4,
      showHome: true,
      separator: '›'
    }
  };
  
  // Navigation Manager Class
  class NavigationManager {
    constructor(config) {
      this.config = config;
      this.currentUser = null;
      this.currentPage = null;
      this.activeNavItems = [];
      
      this.init();
    }
    
    /**
     * Initialize navigation manager
     */
    init() {
      this.bindEvents();
      this.updateNavigation();
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
      // Listen for authentication changes
      window.PMERIT.events.addEventListener('auth:stateChanged', (event) => {
        this.handleAuthChange(event.detail);
      });
      
      // Listen for page changes
      window.PMERIT.events.addEventListener('page:changed', (event) => {
        this.handlePageChange(event.detail.page);
      });
      
      // Listen for navigation clicks
      document.addEventListener('click', (event) => {
        if (event.target.matches('[data-nav-item]')) {
          this.handleNavClick(event);
        }
      });
    }
    
    /**
     * Handle authentication state changes
     */
    handleAuthChange({ isAuthenticated, userRole }) {
      this.currentUser = {
        authenticated: isAuthenticated,
        role: userRole || 'guest'
      };
      
      this.updateNavigation();
      this.updatePageAccess();
    }
    
    /**
     * Handle page changes
     */
    handlePageChange(page) {
      this.currentPage = page;
      this.updateActiveNavigation();
      this.updatePageMetadata();
    }
    
    /**
     * Handle navigation clicks
     */
    handleNavClick(event) {
      const navItem = event.target.closest('[data-nav-item]');
      const itemId = navItem.getAttribute('data-nav-item');
      const item = this.findNavItem(itemId);
      
      if (!item) return;
      
      // Check access permissions
      if (!this.hasAccess(item.access)) {
        event.preventDefault();
        this.showAccessDenied(item);
        return;
      }
      
      // Track navigation
      this.trackNavigation(item);
    }
    
    /**
     * Update navigation based on current user and page
     */
    updateNavigation() {
      this.updatePrimaryNavigation();
      this.updateAuthenticatedNavigation();
      this.updateAdminNavigation();
      this.updateMobileNavigation();
      this.updateActiveNavigation();
    }
    
    /**
     * Update primary navigation
     */
    updatePrimaryNavigation() {
      const navContainer = document.getElementById('navPrimary');
      if (!navContainer) return;
      
      const items = this.config.navigation.primary.filter(item => 
        this.hasAccess(item.access)
      );
      
      this.renderNavItems(navContainer, items);
    }
    
    /**
     * Update authenticated navigation
     */
    updateAuthenticatedNavigation() {
      const navContainer = document.getElementById('navAuthenticated');
      if (!navContainer) return;
      
      const isAuthenticated = this.currentUser?.authenticated;
      
      if (isAuthenticated) {
        const items = this.config.navigation.authenticated.filter(item => 
          this.hasAccess(item.access)
        );
        
        this.renderNavItems(navContainer, items);
        navContainer.style.display = 'flex';
      } else {
        navContainer.style.display = 'none';
      }
    }
    
    /**
     * Update admin navigation
     */
    updateAdminNavigation() {
      const navContainer = document.getElementById('navAdmin');
      if (!navContainer) return;
      
      const userRole = this.currentUser?.role;
      const isAdmin = userRole === 'admin' || userRole === 'instructor';
      
      if (isAdmin) {
        const items = this.config.navigation.admin.filter(item => 
          this.hasAccess(item.access)
        );
        
        this.renderNavItems(navContainer, items);
        navContainer.style.display = 'flex';
      } else {
        navContainer.style.display = 'none';
      }
    }
    
    /**
     * Update mobile navigation
     */
    updateMobileNavigation() {
      const mobileContainer = document.getElementById('mobileNavMenu');
      if (!mobileContainer) return;
      
      // Combine all accessible navigation items
      const allItems = [
        ...this.config.navigation.primary,
        ...this.config.navigation.authenticated,
        ...this.config.navigation.admin,
        ...this.config.navigation.support
      ].filter(item => this.hasAccess(item.access));
      
      this.renderMobileNavItems(mobileContainer, allItems);
    }
    
    /**
     * Render navigation items
     */
    renderNavItems(container, items) {
      container.innerHTML = items.map(item => `
        <li class="nav-item" data-access="${item.access.join(',')}" data-nav-item="${item.id}">
          <a href="${item.url}" class="nav-link" data-page="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-text">${item.label}</span>
          </a>
        </li>
      `).join('');
    }
    
    /**
     * Render mobile navigation items
     */
    renderMobileNavItems(container, items) {
      container.innerHTML = items.map(item => `
        <a href="${item.url}" class="mobile-nav-link" data-nav-item="${item.id}">
          <span class="mobile-nav-icon">${item.icon}</span>
          <span class="mobile-nav-text">${item.label}</span>
          <span class="mobile-nav-description">${item.description}</span>
        </a>
      `).join('');
    }
    
    /**
     * Update active navigation highlighting
     */
    updateActiveNavigation() {
      // Remove active class from all nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to current page
      const currentPageLinks = document.querySelectorAll(`[data-page="${this.currentPage}"]`);
      currentPageLinks.forEach(link => {
        link.classList.add('active');
      });
    }
    
    /**
     * Update page metadata
     */
    updatePageMetadata() {
      const pageConfig = this.config.pages[this.currentPage];
      if (!pageConfig) return;
      
      // Update document title
      document.title = pageConfig.title;
      
      // Update meta description
      this.updateMetaTag('description', pageConfig.description);
      
      // Update meta keywords
      this.updateMetaTag('keywords', pageConfig.keywords);
    }
    
    /**
     * Update meta tag content
     */
    updateMetaTag(name, content) {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    }
    
    /**
     * Check if user has access to navigation item
     */
    hasAccess(requiredAccess) {
      if (!requiredAccess || requiredAccess.includes('public')) {
        return true;
      }
      
      const userRole = this.currentUser?.role || 'guest';
      return requiredAccess.includes(userRole);
    }
    
    /**
     * Update page access based on current user
     */
    updatePageAccess() {
      const pageConfig = this.config.pages[this.currentPage];
      if (!pageConfig) return;
      
      // Check if page requires authentication
      if (pageConfig.requiresAuth && !this.currentUser?.authenticated) {
        this.redirectToLogin();
        return;
      }
      
      // Check if page requires specific role
      if (pageConfig.requiredRole && this.currentUser?.role !== pageConfig.requiredRole) {
        this.showAccessDenied();
        return;
      }
    }
    
    /**
     * Find navigation item by ID
     */
    findNavItem(itemId) {
      const allItems = [
        ...this.config.navigation.primary,
        ...this.config.navigation.authenticated,
        ...this.config.navigation.admin,
        ...this.config.navigation.support
      ];
      
      return allItems.find(item => item.id === itemId);
    }
    
    /**
     * Show access denied message
     */
    showAccessDenied(item = null) {
      const message = item 
        ? `Access denied to ${item.label}. Please sign in or contact support.`
        : 'Access denied. You do not have permission to view this page.';
      
      // Dispatch event for UI to handle
      window.PMERIT.events.dispatchEvent(new CustomEvent('nav:accessDenied', {
        detail: { message, item }
      }));
    }
    
    /**
     * Redirect to login page
     */
    redirectToLogin() {
      const currentUrl = window.location.pathname;
      const loginUrl = `/index.html?redirect=${encodeURIComponent(currentUrl)}`;
      
      window.PMERIT.events.dispatchEvent(new CustomEvent('nav:loginRequired', {
        detail: { currentUrl, loginUrl }
      }));
    }
    
    /**
     * Track navigation for analytics
     */
    trackNavigation(item) {
      window.PMERIT.events.dispatchEvent(new CustomEvent('nav:itemClicked', {
        detail: {
          itemId: item.id,
          label: item.label,
          url: item.url,
          userRole: this.currentUser?.role,
          timestamp: Date.now()
        }
      }));
    }
    
    /**
     * Get navigation configuration
     */
    getConfig() {
      return this.config;
    }
    
    /**
     * Get user-accessible navigation items
     */
    getAccessibleNavigation() {
      return {
        primary: this.config.navigation.primary.filter(item => this.hasAccess(item.access)),
        authenticated: this.config.navigation.authenticated.filter(item => this.hasAccess(item.access)),
        admin: this.config.navigation.admin.filter(item => this.hasAccess(item.access)),
        support: this.config.navigation.support.filter(item => this.hasAccess(item.access))
      };
    }
  }
  
  // Initialize navigation manager when PMERIT is ready
  function initializeNavigation() {
    if (!window.PMERIT) {
      console.warn('PMERIT not found, retrying navigation initialization...');
      setTimeout(initializeNavigation, 100);
      return;
    }
    
    // Create navigation manager instance
    window.PMERIT.navigation = new NavigationManager(NAV_CONFIG);
    
    // Export config and utilities
    window.PMERIT.navConfig = NAV_CONFIG;
    
    // Dispatch ready event
    window.PMERIT.events.dispatchEvent(new CustomEvent('navigation:ready'));
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
  } else {
    initializeNavigation();
  }
  
})();
