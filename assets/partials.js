<script>
/**
 * Tiny partials loader for GitHub Pages/Cloudflare Pages (no build step).
 * Usage: <div data-include="/assets/partials/header.html"></div>
 */
(function () {
  async function inject(el) {
    const path = el.getAttribute('data-include');
    if (!path) return;
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return console.warn('Partial not found:', path);
    el.outerHTML = await res.text();
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-include]').forEach(inject);
  });
})();
</script>
