/* PMERIT Main JavaScript - Production Ready */

// Initialize PMERIT platform
document.addEventListener('DOMContentLoaded', function() {
    console.log('PMERIT Platform Loaded Successfully');
    
    // Initialize responsive layout classes
    function updateLayout() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-layout', isMobile);
        document.body.classList.toggle('desktop-layout', !isMobile);
    }
    
    // Set initial layout
    updateLayout();
    
    // Update layout on window resize
    window.addEventListener('resize', updateLayout);
    
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Modern storage handling (fixes deprecated StorageType.persistent warning)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(function(estimate) {
            console.log('Storage quota available:', estimate.quota);
            console.log('Storage usage:', estimate.usage);
        }).catch(function(error) {
            console.log('Storage API not available:', error);
        });
    }
});

// Export for external use if needed
window.PMERIT = {
    version: '2.0',
    initialized: true
};