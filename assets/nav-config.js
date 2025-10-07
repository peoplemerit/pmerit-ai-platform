/**
 * PMERIT Navigation Configuration
 * Version: 1.0
 * 
 * Configuration for navigation menu structure and access rules
 */

(function(window) {
    'use strict';

    // ============================================
    // NAVIGATION CONFIGURATION
    // ============================================
    
    const NavigationConfig = {
        // Main navigation items
        mainNav: [
            {
                id: 'home',
                label: 'Home',
                url: 'index.html',
                icon: 'fa-home',
                accessLevel: 'public'
            },
            {
                id: 'courses',
                label: 'Courses',
                url: 'courses.html',
                icon: 'fa-book',
                accessLevel: 'public'
            },
            {
                id: 'assessment',
                label: 'Assessment',
                url: 'assessment.html',
                icon: 'fa-clipboard-list',
                accessLevel: 'public'
            },
            {
                id: 'about',
                label: 'About',
                url: 'about-us.html',
                icon: 'fa-info-circle',
                accessLevel: 'public'
            },
            {
                id: 'contact',
                label: 'Contact',
                url: 'contact.html',
                icon: 'fa-envelope',
                accessLevel: 'public'
            }
        ],
        
        // User navigation (authenticated)
        userNav: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                url: 'learner-portal.html',
                icon: 'fa-tachometer-alt',
                accessLevel: 'authenticated'
            },
            {
                id: 'progress',
                label: 'My Progress',
                url: 'progress.html',
                icon: 'fa-chart-line',
                accessLevel: 'authenticated'
            },
            {
                id: 'profile',
                label: 'Profile',
                url: 'profile.html',
                icon: 'fa-user',
                accessLevel: 'authenticated'
            },
            {
                id: 'certificates',
                label: 'Certificates',
                url: 'certificates.html',
                icon: 'fa-certificate',
                accessLevel: 'authenticated'
            }
        ],
        
        // Career tracks
        careerTracks: [
            {
                id: 'grc',
                label: 'Global Remote Career',
                description: '12 courses designed for remote work opportunities worldwide',
                icon: 'fa-globe',
                color: '#2A5B8C'
            },
            {
                id: 'lcp',
                label: 'Local Career Pathways',
                description: '12 courses tailored to local job markets',
                icon: 'fa-map-marker-alt',
                color: '#4A90A4'
            },
            {
                id: 'up',
                label: 'University Preparation',
                description: '12 courses for academic excellence',
                icon: 'fa-university',
                color: '#FF6B6B'
            }
        ],
        
        // Footer navigation
        footerNav: [
            {
                id: 'privacy',
                label: 'Privacy Policy',
                url: 'privacy.html'
            },
            {
                id: 'terms',
                label: 'Terms of Service',
                url: 'terms.html'
            },
            {
                id: 'support',
                label: 'Support',
                url: 'support.html'
            },
            {
                id: 'donate',
                label: 'Donate',
                url: 'donate.html'
            }
        ],
        
        /**
         * Get navigation items by type
         */
        getNav: function(type) {
            return this[type + 'Nav'] || [];
        },
        
        /**
         * Get navigation item by id
         */
        getNavItem: function(type, id) {
            const nav = this.getNav(type);
            return nav.find(item => item.id === id);
        },
        
        /**
         * Check if user has access to nav item
         */
        hasAccess: function(item, userRole = 'guest') {
            if (!item.accessLevel || item.accessLevel === 'public') {
                return true;
            }
            
            if (item.accessLevel === 'authenticated') {
                return userRole !== 'guest';
            }
            
            if (item.accessLevel === 'admin') {
                return userRole === 'admin';
            }
            
            return false;
        },
        
        /**
         * Filter navigation by access level
         */
        getAccessibleNav: function(type, userRole = 'guest') {
            const nav = this.getNav(type);
            return nav.filter(item => this.hasAccess(item, userRole));
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITNavConfig = NavigationConfig;

})(window);
