// =============================================================================
// PMERIT NAVIGATION CONFIGURATION
// File: /assets/nav-config.js
// Navigation management and routing configuration for all pages
// =============================================================================

/**
 * Navigation Configuration Registry
 */
PMERIT.navigation = {
    
    /**
     * Page Configuration Map
     * Defines navigation behavior for each page
     */
    pageConfigs: {
        // Homepage
        'index': {
            title: 'Home - PMERIT',
            description: 'Empowering Learning Through Innovation',
            nav: {
                hide: [],
                highlight: ['home'],
                sections: ['core', 'support', 'actions']
            },
            breadcrumb: ['Home']
        },
        
        // Core Learning Pages
        'dashboard': {
            title: 'Dashboard - PMERIT',
            description: 'Your personalized learning dashboard',
            nav: {
                hide: ['home'],
                highlight: ['dashboard'],
                sections: ['core', 'support', 'actions'],
                requireAuth: true
            },
            breadcrumb: ['Home', 'Dashboard']
        },
        
        'assessment': {
            title: 'Assessment - PMERIT',
            description: 'Discover your learning path through personalized assessment',
            nav: {
                hide: ['home'],
                highlight: ['assessment'],
                sections: ['core', 'actions']
            },
            breadcrumb: ['Home', 'Assessment']
        },
        
        'courses': {
            title: 'Courses - PMERIT',
            description: 'Browse our comprehensive course catalog',
            nav: {
                hide: ['assessment'],
                highlight: ['courses'],
                sections: ['core', 'support', 'actions']
            },
            breadcrumb: ['Home', 'Courses']
        },
        
        'classroom': {
            title: 'Classroom - PMERIT',
            description: 'Interactive learning environment',
            nav: {
                hide: ['assessment', 'courses'],
                highlight: ['classroom'],
                sections: ['core', 'support'],
                requireAuth: true
            },
            breadcrumb: ['Home', 'Classroom']
        },
        
        'career': {
            title: 'Career Paths - PMERIT',
            description: 'Explore career opportunities and market insights',
            nav: {
                hide: ['assessment'],
                highlight: ['career'],
                sections: ['core', 'support', 'actions']
            },
            breadcrumb: ['Home', 'Career']
        },
        
        'library': {
            title: 'Library - PMERIT',
            description: 'Access learning resources and documentation',
            nav: {
                hide: [],
                highlight: ['library'],
                sections: ['core', 'support']
            },
            breadcrumb: ['Home', 'Library']
        },
        
        // Support & User Pages
        'support': {
            title: 'Support - PMERIT',
            description: 'Get help and customer support',
            nav: {
                hide: ['supportMode'],
                highlight: ['support'],
                sections: ['core', 'support']
            },
            breadcrumb: ['Home', 'Support']
        },
        
        'help': {
            title: 'Help Center - PMERIT',
            description: 'Frequently asked questions and guides',
            nav: {
                hide: ['supportMode'],
                highlight: ['help'],
                sections: ['core', 'support']
            },
            breadcrumb: ['Home', 'Help']
        },
        
        'profile': {
            title: 'Profile - PMERIT',
            description: 'Manage your account and preferences',
            nav: {
                hide: [],
                highlight: ['profile'],
                sections: ['core', 'support'],
                requireAuth: true
            },
            breadcrumb: ['Home', 'Profile']
        },
        
        'progress': {
            title: 'Progress - PMERIT',
            description: 'Track your learning progress',
            nav: {
                hide: [],
                highlight: ['progress'],
                sections: ['core', 'support'],
                requireAuth: true
            },
            breadcrumb: ['Home', 'Progress']
        },
        
        'certificates': {
            title: 'Certificates - PMERIT',
            description: 'View and download your certificates',
            nav: {
                hide: [],
                highlight: ['certificates'],
                sections: ['core', 'support'],
                requireAuth: true
            },
            breadcrumb: ['Home', 'Certificates']
        },
        
        'donate': {
            title: 'Support PMERIT - Donate',
            description: 'Support accessible education worldwide',
            nav: {
                hide: [],
                highlight: ['donate'],
                sections: ['core', 'support']
            },
            breadcrumb: ['Home', 'Donate']
        },
        
        // Admin Pages
        'admin-tier1': {
            title: 'Admin Dashboard - PMERIT',
            description: 'Basic administrative functions',
            nav: {
                hide: [],
                highlight: ['admin-tier1'],
                sections: ['core', 'admin', 'monitoring'],
                requireRole: 'admin'
            },
            breadcrumb: ['Home', 'Admin', 'Basic Dashboard']
        },
        
        'admin-tier2': {
            title: 'Advanced Admin - PMERIT',
            description: 'Advanced administrative controls',
            nav: {
                hide: [],
                highlight: ['admin-tier2'],
                sections: ['core', 'admin', 'monitoring'],
                requireRole: 'admin'
            },
            breadcrumb: ['Home', 'Admin', 'Advanced Controls']
        },
        
        'admin-content': {
            title: 'Content Management - PMERIT',
            description: 'Manage courses and learning content',
            nav: {
                hide: [],
                highlight: ['admin-content'],
                sections: ['core', 'admin'],
                requireRole: 'admin'
            },
            breadcrumb: ['Home', 'Admin', 'Content']
        },
        
        'admin-reports': {
            title: 'Reports & Analytics - PMERIT',
            description: 'System analytics and reporting',
            nav: {
                hide: [],
                highlight: ['admin-reports'],
                sections: ['core', 'admin', 'monitoring'],
                requireRole: 'admin'
            },
            breadcrumb: ['Home', 'Admin', 'Reports']
        },
        
        // Monitoring Pages
        'monitoring': {
            title: 'System Monitoring - PMERIT',
            description: 'Real-time system health and performance',
            nav: {
                hide: [],
                highlight: ['monitoring'],
                sections: ['core', 'monitoring'],
                requireRole: 'admin,monitor'
            },
            breadcrumb: ['Home', 'Monitoring']
        },
        
        'ai-police': {
            title: 'AI Security - PMERIT',
            description: 'AI behavior monitoring and security',
            nav: {
                hide: [],
                highlight: ['ai-police'],
                sections: ['core', 'monitoring'],
                requireRole: 'admin,monitor'
            },
            breadcrumb: ['Home', 'Monitoring', 'AI Security']
        },
        
        'incident-response': {
            title: 'Incident Response - PMERIT',
            description: 'Security incident management',
            nav: {
                hide: [],
                highlight: ['incident-response'],
                sections: ['core', 'monitoring'],
                requireRole: 'admin,monitor'
            },
            breadcrumb: ['Home', 'Monitoring', 'Incidents']
        },
        
        // Additional Pages
        'alumni': {
            title: 'Alumni Network - PMERIT',
            description: 'Connect with PMERIT graduates',
            nav: {
                hide: [],
                highlight: ['alumni'],
                sections: ['core', 'support', 'extras']
            },
            breadcrumb: ['Home', 'Community', 'Alumni']
        },
        
        'employer': {
            title: 'For Employers - PMERIT',
            description: 'Employer resources and verification',
            nav: {
                hide: [],
                highlight: ['employer'],
                sections: ['core', 'extras']
            },
            breadcrumb: ['Home', 'Employers']
        },
        
        'consent': {
            title: 'Privacy & Terms - PMERIT',
            description: 'Privacy policy and terms of service',
            nav: {
                hide: [],
                highlight: ['consent'],
                sections: ['extras']
            },
            breadcrumb: ['Home', 'Legal']
        },
        
        // Special Pages
        'maintenance': {
            title: 'Maintenance - PMERIT',
            description: 'System maintenance in progress',
            nav: {
                hide: '*',
                highlight: [],
                sections: [],
                showMessage: 'System is under maintenance. We\'ll be back shortly!'
            },
            breadcrumb: ['Maintenance']
        }
    },
    
    /**
     * Navigation Actions Configuration
     */
    actions: {
        'toggleVH': {
            handler: 'PMERIT.features.VirtualHuman.toggle',
            label: 'Virtual Human Mode',
            icon: '🤖'
        },
        
        'openCareer': {
            handler: 'PMERIT.navigation.goToCareer',
            label: 'Career Exploration',
            icon: '🎯'
        },
        
        'toggleSupport': {
            handler: 'PMERIT.features.CustomerSupport.toggle',
            label: 'Customer Support',
            icon: '💬'
        }
    },
    
    /**
     * Role-based Access Control
     */
    roles: {
        'guest': {
            label: 'Guest',
            access: ['index', 'courses', 'career', 'library', 'help', 'support', 'donate', 'alumni', 'employer', 'consent']
        },
        
        'user': {
            label: 'User', 
            extends: 'guest',
            access: ['dashboard', 'assessment', 'classroom', 'profile', 'progress', 'certificates']
        },
        
        'admin': {
            label: 'Administrator',
            extends: 'user',
            access: ['admin-tier1', 'admin-tier2', 'admin-content', 'admin-reports', 'monitoring', 'ai-police', 'incident-response']
        },
        
        'monitor': {
            label: 'Monitor',
            extends: 'user',
            access: ['monitoring', 'ai-police', 'incident-response']
        }
    },
    
    /**
     * Get Configuration for Current Page
     */
    getCurrentConfig() {
        const currentPage = PMERIT.utils.getCurrentPage();
        return this.pageConfigs[currentPage] || this.pageConfigs['index'];
    },
    
    /**
     * Check if user has access to page
     */
    hasAccess(pageId, userRole = 'guest') {
        const config = this.pageConfigs[pageId];
        if (!config) return false;
        
        // Check role requirement
        if (config.nav.requireRole) {
            const allowedRoles = config.nav.requireRole.split(',');
            if (!allowedRoles.includes(userRole)) {
                return false;
            }
        }
        
        // Check auth requirement
        if (config.nav.requireAuth && !PMERIT.state.user.authenticated) {
            return false;
        }
        
        // Check role access list
        const roleConfig = this.roles[userRole];
        if (!roleConfig) return false;
        
        let allowedPages = roleConfig.access || [];
        
        // Inherit from parent role
        if (roleConfig.extends) {
            const parentRole = this.roles[roleConfig.extends];
            if (parentRole) {
                allowedPages = [...allowedPages, ...parentRole.access];
            }
        }
        
        return allowedPages.includes(pageId);
    },
    
    /**
     * Navigation Handler Methods
     */
    goToPage(pageId) {
        const userRole = PMERIT.state.user.role || 'guest';
        
        if (!this.hasAccess(pageId, userRole)) {
            this.showAccessDenied(pageId);
            return;
        }
        
        const url = pageId === 'index' ? '/' : `/${pageId}.html`;
        window.location.href = url;
    },
    
    goToCareer() {
        this.goToPage('career');
    },
    
    showAccessDenied(pageId) {
        const config = this.pageConfigs[pageId];
        const requiresAuth = config?.nav?.requireAuth;
        const requiresRole = config?.nav?.requireRole;
        
        let message = 'Access denied.';
        
        if (requiresAuth && !PMERIT.state.user.authenticated) {
            message = 'Please sign in to access this page.';
            // Show sign in modal
            PMERIT.modules.AuthManager.showSignInModal();
            return;
        }
        
        if (requiresRole) {
            message = `This page requires ${requiresRole} privileges.`;
        }
        
        // TODO: Implement proper notification system
        alert(message);
    },
    
    /**
     * Breadcrumb Management
     */
    updateBreadcrumb() {
        const config = this.getCurrentConfig();
        const breadcrumbEl = PMERIT.utils.$('#breadcrumb');
        
        if (!breadcrumbEl || !config.breadcrumb) return;
        
        const breadcrumbHtml = config.breadcrumb
            .map((item, index) => {
                const isLast = index === config.breadcrumb.length - 1;
                const className = isLast ? 'breadcrumb-current' : 'breadcrumb-link';
                
                if (isLast) {
                    return `<span class="${className}">${item}</span>`;
                } else {
                    return `<a href="#" class="${className}">${item}</a>`;
                }
            })
            .join('<span class="breadcrumb-separator">›</span>');
        
        breadcrumbEl.innerHTML = breadcrumbHtml;
    },
    
    /**
     * Page Metadata Management
     */
    updatePageMetadata() {
        const config = this.getCurrentConfig();
        
        // Update title
        if (config.title) {
            document.title = config.title;
        }
        
        // Update meta description
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta && config.description) {
            descriptionMeta.content = config.description;
        }
        
        // Update canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        
        const currentPage = PMERIT.utils.getCurrentPage();
        const baseUrl = window.location.origin;
        const pageUrl = currentPage === 'index' ? baseUrl : `${baseUrl}/${currentPage}.html`;
        canonicalLink.href = pageUrl;
    },
    
    /**
     * Initialize Navigation System
     */
    init() {
        // Apply current page configuration
        this.updatePageMetadata();
        this.updateBreadcrumb();
        
        // Set up action handlers
        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                e.preventDefault();
                const action = actionBtn.getAttribute('data-action');
                this.executeAction(action);
            }
        });
        
        // Listen for authentication changes
        PMERIT.events.on('auth:login', () => {
            // Re-apply navigation pruning with new user role
            if (PMERIT.modules.NavigationManager) {
                PMERIT.modules.NavigationManager.applyPruning();
            }
        });
        
        PMERIT.events.on('auth:logout', () => {
            // Re-apply navigation pruning for guest user
            if (PMERIT.modules.NavigationManager) {
                PMERIT.modules.NavigationManager.applyPruning();
            }
        });
    },
    
    /**
     * Execute Navigation Action
     */
    executeAction(actionId) {
        const actionConfig = this.actions[actionId];
        if (!actionConfig) {
            console.warn(`Unknown navigation action: ${actionId}`);
            return;
        }
        
        try {
            // Execute action handler
            const handler = this.getNestedProperty(window, actionConfig.handler);
            if (typeof handler === 'function') {
                handler();
            } else {
                console.warn(`Action handler not found: ${actionConfig.handler}`);
            }
        } catch (error) {
            console.error(`Error executing action ${actionId}:`, error);
        }
    },
    
    /**
     * Utility to get nested object property
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
};

// Initialize navigation when PMERIT is ready
PMERIT.events.on('app:ready', () => {
    PMERIT.navigation.init();
});
