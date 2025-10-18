/**
 * Cloudflare Pages Function - AI Chat Proxy with CORS
 * Version: 2.0 - Explicit Model Forwarding
 */
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get request body
    const body = await context.request.json();
    
    // ✅ CRITICAL: Ensure model is explicitly set
    const requestBody = {
      model: body.model || 'phi3:mini',  // Default to phi3 if not specified
      messages: body.messages,
      stream: body.stream || false,
      options: body.options || {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 150
      }
    };
    
    // Log what we're sending (helpful for debugging)
    console.log('🚀 Forwarding to Ollama:', {
      model: requestBody.model,
      messageCount: requestBody.messages?.length,
      stream: requestBody.stream
    });

    // Forward to Ollama with explicit body
    const response = await fetch('https://ai.pmerit.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),  // ✅ Use reconstructed body
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    // Get response data
    const data = await response.json();
    
    // Log response (for debugging)
    console.log('✅ Received from Ollama:', {
      model: data.model,
      done: data.done
    });

    // Return with CORS headers
    return new Response(JSON.stringify(data), {
      status: 200,
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