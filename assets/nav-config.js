// PMERIT Navigation State & Settings Management

// Role-based navigation and access rules (expand as needed)
window.PMERIT = window.PMERIT || {};
window.PMERIT.navConfig = {
  guest: [
    { label: "Dashboard", icon: "fas fa-gauge", href: "/dashboard.html" },
    { label: "Courses", icon: "fas fa-book-open", href: "/courses.html" },
    { label: "Career Paths", icon: "fas fa-compass", href: "/career-paths.html" }
  ],
  user: [
    { label: "Dashboard", icon: "fas fa-gauge", href: "/dashboard.html" },
    { label: "My Courses", icon: "fas fa-graduation-cap", href: "/my-courses.html" },
    { label: "Career Paths", icon: "fas fa-compass", href: "/career-paths.html" },
    { label: "Profile", icon: "fas fa-user", href: "/profile.html" }
  ]
};

// Settings state management
window.PMERIT.settings = {
  darkMode: localStorage.getItem('pmerit_dark_mode') === 'true',
  tts: localStorage.getItem('pmerit_tts') === 'true',
  lang: localStorage.getItem('pmerit_lang') || 'en',
  setDarkMode(val) {
    localStorage.setItem('pmerit_dark_mode', !!val);
    document.documentElement.classList.toggle('dark', !!val);
  },
  setTTS(val) {
    localStorage.setItem('pmerit_tts', !!val);
  },
  setLang(val) {
    localStorage.setItem('pmerit_lang', val);
  }
};
