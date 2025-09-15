// Main PMERIT Application JavaScript
class PMERITApp {
  constructor() {
    this.isDarkMode = false;
    this.isVirtualHuman = false;
    this.isSupportMode = false;
    this.isTTS = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
    this.updateUI();
  }

  setupEventListeners() {
    // Header navigation
    document.getElementById('donateBtn')?.addEventListener('click', () => {
      window.open('https://donate.pmerit.org', '_blank');
    });
    
    document.getElementById('signInBtn')?.addEventListener('click', () => {
      this.showSignInModal();
    });
    
    document.getElementById('startBtn')?.addEventListener('click', () => {
      this.startLearning();
    });

    // Footer links
    document.getElementById('aboutPmeritBtn')?.addEventListener('click', () => {
      this.showAboutModal();
    });
    
    document.getElementById('helpBtn')?.addEventListener('click', () => {
      this.showHelpModal();
    });
    
    document.getElementById('privacyBtn')?.addEventListener('click', () => {
      window.open('/privacy', '_blank');
    });
    
    document.getElementById('termsBtn')?.addEventListener('click', () => {
      window.open('/terms', '_blank');
    });

    // Toggle switches
    document.getElementById('darkToggle')?.addEventListener('click', () => {
      this.toggleDarkMode();
    });
    
    document.getElementById('vhToggle')?.addEventListener('click', () => {
      this.toggleVirtualHuman();
    });
    
    document.getElementById('supportToggle')?.addEventListener('click', () => {
      this.toggleSupportMode();
    });
    
    document.getElementById('ttsToggle')?.addEventListener('click', () => {
      this.toggleTTS();
    });

    // Mobile equivalents
    document.getElementById('m_darkToggle')?.addEventListener('click', () => {
      this.toggleDarkMode();
    });
    
    document.getElementById('m_vhToggle')?.addEventListener('click', () => {
      this.toggleVirtualHuman();
    });
    
    document.getElementById('m_supportToggle')?.addEventListener('click', () => {
      this.toggleSupportMode();
    });
    
    document.getElementById('m_ttsToggle')?.addEventListener('click', () => {
      this.toggleTTS();
    });

    // Settings collapsible
    document.querySelector('#settingsBox .head')?.addEventListener('click', () => {
      this.toggleCollapsible('settingsBox');
    });

    // Career paths
    document.getElementById('careerPaths')?.addEventListener('click', () => {
      this.showCareerPaths();
    });
    
    document.getElementById('m_careerPaths')?.addEventListener('click', () => {
      this.showCareerPaths();
    });

    // Language selector
    document.getElementById('lang')?.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
    
    // Update toggle states
    const toggles = ['darkToggle', 'm_darkToggle'];
    toggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.classList.toggle('active', this.isDarkMode);
      }
    });
    
    this.savePreferences();
  }

  toggleVirtualHuman() {
    this.isVirtualHuman = !this.isVirtualHuman;
    
    // Update toggle states
    const toggles = ['vhToggle', 'm_vhToggle'];
    toggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.classList.toggle('active', this.isVirtualHuman);
      }
    });
    
    // Update UI
    document.getElementById('vhBadge').style.display = this.isVirtualHuman ? 'inline-flex' : 'none';
    document.getElementById('vhAvatar').classList.toggle('active', this.isVirtualHuman);
    
    // Switch between text chat and VH stage
    if (this.isVirtualHuman) {
      document.getElementById('textChat').style.display = 'none';
      document.getElementById('vhStage').style.display = 'flex';
    } else {
      document.getElementById('textChat').style.display = 'flex';
      document.getElementById('vhStage').style.display = 'none';
    }
    
    this.savePreferences();
  }

  toggleSupportMode() {
    this.isSupportMode = !this.isSupportMode;
    
    // Update toggle states
    const toggles = ['supportToggle', 'm_supportToggle'];
    toggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.classList.toggle('active', this.isSupportMode);
      }
    });
    
    // Update UI
    document.getElementById('supportBadge').style.display = this.isSupportMode ? 'inline-flex' : 'none';
    
    this.savePreferences();
  }

  toggleTTS() {
    this.isTTS = !this.isTTS;
    
    // Update toggle states
    const toggles = ['ttsToggle', 'm_ttsToggle'];
    toggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.classList.toggle('active', this.isTTS);
      }
    });
    
    this.savePreferences();
  }

  toggleCollapsible(id) {
    const collapsible = document.getElementById(id);
    const body = collapsible.querySelector('.body');
    const chevron = collapsible.querySelector('.head i:last-child');
    
    if (body.style.display === 'block') {
      body.style.display = 'none';
      chevron.className = 'fas fa-chevron-down';
    } else {
      body.style.display = 'block';
      chevron.className = 'fas fa-chevron-up';
    }
  }

  showSignInModal() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <form method="dialog">
        <h3><i class="fas fa-sign-in-alt"></i> Sign In to PMERIT</h3>
        <label>
          Email Address
          <input type="email" required>
        </label>
        <label>
          Password
          <input type="password" required>
        </label>
        <div class="button-group">
          <button type="button" class="nav-btn" onclick="this.closest('dialog').close()">Cancel</button>
          <button type="submit" class="nav-btn primary">Sign In</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    
    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog);
    });
  }

  showAboutModal() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <form method="dialog">
        <h3><i class="fas fa-info-circle"></i> About PMERIT</h3>
        <p>PMERIT is dedicated to providing accessible, high-quality education that opens doors to endless opportunities worldwide.</p>
        <p>Our mission is to democratize learning through innovative technology and personalized educational experiences.</p>
        <div class="button-group">
          <button type="submit" class="nav-btn primary">Close</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    
    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog);
    });
  }

  showHelpModal() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <form method="dialog">
        <h3><i class="fas fa-question-circle"></i> Help & Support</h3>
        <p>Welcome to PMERIT Help Center!</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>Use the Virtual Human toggle for interactive learning</li>
          <li>Explore Career Paths to find your learning direction</li>
          <li>Enable Support Mode for assistance</li>
          <li>Try Dark Mode for comfortable viewing</li>
        </ul>
        <div class="button-group">
          <button type="submit" class="nav-btn primary">Got it!</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    
    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog);
    });
  }

  showCareerPaths() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <form method="dialog">
        <h3><i class="fas fa-compass"></i> Career Tracks & Learning Paths</h3>
        <div class="tracks-grid">
          <div class="track-card">
            <h4>🚀 Technology</h4>
            <p>Programming, AI, cybersecurity, and emerging tech skills</p>
          </div>
          <div class="track-card">
            <h4>💼 Business</h4>
            <p>Leadership, entrepreneurship, and business development</p>
          </div>
          <div class="track-card">
            <h4>🎨 Creative</h4>
            <p>Design, content creation, and digital media</p>
          </div>
          <div class="track-card">
            <h4>🌍 Global Skills</h4>
            <p>Languages, cultural competency, and international business</p>
          </div>
        </div>
        <div class="button-group">
          <button type="submit" class="nav-btn primary">Explore Paths</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    
    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog);
    });
  }

  startLearning() {
    // Placeholder for learning journey start
    alert('Welcome to your PMERIT learning journey! 🎓');
  }

  changeLanguage(lang) {
    // Placeholder for language switching
    console.log(`Switching to language: ${lang}`);
  }

  loadUserPreferences() {
    const prefs = JSON.parse(localStorage.getItem('pmerit-preferences') || '{}');
    this.isDarkMode = prefs.darkMode || false;
    this.isVirtualHuman = prefs.virtualHuman || false;
    this.isSupportMode = prefs.supportMode || false;
    this.isTTS = prefs.tts || false;
  }

  savePreferences() {
    const prefs = {
      darkMode: this.isDarkMode,
      virtualHuman: this.isVirtualHuman,
      supportMode: this.isSupportMode,
      tts: this.isTTS
    };
    localStorage.setItem('pmerit-preferences', JSON.stringify(prefs));
  }

  updateUI() {
    // Apply saved preferences
    if (this.isDarkMode) {
      document.body.classList.add('dark');
      const toggles = ['darkToggle', 'm_darkToggle'];
      toggles.forEach(id => {
        document.getElementById(id)?.classList.add('active');
      });
    }
    
    if (this.isVirtualHuman) {
      this.toggleVirtualHuman();
    }
    
    if (this.isSupportMode) {
      this.toggleSupportMode();
    }
    
    if (this.isTTS) {
      const toggles = ['ttsToggle', 'm_ttsToggle'];
      toggles.forEach(id => {
        document.getElementById(id)?.classList.add('active');
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pmeritApp = new PMERITApp();
});
