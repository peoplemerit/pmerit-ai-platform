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
    item.addEventListener('click', function() {
      const text = this.textContent.trim();
      console.log(`Menu item clicked: ${text}`);
      closeMenu();
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
          }
          console.log('Dark mode:', !isActive);
          break;
        case 'vh':
          console.log('Virtual Human mode:', !isActive);
          // Add virtual human logic here
          break;
        case 'cs':
          console.log('Customer Service mode:', !isActive);
          // Add customer service logic here
          break;
        case 'tts':
          console.log('Text-to-Speech mode:', !isActive);
          // Add TTS logic here
          break;
        case 'video':
          console.log('Preview Videos mode:', !isActive);
          // Add video preview logic here
          break;
      }
    });
  });

  // Grid Menu Button
  if (gridMenuBtn) {
    gridMenuBtn.addEventListener('click', function() {
      // For now, show available platform sections - can be expanded to show app grid
      console.log('Grid menu clicked - showing platform apps');
      
      // Open hamburger menu as fallback to show platform features
      toggleMenu();
      
      // Optional: Could implement a dedicated app grid dropdown here
      // showAppGrid();
    });
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
