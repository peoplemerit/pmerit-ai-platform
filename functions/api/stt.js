/**
 * Cloudflare Pages Function - STT (Speech-to-Text) API
 * Phase 3.3-A: Stub implementation for future expansion
 * 
 * POST /api/stt
 * Body: { audioBase64: string }
 * Response: { text: string }
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
    const { audioBase64 } = body;

    // Validate input
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Invalid input',
        message: 'audioBase64 is required and must be a string'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Log request
    console.log('STT request:', {
      audioLength: audioBase64.length,
      timestamp: new Date().toISOString()
    });

    // Phase 3.3-A: Stub implementation
    // TODO (Phase 3.3-B): Integrate with Workers AI or external STT service
    // Example with Workers AI:
    // const ai = context.env.AI;
    // const audioBuffer = Buffer.from(audioBase64, 'base64');
    // const response = await ai.run('@cf/openai/whisper', {
    //   audio: audioBuffer
    // });
    // return { text: response.text };

    const mockResponse = {
      text: "This is a placeholder transcription. STT integration coming in Phase 3.3-B.",
      confidence: 0.0,
      stub: true
    };

    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('STT API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to process STT request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
