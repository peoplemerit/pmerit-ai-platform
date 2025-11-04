/**
 * POST /api/v1/assessment/start
 * Start new assessment session
 * 
 * @module AssessmentStartEndpoint
 * @version 1.0.0
 * @created November 4, 2025
 */

import DatabaseHelper from '../../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  
  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request body
    const body = await request.json();
    
    // Validate consent
    if (!body.consent || 
        !body.consent.privacy || 
        !body.consent.data || 
        !body.consent.terms) {
      return new Response(JSON.stringify({
        success: false,
        error: 'All consent fields are required (privacy, data, terms)'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Create session
    const sessionId = await db.createAssessmentSession({
      userId: body.userId || null,
      consentData: body.consent
    });

    // Success response
    return new Response(JSON.stringify({
      success: true,
      sessionId,
      message: 'Assessment session started',
      resumable: false,
      startedAt: new Date().toISOString()
    }), {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/assessment/start] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to start assessment. Please try again later.'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
