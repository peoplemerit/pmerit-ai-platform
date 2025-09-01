/**
 * PMERIT Sidebar Right Module
 * Handles the right panel functionality (Discovery section with assessment button)
 * This is YOUR RIGHT PANEL - not a scroll bar!
 */

(function() {
    'use strict';
    
    // Ensure PMERIT namespace exists
    window.PMERIT = window.PMERIT || {};
    window.PMERIT.modules = window.PMERIT.modules || {};
    
    // Sidebar Right Module
    window.PMERIT.modules.sidebarRight = {
        name: 'sidebarRight',
        initialized: false,
        
        // Module configuration
        config: {
            panelId: 'rightPanel',
            assessmentButtonId: 'beginAssessment',
            statusIndicatorClass: '.status-indicator',
            apiEndpoint: '/api/assessment',
            dbConnectionTimeout: 5000
        },
        
        // Initialize the right panel
        init() {
            if (this.initialized) return;
            
            console.log('🔧 Initializing Sidebar Right (Discovery Panel)');
            
            try {
                this.setupAssessmentButton();
                this.setupStatusIndicator();
                this.checkDatabaseConnection();
                
                this.initialized = true;
                console.log('✅ Sidebar Right module initialized');
                
                // Dispatch event for other modules
                window.dispatchEvent(new CustomEvent('pmerit:sidebarRight:ready'));
                
            } catch (error) {
                console.error('❌ Sidebar Right initialization failed:', error);
            }
        },
        
        // Setup the main assessment button functionality
        setupAssessmentButton() {
            const assessmentBtn = document.getElementById(this.config.assessmentButtonId);
            
            if (!assessmentBtn) {
                console.warn('Assessment button not found');
                return;
            }
            
            // Add click handler for assessment
            assessmentBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.startAssessment();
            });
            
            // Add hover effects
            assessmentBtn.addEventListener('mouseenter', () => {
                this.showAssessmentPreview();
            });
            
            assessmentBtn.addEventListener('mouseleave', () => {
                this.hideAssessmentPreview();
            });
            
            console.log('✅ Assessment button configured');
        },
        
        // Start the assessment process
        async startAssessment() {
            console.log('🎯 Starting assessment process');
            
            try {
                // Show loading state
                this.setAssessmentButtonState('loading');
                
                // Check if user is authenticated
                const isAuthenticated = await this.checkAuthentication();
                
                if (!isAuthenticated) {
                    // Show sign-in modal first
                    await PMERIT.modals.showSignIn({
                        reason: 'assessment',
                        message: 'Please sign in to take your personalized assessment'
                    });
                    return;
                }
                
                // Fetch assessment questions from your 78-table database
                const assessmentData = await this.fetchAssessmentQuestions();
                
                if (assessmentData && assessmentData.questions) {
                    // Open assessment modal with real database questions
                    await PMERIT.modals.openAssessment({
                        questions: assessmentData.questions,
                        assessmentId: assessmentData.id,
                        userProfile: assessmentData.userProfile
                    });
                } else {
                    throw new Error('No assessment questions available');
                }
                
            } catch (error) {
                console.error('Assessment error:', error);
                this.showAssessmentError(error.message);
            } finally {
                this.setAssessmentButtonState('ready');
            }
        },
        
        // Fetch assessment questions from your database
        async fetchAssessmentQuestions() {
            try {
                console.log('📊 Fetching assessment from database...');
                
                const response = await fetch(this.config.apiEndpoint + '/questions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${PMERIT.state.getAuthToken()}`
                    },
                    signal: AbortSignal.timeout(this.config.dbConnectionTimeout)
                });
                
                if (!response.ok) {
                    throw new Error(`Database error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('✅ Assessment data loaded from 78-table database');
                
                return data;
                
            } catch (error) {
                console.error('Database connection failed:', error);
                // Return fallback questions if database is unavailable
                return this.getFallbackQuestions();
            }
        },
        
        // Fallback questions if database is unavailable
        getFallbackQuestions() {
            return {
                id: 'fallback_assessment',
                questions: [
                    {
                        id: 1,
                        type: 'multiple_choice',
                        question: 'What best describes your learning style?',
                        options: [
                            'Visual learner (I learn best by seeing)',
                            'Auditory learner (I learn best by listening)',
                            'Kinesthetic learner (I learn best by doing)',
                            'Reading/Writing learner (I learn best by reading and writing)'
                        ]
                    },
                    {
                        id: 2,
                        type: 'multiple_choice',
                        question: 'What is your primary career interest?',
                        options: [
                            'Technology and Software Development',
                            'Business and Entrepreneurship',
                            'Healthcare and Medicine',
                            'Education and Training',
                            'Creative Arts and Design'
                        ]
                    }
                ],
                userProfile: {
                    isNew: true,
                    source: 'fallback'
                }
            };
        },
        
        // Check if user is authenticated
        async checkAuthentication() {
            const token = PMERIT.state?.getAuthToken();
            const userId = PMERIT.state?.getUserId();
            
            return !!(token && userId);
        },
        
        // Setup status indicator functionality
        setupStatusIndicator() {
            const statusIndicator = document.querySelector(this.config.statusIndicatorClass);
            
            if (statusIndicator) {
                // Add click handler for status details
                statusIndicator.addEventListener('click', () => {
                    this.showSystemStatus();
                });
                
                console.log('✅ Status indicator configured');
            }
        },
        
        // Check database connection and update status
        async checkDatabaseConnection() {
            try {
                const response = await fetch('/api/health', {
                    method: 'GET',
                    signal: AbortSignal.timeout(3000)
                });
                
                if (response.ok) {
                    this.updateConnectionStatus('connected');
                } else {
                    this.updateConnectionStatus('error');
                }
                
            } catch (error) {
                console.warn('Database connection check failed:', error);
                this.updateConnectionStatus('offline');
            }
        },
        
        // Update connection status display
        updateConnectionStatus(status) {
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('[data-i18n="connectedServices"]');
            
            if (statusDot && statusText) {
                // Update visual indicator
                statusDot.className = `status-dot status-${status}`;
                
                // Update text
                const statusMessages = {
                    connected: 'Connected to Educational Services',
                    error: 'Service Connection Issues',
                    offline: 'Services Offline - Limited Functionality'
                };
                
                statusText.textContent = statusMessages[status] || statusMessages.connected;
                
                console.log(`🔗 Connection status: ${status}`);
            }
        },
        
        // Set assessment button state
        setAssessmentButtonState(state) {
            const assessmentBtn = document.getElementById(this.config.assessmentButtonId);
            if (!assessmentBtn) return;
            
            switch (state) {
                case 'loading':
                    assessmentBtn.disabled = true;
                    assessmentBtn.textContent = 'Starting Assessment...';
                    assessmentBtn.classList.add('loading');
                    break;
                    
                case 'ready':
                    assessmentBtn.disabled = false;
                    assessmentBtn.textContent = 'Begin Assessment';
                    assessmentBtn.classList.remove('loading', 'error');
                    break;
                    
                case 'error':
                    assessmentBtn.disabled = false;
                    assessmentBtn.textContent = 'Try Again';
                    assessmentBtn.classList.add('error');
                    break;
            }
        },
        
        // Show assessment preview on hover
        showAssessmentPreview() {
            // Create tooltip or preview if it doesn't exist
            if (!document.getElementById('assessmentPreview')) {
                const preview = document.createElement('div');
                preview.id = 'assessmentPreview';
                preview.className = 'assessment-preview-tooltip';
                preview.innerHTML = `
                    <div class="preview-content">
                        <h4>Personalized Assessment</h4>
                        <p>• 5-10 minutes to complete</p>
                        <p>• Analyzes learning style & interests</p>
                        <p>• Creates custom learning path</p>
                        <p>• Connects to real job market data</p>
                    </div>
                `;
                
                const rightPanel = document.getElementById(this.config.panelId);
                if (rightPanel) {
                    rightPanel.appendChild(preview);
                }
            }
            
            const preview = document.getElementById('assessmentPreview');
            if (preview) {
                preview.style.display = 'block';
            }
        },
        
        // Hide assessment preview
        hideAssessmentPreview() {
            const preview = document.getElementById('assessmentPreview');
            if (preview) {
                preview.style.display = 'none';
            }
        },
        
        // Show assessment error
        showAssessmentError(message) {
            if (PMERIT.modals && PMERIT.modals.showError) {
                PMERIT.modals.showError({
                    title: 'Assessment Unavailable',
                    message: message,
                    actions: [
                        { 
                            label: 'Try Again', 
                            action: () => this.startAssessment() 
                        },
                        { 
                            label: 'Continue Without Assessment', 
                            action: () => PMERIT.navigation.goToPage('courses') 
                        }
                    ]
                });
            } else {
                alert(`Assessment Error: ${message}`);
            }
        },
        
        // Show system status details
        showSystemStatus() {
            if (PMERIT.modals && PMERIT.modals.showSystemStatus) {
                PMERIT.modals.showSystemStatus();
            } else {
                console.log('System status: Database operational, assessment system ready');
            }
        },
        
        // Public API for other modules
        api: {
            // Trigger assessment from other components
            startAssessment: function() {
                return window.PMERIT.modules.sidebarRight.startAssessment();
            },
            
            // Check if assessment is available
            isAssessmentAvailable: function() {
                return window.PMERIT.modules.sidebarRight.initialized;
            },
            
            // Update status from other modules
            updateStatus: function(status) {
                window.PMERIT.modules.sidebarRight.updateConnectionStatus(status);
            }
        }
    };
    
    // Auto-initialize if PMERIT system is ready
    if (window.PMERIT && window.PMERIT.modules) {
        // Register module
        window.PMERIT.modules.sidebarRight.init();
    } else {
        // Wait for PMERIT system to be ready
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (window.PMERIT && window.PMERIT.modules) {
                    window.PMERIT.modules.sidebarRight.init();
                }
            }, 100);
        });
    }
    
})();
