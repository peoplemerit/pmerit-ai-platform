/**
PMERIT AI PLATFORM: MAIN.JS NARRATIVE

This file implements core interactive behaviors for the PMERIT frontend, enabling dynamic toggling and accessibility for key UI features. 
It is loaded globally on all main pages that use the DRY partial system and three-panel layout.

SPECIFIC FUNCTION:
- Handles click and input events for toggles (Virtual Human, Support, Dark Mode), chat input character counter, and integrates with the markup produced by /partials/body.html.
- Ensures immediate and accessible UI feedback for user actions, with ARIA and visible focus compatibility.
- Preserves layout and component integrity for both desktop and mobile breakpoints, as per the design grid.

TEMPLATE-SPECIFIC CONSTRAINT:
- No global namespace pollution; all logic runs within DOMContentLoaded.
- No changes to core layout or markup; only enhances interactivity.
- Uses only standard JavaScript and is compatible with all modern browsers.
- Does not duplicate logic handled by PMERIT.api or boot-includes.js.

SPECIFIC REQUIREMENTS:
- Virtual Human Toggle: Shows/hides the Virtual Human badge and stage.
- Support Mode Toggle: Shows/hides the Support badge and support assistant pane.
- Dark Mode Toggle: Toggles the .dark class on <body> for theme switching.
- Chat Input Counter: Live character count for chat input area (max 1000).
- All toggles and buttons must remain keyboard and screen reader accessible.
- Must work with the markup and class names defined in /partials/body.html and base.css.

INTEGRATION:
- Loaded after boot-includes.js and after partials are injected.
- Assumes the presence of the correct IDs and classes on DOM elements.
- May be extended in the future to emit events to PMERIT.api for state persistence.

RESULT:
- Provides a smooth, accessible, and responsive user experience for toggling key platform features and managing chat interactions within the PMERIT estate layout.

**/

// main.js

