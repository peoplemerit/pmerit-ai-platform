// ... existing boot-includes.js code ...

// Settings Collapsible: Fix toggle, ARIA, and state
document.addEventListener('DOMContentLoaded', function() {
  const settingsDropdown = document.getElementById('settingsDropdown');
  const settingsToggle = document.getElementById('settings-heading');
  if (settingsDropdown && settingsToggle) {
    settingsDropdown.addEventListener('toggle', function() {
      const isOpen = this.open;
      settingsToggle.setAttribute('aria-expanded', isOpen.toString());
    });
  }

  // Dark mode toggle
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    // Restore state
    const darkPref = localStorage.getItem('pmerit_dark_mode') === 'true';
    setDarkMode(darkPref);
    darkToggle.setAttribute('aria-checked', darkPref.toString());

    darkToggle.addEventListener('click', function() {
      const current = darkToggle.getAttribute('aria-checked') === 'true';
      setDarkMode(!current);
      localStorage.setItem('pmerit_dark_mode', !current);
      darkToggle.setAttribute('aria-checked', (!current).toString());
    });
  }
  function setDarkMode(on) {
    document.documentElement.classList.toggle('dark', !!on);
  }

  // TTS toggle
  const ttsToggle = document.getElementById('ttsToggle');
  if (ttsToggle) {
    const ttsPref = localStorage.getItem('pmerit_tts') === 'true';
    ttsToggle.setAttribute('aria-checked', ttsPref.toString());
    ttsToggle.addEventListener('click', function() {
      const curr = ttsToggle.getAttribute('aria-checked') === 'true';
      localStorage.setItem('pmerit_tts', (!curr).toString());
      ttsToggle.setAttribute('aria-checked', (!curr).toString());
    });
  }

  // Preview Voice
  const previewBtn = document.getElementById('previewVoiceBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance('Welcome to PMERIT. This is your sample voice.');
        utter.lang = getSelectedLang() || 'en-US';
        window.speechSynthesis.speak(utter);
      }
    });
  }

  // Language selector
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    // Restore state
    const savedLang = localStorage.getItem('pmerit_lang') || 'en';
    langSelect.value = savedLang;
    langSelect.addEventListener('change', function() {
      localStorage.setItem('pmerit_lang', langSelect.value);
      // Optionally, trigger UI language reload here
    });
  }
  function getSelectedLang() {
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      switch (langSelect.value) {
        case 'yo': return 'yo-NG';
        case 'ig': return 'ig-NG';
        case 'ha': return 'ha-NG';
        default: return 'en-US';
      }
    }
    return 'en-US';
  }
});
