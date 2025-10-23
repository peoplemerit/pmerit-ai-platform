(function () {
  function initHeader() {
    const hb = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hb && mobileMenu) {
      hb.addEventListener('click', () => {
        const open = hb.getAttribute('aria-expanded') === 'true';
        hb.setAttribute('aria-expanded', String(!open));
        mobileMenu.style.display = open ? 'none' : 'block';
        mobileMenu.setAttribute('aria-hidden', String(open));
      });
    }

    const signIn = document.getElementById('header-signin');
    if (signIn) {
      signIn.addEventListener('click', (e) => {
        // leave native anchor behavior; this keeps consistent behavior if a button is used
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initHeader);
})();
