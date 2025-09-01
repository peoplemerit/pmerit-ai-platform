/**
 * ============================================================================= 
 * PMERIT INTERNATIONALIZATION - Phase 1 Module
 * Multi-language support extracted from your index.html
 * =============================================================================
 */

export class I18n {
  constructor() {
    this.currentLang = 'en';
    this.translations = this.getTranslations();
    this.initialized = false;
  }

  /**
   * Your existing translation data
   */
  getTranslations() {
    return {
      en: {
        donate: "Donate", signIn: "Sign In", startLearning: "Start Learning", quickActions: "Quick Actions",
        virtualHuman: "Virtual Human Mode", careerPaths: "Career Track & Explore Paths", supportMode: "Customer Service Mode",
        settings: "Settings", darkMode: "Dark Mode", tts: "Text-to-Speech", previewVoices: "Preview Voices",
        dashboard: "Dashboard", virtualHumanShort: "Virtual Human", supportAssistant: "Support Assistant",
        askAboutPmerit: "Ask me about PMERIT", supportShort: "Support", discoverYourPath: "Discover Your Path (AI)",
        discoverTitle: "Personalized learning plan", discoverCopy: "Start a short flow that blends learning style, interests, and skills into a plan.",
        beginAssessment: "Begin Assessment", connected: "Connected to Educational Services", privacy: "Privacy & Terms",
        contact: "Contact", partners: "Partnerships", support: "Support", vhModeShort: "VH Mode", readAbout: "Read",
        createAccount: "Create your PMERIT account", createAccountShort: "Create account", fullName: "Full name", email: "Email", password: "Password",
        termsCopy: "By continuing you agree to our terms.", cancel: "Cancel", signInToPmerit: "Sign in to PMERIT",
        voiceSampler: "Voice Sampler", sampleText: "Sample text", browserTts: "Browser TTS (fallback)", close: "Close",
        exploreTracks: "Explore Career Tracks", assessmentFlow: "Discover Your Path – Quick Assessment",
        step1: "Learning style: a few preferences.", step2: "Interests: choose areas you enjoy.", step3: "Skills: rate comfort with common tools.",
        assessmentNote: "This MVP flow records your choices locally and shows a suggested track.", start: "Start",
        supportPmerit: "Support PMERIT", donateCopy: "Your donation helps keep education accessible. Choose a method:"
      },
      yo: {
        donate: "Ṣe Ìrànlọ́wọ́", signIn: "Wọlé", startLearning: "Bẹ̀rẹ̀ Kẹ́kọ̀ọ́", quickActions: "Ìṣe Kánkán",
        virtualHuman: "Ọ̀nà Èdá Oníròyìn", careerPaths: "Ọ̀nà Ọ̀fí̀si & Ṣàwárí Ọ̀pọ́ Ọ̀nà", supportMode: "Ọ̀nà Ìbánisọ̀rọ̀ Onífẹ̀ẹ̀",
        settings: "Ètò", darkMode: "Ìròlé Dúdú", tts: "Ọrọ sí Ohùn", previewVoices: "Ṣàyẹ̀wò Ohùn",
        dashboard: "Dasibodu", virtualHumanShort: "Oníròyìn", supportAssistant: "Olùrànlọ́wọ́ Atílẹyin",
        askAboutPmerit: "Bèrè nípa PMERIT", supportShort: "Atílẹyin", discoverYourPath: "Ṣàwárí Ọ̀nà Rẹ (AI)",
        discoverTitle: "Ètò ìkẹ́kọ̀ọ́ ti ara ẹni", discoverCopy: "Bẹ̀rẹ̀ ìrìn jò kékeré tó darāpọ̀ ìfẹ́kẹ́kọ̀ọ́, ìfẹ́ sí ọ̀rọ̀, àti ọ̀gbọ́n.",
        beginAssessment: "Bẹ̀rẹ̀ Ayẹwo", connected: "So pọ̀ mọ́ Èka Èkọ", privacy: "Ìpamọ́ & Òfin",
        contact: "Olúbasọ̀rọ̀", partners: "Alábá àṣiṣẹ́pọ̀", support: "Atílẹyin", vhModeShort: "VH",
        readAbout: "Kà", createAccount: "Ṣẹda àkọ́ọlẹ PMERIT rẹ", createAccountShort: "Ṣẹda àkọ́ọlẹ", fullName: "Orúkọ kíkun",
        email: "Imeeli", password: "Ọrọigbaniwọle", termsCopy: "Nípasẹ̀ tẹ́síwájú o gba ìlànà wa.",
        cancel: "Fagìlé", signInToPmerit: "Wọlé sí PMERIT", voiceSampler: "Ayẹwo Ohùn", sampleText: "Ìkànsí ọrọ",
        browserTts: "Ohùn ẹrọ aṣàwákiri", close: "Pa", exploreTracks: "Ṣàwárí Ọ̀nà Ọ̀fí̀si",
        assessmentFlow: "Ṣàwárí Ọ̀nà Rẹ – Ayẹwo Kékeré", step1: "Ìfẹ́kẹ́kọ̀ọ́:", step2: "Ìfẹ́ sí ọ̀rọ̀:", step3: "Ọ̀gbọ́n:",
        assessmentNote: "Ìpele MVP yìí n fipamọ́ yín jà rẹ lókálì.", start: "Bẹ̀rẹ̀", supportPmerit: "Ṣe Ìrànlọ́wọ́ PMERIT",
        donateCopy: "Ìrànlọ́wọ́ rẹ ń rán wa lọ́wọ́."
      },
      ig: {
        donate: "Nyefee aka", signIn: "Banye", startLearning: "Bido ọmụmụ", quickActions: "Ngwa ngwa",
        virtualHuman: "Ụdị mmadụ Virtual", careerPaths: "Ụzọ ọrụ & chọgharịa", supportMode: "Ụzọ nkwado ahịa",
        settings: "Ntọala", darkMode: "Ọnọdụ ọchịchịrị", tts: "Okwu gaa n'olu", previewVoices: "Nlele olu",
        dashboard: "Dashboard", virtualHumanShort: "Virtual Human", supportAssistant: "Onye enyemaka nkwado",
        askAboutPmerit: "Jụọ gbasara PMERIT", supportShort: "Nkwado", discoverYourPath: "Chọpụta ụzọ gị (AI)",
        discoverTitle: "Atụmatụ mmụta nke onwe", discoverCopy: "Bido obere usoro jikọtara ụdị mmụta, mmasị, na nkà.",
        beginAssessment: "Bido nyocha", connected: "Ejikọrọ na ọrụ agụmakwụkwụ", privacy: "Nzuzo & Usoro",
        contact: "Kpọtụrụ", partners: "Ụmụ mmekọ", support: "Nkwado", vhModeShort: "VH", readAbout: "Gụọ",
        createAccount: "Mepụta akaụntụ PMERIT gị", createAccountShort: "Mepụta akaụntụ", fullName: "Aha zuru ezu",
        email: "Email", password: "Okwuntughe", termsCopy: "Iji gawa n'ihu ị na-ekweta iwu anyị.",
        cancel: "Kagbuo", signInToPmerit: "Banye na PMERIT", voiceSampler: "Nlele olu", sampleText: "Okwu nlele",
        browserTts: "TTS nchọgharị", close: "Mechie", exploreTracks: "Chọgharịa ụzọ ọrụ",
        assessmentFlow: "Chọpụta ụzọ gị – nyocha ngwa ngwa", step1: "Ụdị mmụta:", step2: "Mmasị:", step3: "Nkà:",
        assessmentNote: "MVP a na-edebe nhọrọ gị n'ime ngwaọrụ.", start: "Bido",
        supportPmerit: "Soro kwado PMERIT", donateCopy: "Nkwado gị na-enyere ka agụmakwụkwụ bụrụ nke onye ọ bụla."
      },
      ha: {
        donate: "Ba da gudummawa", signIn: "Shiga", startLearning: "Fara koyo", quickActions: "Ayyuka na gaggawa",
        virtualHuman: "Yanayin Virtual Human", careerPaths: "Hanyoyin aiki & binciko", supportMode: "Yanayin Tallafi",
        settings: "Saituna", darkMode: "Yanayin duhu", tts: "Rubutu zuwa murya", previewVoices: "Duba muryoyi",
        dashboard: "Dashboard", virtualHumanShort: "Virtual Human", supportAssistant: "Mataimakin Tallafi",
        askAboutPmerit: "Tambaye ni game da PMERIT", supportShort: "Tallafi", discoverYourPath: "Gano Hanyarka (AI)",
        discoverTitle: "Shirin koyo na kai", discoverCopy: "Fara gajeriyar hanya wacce ta haɗa salon koyo, sha'awa, da ƙwarewa.",
        beginAssessment: "Fara gwaji", connected: "An haɗa zuwa ayyukan ilimi", privacy: "Sirri & Ka'idoji",
        contact: "Tuntuɓi", partners: "Abokan hulɗa", support: "Tallafi", vhModeShort: "VH", readAbout: "Karanta",
        createAccount: "Ƙirƙiri asusun PMERIT", createAccountShort: "Ƙirƙiri asusu", fullName: "Cikakken suna",
        email: "Imel", password: "Kalmar sirri", termsCopy: "Ta ci gaba kana yarda da sharuddanmu.",
        cancel: "Soke", signInToPmerit: "Shiga PMERIT", voiceSampler: "Nuna muryoyi", sampleText: "Rubutu samfurin",
        browserTts: "TTS na mai bincike", close: "Rufe", exploreTracks: "Binciki hanyoyin aiki",
        assessmentFlow: "Gano Hanyarka – gajeren gwaji", step1: "Salon koyo:", step2: "Sha'awa:", step3: "Kwarewa:",
        assessmentNote: "Wannan MVP yana adana zaɓinka a na'ura.", start: "Fara", supportPmerit: "Tallafa wa PMERIT",
        donateCopy: "Gudummawarka tana tallafawa ilimi ga kowa."
      }
    };
  }

