function init() {
  // Initialize state (check if function exists first)
  if (typeof initState === 'function') {
    initState();
  }
  
  // Initialize chat interface buttons
  initChatInterface();
  
  // Clean Google-Inspired Header Functionality
  const menuToggle = document.getElementById('menuToggle');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const signInBtn = document.getElementById('signInBtn');
  const gridMenuBtn = document.getElementById('gridMenuBtn');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const aiAssistantToggle = document.getElementById('aiAssistantToggle');
  
  // Hamburger Menu Toggle
  function toggleMenu() {
    if (sideMenu && menuOverlay) {
      sideMenu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
    }
  }

  function closeMenu() {
    if (sideMenu && menuOverlay) {
      sideMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
    }
  }

  // Event Listeners for Header
  if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Toggle Switches
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      // Integrate with existing dark mode functionality
      if (typeof setDark === 'function') {
        setDark(!state.dark);
      }
    });
  }

  if (aiAssistantToggle) {
    aiAssistantToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      // Add AI assistant toggle logic here
      console.log('AI Assistant toggled');
    });
  }

  // Menu Items Click Handler
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Prevent default if it has an onclick attribute
      const hasOnclick = this.hasAttribute('onclick');
      if (!hasOnclick) {
        e.preventDefault();
      }
      
      const text = this.textContent.trim();
      console.log(`Menu item clicked: ${text}`);
      
      // Handle specific blueprint behaviors
      if (text.includes('Career Track')) {
        showCareerTracks();
      } else if (text.includes('Begin Assessment')) {
        startAssessment();
      } else if (text.includes('Preview Voices')) {
        previewVoices();
      } else {
        closeMenu();
      }
    });
  });

  // Enhanced Authentication System
  const authModal = document.getElementById('authModal');
  const menuSignInBtn = document.getElementById('menuSignInBtn');
  const modalClose = document.getElementById('modalClose');
  const nextBtn = document.getElementById('nextBtn');
  const emailInput = document.getElementById('emailInput');
  const createAccountLink = document.getElementById('createAccountLink');

  // Sign In Modal Functions
  function showAuthModal() {
    if (authModal) {
      authModal.classList.remove('hidden');
      if (emailInput) emailInput.focus();
    }
  }

  function hideAuthModal() {
    if (authModal) {
      authModal.classList.add('hidden');
    }
  }

  // Sign In Button Events
  if (signInBtn) signInBtn.addEventListener('click', showAuthModal);
  if (menuSignInBtn) menuSignInBtn.addEventListener('click', () => {
    closeMenu();
    setTimeout(showAuthModal, 300); // Wait for menu to close
  });

  // Modal Close Events
  if (modalClose) modalClose.addEventListener('click', hideAuthModal);
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) hideAuthModal();
    });
  }

  // Email Validation and Next Button
  if (nextBtn && emailInput) {
    nextBtn.addEventListener('click', function() {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && (emailRegex.test(email) || /^\+?[\d\s-()]+$/.test(email))) {
        // Valid email or phone - proceed to next step
        console.log('Valid credentials, proceeding to password step');
        // Here you would typically show password input or redirect
        hideAuthModal();
        // For demo, show success message
        setTimeout(() => {
          alert('Authentication flow would continue here with password input.');
        }, 300);
      } else {
        // Invalid input - show error
        emailInput.classList.add('error');
        emailInput.focus();
        setTimeout(() => {
          emailInput.classList.remove('error');
        }, 3000);
      }
    });

    // Remove error styling on input
    emailInput.addEventListener('input', function() {
      this.classList.remove('error');
    });
  }

  // Enhanced Toggle Switches
  const toggleSwitches = document.querySelectorAll('.toggle-switch');
  
  toggleSwitches.forEach(toggleSwitch => {
    toggleSwitch.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      const mode = this.dataset.mode;
      
      if (isActive) {
        this.classList.remove('active');
        this.textContent = '○';
      } else {
        this.classList.add('active');
        this.textContent = '●';
      }
      
      // Handle specific toggle actions
      switch(mode) {
        case 'dark':
          if (typeof setDark === 'function') {
            setDark(!isActive);
          } else {
            // Fallback dark mode implementation
            document.body.classList.toggle('dark', !isActive);
          }
          console.log('Dark mode:', !isActive);
          showToast(`Dark mode ${!isActive ? 'enabled' : 'disabled'}`);
          break;
        case 'vh':
          toggleVirtualHumanMode(!isActive);
          console.log('Virtual Human mode:', !isActive);
          showToast(`Virtual Human ${!isActive ? 'activated' : 'deactivated'}`);
          break;
        case 'cs':
          toggleCustomerServiceMode(!isActive);
          console.log('Customer Service mode:', !isActive);
          showToast(`Customer Service ${!isActive ? 'activated' : 'deactivated'}`);
          break;
        case 'tts':
          toggleTextToSpeech(!isActive);
          console.log('Text-to-Speech mode:', !isActive);
          showToast(`Text-to-Speech ${!isActive ? 'enabled' : 'disabled'}`);
          break;
        case 'video':
          togglePreviewVideos(!isActive);
          console.log('Preview Videos mode:', !isActive);
          showToast(`Preview Videos ${!isActive ? 'enabled' : 'disabled'}`);
          break;
      }
    });
  });

  // Grid Menu Button - Reserved for future pages/apps
  if (gridMenuBtn) {
    gridMenuBtn.addEventListener('click', function() {
      console.log('Grid menu clicked - Reserved for pages/apps');
      
      // Grid menu is reserved for pages as apps - currently empty
      // TODO: Implement app grid dropdown with page navigation
      // showAppGrid();
    });
  }

  // Blueprint Behavior Functions
  function toggleVirtualHumanMode(enabled) {
    // Virtual Human Mode Implementation
    if (enabled) {
      // Show Virtual Human interface elements
      document.body.classList.add('vh-mode');
      console.log('Virtual Human Mode: Activating 3D avatar interface');
      // Add VH-specific UI changes here
    } else {
      document.body.classList.remove('vh-mode');
      console.log('Virtual Human Mode: Returning to text chat');
    }
  }

  function toggleCustomerServiceMode(enabled) {
    // Customer Service Mode Implementation
    if (enabled) {
      document.body.classList.add('cs-mode');
      console.log('Customer Service Mode: Connecting to support team');
      // Show support badges, change chat behavior
    } else {
      document.body.classList.remove('cs-mode');
      console.log('Customer Service Mode: Returning to AI assistance');
    }
  }

  function toggleTextToSpeech(enabled) {
    // Text-to-Speech Implementation
    if (enabled) {
      document.body.classList.add('tts-enabled');
      console.log('Text-to-Speech: Enabled - messages will be spoken');
      // Initialize TTS engine
    } else {
      document.body.classList.remove('tts-enabled');
      console.log('Text-to-Speech: Disabled');
    }
  }

  function togglePreviewVideos(enabled) {
    // Preview Videos Implementation
    if (enabled) {
      document.body.classList.add('video-previews-enabled');
      console.log('Preview Videos: Enabled - showing video thumbnails');
    } else {
      document.body.classList.remove('video-previews-enabled');
      console.log('Preview Videos: Disabled');
    }
  }

  function showCareerTracks() {
    // Career Track Exploration Implementation
    console.log('Showing Career Track samples and exploration options');
    // This could open a modal, navigate to career page, or show inline content
    closeMenu();
    setTimeout(() => {
      showToast('Opening Career Track Explorer...');
      // window.location.href = 'career.html';
    }, 300);
  }

  function startAssessment() {
    // Begin Assessment Implementation
    console.log('Starting career assessment flow');
    closeMenu();
    setTimeout(() => {
      showToast('Launching Career Assessment...');
      // window.location.href = 'assessment.html';
    }, 300);
  }

  function previewVoices() {
    // Preview Voices Implementation
    console.log('Opening voice preview interface');
    showToast('Voice Preview: Coming soon - multiple AI voices available');
  }

  // Blueprint Sidebar Functionality
  function initializeBlueprintSidebar() {
    // Left Sidebar Toggle Handlers
    const leftVhToggle = document.getElementById('vhToggle');
    const leftSupportToggle = document.getElementById('supportToggle');
    const leftDarkToggle = document.getElementById('darkToggle');
    const leftTtsToggle = document.getElementById('ttsToggle');
    const settingsBox = document.getElementById('settingsBox');
    const careerPathsBtn = document.getElementById('careerPaths');
    const dashBtn = document.getElementById('dashBtn');
    const beginAssessmentBtn = document.getElementById('beginAssessment');

    // Settings Collapsible
    if (settingsBox) {
      const head = settingsBox.querySelector('.head');
      const body = settingsBox.querySelector('.body');
      const chevron = head.querySelector('i.fa-chevron-down');

      head.addEventListener('click', function() {
        const isOpen = body.style.display === 'block';
        body.style.display = isOpen ? 'none' : 'block';
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

    // Blueprint Toggle Handlers
    if (leftVhToggle) {
      leftVhToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');
        toggleVirtualHumanMode(isActive);
        updateVirtualHumanUI(isActive);
      });
    }

    if (leftSupportToggle) {
      leftSupportToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');
        toggleCustomerServiceMode(isActive);
        updateSupportUI(isActive);
      });
    }

    if (leftDarkToggle) {
      leftDarkToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');
        document.body.classList.toggle('dark', isActive);
        showToast(`Dark mode ${isActive ? 'enabled' : 'disabled'}`);
      });
    }

    if (leftTtsToggle) {
      leftTtsToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');
        toggleTextToSpeech(isActive);
      });
    }

    if (careerPathsBtn) {
      careerPathsBtn.addEventListener('click', showCareerTracks);
    }

    if (dashBtn) {
      dashBtn.addEventListener('click', function() {
        showToast('Dashboard: Coming soon - comprehensive learning analytics');
      });
    }

    if (beginAssessmentBtn) {
      beginAssessmentBtn.addEventListener('click', startAssessment);
    }
  }

  function updateVirtualHumanUI(isActive) {
    const vhStage = document.getElementById('vhStage');
    const textChat = document.getElementById('textChat');
    const vhBadge = document.getElementById('vhBadge');
    const vhAvatar = document.getElementById('vhAvatar');

    if (isActive) {
      if (vhStage) vhStage.style.display = 'flex';
      if (textChat) textChat.style.display = 'none';
      if (vhBadge) vhBadge.style.display = 'inline-flex';
      if (vhAvatar) vhAvatar.classList.add('active');
    } else {
      if (vhStage) vhStage.style.display = 'none';
      if (textChat) textChat.style.display = 'flex';
      if (vhBadge) vhBadge.style.display = 'none';
      if (vhAvatar) vhAvatar.classList.remove('active');
    }
  }

  function updateSupportUI(isActive) {
    const supportBadge = document.getElementById('supportBadge');

    if (isActive) {
      if (supportBadge) supportBadge.style.display = 'inline-flex';
    } else {
      if (supportBadge) supportBadge.style.display = 'none';
    }
  }

  // Initialize blueprint sidebar on load
  if (window.innerWidth > 1100) {
    initializeBlueprintSidebar();
  }

  // Toast Notification System
  function showToast(message, duration = 3000) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
    }, duration);
  }

  // Language Selection
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      console.log(`Language changed to: ${this.value}`);
      // Add language switching logic here
    });
  }
  
  // Legacy hamburger menu functionality (keeping for compatibility)
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const navItems = document.getElementById('navItems');
  
  if (hamburgerMenu && navItems) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navItems.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerMenu.contains(e.target) && !navItems.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        navItems.classList.remove('open');
      }
    });
  }
  
  // Set up event listeners with null safety checks
  if (darkToggle) darkToggle.addEventListener('click', () => setDark(!state.dark));
  if (ttsToggle) ttsToggle.addEventListener('click', () => setTTS(!state.tts));
  if (supportToggle) supportToggle.addEventListener('click', () => setSupport(!state.support));
  if (supportShort) supportShort.addEventListener('click', () => setSupport(true));
  if (vhToggle) vhToggle.addEventListener('click', () => setVH(!state.vh));
  if (vhQuick) vhQuick.addEventListener('click', () => setVH(true));
  if (vhShort) vhShort.addEventListener('click', () => setVH(true));
  
  // Mobile toggles
  const mVhToggle = document.getElementById('m_vhToggle');
  const mSupportToggle = document.getElementById('m_supportToggle');
  const mSettings = document.getElementById('m_settings');
  const mDarkToggle = document.getElementById('m_darkToggle');
  const mTtsToggle = document.getElementById('m_ttsToggle');
  const mVoicesBtn = document.getElementById('m_voicesBtn');
  
  if (mVhToggle) mVhToggle.addEventListener('click', () => setVH(!state.vh));
  if (mSupportToggle) mSupportToggle.addEventListener('click', () => setSupport(!state.support));
  if (mDarkToggle) mDarkToggle.addEventListener('click', () => setDark(!state.dark));
  if (mTtsToggle) mTtsToggle.addEventListener('click', () => setTTS(!state.tts));
  if (mSettings && settingsBody) mSettings.addEventListener('click', () => {
    settingsBody.style.display = settingsBody.style.display === 'block' ? 'none' : 'block';
  });
  if (mVoicesBtn) mVoicesBtn.addEventListener('click', () => voicesModal.showModal());
  
  // Mobile accordion functionality
  const quickActionsHeader = document.getElementById('quickActionsHeader');
  const quickActionsContent = document.getElementById('quickActionsContent');
  
  if (quickActionsHeader && quickActionsContent) {
    quickActionsHeader.addEventListener('click', () => {
      const isOpen = quickActionsContent.classList.contains('open');
      quickActionsContent.classList.toggle('open');
      
      const icon = quickActionsHeader.querySelector('.accordion-icon');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
    
    // Start with accordion closed on mobile
    if (window.innerWidth <= 1100) {
      quickActionsContent.classList.remove('open');
    }
  }
  
  // Settings collapsible
  if (settingsHead && settingsBody) {
    settingsHead.addEventListener('click', () => {
      const isOpen = settingsBody.style.display === 'block';
      settingsBody.style.display = isOpen ? 'none' : 'block';
      const icon = settingsHead.querySelector('i.fas');
      if (icon) {
        icon.className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
      }
    });
  }
  
  // Dashboard button
  if (dashBtn) dashBtn.addEventListener('click', goDashboard);
  const mDashBtn = document.getElementById('m_dashBtn');
  if (mDashBtn) mDashBtn.addEventListener('click', goDashboard);
  
  // Auth buttons
  if (signInBtn && signInModal) {
    signInBtn.addEventListener('click', () => {
      if (typeof signInModal.showModal === 'function') signInModal.showModal();
    });
  }
  
  const signInCancel = document.getElementById('signInCancel');
  const signInGo = document.getElementById('signInGo');
  
  if (signInCancel && signInModal) {
    signInCancel.addEventListener('click', () => signInModal.close());
  }
  
  if (signInGo) {
    signInGo.addEventListener('click', () => {
      const email = document.getElementById('si_email').value.trim();
      const password = document.getElementById('si_pwd').value.trim();
      if (!email || !password) {
        alert('Please enter your email and password.');
        return;
      }
      state.auth = true;
      save('pmerit_auth', true);
      updateDashboardVisual();
      updateWelcomeMessage();
      signInModal.close();
      if (typeof addMessage === 'function') {
        addMessage('PMERIT AI', `Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.`);
      }
    });
  }
  
  const signUpCancel = document.getElementById('signUpCancel');
  const signUpCreate = document.getElementById('signUpCreate');
  
  if (signUpCancel && signUpModal) {
    signUpCancel.addEventListener('click', () => signUpModal.close());
  }
  
  if (signUpCreate && signUpModal) {
    signUpCreate.addEventListener('click', () => {
    const name = document.getElementById('su_name').value.trim();
    const email = document.getElementById('su_email').value.trim();
    const password = document.getElementById('su_pwd').value.trim();
    if (!name || !email || !password) {
      alert('Please complete all fields.');
      return;
    }
      state.auth = true;
      save('pmerit_auth', true);
      updateDashboardVisual();
      updateWelcomeMessage();
      signUpModal.close();
      if (typeof addMessage === 'function') {
        addMessage('PMERIT AI', `Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
      }
    });
  }
  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (state.auth) {
        if (typeof openAssessment === 'function') openAssessment();
      } else {
        if (signUpModal && typeof signUpModal.showModal === 'function') {
          signUpModal.showModal();
        }
      }
    });
  }
  
  if (beginBtn && typeof openAssessment === 'function') {
    beginBtn.addEventListener('click', openAssessment);
  }
  
  // Mobile assessment button
  const mBeginAssessment = document.getElementById('m_beginAssessment');
  if (mBeginAssessment && typeof openAssessment === 'function') {
    mBeginAssessment.addEventListener('click', openAssessment);
  }
  
  const assessmentCancel = document.getElementById('assessmentCancel');
  const assessmentStart = document.getElementById('assessmentStart');
  
  if (assessmentCancel && assessmentModal) {
    assessmentCancel.addEventListener('click', () => assessmentModal.close());
  }
  
  if (assessmentStart && assessmentModal) {
    assessmentStart.addEventListener('click', () => {
      assessmentModal.close();
      // Mark user as assessed
      state.assessed = true;
      save('pmerit_assessed', true);
      updateWelcomeMessage();
      
      const results = [
        "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights through dashboards and reports.",
        "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered problem solving.",
        "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities and match your interpersonal strengths."
      ];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      if (typeof addMessage === 'function') {
        addMessage('PMERIT AI', randomResult);
      }
    });
  }
  
  // Chat functionality - Add null checks
  if (chatInput) {
    chatInput.addEventListener('input', () => {
      count.textContent = `${chatInput.value.length}/1000`;
    });
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Career paths
  if (careerPaths) {
    careerPaths.addEventListener('click', () => {
      renderTracks();
      tracksModal.showModal();
    });
  }
  
  const mCareerPaths = document.getElementById('m_careerPaths');
  if (mCareerPaths) {
    mCareerPaths.addEventListener('click', () => {
      renderTracks();
      tracksModal.showModal();
    });
  }
  
  const tracksClose = document.getElementById('tracksClose');
  if (tracksClose && tracksModal) {
    tracksClose.addEventListener('click', () => tracksModal.close());
  }
  
  // Voices
  const voicesBtn = document.getElementById('voicesBtn');
  if (voicesBtn && voicesModal) {
    voicesBtn.addEventListener('click', () => voicesModal.showModal());
  }
  
  const voicesClose = document.getElementById('voicesClose');
  if (voicesClose && voicesModal) {
    voicesClose.addEventListener('click', () => voicesModal.close());
  }
  
  const browserTts = document.getElementById('browserTts');
  if (browserTts) {
    browserTts.addEventListener('click', () => {
      const voiceText = document.getElementById('voiceText');
      if (!voiceText) return;
      const text = voiceText.value.trim();
      if (!text) return;
      if (!('speechSynthesis' in window)) {
        alert('Browser TTS not supported.');
        return;
      }
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    });
  }
  
  // Footer buttons
  const privacyBtn = document.getElementById('privacyBtn');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
    });
  }
  
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
    });
  }
  
  const partnershipsBtn = document.getElementById('partnershipsBtn');
  if (partnershipsBtn) {
    partnershipsBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
    });
  }
  
  const supportBtn = document.getElementById('supportBtn');
  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      setSupport(true);
      addMessage('PMERIT AI', 'Support mode activated! I\'m now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?');
    });
  }
  
  const aboutBtn = document.getElementById('aboutBtn');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'Hi! I\'m empowering your education through innovation. PMERIT bridges educational gaps with accessible, high-quality learning that opens doors to endless opportunities worldwide. Let\'s create your personalized path to success!');
    });
  }
  
  // Initialize rotating tips
  if (typeof rotateInsights === 'function') {
    rotateInsights(insights);
    rotateInsights(m_insights);
  }
  
  // Language selector
  const langSelector = document.getElementById('lang');
  if (langSelector) {
    langSelector.addEventListener('change', function() {
      state.lang = this.value;
      save('pmerit_lang', state.lang);
      addMessage('PMERIT AI', `Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
    });
  }

  // Pricing button
  if (pricingBtn) {
    pricingBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
    });
  }
  
  // Footer Active State Management
  initFooterInteractivity();
}

// Footer Interactivity - Google-style Link Management
function initFooterInteractivity() {
  const footerLinks = document.querySelectorAll('.footer-link');
  const statusElement = document.querySelector('.footer-status');
  
  // Enhanced link interactions
  footerLinks.forEach(link => {
    if (!link) return;
    
    // Click handlers
    link.addEventListener('click', function(e) {
      // Remove active state from all links
      footerLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      
      // Set current link as active
      this.classList.add('active');
      this.setAttribute('aria-current', 'page');
    });
    
    // Keyboard navigation
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
    
    // Visual feedback
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Initialize status indicator
  if (statusElement) {
    updateConnectionStatus(navigator.onLine);
    
    // Auto-update connection status every 30 seconds
    setInterval(() => {
      updateConnectionStatus(navigator.onLine);
    }, 30000);
    
    // Update on network change
    window.addEventListener('online', () => updateConnectionStatus(true));
    window.addEventListener('offline', () => updateConnectionStatus(false));
  }
}

// Connection Status Management for Google-style Footer
function updateConnectionStatus(isConnected) {
  const statusElement = document.querySelector('.footer-status');
  if (!statusElement) return;
  
  const dot = statusElement.querySelector('.status-dot');
  const text = statusElement.querySelector('.status-text');
  
  if (dot) {
    dot.style.color = isConnected ? '#34a853' : '#ea4335'; // Google green/red
  }
  
  if (text) {
    text.textContent = isConnected ? 'Connected to Educational Services' : 'Offline';
  }
  
  statusElement.setAttribute('aria-label', 
    isConnected ? 'Status: Connected to Educational Services' : 'Status: Offline');
}

// Simple message display function
function addMessage(sender, message) {
  // In a full implementation, this would add messages to a chat history display
}

// Chat Interface Initialization
function initChatInterface() {
  // Add button for file uploads
  const addBtn = document.querySelector('.add-btn');
  const micBtn = document.querySelector('.mic-btn');
  const voiceBtn = document.querySelector('.voice-btn');
  const chatInput = document.querySelector('.chat-input');
  const sendBtn = document.querySelector('.send-btn');
  
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      // Create hidden file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt';
      fileInput.multiple = true;
      
      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const fileNames = files.map(f => f.name).join(', ');
          addMessage('You', `Uploaded files: ${fileNames}`);
          addMessage('PMERIT AI', `I can see you've uploaded ${files.length} file(s): ${fileNames}. I can help analyze documents, images, and other content to support your learning. What would you like me to help you with regarding these files?`);
        }
      });
      
      fileInput.click();
    });
  }
  
  if (micBtn) {
    let isRecording = false;
    micBtn.addEventListener('click', () => {
      if (!isRecording) {
        // Start voice recording
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              isRecording = true;
              micBtn.style.color = '#ea4335'; // Red color when recording
              micBtn.innerHTML = '<i class="fas fa-stop"></i>';
              addMessage('PMERIT AI', 'Listening... Speak your question or message.');
              
              // Stop recording after 10 seconds (demo)
              setTimeout(() => {
                stream.getTracks().forEach(track => track.stop());
                isRecording = false;
                micBtn.style.color = '#5f6368';
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                addMessage('PMERIT AI', 'Voice input received. In a full implementation, I would process your speech and respond accordingly.');
              }, 3000);
            })
            .catch(err => {
              addMessage('PMERIT AI', 'Sorry, I need microphone permission to use voice input. Please enable microphone access in your browser settings.');
            });
        } else {
          addMessage('PMERIT AI', 'Voice input is not supported in your browser. Please type your message instead.');
        }
      }
    });
  }
  
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      addMessage('PMERIT AI', 'Voice settings: Here you can adjust text-to-speech options, voice speed, and language preferences. Would you like me to read my responses aloud?');
    });
  }
  
  // Enhanced chat input functionality
  if (chatInput && sendBtn) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        addMessage('You', message);
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
          addMessage('PMERIT AI', `Thank you for your message: "${message}". I'm here to help with your learning journey. What specific topic or skill would you like to explore today?`);
        }, 1000);
      }
    }
  }
}

