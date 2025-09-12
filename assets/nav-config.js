export const navConfig = {
  header: [
    { label: "Home", href: "#home", icon: "fas fa-home" },
    { label: "Track & Explore Paths", href: "#careerPaths", icon: "fas fa-compass" },
    { label: "Customer Service Mode", href: "#supportToggle", icon: "fas fa-headset" },
    { label: "Donate", href: "#donate", icon: "fas fa-hand-holding-heart" },
    { label: "Sign In", href: "#signin", icon: "fas fa-user" },
    { label: "Start Learning", href: "#start", icon: "fas fa-graduation-cap" }
  ],

  sidebar: {
    quickActions: [
      { label: "Virtual Human Mode", id: "vhToggle", type: "toggle", icon: "fas fa-user" },
      { label: "Career Track & Explore Paths", id: "careerPaths", type: "action", icon: "fas fa-compass" },
      { label: "Customer Service Mode", id: "supportToggle", type: "toggle", icon: "fas fa-headset" }
    ],
    settings: [
      { label: "Dark Mode", id: "darkToggle", type: "toggle", icon: "fas fa-moon" },
      { label: "Text-to-Speech", id: "ttsToggle", type: "toggle", icon: "fas fa-volume-up" },
      { label: "Preview Voices", id: "voicesBtn", type: "action", icon: "fas fa-headphones" }
    ],
    dashboard: { label: "Dashboard", id: "dashBtn", icon: "fas fa-gauge-high" }
  },

  footer: [
    { label: "About PMERIT", href: "#about" },
    { label: "Privacy & Terms", href: "#privacy" },
    { label: "Contact", href: "#contact" },
    { label: "Partnerships", href: "#partners" },
    { label: "Support", href: "#support" }
  ],

  mobileFooter: [
    { label: "Menu", id: "toggleLeft", icon: "fas fa-bars" },
    { label: "Tools", id: "toggleRight", icon: "fas fa-chart-bar" }
  ]
};
