(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    function applyDeviceClass() {
      if (window.innerWidth <= 768) document.documentElement.classList.add('mobile');
      else document.documentElement.classList.remove('mobile');
    }
    applyDeviceClass();
    window.addEventListener('resize', applyDeviceClass);
  });

  window.PMERIT = window.PMERIT || {};
})();
