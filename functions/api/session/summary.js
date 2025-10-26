/**
 * Cloudflare Pages Function - Session Summary API
 * Phase 3.3-A: Persist classroom session data
 * 
 * POST /api/session/summary
 * Body: { 
 *   userId: string, 
 *   courseId: string, 
 *   startedAt: string, 
 *   endedAt: string, 
 *   durationSec: number,
 *   lastPrompt?: string,
 *   lastReplyHash?: string,
 *   vhMode: boolean
 * }
 * Response: { success: boolean, sessionId: string }
 */

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // TODO: Restrict to site origin in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    
    // Validate required fields
    const requiredFields = ['userId', 'courseId', 'startedAt', 'endedAt', 'durationSec'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({ 
          error: 'Invalid input',
          message: `Missing required field: ${field}`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Extract session data
    const {
      userId,
      courseId,
      startedAt,
      endedAt,
      durationSec,
      lastPrompt = null,
      lastReplyHash = null,
      vhMode = false
    } = body;

    // Generate session ID
    const sessionId = `session_${userId}_${courseId}_${Date.now()}`;

    // Log session (redact PII)
    console.log('Session summary:', {
      sessionId,
      userId: userId.substring(0, 8) + '...',
      courseId,
      durationSec,
      vhMode,
      timestamp: new Date().toISOString()
    });

    // Phase 3.3-A MVP: Store in KV or log
    // TODO (Phase 3.3-B): Persist to D1 database or Oracle backend
    // Example with D1:
    // const db = context.env.DB;
    // await db.prepare(`
    //   INSERT INTO session_summaries 
    //   (session_id, user_id, course_id, started_at, ended_at, duration_sec, vh_mode, created_at)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    // `).bind(
    //   sessionId,
    //   userId,
    //   courseId,
    //   startedAt,
    //   endedAt,
    //   durationSec,
    //   vhMode ? 1 : 0,
    //   new Date().toISOString()
    // ).run();

    // For MVP, store in KV if available
    if (context.env.SESSION_SUMMARIES) {
      const summaryData = {
        sessionId,
        userId,
        courseId,
        startedAt,
        endedAt,
        durationSec,
        lastPrompt,
        lastReplyHash,
        vhMode,
        createdAt: new Date().toISOString()
      };

      await context.env.SESSION_SUMMARIES.put(
        sessionId,
        JSON.stringify(summaryData),
        {
          expirationTtl: 60 * 60 * 24 * 90 // 90 days
        }
      );
    }

    return new Response(JSON.stringify({ 
      success: true,
      sessionId,
      message: 'Session summary saved successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Session summary API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to save session summary'
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
 * GET endpoint to retrieve session summaries
 */
export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    const courseId = url.searchParams.get('courseId');

    if (!userId) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input',
        message: 'userId parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // TODO: Implement retrieval from D1 or KV
    // For MVP, return empty array
    const sessions = [];

    return new Response(JSON.stringify({ 
      success: true,
      sessions,
      count: sessions.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Session summary GET error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to retrieve session summaries'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
