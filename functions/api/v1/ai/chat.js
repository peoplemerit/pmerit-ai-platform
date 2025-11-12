/**
 * AI Chat Endpoint - Cloudflare Workers AI
 * POST /api/v1/ai/chat
 *
 * Handles streaming AI chat requests using Cloudflare Workers AI
 * Model: @cf/meta/llama-3.1-8b-instruct
 *
 * @updated November 12, 2025 - Restored missing AI chat endpoint
 */

/**
 * Handle POST request - AI Chat with Streaming
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // Parse request body
    const body = await request.json();
    const { messages } = body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid request: messages array is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Log request for debugging (disabled in production)
    // console.log('🤖 AI Chat Request:', {
    //   messageCount: messages.length,
    //   lastMessage: messages[messages.length - 1]?.content?.substring(0, 50)
    // });

    // Call Cloudflare Workers AI with streaming
    const response = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      {
        messages,
        stream: true
      }
    );

    // Transform the response into SSE format expected by frontend
    // Frontend expects: data: {"response": "text", "done": false}
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream in the background
    (async () => {
      try {
        for await (const chunk of response) {
          // Cloudflare AI returns chunks with 'response' field
          if (chunk.response) {
            // Format as SSE
            const sseData = `data: ${JSON.stringify({
              response: chunk.response,
              done: false
            })}\n\n`;
            await writer.write(encoder.encode(sseData));
          }
        }

        // Send final done message
        const doneData = `data: ${JSON.stringify({
          response: '',
          done: true
        })}\n\n`;
        await writer.write(encoder.encode(doneData));
      } catch (error) {
        console.error('❌ Stream processing error:', error);
        const errorData = `data: ${JSON.stringify({
          error: error.message,
          done: true
        })}\n\n`;
        await writer.write(encoder.encode(errorData));
      } finally {
        await writer.close();
      }
    })();

    // Return SSE response
    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('❌ AI Chat Error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process AI chat request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

/**
 * Handle OPTIONS request - CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