// Helper function for Start Learning action
function startLearning() {
  // Focus on the chat input to start the learning conversation
  const chatInput = document.getElementById('chatInput') || document.querySelector('textarea[placeholder*="Ask"]');
  if (chatInput) {
    chatInput.focus();
    chatInput.value = "I'm ready to start learning! What courses or topics do you recommend for me?";
  }
  console.log('Start Learning activated');
}

// Blueprint-specific interactive features
function showCareerTracks() {
  console.log('Career Tracks activated');
  // Show career path exploration modal or navigate to dedicated page
  const careerModal = document.createElement('div');
  careerModal.className = 'career-modal-overlay';
  careerModal.innerHTML = `
    <div class="career-modal">
      <div class="modal-header">
        <h3>Explore Career Tracks</h3>
        <button class="modal-close" onclick="this.closest('.career-modal-overlay').remove()">×</button>
      </div>
      <div class="modal-content">
        <div class="career-track-grid">
          <div class="career-track-card" onclick="selectCareerTrack('data-science')">
            <i class="fas fa-chart-bar"></i>
            <h4>Data Science</h4>
            <p>Analytics, ML, AI Development</p>
          </div>
          <div class="career-track-card" onclick="selectCareerTrack('software-dev')">
            <i class="fas fa-code"></i>
            <h4>Software Development</h4>
            <p>Full-Stack, Mobile, Web Development</p>
          </div>
          <div class="career-track-card" onclick="selectCareerTrack('cybersecurity')">
            <i class="fas fa-shield-alt"></i>
            <h4>Cybersecurity</h4>
            <p>Security Analysis, Penetration Testing</p>
          </div>
          <div class="career-track-card" onclick="selectCareerTrack('product-mgmt')">
            <i class="fas fa-tasks"></i>
            <h4>Product Management</h4>
            <p>Strategy, Analytics, Leadership</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(careerModal);
}

function selectCareerTrack(track) {
  console.log(`Selected career track: ${track}`);
  // Store selected track and navigate or update UI
  localStorage.setItem('selectedCareerTrack', track);
  document.querySelector('.career-modal-overlay').remove();
  
  // Focus chat to start career-specific conversation
  const chatInput = document.getElementById('chatInput') || document.querySelector('textarea[placeholder*="Ask"]');
  if (chatInput) {
    chatInput.focus();
    chatInput.value = `I'm interested in the ${track.replace('-', ' ')} career track. Can you help me create a personalized learning path?`;
  }
}