document.addEventListener('DOMContentLoaded', function () {
  // Helper selectors
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // DOM Elements (after partials load)
  function onReady() {
    const body = document.body;
    const vhToggle = $('#vhToggle'),
      vhAvatar = $('#vhAvatar'),
      vhBadge = $('#vhBadge'),
      supportToggle = $('#supportToggle'),
      supportBadge = $('#supportBadge'),
      dashBtn = $('#dashBtn'),
      settingsBox = $('#settingsBox'),
      settingsHead = settingsBox ? settingsBox.querySelector('.head') : null,
      settingsBody = settingsBox ? settingsBox.querySelector('.body') : null,
      darkToggle = $('#darkToggle'),
      ttsToggle = $('#ttsToggle'),
      rightPane = $('#rightPane'),
      leftPane = $('.left'),
      mobileFooter = $('#mobileFooter'),
      tracksList = $('#tracksList'),
      tracksModal = $('#tracksModal'),
      careerPathsBtn = $('#careerPaths'),
      voicesBtn = $('#voicesBtn'),
      voicesDlg = $('#voicesModal'),
      voiceTabs = $('#voiceTabs'),
      voicePanels = $('#voicePanels'),
      browserTtsBtn = $('#browserTtsBtn'),
      voiceSampleText = $('#voiceSampleText'),
      signInBtn = $('#signInBtn'),
      chatInput = $('#chatInput'),
      sendBtn = $('#sendBtn'),
      count = $('#count'),
      welcomeMessageContainer = $('#welcomeMessageContainer'),
      textChat = $('#textChat'),
      vhStage = $('#vhStage'),
      toggleLeftBtn = $('#toggleLeft'),
      toggleRightBtn = $('#toggleRight'),
      supportAssistantPane = $('#supportAssistantPane');

    const state = { auth: false, dark: false, vhMode: false, supportMode: false, tts: false };
    const CAREER_TRACKS = [
      "Software Development (Full-stack)",
      "Data Analytics",
      "UI/UX Design",
      "Digital Marketing",
      "Customer Support (Remote)",
      "Virtual Assistance / Operations",
      "Cloud & DevOps (Intro)"
    ];

    function init() {
      try {
        state.dark = localStorage.getItem('pmerit_dark') === 'true';
        state.auth = localStorage.getItem('pmerit_auth') === 'true';
        state.tts = localStorage.getItem('pmerit_tts') === 'true';
      } catch { }

      body.classList.toggle('dark', state.dark);
      if (darkToggle) darkToggle.classList.toggle('active', state.dark);
      if (ttsToggle) ttsToggle.classList.toggle('active', state.tts);
      if (dashBtn) dashBtn.classList.toggle('guest', !state.auth);
      if (rightPane && supportAssistantPane) rightPane.prepend(supportAssistantPane);

      if (tracksList) {
        tracksList.innerHTML = CAREER_TRACKS.map((t, i) =>
          `<button class="action" value="${i}" style="justify-content:flex-start"><i class="fas fa-arrow-right icon"></i><span>${t}</span></button>`
        ).join('');
      }
      if (window.innerWidth <= 1100) {
        if (leftPane) leftPane.style.display = 'none';
        if (rightPane) rightPane.style.display = 'none';
        if (mobileFooter) mobileFooter.style.display = 'flex';
      } else {
        if (leftPane) leftPane.style.display = 'flex';
        if (rightPane) rightPane.style.display = 'block';
        if (mobileFooter) mobileFooter.style.display = 'none';
      }
      updateChatView();
      updateCount();
      updateDashboardButton();
    }

    function save(k, v) { try { localStorage.setItem(k, String(v)); } catch { } }
    function updateCount() { if (count && chatInput) count.textContent = (chatInput.value || '').length + '/1000'; }
    function speak(text) { if (!state.tts) return; if (!('speechSynthesis' in window)) return; const u = new SpeechSynthesisUtterance(text); speechSynthesis.speak(u); }
    function updateDashboardButton() {
      if (!dashBtn) return;
      if (state.auth) {
        dashBtn.innerHTML = '<i class="fas fa-gauge-high"></i>&nbsp;Dashboard';
        dashBtn.classList.remove('guest');
      } else {
        dashBtn.innerHTML = '<i class="fas fa-gauge-high"></i>&nbsp;Dashboard';
        dashBtn.classList.add('guest');
      }
    }

    if (settingsHead && settingsBody) {
      settingsHead.addEventListener('click', () => {
        const open = settingsBody.style.display === 'block';
        settingsBody.style.display = open ? 'none' : 'block';
        settingsHead.querySelector('i.fas').className = open ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
      });
    }
    if (darkToggle) {
      darkToggle.addEventListener('click', () => {
        darkToggle.classList.toggle('active');
        state.dark = darkToggle.classList.contains('active');
        body.classList.toggle('dark', state.dark);
        save('pmerit_dark', state.dark);
      });
    }
    if (ttsToggle) {
      ttsToggle.addEventListener('click', () => {
        ttsToggle.classList.toggle('active');
        state.tts = ttsToggle.classList.contains('active');
        save('pmerit_tts', state.tts);
        if (!state.tts) speechSynthesis.cancel();
      });
    }
    if (supportToggle && supportBadge) {
      supportToggle.addEventListener('click', () => {
        supportToggle.classList.toggle('active');
        state.supportMode = supportToggle.classList.contains('active');
        supportBadge.style.display = state.supportMode ? 'inline-flex' : 'none';
      });
    }
    if (vhToggle && vhBadge && vhAvatar) {
      vhToggle.addEventListener('click', () => {
        vhToggle.classList.toggle('active');
        state.vhMode = vhToggle.classList.contains('active');
        updateChatView();
      });
    }

    function updateChatView() {
      if (!textChat || !vhStage || !vhAvatar || !vhBadge) return;
      if (state.vhMode) {
        textChat.style.display = 'none';
        vhStage.classList.add('visible');
        vhStage.classList.remove('hidden');
        vhAvatar.classList.add('active');
        vhBadge.style.display = 'inline-flex';
      } else {
        textChat.style.display = 'block';
        vhStage.classList.remove('visible');
        vhStage.classList.add('hidden');
        vhAvatar.classList.remove('active');
        vhBadge.style.display = 'none';
      }
    }

    if (dashBtn) {
      dashBtn.addEventListener('click', () => {
        if (state.auth) {
          window.location.href = 'dashboard.html';
        } else {
          alert('Please sign up to access your dashboard.');
        }
      });
    }

    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        state.auth = !state.auth;
        save('pmerit_auth', state.auth);
        updateDashboardButton();
        alert(state.auth ? 'Signed in (demo). Dashboard enabled.' : 'Signed out (demo).');
      });
    }

    const startBtn = $('#startBtn');
    if (startBtn) startBtn.addEventListener('click', () => alert('Starting learning journey…'));
    if (chatInput) chatInput.addEventListener('input', updateCount);
    if (sendBtn && chatInput && chatInput.value !== undefined) {
      sendBtn.addEventListener('click', () => {
        const text = (chatInput.value || '').trim();
        if (!text) return;
        if (welcomeMessageContainer) { welcomeMessageContainer.style.display = 'none'; }
        const me = document.createElement('article');
        me.className = 'bubble';
        me.innerHTML = '<div class="ava" style="background:#4f46e5"><i class="fas fa-user-circle"></i></div><div><h3>You</h3><p></p></div>';
        me.querySelector('p').textContent = text;
        $('#chatBody').appendChild(me);
        setTimeout(() => {
          const aiResponse = state.supportMode ? "Thank you for your inquiry. A support agent will get back to you shortly." : "Based on your goals, I recommend exploring our `UI/UX Design` career track.";
          const ai = document.createElement('article');
          ai.className = 'bubble';
          ai.innerHTML = '<div class="ava"><i class="fas fa-robot"></i></div><div><h3>PMERIT AI</h3><p></p></div>';
          ai.querySelector('p').textContent = aiResponse;
          $('#chatBody').appendChild(ai);
          speak(aiResponse);
        }, 400);
        chatInput.value = '';
        updateCount();
      });
    }

    if (careerPathsBtn && tracksModal) {
      careerPathsBtn.addEventListener('click', () => {
        if (typeof tracksModal.showModal === 'function') {
          tracksModal.showModal();
        } else {
          alert('Tracks:\n- ' + CAREER_TRACKS.join('\n- '));
        }
      });
    }
    if (tracksList && tracksModal) {
      tracksList.addEventListener('click', e => {
        const btn = e.target.closest('button.action');
        if (!btn) return;
        const idx = Number(btn.value);
        alert('Selected: ' + CAREER_TRACKS[idx]);
      });
    }

    function setVoiceTab(name) {
      if (!voiceTabs || !voicePanels) return;
      $$('[data-tab]', voiceTabs).forEach(b => { b.classList.toggle('active', b.dataset.tab === name); });
      $$('[data-panel]', voicePanels).forEach(p => { const isActive = p.dataset.panel === name; p.style.display = isActive ? '' : 'none'; });
    }
    if (voicesBtn && voicesDlg) {
      voicesBtn.addEventListener('click', () => {
        if (typeof voicesDlg.showModal === 'function') {
          voicesDlg.showModal();
        } else {
          alert('Voice Sampler requires a modern browser.');
        }
        setVoiceTab('opensource');
      });
    }
    if (voiceTabs) {
      voiceTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('button.btn');
        if (!btn) return;
        setVoiceTab(btn.dataset.tab);
      });
    }
    if (voicesDlg) {
      voicesDlg.addEventListener('play', (e) => {
        if (e.target.tagName !== 'AUDIO') return;
        voicesDlg.querySelectorAll('audio').forEach(a => { if (a !== e.target) a.pause(); });
      }, true);
    }
    if (browserTtsBtn && voiceSampleText) {
      browserTtsBtn.addEventListener('click', () => {
        const text = (voiceSampleText.value || '').trim();
        if (!text) return;
        if (!('speechSynthesis' in window)) { alert('Browser TTS not supported here.'); return; }
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      });
    }
    if (toggleLeftBtn && leftPane && rightPane && mobileFooter) {
      toggleLeftBtn.addEventListener('click', () => {
        leftPane.style.display = (leftPane.style.display === 'none' || leftPane.style.display === '') ? 'flex' : 'none';
        rightPane.style.display = 'none';
      });
    }
    if (toggleRightBtn && rightPane && leftPane && mobileFooter) {
      toggleRightBtn.addEventListener('click', () => {
        rightPane.style.display = (rightPane.style.display === 'none' || rightPane.style.display === '') ? 'block' : 'none';
        leftPane.style.display = 'none';
      });
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) {
        body.classList.add('no-scroll');
        if (leftPane) leftPane.style.display = 'flex';
        if (rightPane) rightPane.style.display = 'block';
        if (mobileFooter) mobileFooter.style.display = 'none';
      } else {
        body.classList.remove('no-scroll');
        if (leftPane) leftPane.style.display = 'none';
        if (rightPane) rightPane.style.display = 'none';
        if (mobileFooter) mobileFooter.style.display = 'flex';
      }
    });

    // Final init
    init();
  }

  // Wait for partials to be loaded before running main logic
  function whenElementsExist(ids, cb) {
    const check = () => {
      if (ids.every(id => document.getElementById(id))) {
        cb();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  }
  // IDs we expect from partials
  whenElementsExist([
    'vhToggle', 'vhAvatar', 'vhBadge', 'supportToggle', 'supportBadge', 'dashBtn',
    'settingsBox', 'rightPane', 'leftPane', 'mobileFooter', 'tracksList', 'tracksModal',
    'careerPaths', 'voicesBtn', 'voicesModal', 'voiceTabs', 'voicePanels', 'browserTtsBtn',
    'voiceSampleText', 'signInBtn', 'chatInput', 'sendBtn', 'count', 'welcomeMessageContainer',
    'textChat', 'vhStage', 'toggleLeft', 'toggleRight', 'supportAssistantPane'
  ], onReady);
});
