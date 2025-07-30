// PMERIT AI Educational Platform - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎓 PMERIT AI Educational Platform Loaded');
  // Mobile optimization detection
  if (window.innerWidth <= 768) {
    console.log('📱 Mobile optimization active');
  }
  // Network optimization for 3G/4G
  if (navigator.connection && navigator.connection.effectiveType) {
    const connectionType = navigator.connection.effectiveType;
    console.log('📶 Connection type:', connectionType);
    if (connectionType === '3g' || connectionType === '2g') {
      document.body.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%)';
      console.log('🚀 Reduced gradient for slower connections');
    }
  }
});