function startAssessment() {
  console.log('Starting assessment');
  // Navigate to assessment with proper state
  window.location.href = '/assessment.html';
}

function previewVoices() {
  console.log('Voice preview activated');
  // Show voice preview modal
  const voiceModal = document.createElement('div');
  voiceModal.className = 'voice-modal-overlay';
  voiceModal.innerHTML = `
    <div class="voice-modal">
      <div class="modal-header">
        <h3>Preview AI Voices</h3>
        <button class="modal-close" onclick="this.closest('.voice-modal-overlay').remove()">×</button>
      </div>
      <div class="modal-content">
        <div class="voice-options">
          <div class="voice-option" onclick="playVoicePreview('sarah')">
            <div class="voice-info">
              <h4>Sarah</h4>
              <p>Professional, Clear</p>
            </div>
            <button class="play-btn"><i class="fas fa-play"></i></button>
          </div>
          <div class="voice-option" onclick="playVoicePreview('alex')">
            <div class="voice-info">
              <h4>Alex</h4>
              <p>Friendly, Conversational</p>
            </div>
            <button class="play-btn"><i class="fas fa-play"></i></button>
          </div>
          <div class="voice-option" onclick="playVoicePreview('morgan')">
            <div class="voice-info">
              <h4>Morgan</h4>
              <p>Calm, Reassuring</p>
            </div>
            <button class="play-btn"><i class="fas fa-play"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(voiceModal);
}

function playVoicePreview(voice) {
  console.log(`Playing voice preview: ${voice}`);
  // Implement actual TTS preview here
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(`Hello! This is ${voice}. I'll be your AI learning assistant.`);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

function startAIDiscovery() {
  console.log('AI Discovery activated');
  const chatInput = document.getElementById('chatInput') || document.querySelector('textarea[placeholder*="Ask"]');
  if (chatInput) {
    chatInput.focus();
    chatInput.value = "I'd like AI to help me discover the best learning path based on my interests and goals. Can we start with a quick assessment?";
  }
}

function showVirtualHumanWelcome() {
  console.log('Virtual Human Mode activated');
  // Show virtual human avatar and welcome message
  const chatInput = document.getElementById('chatInput') || document.querySelector('textarea[placeholder*="Ask"]');
  if (chatInput) {
    chatInput.focus();
    chatInput.value = "Hi! I've enabled Virtual Human Mode. Can you show me your avatar and introduce yourself?";
    
    // Add visual indicator for virtual human mode
    const mainContainer = document.querySelector('main') || document.body;
    mainContainer.classList.add('virtual-human-active');
    
    // Optional: TTS welcome if enabled
    const ttsEnabled = document.getElementById('ttsToggle')?.checked;
    if (ttsEnabled && 'speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance('Virtual Human Mode is now active. I can provide a more interactive and personalized learning experience.');
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }, 500);
    }
  }
}

