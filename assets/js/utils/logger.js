/**
 * PMERIT Debug Logger
 * Conditional logging that respects DEBUG_MODE
 * Automatically silent in production
 */

// Detect production environment
const isProduction = window.location.hostname === 'pmerit.com' ||
                     window.location.hostname === 'www.pmerit.com';

// Debug mode: enabled for non-production environments
const DEBUG_MODE = !isProduction;

/**
 * Logger object with conditional methods
 */
const logger = {
    debug: (...args) => {
        if (DEBUG_MODE) console.log('[DEBUG]', ...args);
    },

    info: (...args) => {
        if (DEBUG_MODE) console.info('[INFO]', ...args);
    },

    warn: (...args) => {
        console.warn('[WARN]', ...args); // Always show warnings
    },

    error: (...args) => {
        console.error('[ERROR]', ...args); // Always show errors
    }
};

// Export for use across the platform
window.logger = logger;
