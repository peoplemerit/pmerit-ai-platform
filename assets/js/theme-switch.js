(function () {
  function initThemeSwitch() {
    const el = document.getElementById('theme-toggle');
    if (!el) return;
    el.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      el.setAttribute('aria-pressed', String(document.documentElement.classList.contains('dark-mode')));
    });
  }
  document.addEventListener('DOMContentLoaded', initThemeSwitch);
})();
