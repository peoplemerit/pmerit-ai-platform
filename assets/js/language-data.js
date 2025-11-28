/**
 * PMERIT Language Data
 * Complete list of Google Translate supported languages
 *
 * Structure:
 * - code: Google Translate language code
 * - name: English name
 * - nativeName: Name in native script
 * - offline: true if Language Manager supports offline mode (en, yo, ig, ha)
 * - region: Emoji flag or region indicator
 */

window.PMERIT_LANGUAGES = [
  // ============================================
  // PRIORITY LANGUAGES (Platform Focus)
  // ============================================
  { code: 'en', name: 'English', nativeName: 'English', offline: true, region: '🌐' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', offline: true, region: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', offline: true, region: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', offline: true, region: '🇳🇬' },

  // ============================================
  // ALL LANGUAGES (Alphabetical by English name)
  // ============================================
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', offline: false, region: '🇿🇦' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', offline: false, region: '🇦🇱' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', offline: false, region: '🇪🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', offline: false, region: '🇸🇦' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերdelays', offline: false, region: '🇦🇲' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', offline: false, region: '🇮🇳' },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', offline: false, region: '🇧🇴' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', offline: false, region: '🇦🇿' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', offline: false, region: '🇲🇱' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', offline: false, region: '🇪🇸' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', offline: false, region: '🇧🇾' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', offline: false, region: '🇧🇩' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', offline: false, region: '🇮🇳' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', offline: false, region: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', offline: false, region: '🇧🇬' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', offline: false, region: '🇪🇸' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano', offline: false, region: '🇵🇭' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', offline: false, region: '🇲🇼' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', offline: false, region: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', offline: false, region: '🇹🇼' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', offline: false, region: '🇫🇷' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', offline: false, region: '🇭🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', offline: false, region: '🇨🇿' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', offline: false, region: '🇩🇰' },
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', offline: false, region: '🇲🇻' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', offline: false, region: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', offline: false, region: '🇳🇱' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', offline: false, region: '🌐' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', offline: false, region: '🇪🇪' },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', offline: false, region: '🇬🇭' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', offline: false, region: '🇵🇭' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', offline: false, region: '🇫🇮' },
  { code: 'fr', name: 'French', nativeName: 'Français', offline: false, region: '🇫🇷' },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk', offline: false, region: '🇳🇱' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', offline: false, region: '🇪🇸' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', offline: false, region: '🇬🇪' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', offline: false, region: '🇩🇪' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', offline: false, region: '🇬🇷' },
  { code: 'gn', name: 'Guarani', nativeName: "Avañe'ẽ", offline: false, region: '🇵🇾' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', offline: false, region: '🇮🇳' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', offline: false, region: '🇭🇹' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', offline: false, region: '🇺🇸' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', offline: false, region: '🇮🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', offline: false, region: '🇮🇳' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob', offline: false, region: '🌏' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', offline: false, region: '🇭🇺' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', offline: false, region: '🇮🇸' },
  { code: 'ilo', name: 'Ilocano', nativeName: 'Ilokano', offline: false, region: '🇵🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', offline: false, region: '🇮🇩' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', offline: false, region: '🇮🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', offline: false, region: '🇮🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', offline: false, region: '🇯🇵' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', offline: false, region: '🇮🇩' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', offline: false, region: '🇮🇳' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', offline: false, region: '🇰🇿' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', offline: false, region: '🇰🇭' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', offline: false, region: '🇷🇼' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', offline: false, region: '🇮🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', offline: false, region: '🇰🇷' },
  { code: 'kri', name: 'Krio', nativeName: 'Krio', offline: false, region: '🇸🇱' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî', offline: false, region: '🌍' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'سۆرانی', offline: false, region: '🌍' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', offline: false, region: '🇰🇬' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', offline: false, region: '🇱🇦' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', offline: false, region: '🏛️' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', offline: false, region: '🇱🇻' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', offline: false, region: '🇨🇩' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', offline: false, region: '🇱🇹' },
  { code: 'lg', name: 'Luganda', nativeName: 'Luganda', offline: false, region: '🇺🇬' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', offline: false, region: '🇱🇺' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', offline: false, region: '🇲🇰' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', offline: false, region: '🇮🇳' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', offline: false, region: '🇲🇬' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', offline: false, region: '🇲🇾' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', offline: false, region: '🇮🇳' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', offline: false, region: '🇲🇹' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', offline: false, region: '🇳🇿' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', offline: false, region: '🇮🇳' },
  { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', offline: false, region: '🇮🇳' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', offline: false, region: '🇮🇳' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', offline: false, region: '🇲🇳' },
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာ', offline: false, region: '🇲🇲' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', offline: false, region: '🇳🇵' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', offline: false, region: '🇳🇴' },
  { code: 'or', name: 'Odia (Oriya)', nativeName: 'ଓଡ଼ିଆ', offline: false, region: '🇮🇳' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', offline: false, region: '🇪🇹' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', offline: false, region: '🇦🇫' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', offline: false, region: '🇮🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', offline: false, region: '🇵🇱' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', offline: false, region: '🇵🇹' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', offline: false, region: '🇮🇳' },
  { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', offline: false, region: '🇵🇪' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', offline: false, region: '🇷🇴' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', offline: false, region: '🇷🇺' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', offline: false, region: '🇼🇸' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', offline: false, region: '🇮🇳' },
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig', offline: false, region: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'nso', name: 'Sepedi', nativeName: 'Sepedi', offline: false, region: '🇿🇦' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', offline: false, region: '🇷🇸' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', offline: false, region: '🇱🇸' },
  { code: 'sn', name: 'Shona', nativeName: 'ChiShona', offline: false, region: '🇿🇼' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', offline: false, region: '🇵🇰' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', offline: false, region: '🇱🇰' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', offline: false, region: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', offline: false, region: '🇸🇮' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', offline: false, region: '🇸🇴' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', offline: false, region: '🇪🇸' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', offline: false, region: '🇮🇩' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', offline: false, region: '🇰🇪' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', offline: false, region: '🇸🇪' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', offline: false, region: '🇹🇯' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', offline: false, region: '🇮🇳' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татар', offline: false, region: '🇷🇺' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', offline: false, region: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', offline: false, region: '🇹🇭' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', offline: false, region: '🇪🇷' },
  { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga', offline: false, region: '🇿🇦' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', offline: false, region: '🇹🇷' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', offline: false, region: '🇹🇲' },
  { code: 'ak', name: 'Twi', nativeName: 'Twi', offline: false, region: '🇬🇭' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', offline: false, region: '🇺🇦' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', offline: false, region: '🇵🇰' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', offline: false, region: '🇨🇳' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', offline: false, region: '🇺🇿' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', offline: false, region: '🇻🇳' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', offline: false, region: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', offline: false, region: '🇿🇦' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', offline: false, region: '🌍' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', offline: false, region: '🇿🇦' }
];

// Helper function to get language by code
window.PMERIT_LANGUAGES.getByCode = function(code) {
  return this.find(function(lang) {
    return lang.code === code;
  });
};

// Helper function to get priority/offline languages
window.PMERIT_LANGUAGES.getOfflineLanguages = function() {
  return this.filter(function(lang) {
    return lang.offline === true;
  });
};

// Helper function to search languages
window.PMERIT_LANGUAGES.search = function(query) {
  var q = query.toLowerCase().trim();
  if (!q) return this;

  return this.filter(function(lang) {
    return lang.name.toLowerCase().includes(q) ||
           lang.nativeName.toLowerCase().includes(q) ||
           lang.code.toLowerCase().includes(q);
  });
};

console.log('[PMERIT] Language data loaded:', window.PMERIT_LANGUAGES.length, 'languages');
