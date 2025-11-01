/**
 * PMERIT Mobile UX Telemetry
 * Phase 8.11 - Telemetry Hooks for Mobile UX
 * Version: 1.0
 * 
 * Tracks mobile-specific user interactions and performance metrics
 * No PII (Personally Identifiable Information) is collected
 * 
 * Events tracked:
 * - nav_open, nav_close, nav_item_click
 * - classroom_enter
 * - chat_input_focus, chat_input_send
 * - keyboard_open, keyboard_close
 * - avatar_focus_mode_toggle
 * - viewport_resize
 * - touch_gesture
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    
    const config = {
        enabled: true,
        debug: window.PMERIT_DEBUG || false,
        batchSize: 10,
        flushInterval: 30000, // 30 seconds
        sessionId: generateSessionId()
    };

    // Event queue
    let eventQueue = [];
    let flushTimer = null;

    // ========================================
    // SESSION & DEVICE INFO
    // ========================================

    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function getDeviceHints() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
            isAndroid: /Android/i.test(navigator.userAgent),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            orientation: window.screen.orientation?.type || 'unknown'
        };
    }

    function getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            visualWidth: window.visualViewport?.width || window.innerWidth,
            visualHeight: window.visualViewport?.height || window.innerHeight,
            scrollY: window.scrollY || window.pageYOffset
        };
    }

    function getCurrentRoute() {
        return window.location.hash || window.location.pathname || '/';
    }

    // ========================================
    // TELEMETRY TRACKING
    // ========================================

    /**
     * Track a telemetry event
     * @param {string} eventName - Name of the event
     * @param {object} payload - Event data (no PII)
     */
    function track(eventName, payload = {}) {
        if (!config.enabled) return;

        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: config.sessionId,
            route: getCurrentRoute(),
            viewport: getViewportInfo(),
            deviceHints: getDeviceHints(),
            ...payload
        };

        // Log in debug mode
        if (config.debug) {
            console.log('[Telemetry]', eventName, event);
        }

        // Add to queue
        eventQueue.push(event);

        // Flush if batch size reached
        if (eventQueue.length >= config.batchSize) {
            flush();
        }

        // Call external analytics if available
        if (window.analytics?.track) {
            window.analytics.track(eventName, payload);
        }
    }

    /**
     * Flush event queue
     */
    function flush() {
        if (eventQueue.length === 0) return;

        const events = [...eventQueue];
        eventQueue = [];

        // Send to analytics endpoint or display in admin panel
        if (config.debug) {
            console.log('[Telemetry] Flushing events:', events);
        }

        // Could send to /api/telemetry or store in localStorage for admin panel
        storeForAdmin(events);

        // External analytics provider
        if (window.gtag) {
            events.forEach(event => {
                window.gtag('event', event.event, event);
            });
        }
    }

    /**
     * Store events for admin/QA panel viewing
     */
    function storeForAdmin(events) {
        try {
            const stored = JSON.parse(localStorage.getItem('pmerit_telemetry') || '[]');
            const updated = [...stored, ...events].slice(-100); // Keep last 100 events
            localStorage.setItem('pmerit_telemetry', JSON.stringify(updated));
        } catch (e) {
            console.warn('[Telemetry] Could not store events:', e);
        }
    }

    // ========================================
    // AUTO-TRACKING SETUP
    // ========================================

    function setupAutoTracking() {
        // Track viewport resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                track('viewport_resize', {
                    viewport: getViewportInfo(),
                    deviceHints: getDeviceHints()
                });
            }, 500);
        });

        // Track orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                track('orientation_change', {
                    orientation: window.screen.orientation?.type || 'unknown',
                    viewport: getViewportInfo()
                });
            }, 200);
        });

        // Track visibility change
        document.addEventListener('visibilitychange', () => {
            track('visibility_change', {
                hidden: document.hidden,
                visibilityState: document.visibilityState
            });
        });

        // Track route changes
        let lastRoute = getCurrentRoute();
        window.addEventListener('hashchange', () => {
            const newRoute = getCurrentRoute();
            track('route_change', {
                from: lastRoute,
                to: newRoute
            });
            lastRoute = newRoute;
        });

        // Track page load performance
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                    
                    track('page_load_metrics', {
                        loadTime: loadTime,
                        domReady: domReady,
                        firstPaint: performance.getEntriesByType?.('paint')?.[0]?.startTime || null,
                        route: getCurrentRoute()
                    });
                }, 0);
            });
        }

        // Track touch gestures (sample rate to avoid spam)
        let lastTouch = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouch < 1000) return; // Throttle

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Detect swipe
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                const direction = Math.abs(deltaX) > Math.abs(deltaY) 
                    ? (deltaX > 0 ? 'right' : 'left')
                    : (deltaY > 0 ? 'down' : 'up');

                track('touch_gesture', {
                    type: 'swipe',
                    direction: direction,
                    distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY)
                });

                lastTouch = now;
            }
        }, { passive: true });

        console.log('[Telemetry] Auto-tracking enabled');
    }

    // ========================================
    // CUSTOM EVENT LISTENERS
    // ========================================

    function setupCustomEventListeners() {
        // Navigation events
        document.addEventListener('nav_open', () => {
            track('nav_open', {
                route: getCurrentRoute(),
                viewport: getViewportInfo()
            });
        });

        document.addEventListener('nav_close', () => {
            track('nav_close', {
                route: getCurrentRoute()
            });
        });

        // Chat events
        document.addEventListener('chat:send', (e) => {
            track('chat_input_send', {
                messageLength: e.detail?.message?.length || 0,
                hasVoice: e.detail?.isVoice || false
            });
        });

        document.addEventListener('chat:receive', () => {
            track('chat_message_receive', {
                route: getCurrentRoute()
            });
        });

        // Voice events
        document.addEventListener('voice:start', () => {
            track('voice_recording_start', {
                route: getCurrentRoute()
            });
        });

        document.addEventListener('voice:stop', () => {
            track('voice_recording_stop', {
                route: getCurrentRoute()
            });
        });

        // TTS events
        document.addEventListener('tts:playing', () => {
            track('tts_playback_start', {
                route: getCurrentRoute()
            });
        });

        document.addEventListener('tts:completed', () => {
            track('tts_playback_complete', {
                route: getCurrentRoute()
            });
        });

        // Avatar focus mode
        document.addEventListener('avatar:focus_mode', (e) => {
            track('avatar_focus_mode_toggle', {
                enabled: e.detail?.enabled || false,
                route: getCurrentRoute()
            });
        });

        console.log('[Telemetry] Custom event listeners registered');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        if (!config.enabled) {
            console.log('[Telemetry] Disabled');
            return;
        }

        // Track session start
        track('session_start', {
            deviceHints: getDeviceHints(),
            viewport: getViewportInfo(),
            referrer: document.referrer,
            route: getCurrentRoute()
        });

        // Set up auto-tracking
        setupAutoTracking();

        // Set up custom event listeners
        setupCustomEventListeners();

        // Set up periodic flush
        flushTimer = setInterval(() => {
            flush();
        }, config.flushInterval);

        // Flush on page unload
        window.addEventListener('beforeunload', () => {
            flush();
        });

        console.log('[Telemetry] Initialized with session:', config.sessionId);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    window.PMERIT = window.PMERIT || {};
    window.PMERIT.telemetry = {
        track: track,
        flush: flush,
        getSessionId: () => config.sessionId,
        getEvents: () => {
            try {
                return JSON.parse(localStorage.getItem('pmerit_telemetry') || '[]');
            } catch (e) {
                return [];
            }
        },
        clearEvents: () => {
            localStorage.removeItem('pmerit_telemetry');
            eventQueue = [];
        },
        enable: () => {
            config.enabled = true;
            init();
        },
        disable: () => {
            config.enabled = false;
            clearInterval(flushTimer);
        }
    };

    // ========================================
    // INITIALIZE ON DOM READY
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
