/**
 * Translation Utility for AI Chat
 * Uses Microsoft Translator API for real-time message translation
 *
 * Supports bidirectional translation:
 * - User message (any language) → English (for AI processing)
 * - AI response (English) → User's language
 *
 * @version 1.0.0
 * @updated November 2025
 */

// Microsoft Translator API endpoint
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

// Languages that don't need translation (AI understands them well)
// For these, we'll use prompt engineering instead of translation
const AI_NATIVE_LANGUAGES = ['en'];

// Language code mappings for Microsoft Translator
const LANGUAGE_MAPPINGS = {
  'yo': 'yo',   // Yoruba
  'ig': 'ig',   // Igbo
  'ha': 'ha',   // Hausa
  'fr': 'fr',   // French
  'es': 'es',   // Spanish
  'pt': 'pt',   // Portuguese
  'ar': 'ar',   // Arabic
  'zh': 'zh-Hans', // Chinese Simplified
  'hi': 'hi',   // Hindi
  'sw': 'sw'    // Swahili
};

/**
 * Translate text using Microsoft Translator API
 *
 * @param {string} text - Text to translate
 * @param {string} from - Source language code (e.g., 'yo', 'en')
 * @param {string} to - Target language code (e.g., 'en', 'yo')
 * @param {object} env - Environment with TRANSLATOR_KEY, TRANSLATOR_REGION
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, from, to, env) {
  // Skip translation if same language or empty text
  if (from === to || !text || text.trim() === '') {
    return text;
  }

  // Map language codes if needed
  const fromLang = LANGUAGE_MAPPINGS[from] || from;
  const toLang = LANGUAGE_MAPPINGS[to] || to;

  try {
    const params = new URLSearchParams({
      'api-version': '3.0',
      'from': fromLang,
      'to': toLang
    });

    const response = await fetch(`${TRANSLATOR_ENDPOINT}/translate?${params}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': env.TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': env.TRANSLATOR_REGION || 'eastus2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ Text: text }])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Translator] API error:', response.status, errorText);
      // Return original text on error (graceful degradation)
      return text;
    }

    const data = await response.json();
    const translated = data[0]?.translations[0]?.text;

    if (translated) {
      return translated;
    }

    return text;
  } catch (error) {
    console.error('[Translator] Error:', error);
    // Return original text on error (graceful degradation)
    return text;
  }
}

/**
 * Detect the language of a text
 *
 * @param {string} text - Text to detect language for
 * @param {object} env - Environment with TRANSLATOR_KEY, TRANSLATOR_REGION
 * @returns {Promise<string>} - Detected language code
 */
export async function detectLanguage(text, env) {
  if (!text || text.trim() === '') {
    return 'en';
  }

  try {
    const response = await fetch(`${TRANSLATOR_ENDPOINT}/detect?api-version=3.0`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': env.TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': env.TRANSLATOR_REGION || 'eastus2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ Text: text }])
    });

    if (!response.ok) {
      return 'en';
    }

    const data = await response.json();
    return data[0]?.language || 'en';
  } catch (error) {
    console.error('[Translator] Detection error:', error);
    return 'en';
  }
}

/**
 * Check if a language requires translation for AI processing
 *
 * @param {string} langCode - Language code
 * @returns {boolean} - True if translation is needed
 */
export function needsTranslation(langCode) {
  return !AI_NATIVE_LANGUAGES.includes(langCode);
}

/**
 * Get cultural context prompt addition for a language
 * This helps the AI provide culturally relevant responses
 *
 * @param {string} langCode - Language code
 * @returns {string} - Cultural context addition to system prompt
 */
export function getCulturalContext(langCode) {
  const contexts = {
    'yo': 'The user speaks Yoruba and is likely from Nigeria or the Yoruba diaspora. Be aware of Nigerian cultural context, local expressions, and the importance of respect and family values in communication.',
    'ig': 'The user speaks Igbo and is likely from Nigeria or the Igbo diaspora. Be aware of Nigerian cultural context, entrepreneurial values, and the importance of community in Igbo culture.',
    'ha': 'The user speaks Hausa and is likely from Northern Nigeria or neighboring regions. Be aware of the cultural context, Islamic values that may be relevant, and traditional respectful communication styles.',
    'fr': 'The user speaks French. Be aware of francophone cultural context which may include African French-speaking countries.',
    'ar': 'The user speaks Arabic. Be respectful of cultural and religious contexts that may be relevant.',
    'sw': 'The user speaks Swahili and is likely from East Africa (Kenya, Tanzania, etc.). Be aware of East African cultural context.',
    'pt': 'The user speaks Portuguese. They may be from Brazil, Portugal, or African Portuguese-speaking countries like Angola or Mozambique.',
    'es': 'The user speaks Spanish. They may be from Spain, Latin America, or other Spanish-speaking regions.',
    'zh': 'The user speaks Chinese. Be aware of Chinese cultural context and communication styles.',
    'hi': 'The user speaks Hindi and is likely from India. Be aware of Indian cultural context.'
  };

  return contexts[langCode] || '';
}

/**
 * Get the display name of a language
 *
 * @param {string} langCode - Language code
 * @returns {string} - Display name
 */
export function getLanguageName(langCode) {
  const names = {
    'en': 'English',
    'yo': 'Yoruba',
    'ig': 'Igbo',
    'ha': 'Hausa',
    'fr': 'French',
    'es': 'Spanish',
    'pt': 'Portuguese',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'hi': 'Hindi',
    'sw': 'Swahili'
  };

  return names[langCode] || langCode;
}
