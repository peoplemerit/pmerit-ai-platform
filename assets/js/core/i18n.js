/**
 * PMERIT Internationalization (i18n)
 * Version: 1.0
 * 
 * Multi-language support for English, Yorùbá, Igbo, and Hausa
 */

(function(window) {
    'use strict';

    // ============================================
    // TRANSLATIONS
    // ============================================
    
    const translations = {
        en: {
            // Common
            welcome: 'Welcome',
            hello: 'Hello',
            goodbye: 'Goodbye',
            yes: 'Yes',
            no: 'No',
            ok: 'OK',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            
            // Navigation
            home: 'Home',
            courses: 'Courses',
            about: 'About',
            contact: 'Contact',
            dashboard: 'Dashboard',
            profile: 'Profile',
            settings: 'Settings',
            signIn: 'Sign In',
            signUp: 'Sign Up',
            signOut: 'Sign Out',
            
            // Header
            languageSelector: 'Select Language',
            menu: 'Menu',
            
            // Chat
            chatPlaceholder: 'Try: "What programming courses do you offer?"',
            sendMessage: 'Send message',
            aiThinking: 'AI is typing...',
            
            // Assessment
            beginAssessment: 'Begin Assessment',
            assessmentTitle: 'Discover Your Path',
            assessmentDescription: 'Start a short flow that blends learning style, interests, and skills into a personalized plan.',
            
            // Career Tracks
            careerTracks: 'Career Track & Explore Paths',
            globalRemoteCareer: 'Global Remote Career',
            localCareerPathways: 'Local Career Pathways',
            universityPreparation: 'University Preparation',
            
            // Features
            virtualHumanMode: 'Virtual Human Mode',
            customerServiceMode: 'Customer Service Mode',
            darkMode: 'Dark Mode',
            textToSpeech: 'Text-to-Speech',
            previewVoices: 'Preview Voices',
            
            // Forms
            email: 'Email',
            password: 'Password',
            fullName: 'Full Name',
            forgotPassword: 'Forgot password?',
            createAccount: 'Create an account',
            alreadyHaveAccount: 'Already have an account?',
            newToPmerit: 'New to Pmerit?',
            
            // Footer
            privacyTerms: 'Privacy & Terms',
            connectedToServices: 'Connected to Educational Services',
            
            // Messages
            welcomeMessage: 'Hello! I\'m here to help you explore courses, career paths, and answer any questions about your learning journey. What would you like to know?',
            vhActivated: 'Virtual Human mode activated. I\'m now using visual representation to enhance our interaction.',
            csActivated: 'Customer Service mode activated. How can I assist you today?',
            darkModeEnabled: 'Dark mode enabled',
            lightModeEnabled: 'Light mode enabled',
            ttsEnabled: 'Text-to-Speech enabled',
            ttsDisabled: 'Text-to-Speech disabled',
            languageChanged: 'Language changed to'
        },
        
        yo: {
            // Common (Yorùbá)
            welcome: 'Ẹ káàbọ̀',
            hello: 'Ẹ ku ọjọ́',
            goodbye: 'Ó dàbọ̀',
            yes: 'Bẹ́ẹ̀ni',
            no: 'Bẹ́ẹ̀kọ́',
            ok: 'Ó dára',
            cancel: 'Fagilee',
            save: 'Fi pamọ́',
            delete: 'Pajẹ',
            edit: 'Ṣàtúnṣe',
            close: 'Padé',
            loading: 'Ó ń kigbe...',
            error: 'Àṣìṣe',
            success: 'Àṣeyọrí',
            
            // Navigation
            home: 'Ilé',
            courses: 'Àwọn Ẹ̀kọ́',
            about: 'Nípa wa',
            contact: 'Kàn sí wa',
            dashboard: 'Papá àkọ́sílẹ̀',
            profile: 'Àpẹẹrẹ',
            settings: 'Ètò',
            signIn: 'Wọlé',
            signUp: 'Ìforúkọsílẹ̀',
            signOut: 'Jáde',
            
            // Header
            languageSelector: 'Yan Èdè',
            menu: 'Menu',
            
            // Chat
            chatPlaceholder: 'Gbiyanju: "Kíló ń kọ́ nípa ètò àkàntò?"',
            sendMessage: 'Firánnse',
            aiThinking: 'AI ń ronú...',
            
            // Assessment
            beginAssessment: 'Bẹ̀rẹ̀ Ìdánwò',
            assessmentTitle: 'Ṣàwárí Ọ̀nà Rẹ',
            assessmentDescription: 'Bẹ̀rẹ̀ ìlò kúkurú tó dàpọ̀ ọ̀nà ẹ̀kọ́, ìfẹ́, àti ọgbọ́n sínú ètò àkànṣe.',
            
            // Career Tracks
            careerTracks: 'Ipa Iṣẹ́ àti Ṣàwárí Ọ̀nà',
            globalRemoteCareer: 'Iṣẹ́ Jíjìn Àgbáyé',
            localCareerPathways: 'Ọ̀nà Iṣẹ́ Ìbílẹ̀',
            universityPreparation: 'Ìmúrasílẹ̀ Yunifásítì',
            
            // Features
            virtualHumanMode: 'Ìpò Ènìyàn Fọ́tò',
            customerServiceMode: 'Ìpò Ìránṣẹ́ Onílò',
            darkMode: 'Ìpò Òkùnkùn',
            textToSpeech: 'Àkọsílẹ̀-sí-Ọ̀rọ̀',
            previewVoices: 'Wò Àwọn Ohùn',
            
            // Forms
            email: 'Ímeèlì',
            password: 'Ọ̀rọ̀ àṣínà',
            fullName: 'Orúkọ Kíkún',
            forgotPassword: 'Ṣe o gbàgbé ọ̀rọ̀ àṣínà?',
            createAccount: 'Ṣẹ̀dá àkópamọ́',
            alreadyHaveAccount: 'Ṣe o ní àkọ́lẹ̀ tẹ́lẹ̀?',
            newToPmerit: 'Ṣe o tuntun sí Pmerit?',
            
            // Footer
            privacyTerms: 'Ìpamọ́ & Àwọn Òfin',
            connectedToServices: 'Ti sopọ̀ mọ́ Àwọn Iṣẹ́ Ẹ̀kọ́',
            
            // Messages
            welcomeMessage: 'Ẹ káàbọ̀! Mo wà níhìn láti ràn ọ́ lọ́wọ́ láti ṣàwárí àwọn ẹ̀kọ́, ọ̀nà iṣẹ́, àti láti dáhùn ìbéèrè kankan nípa ìrìnàjò ẹ̀kọ́ rẹ.',
            vhActivated: 'Ìpò Ènìyàn Fọ́tò ti wá. Mo ń lo àpẹẹrẹ àwòrán láti mú ìbáṣepọ̀ wa dára sí i.',
            csActivated: 'Ìpò Ìránṣẹ́ Onílò ti wá. Báwo ni mo ṣe lè ràn ọ́ lọ́wọ́ lónìí?',
            darkModeEnabled: 'Ìpò òkùnkùn ti wá',
            lightModeEnabled: 'Ìpò ìmọ́lẹ̀ ti wá',
            ttsEnabled: 'Àkọsílẹ̀-sí-Ọ̀rọ̀ ti wá',
            ttsDisabled: 'Àkọsílẹ̀-sí-Ọ̀rọ̀ ti parẹ́',
            languageChanged: 'Èdè ti yípadà sí'
        },
        
        ig: {
            // Common (Igbo)
            welcome: 'Nnọọ',
            hello: 'Kedu',
            goodbye: 'Ka ọ dị',
            yes: 'Ee',
            no: 'Mba',
            ok: 'Ọ dị mma',
            cancel: 'Kagbuo',
            save: 'Chekwaa',
            delete: 'Hichapụ',
            edit: 'Dezie',
            close: 'Mechie',
            loading: 'Na-ebu...',
            error: 'Njehie',
            success: 'Ihe ịga nke ọma',
            
            // Navigation
            home: 'Ụlọ',
            courses: 'Ọmụmụ ihe',
            about: 'Gbasara anyị',
            contact: 'Kpọtụrụ anyị',
            dashboard: 'Dashboard',
            profile: 'Profile',
            settings: 'Ntọala',
            signIn: 'Bata',
            signUp: 'Debanye aha',
            signOut: 'Pụọ',
            
            // Header
            languageSelector: 'Họrọ Asụsụ',
            menu: 'Menu',
            
            // Chat
            chatPlaceholder: 'Gbalịa: "Kedu ọmụmụ ihe mmemme unu nwere?"',
            sendMessage: 'Ziga ozi',
            aiThinking: 'AI na-eche...',
            
            // Assessment
            beginAssessment: 'Malite Nyocha',
            assessmentTitle: 'Chọpụta Ụzọ Gị',
            assessmentDescription: 'Malite usoro dị mkpụmkpụ nke na-ejikọta ụdị mmụta, mmasị, na nkà n\'ime atụmatụ ahaziri gị.',
            
            // Career Tracks
            careerTracks: 'Ụzọ Ọrụ & Nyochaa',
            globalRemoteCareer: 'Ọrụ Dịpụrụ Adịpụ Ụwa',
            localCareerPathways: 'Ụzọ Ọrụ Mpaghara',
            universityPreparation: 'Nkwadebe Mahadum',
            
            // Features
            virtualHumanMode: 'Ọnọdụ Mmadụ Nkịtị',
            customerServiceMode: 'Ọnọdụ Ọrụ Ndị Ahịa',
            darkMode: 'Ọnọdụ Ọchịchịrị',
            textToSpeech: 'Ederede-ka-Okwu',
            previewVoices: 'Lelee Olu',
            
            // Forms
            email: 'Email',
            password: 'Okwuntughe',
            fullName: 'Aha Zuru Ezu',
            forgotPassword: 'Chefuru okwuntughe?',
            createAccount: 'Mepụta akaụntụ',
            alreadyHaveAccount: 'Ị nwere akaụntụ?',
            newToPmerit: 'Ọhụrụ na Pmerit?',
            
            // Footer
            privacyTerms: 'Nzuzo & Usoro',
            connectedToServices: 'Ejikọtara na Ọrụ Mmụta',
            
            // Messages
            welcomeMessage: 'Nnọọ! Anọ m ebe a inyere gị aka ịchọpụta ọmụmụ ihe, ụzọ ọrụ, na ịza ajụjụ ọ bụla gbasara njem mmụta gị.',
            vhActivated: 'Arụnyere ọnọdụ Mmadụ Nkịtị. Ana m eji ọnọdụ a eme ka mmekọrịta anyị dịkwuo mma.',
            csActivated: 'Arụnyere ọnọdụ Ọrụ Ndị Ahịa. Kedu ka m ga-esi nyere gị aka taa?',
            darkModeEnabled: 'Arụnyere ọnọdụ ọchịchịrị',
            lightModeEnabled: 'Arụnyere ọnọdụ ọkụ',
            ttsEnabled: 'Arụnyere Ederede-ka-Okwu',
            ttsDisabled: 'Gbanyụrụ Ederede-ka-Okwu',
            languageChanged: 'Agbanwere asụsụ gaa na'
        },
        
        ha: {
            // Common (Hausa)
            welcome: 'Barka da zuwa',
            hello: 'Sannu',
            goodbye: 'Sai anjima',
            yes: 'Ee',
            no: 'A\'a',
            ok: 'To',
            cancel: 'Soke',
            save: 'Ajiye',
            delete: 'Goge',
            edit: 'Gyara',
            close: 'Rufe',
            loading: 'Ana lodawa...',
            error: 'Kuskure',
            success: 'Nasara',
            
            // Navigation
            home: 'Gida',
            courses: 'Darussa',
            about: 'Game da mu',
            contact: 'Tuntube mu',
            dashboard: 'Dashboard',
            profile: 'Profile',
            settings: 'Saituna',
            signIn: 'Shiga',
            signUp: 'Yi rajista',
            signOut: 'Fita',
            
            // Header
            languageSelector: 'Zaɓi Harshe',
            menu: 'Menu',
            
            // Chat
            chatPlaceholder: 'Gwada: "Wane darussan shirye-shirye kuke bayarwa?"',
            sendMessage: 'Aika saƙo',
            aiThinking: 'AI yana tunani...',
            
            // Assessment
            beginAssessment: 'Fara Gwaji',
            assessmentTitle: 'Gano Hanyar Ka',
            assessmentDescription: 'Fara gwaji gajere wanda ya haɗa salon koyo, sha\'awa, da ƙwarewa zuwa tsarin da aka keɓance maka.',
            
            // Career Tracks
            careerTracks: 'Hanyoyin Sana\'a & Binciko',
            globalRemoteCareer: 'Sana\'ar Nesa Ta Duniya',
            localCareerPathways: 'Hanyoyin Sana\'a Na Gida',
            universityPreparation: 'Shirye-shiryen Jami\'a',
            
            // Features
            virtualHumanMode: 'Yanayin Mutum Na Kama-da-Yake',
            customerServiceMode: 'Yanayin Sabis Na Abokin Ciniki',
            darkMode: 'Yanayin Duhu',
            textToSpeech: 'Rubutu-zuwa-Magana',
            previewVoices: 'Duba Muryoyi',
            
            // Forms
            email: 'Email',
            password: 'Kalmar sirri',
            fullName: 'Cikakken Suna',
            forgotPassword: 'Ka manta da kalmar sirri?',
            createAccount: 'Ƙirƙiri asusu',
            alreadyHaveAccount: 'Kana da asusu?',
            newToPmerit: 'Sabon ga Pmerit?',
            
            // Footer
            privacyTerms: 'Sirri & Sharuɗɗa',
            connectedToServices: 'An haɗa zuwa Sabis Na Ilimi',
            
            // Messages
            welcomeMessage: 'Sannu! Ina nan don in taimake ka binciko darussa, hanyoyin sana\'a, da amsa kowace tambaya game da tafiyar koyonka.',
            vhActivated: 'An kunna yanayin Mutum Na Kama-da-Yake. Yanzu ina amfani da wakilci na gani don haɓaka hulɗar mu.',
            csActivated: 'An kunna yanayin Sabis Na Abokin Ciniki. Ta yaya zan iya taimaka maka yau?',
            darkModeEnabled: 'An kunna yanayin duhu',
            lightModeEnabled: 'An kunna yanayin haske',
            ttsEnabled: 'An kunna Rubutu-zuwa-Magana',
            ttsDisabled: 'An kashe Rubutu-zuwa-Magana',
            languageChanged: 'An canza harshe zuwa'
        }
    };

    // ============================================
    // i18n MANAGER
    // ============================================
    
    const i18nManager = {
        currentLanguage: 'en',
        
        /**
         * Initialize i18n
         */
        init: function() {
            // Load saved language
            const savedLanguage = localStorage.getItem('pmerit-language') || 'en';
            this.setLanguage(savedLanguage);
            console.log('✅ i18n Manager initialized');
        },
        
        /**
         * Set current language
         */
        setLanguage: function(code) {
            if (translations[code]) {
                this.currentLanguage = code;
                localStorage.setItem('pmerit-language', code);
                this.updatePageText();
            } else {
                console.warn(`Language "${code}" not supported`);
            }
        },
        
        /**
         * Get translation for a key
         */
        t: function(key, lang = null) {
            const language = lang || this.currentLanguage;
            
            if (translations[language] && translations[language][key]) {
                return translations[language][key];
            }
            
            // Fallback to English
            if (translations['en'][key]) {
                return translations['en'][key];
            }
            
            // Return key if no translation found
            return key;
        },
        
        /**
         * Update all page text with translations
         */
        updatePageText: function() {
            // Find all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.dataset.i18n;
                const translation = this.t(key);
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });
        },
        
        /**
         * Get current language
         */
        getCurrentLanguage: function() {
            return this.currentLanguage;
        },
        
        /**
         * Get all supported languages
         */
        getSupportedLanguages: function() {
            return Object.keys(translations);
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITi18n = i18nManager;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => i18nManager.init());
    } else {
        i18nManager.init();
    }

})(window);
