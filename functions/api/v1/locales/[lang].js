/**
 * Translation API Endpoint - Cloudflare Pages Function
 * GET /api/v1/locales/:lang
 *
 * Generates translated locale files on-demand using Microsoft Translator API.
 * Caches results in Cloudflare KV for subsequent requests.
 *
 * @example GET /api/v1/locales/fr → Returns French translations
 * @example GET /api/v1/locales/es → Returns Spanish translations
 *
 * Environment Variables Required:
 * - TRANSLATOR_KEY: Microsoft Translator API subscription key
 * - TRANSLATOR_REGION: Azure region (e.g., 'eastus', 'westeurope')
 * - LOCALES_KV: Cloudflare KV namespace binding for caching
 *
 * @author PMERIT Development Team
 * @version 1.0
 * @updated November 2025
 */

// Offline languages (no API translation needed)
const OFFLINE_LANGUAGES = ['en', 'yo', 'ig', 'ha'];

// Microsoft Translator API endpoint
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

/**
 * Flatten nested JSON object to dot-notation keys
 * { "a": { "b": "value" } } → { "a.b": "value" }
 */
function flattenObject(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

/**
 * Unflatten dot-notation keys back to nested object
 * { "a.b": "value" } → { "a": { "b": "value" } }
 */
function unflattenObject(obj) {
  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const keys = key.split('.');
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = obj[key];
    }
  }

  return result;
}

/**
 * Batch translate texts using Microsoft Translator API
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code (e.g., 'fr', 'es')
 * @param {string} apiKey - Microsoft Translator API key
 * @param {string} region - Azure region
 * @returns {Promise<string[]>} - Array of translated texts
 */
async function batchTranslate(texts, targetLang, apiKey, region) {
  // Microsoft Translator limits: 100 texts per request, 10,000 chars total
  const BATCH_SIZE = 100;
  const results = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const body = batch.map(text => ({ Text: text }));

    const response = await fetch(
      `${TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=en&to=${targetLang}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Translation API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const translated = data.map(item => item.translations[0].text);
    results.push(...translated);
  }

  return results;
}

/**
 * Handle GET request for locale translations
 */
export async function onRequestGet(context) {
  const { params, env, request } = context;
  const lang = params.lang;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
  };

  try {
    // Validate language code (2-3 letter ISO code)
    if (!lang || !/^[a-z]{2,3}(-[A-Z]{2})?$/.test(lang)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid language code. Use ISO 639-1 format (e.g., "fr", "es", "zh-CN")'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // For offline languages, redirect to static files
    if (OFFLINE_LANGUAGES.includes(lang)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Language "${lang}" is an offline language. Use /assets/i18n/${lang}.json instead.`,
        redirect: `/assets/i18n/${lang}.json`
      }), {
        status: 307,
        headers: {
          'Content-Type': 'application/json',
          'Location': `/assets/i18n/${lang}.json`,
          ...corsHeaders
        }
      });
    }

    // Check KV cache first
    if (env.LOCALES_KV) {
      const cached = await env.LOCALES_KV.get(`locale:${lang}`, 'json');
      if (cached) {
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            ...corsHeaders
          }
        });
      }
    }

    // Check for required environment variables
    if (!env.TRANSLATOR_KEY || !env.TRANSLATOR_REGION) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Translation service not configured. Missing TRANSLATOR_KEY or TRANSLATOR_REGION.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Fetch English translations as source
    const enResponse = await fetch(new URL('/assets/i18n/en.json', request.url));
    if (!enResponse.ok) {
      throw new Error('Failed to fetch English locale file');
    }
    const enLocale = await enResponse.json();

    // Flatten, translate, and unflatten
    const flattened = flattenObject(enLocale);
    const keys = Object.keys(flattened);
    const values = Object.values(flattened);

    // Translate all values
    const translatedValues = await batchTranslate(
      values,
      lang,
      env.TRANSLATOR_KEY,
      env.TRANSLATOR_REGION
    );

    // Rebuild the locale object
    const translatedFlat = {};
    keys.forEach((key, index) => {
      translatedFlat[key] = translatedValues[index];
    });
    const translatedLocale = unflattenObject(translatedFlat);

    // Cache in KV for future requests (30 days TTL)
    if (env.LOCALES_KV) {
      await env.LOCALES_KV.put(
        `locale:${lang}`,
        JSON.stringify(translatedLocale),
        { expirationTtl: 60 * 60 * 24 * 30 } // 30 days
      );
    }

    return new Response(JSON.stringify(translatedLocale), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Generated': new Date().toISOString(),
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('[Locales API] Error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Translation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
