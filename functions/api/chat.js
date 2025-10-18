/**
 * Cloudflare Pages Function - AI Chat Proxy with CORS
 * Proxies requests to Ollama AI and adds CORS headers
 */
export async function onRequestPost(context) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get request body
    const body = await context.request.json();
    
    // ✅ ADD THIS: Log what we're sending to Ollama
    console.log('📤 Forwarding to Ollama:', JSON.stringify({
      model: body.model,
      messageCount: body.messages?.length,
      stream: body.stream
    }));

    // Forward to Ollama
    const response = await fetch('https://ai.pmerit.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await response.json();
    
    // ✅ ADD THIS: Log what we got back
    console.log('📥 Received from Ollama:', data.model || 'unknown model');

    // Return with CORS headers
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to AI service',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}