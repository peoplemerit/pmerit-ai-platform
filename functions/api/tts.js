/**
 * Cloudflare Pages Function - TTS (Text-to-Speech) API
 * Phase 3.3-A: Returns audio URL and viseme data for lip-sync
 * 
 * POST /api/tts
 * Body: { text: string, voice?: string, speed?: number }
 * Response: { audioUrl: string, visemes: Array<{v: string, t: number}>, duration: number }
 */

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // TODO: Restrict to site origin in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const body = await context.request.json();
    const { text, voice = 'default', speed = 1.0 } = body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input',
        message: 'Text is required and must be a non-empty string'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Rate limiting check (simple implementation)
    // TODO: Implement proper rate limiting using Cloudflare KV or Durable Objects
    
    // Log request (redact sensitive data)
    console.log('TTS request:', {
      textLength: text.length,
      voice,
      speed,
      timestamp: new Date().toISOString()
    });

    // Phase 3.3-A MVP: Generate mock response
    // TODO (Phase 3.3-B): Integrate with Workers AI or external TTS service
    // Example with Workers AI:
    // const ai = context.env.AI;
    // const response = await ai.run('@cf/meta/seamless-m4t-v2', {
    //   text: text,
    //   target_lang: 'eng',
    //   task: 'text_to_speech'
    // });
    
    const mockResponse = await generateMockTTSResponse(text, voice, speed);

    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('TTS API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to process TTS request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

/**
 * Generate mock TTS response for MVP
 * @private
 */
async function generateMockTTSResponse(text, voice, speed) {
  // Estimate duration (rough calculation)
  const wordsPerMinute = 150 * speed;
  const wordCount = text.split(/\s+/).length;
  const durationSeconds = (wordCount / wordsPerMinute) * 60;

  // Generate simple viseme timeline
  // In production, this would come from the TTS service
  const visemes = generateVisemeTimeline(text, durationSeconds);

  // For MVP, return a data URL placeholder (silent WAV file)
  // This is intentionally silent for the MVP phase
  // In production, this would be a signed R2 URL or Workers AI response with actual audio
  const audioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=`;

  return {
    audioUrl,
    visemes,
    duration: durationSeconds,
    voice,
    speed
  };
}

/**
 * Generate simple viseme timeline based on text
 * @private
 */
function generateVisemeTimeline(text, durationSeconds) {
  const visemes = [];
  const words = text.split(/\s+/);
  const timePerWord = durationSeconds / words.length;

  let currentTime = 0;

  words.forEach(word => {
    // Simple mapping: assign visemes based on vowels/consonants
    const chars = word.toLowerCase().split('');
    const charsPerViseme = Math.max(1, Math.floor(chars.length / 3));

    chars.forEach((char, i) => {
      if (i % charsPerViseme === 0) {
        const viseme = mapCharToViseme(char);
        visemes.push({
          v: viseme,
          t: Math.floor(currentTime * 1000) // Convert to milliseconds
        });
        currentTime += timePerWord / (chars.length / charsPerViseme);
      }
    });
  });

  return visemes;
}

/**
 * Simple character to viseme mapping
 * @private
 */
function mapCharToViseme(char) {
  const vowels = {
    'a': 'aa',
    'e': 'E',
    'i': 'I',
    'o': 'O',
    'u': 'U'
  };

  const consonants = {
    'p': 'PP', 'b': 'PP',
    'f': 'FF', 'v': 'FF',
    't': 'DD', 'd': 'DD',
    's': 'SS', 'z': 'SS',
    'k': 'kk', 'g': 'kk',
    'n': 'nn', 'm': 'PP',
    'r': 'RR', 'l': 'nn'
  };

  return vowels[char] || consonants[char] || 'DD';
}
