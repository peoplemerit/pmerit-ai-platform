/**
 * GET /api/v1/assessment/results/[resultId]
 * Retrieve assessment results
 * 
 * @module AssessmentResultsEndpoint
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
    const resultId = params.resultId;
    
    if (!resultId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'resultId is required'
      }), { status: 400, headers: corsHeaders });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Get results
    const result = await db.getAssessmentResults(resultId);

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Results not found'
      }), { status: 404, headers: corsHeaders });
    }

    // Success response
    return new Response(JSON.stringify({
      success: true,
      result
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/assessment/results] Error:', error);
    
    // Check if error is "Results not found"
    if (error.message.includes('Results not found')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Results not found'
      }), { status: 404, headers: corsHeaders });
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to retrieve results. Please try again later.'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
