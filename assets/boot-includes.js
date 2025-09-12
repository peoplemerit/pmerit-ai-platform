fetch('/partials/header.html')
  .then(res => res.text())
  .then(html => document.getElementById('headerContainer').innerHTML = html);

fetch('/partials/body.html')
  .then(res => res.text())
  .then(html => document.getElementById('bodyContainer').innerHTML = html);

fetch('/partials/footer.html')
  .then(res => res.text())
  .then(html => document.getElementById('footerContainer').innerHTML = html);
