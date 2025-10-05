/**
 * boot-includes.js
 * Dynamically loads HTML partials into designated containers
 * Used for DRY principle to share common components (nav, header, footer)
 */

(function() {
  'use strict';

  // Load partial HTML into container
  async function loadPartial(containerId, partialPath) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return false;
    }

    try {
      const response = await fetch(partialPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${partialPath}: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      
      // Execute any scripts in the loaded content
      const scripts = container.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        script.remove();
      });
      
      return true;
    } catch (error) {
      console.error(`Error loading ${partialPath}:`, error);
      return false;
    }
  }

  // Initialize partials on page load
  async function initializePartials() {
    const partials = [
      { container: 'nav-container', path: 'partials/nav.html' },
      { container: 'header-container', path: 'partials/header.html' },
      { container: 'footer-container', path: 'partials/footer.html' }
    ];

    for (const partial of partials) {
      await loadPartial(partial.container, partial.path);
    }

    // Dispatch custom event when all partials are loaded
    document.dispatchEvent(new CustomEvent('partials-loaded'));
  }

  // Start loading when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePartials);
  } else {
    initializePartials();
  }

  // Export for global access if needed
  window.BootIncludes = {
    loadPartial
  };
})();
