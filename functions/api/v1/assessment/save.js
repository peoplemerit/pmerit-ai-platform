/**
 * POST /api/v1/assessment/save
 * Save assessment progress (auto-save)
 * 
 * @module AssessmentSaveEndpoint
 * @version 1.0.0
 * @created November 4, 2025
 */

import DatabaseHelper from '../../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'sessionId is required'
      }), { status: 400, headers: corsHeaders });
    }

    if (typeof body.currentQuestion !== 'number') {
      return new Response(JSON.stringify({
        success: false,
        error: 'currentQuestion must be a number'
      }), { status: 400, headers: corsHeaders });
    }

    if (!body.answers || typeof body.answers !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        error: 'answers must be an object'
      }), { status: 400, headers: corsHeaders });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Save progress
    const result = await db.saveAssessmentProgress(body.sessionId, {
      currentQuestion: body.currentQuestion,
      answers: body.answers
    });

    // Success response - return only necessary fields
    return new Response(JSON.stringify({
      success: result.success,
      saved: result.saved,
      currentQuestion: result.currentQuestion,
      answerCount: result.answerCount,
      message: 'Progress saved',
      updatedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/assessment/save] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save progress',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
