/**
 * AI Chat Endpoint - Cloudflare Workers AI
 * POST /api/v1/ai/chat
 *
 * Handles streaming AI chat requests using Cloudflare Workers AI
 * Model: @cf/meta/llama-3.1-8b-instruct
 *
 * NEW: Multilingual support with automatic translation
 * - Translates user messages to English for AI processing
 * - Translates AI responses back to user's language
 * - Supports: English, Yoruba, Igbo, Hausa, French, Spanish, etc.
 *
 * @updated November 30, 2025 - Added multilingual AI chat support
 */

import {
  translateText,
  needsTranslation,
  getCulturalContext,
  getLanguageName
} from '../../utils/translator.js';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Build system prompt with cultural context
 */
function buildSystemPrompt(language) {
  const culturalContext = getCulturalContext(language);
  const langName = getLanguageName(language);

  let systemPrompt = `You are PMERIT AI, a friendly and knowledgeable educational assistant for the PMERIT learning platform. You help students learn and answer their questions in a clear, supportive way.

Guidelines:
- Be encouraging and patient with learners
- Provide clear, accurate explanations
- Use examples when helpful
- Break down complex topics into simple steps
- Encourage curiosity and further learning`;

  if (language !== 'en' && culturalContext) {
    systemPrompt += `

Cultural Context:
The user's preferred language is ${langName}. ${culturalContext}
While you process in English, your responses will be translated to ${langName} for the user.`;
  }

  return systemPrompt;
}

/**
 * Handle POST request - AI Chat with Multilingual Support
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // Parse request body
    const body = await request.json();
    const { messages, language = 'en' } = body;

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

    // Check if translation is needed
    const requiresTranslation = needsTranslation(language) && env.TRANSLATOR_KEY;

    // Prepare messages for AI
    let processedMessages = [...messages];

    // Add system prompt with cultural context
    const systemPrompt = buildSystemPrompt(language);
    processedMessages.unshift({
      role: 'system',
      content: systemPrompt
    });

    // Translate user messages to English if needed
    if (requiresTranslation) {
      processedMessages = await translateMessagesToEnglish(processedMessages, language, env);
    }

    // For English or when streaming is appropriate
    if (!requiresTranslation) {
      return streamingResponse(processedMessages, env);
    }

    // For non-English: Get full response, translate, then stream back
    return translatedResponse(processedMessages, language, env);

  } catch (error) {
    console.error('[AI Chat] Error:', error);

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
 * Translate user messages to English for AI processing
 */
async function translateMessagesToEnglish(messages, fromLang, env) {
  const translated = [];

  for (const msg of messages) {
    if (msg.role === 'user' && msg.content) {
      // Translate user message to English
      const translatedContent = await translateText(msg.content, fromLang, 'en', env);
      translated.push({
        ...msg,
        content: translatedContent
      });
    } else {
      // Keep system and assistant messages as-is
      translated.push(msg);
    }
  }

  return translated;
}

/**
 * Streaming response for English users
 */
async function streamingResponse(messages, env) {
  // Call Cloudflare Workers AI with streaming
  const response = await env.AI.run(
    '@cf/meta/llama-3.1-8b-instruct',
    {
      messages,
      stream: true
    }
  );

  // Transform the response into SSE format
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Process the stream in the background
  (async () => {
    try {
      for await (const chunk of response) {
        if (chunk.response) {
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
      console.error('[AI Chat] Stream error:', error);
      const errorData = `data: ${JSON.stringify({
        error: error.message,
        done: true
      })}\n\n`;
      await writer.write(encoder.encode(errorData));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...corsHeaders
    }
  });
}

/**
 * Translated response for non-English users
 * Gets full response, translates, then sends as SSE stream
 */
async function translatedResponse(messages, targetLang, env) {
  // Call Cloudflare Workers AI WITHOUT streaming to get full response
  const response = await env.AI.run(
    '@cf/meta/llama-3.1-8b-instruct',
    {
      messages,
      stream: false
    }
  );

  // Get the full response text
  const englishResponse = response.response || '';

  // Translate the response to user's language
  const translatedText = await translateText(englishResponse, 'en', targetLang, env);

  // Return as SSE stream (simulated) for frontend compatibility
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Send the translated response in chunks for smooth UI
  (async () => {
    try {
      // Split into chunks for smoother display (simulate streaming)
      const chunkSize = 20; // characters per chunk
      const chunks = [];

      for (let i = 0; i < translatedText.length; i += chunkSize) {
        chunks.push(translatedText.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        const sseData = `data: ${JSON.stringify({
          response: chunk,
          done: false
        })}\n\n`;
        await writer.write(encoder.encode(sseData));

        // Small delay for smoother appearance
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Send final done message
      const doneData = `data: ${JSON.stringify({
        response: '',
        done: true,
        translated: true,
        originalLanguage: targetLang
      })}\n\n`;
      await writer.write(encoder.encode(doneData));
    } catch (error) {
      console.error('[AI Chat] Translation stream error:', error);
      const errorData = `data: ${JSON.stringify({
        error: error.message,
        done: true
      })}\n\n`;
      await writer.write(encoder.encode(errorData));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...corsHeaders
    }
  });
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
