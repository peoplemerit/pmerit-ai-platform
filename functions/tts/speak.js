/**
 * Cloudflare Pages Function - TTS Speak Endpoint
 * Phase 10: Cloudflare Workers AI TTS Integration
 *
 * POST /functions/tts/speak
 * Body: { text: string }
 * Query params: ?voiceEngine=<model_name>
 * Response: audio/mp3 or audio/wav blob
 *
 * Supports Cloudflare Workers AI TTS models:
 * - @cf/myshell-ai/melotts
 * - @cf/deepgram/aura-1
 * - @cf/deepgram/aura-2-en
 * - @cf/deepgram/aura-2-es
 */

// Configuration
const MAX_TEXT_LENGTH = 5000; // Maximum characters for TTS input

// Supported TTS models with language mappings
const TTS_MODELS = {
  'melotts': {
    model: '@cf/myshell-ai/melotts',
    lang: 'en'
  },
  'aura-1': {
    model: '@cf/deepgram/aura-1',
    lang: 'en'
  },
  'aura-2-en': {
    model: '@cf/deepgram/aura-2-en',
    lang: 'en'
  },
  'aura-2-es': {
    model: '@cf/deepgram/aura-2-es',
    lang: 'es'
  }
};

// Default model
const DEFAULT_MODEL = 'aura-2-en';

export async function onRequestPost(context) {
  const corsHeaders = {
    // TODO: Restrict to site origin in production
    // 'Access-Control-Allow-Origin': 'https://your-domain.com',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const startTime = Date.now();

  try {
    const body = await context.request.json();
    const { text } = body;

    // Get voice engine from query params
    const url = new URL(context.request.url);
    const voiceEngine = url.searchParams.get('voiceEngine') || 'aura-2-en';

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        message: 'Text is required and must be a non-empty string'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Validate text length to prevent resource exhaustion
    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        message: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get the model configuration
    const modelConfig = TTS_MODELS[voiceEngine] || TTS_MODELS[DEFAULT_MODEL];
    const model = modelConfig.model;
    const lang = modelConfig.lang;

    // Log request
    console.log('TTS speak request:', {
      textLength: text.length,
      voiceEngine: voiceEngine,
      model: model,
      lang: lang,
      timestamp: new Date().toISOString()
    });

    // Try to use Cloudflare Workers AI
    if (context.env.AI) {
      try {
        // Call Workers AI for TTS
        const aiResponse = await context.env.AI.run(model, {
          text: text,
          lang: lang
        });

        const latency = Date.now() - startTime;
        console.log('TTS generation successful:', {
          voiceEngine: voiceEngine,
          latency: latency
        });

        // Return the audio response
        return new Response(aiResponse, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mp3',
            'X-TTS-Engine': voiceEngine,
            'X-TTS-Latency': latency.toString(),
            ...corsHeaders
          }
        });
      } catch (aiError) {
        console.error('Workers AI TTS error:', aiError);

        // If AI fails, return error with fallback suggestion
        return new Response(JSON.stringify({
          error: 'TTS generation failed',
          message: 'Workers AI unavailable, please use fallback',
          fallback: true
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'X-TTS-Fallback': 'required',
            ...corsHeaders
          }
        });
      }
    } else {
      // AI binding not available - return fallback response
      console.warn('AI binding not available, returning fallback');
      return new Response(JSON.stringify({
        error: 'Service unavailable',
        message: 'TTS service not configured, please use browser fallback',
        fallback: true
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-TTS-Fallback': 'required',
          ...corsHeaders
        }
      });
    }

  } catch (error) {
    console.error('TTS speak error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Failed to generate speech',
      fallback: true
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Fallback': 'required',
        ...corsHeaders
      }
    });
  }
}
