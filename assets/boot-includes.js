async function loadIncludes() {
  const header = await fetch('/partials/header.html').then(res => res.text());
  const footer = await fetch('/partials/footer.html').then(res => res.text());

  document.getElementById('header-container').innerHTML = header;
  document.getElementById('footer-container').innerHTML = footer;

  // Signal that header/footer are ready
  window.dispatchEvent(new Event('pmerit:initialized'));
}

// Load includes immediately
loadIncludes();