// New: Modern Toggle Switch Handler
function initializeModernToggles() {
  document.querySelectorAll('.modern-toggle').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const toggleId = this.id;
      console.log(`Toggle ${toggleId} changed to:`, this.checked);
      
      // Store toggle state in localStorage
      localStorage.setItem(toggleId, this.checked);
      
      // Handle specific toggle behaviors
      if (toggleId === 'darkModeToggle' && typeof setDark === 'function') {
        setDark(this.checked);
      } else if (toggleId === 'aiAssistantToggle') {
        console.log('AI Assistant toggled');
        // Enable/disable AI assistant features
        document.body.classList.toggle('ai-assistant-enabled', this.checked);
      } else if (toggleId === 'notificationsToggle') {
        console.log('Notifications toggled');
        // Enable/disable browser notifications
        if (this.checked && 'Notification' in window) {
          Notification.requestPermission();
        }
      } else if (toggleId === 'autoplayToggle') {
        console.log('Autoplay toggled');
        // Control autoplay of media elements
        document.body.classList.toggle('autoplay-enabled', this.checked);
      } else if (toggleId === 'privacyModeToggle') {
        console.log('Privacy mode toggled');
        // Enable/disable privacy features
        document.body.classList.toggle('privacy-mode', this.checked);
      } else if (toggleId === 'ttsToggle') {
        console.log('Text-to-Speech toggled');
        // Enable/disable TTS functionality
        document.body.classList.toggle('tts-enabled', this.checked);
        if (this.checked) {
          // Test TTS when enabled
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Text-to-speech is now enabled.');
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
          }
        }
      } else if (toggleId === 'virtualHumanToggle') {
        console.log('Virtual Human Mode toggled');
        // Enable/disable virtual human interface
        document.body.classList.toggle('virtual-human-mode', this.checked);
        if (this.checked) {
          showVirtualHumanWelcome();
        }
      } else if (toggleId === 'customerServiceToggle') {
        console.log('Customer Service Mode toggled');
        // Enable/disable customer service features
        document.body.classList.toggle('customer-service-mode', this.checked);
      }
    });
    
    // Load saved state
    const savedState = localStorage.getItem(toggle.id);
    if (savedState !== null) {
      toggle.checked = savedState === 'true';
    }
  });
}

