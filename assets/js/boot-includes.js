// Loader for HTML partials (header, body, footer) for local dev/static hosting
window.addEventListener('DOMContentLoaded', () => {
  async function loadPartial(id, url) {
    const el = document.getElementById(id);
    if (el) {
      try {
        const resp = await fetch(url);
        el.innerHTML = await resp.text();
      } catch (e) {
        el.innerHTML = '<div style="color:red;">Failed to load '+url+'</div>';
      }
    }
  }
  loadPartial('header-include', 'partials/header.html');
  loadPartial('body-include', 'partials/body.html');
  loadPartial('footer-include', 'partials/footer.html');
});
