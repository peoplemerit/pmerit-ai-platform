// Main app logic: dark mode, mobile accordion keyboard support, etc.

// --- Dark Mode ---
function applyDarkMode(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', '1');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', '0');
  }
}
function toggleDarkMode() {
  applyDarkMode(!document.documentElement.classList.contains('dark'));
}
window.toggleDarkMode = toggleDarkMode;

window.addEventListener('DOMContentLoaded', () => {
  // Restore dark mode
  if (localStorage.getItem('darkMode') === '1') applyDarkMode(true);

  // Listen for dark mode toggles (desktop and mobile)
  document.body.addEventListener('click', (e) => {
    if (
      e.target.closest('#darkToggle') ||
      e.target.closest('#darkToggle-mobile')
    ) {
      toggleDarkMode();
    }
  });

  // Keyboard accessibility for mobile accordions
  document.querySelectorAll('.mobile-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.click();
        e.preventDefault();
      }
    });
  });

  // Optional: Focus styling for accordions
  document.querySelectorAll('.mobile-accordion summary').forEach(summary => {
    summary.setAttribute('tabindex', '0');
    summary.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        summary.click();
        e.preventDefault();
      }
    });
  });
});