// New: Collapsible Settings Handler
function initializeCollapsibleSettings() {
  const settingsHeader = document.querySelector('.collapsible-header');
  if (settingsHeader) {
    settingsHeader.addEventListener('click', function() {
      this.classList.toggle('open');
      const content = document.querySelector('.collapsible-content');
      if (content) {
        content.classList.toggle('open');
      }
    });
  }
}

// New: Dashboard Button Handler
function initializeDashboardButton() {
  const dashboardBtn = document.querySelector('.dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      // Add dashboard navigation logic here
      console.log('Navigating to dashboard...');
      // You can add routing logic or redirect to a dashboard page
      window.location.href = '/learner-portal.html';
    });
  }
}

// Update initialization to include new features
function initializeNewMenuFeatures() {
  initializeModernToggles();
  initializeCollapsibleSettings();
  initializeDashboardButton();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    init();
    initializeNewMenuFeatures();
  });
} else {
  init();
  initializeNewMenuFeatures();
}
// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.body.setAttribute('data-theme', currentTheme);
    
    // Toggle handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update toggle button text/icon
            updateDarkModeButton(newTheme);
        });
    }
}

function updateDarkModeButton(theme) {
    const button = document.getElementById('darkModeToggle');
    if (button) {
        const icon = button.querySelector('.icon');
        const text = button.querySelector('.text');
        
        if (theme === 'dark') {
            icon.textContent = '🌙';
            text.textContent = 'Dark Mode';
        } else {
            icon.textContent = '☀️';
            text.textContent = 'Light Mode';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDarkMode);
