<script>
/* Simple HTML partials loader
   Usage: <div data-include="/partials/header.html"></div>
*/
async function injectPartials() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(nodes.map(async (el) => {
    const url = el.getAttribute('data-include');
    const res = await fetch(url, { cache: 'no-store' });
    const html = await res.text();
    el.outerHTML = html; // replace the placeholder with the fetched markup
  }));
}
</script>