  /**
   * Initialize with a language
   */
  init(langCode = 'en') {
    this.currentLang = langCode;
    this.initialized = true;
    this.applyTranslations();
    return this;
  }

  /**
   * Set language and update UI
   */
  setLanguage(langCode) {
    if (!this.translations[langCode]) {
      console.warn(`Language ${langCode} not supported, falling back to English`);
      langCode = 'en';
    }
    
    this.currentLang = langCode;
    this.applyTranslations();
    
    // Update language selector if it exists
    const langSelect = document.querySelector('#lang');
    if (langSelect) {
      langSelect.value = langCode;
    }
    
    return this;
  }

  /**
   * Get translation for a key
   */
  t(key, defaultValue = key) {
    const translations = this.translations[this.currentLang] || this.translations.en;
    return translations[key] || defaultValue;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    if (!this.initialized) return;
    
    const elements = document.querySelectorAll('[data-i18n]');
    const translations = this.translations[this.currentLang] || this.translations.en;
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });
    
    return this;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Check if language is supported
   */
  isSupported(langCode) {
    return this.translations.hasOwnProperty(langCode);
  }

  /**
   * Add or update translations for a language
   */
  addTranslations(langCode, translations) {
    if (!this.translations[langCode]) {
      this.translations[langCode] = {};
    }
    
    Object.assign(this.translations[langCode], translations);
    
    // Re-apply if this is the current language
    if (langCode === this.currentLang) {
      this.applyTranslations();
    }
    
    return this;
  }

  /**
   * Get language info for UI display
   */
  getLanguageInfo() {
    return {
      en: { name: 'English', native: 'English' },
      yo: { name: 'Yoruba', native: 'Yorùbá' },
      ig: { name: 'Igbo', native: 'Igbo' },
      ha: { name: 'Hausa', native: 'Hausa' }
    };
  }

  /**
   * Detect user's preferred language from browser
   */
  detectLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    const langCode = browserLang.split('-')[0];
    
    return this.isSupported(langCode) ? langCode : 'en';
  }

  /**
   * Set up automatic language detection and selector
   */
  setupLanguageSelector(selectorId = '#lang') {
    const selector = document.querySelector(selectorId);
    if (!selector) return;
    
    // Auto-detect if no language is set
    if (!this.currentLang || this.currentLang === 'en') {
      const detected = this.detectLanguage();
      if (detected !== 'en') {
        this.setLanguage(detected);
      }
    }
    
    // Set up change handler
    selector.addEventListener('change', (event) => {
      this.setLanguage(event.target.value);
    });
    
    return this;
  }

  /**
   * Format numbers according to current language
   */
  formatNumber(number, options = {}) {
    const locale = this.getLocaleFromLanguage(this.currentLang);
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * Format dates according to current language
   */
  formatDate(date, options = {}) {
    const locale = this.getLocaleFromLanguage(this.currentLang);
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  }

  /**
   * Get locale string from language code
   */
  getLocaleFromLanguage(langCode) {
    const localeMap = {
      en: 'en-US',
      yo: 'yo-NG',
      ig: 'ig-NG', 
      ha: 'ha-NG'
    };
    
    return localeMap[langCode] || 'en-US';
  }

  /**
   * Debug helper
   */
  debug() {
    console.group('🌍 PMERIT I18n Debug');
    console.log('Current language:', this.currentLang);
    console.log('Available languages:', this.getAvailableLanguages());
    console.log('Elements with translations:', document.querySelectorAll('[data-i18n]').length);
    console.log('Browser language:', navigator.language);
    console.groupEnd();
    return this;
  }
}
