/**
 * GET /api/v1/assessment/resume/[sessionId]
 * Resume incomplete assessment
 * 
 * @module AssessmentResumeEndpoint
 * @version 1.0.0
 * @created November 4, 2025
 */

import DatabaseHelper from '../../../../db/DatabaseHelper.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const sessionId = params.sessionId;
    
    if (!sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'sessionId is required'
      }), { status: 400, headers: corsHeaders });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Resume session
    const session = await db.resumeAssessment(sessionId);

    // Success response
    return new Response(JSON.stringify({
      success: true,
      session
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/assessment/resume] Error:', error);
    
    // Check if error is about completed assessment
    if (error.message.includes('already completed')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Assessment already completed',
        canResume: false
      }), { status: 400, headers: corsHeaders });
    }

    // Check if error is about session not found
    if (error.message.includes('Session not found')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session not found'
      }), { status: 404, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to resume assessment. Please try again later.'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
