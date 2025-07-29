// PMERIT AI Educational Platform - Main JavaScript
console.log('🎓 PMERIT AI Educational Platform Loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Platform ready to serve underserved communities globally');
    
    // Add mobile optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        console.log('📱 Touch device optimizations active');
    }
    
    // Network optimization for 3G/4G
    if (navigator.connection && navigator.connection.effectiveType) {
        const connectionType = navigator.connection.effectiveType;
        console.log(`📶 Connection: ${connectionType}`);
        
        if (connectionType === '3g' || connectionType === '2g') {
            document.body.classList.add('reduced-motion');
        }
    }
});
