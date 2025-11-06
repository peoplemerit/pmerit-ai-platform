/**
 * POST /api/v1/assessment/submit
 * Submit completed assessment and generate results
 * 
 * @module AssessmentSubmitEndpoint
 * @version 1.0.0
 * @created November 4, 2025
 */

import DatabaseHelper from '../../../db/DatabaseHelper.js';
import CareerMatchingService from '../../../services/CareerMatchingService.js';
import { calculateBigFiveScores } from '../../algorithms/BigFiveScoring.js';
import { calculateHollandCode } from '../../algorithms/HollandCodeCalculator.js';

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
    
    // Validate request
    if (!body.sessionId || !body.answers) {
      return new Response(JSON.stringify({
        success: false,
        error: 'sessionId and answers are required'
      }), { status: 400, headers: corsHeaders });
    }

    // Validate 120 answers
    const answerCount = Object.keys(body.answers).length;
    if (answerCount !== 120) {
      return new Response(JSON.stringify({
        success: false,
        error: `Expected 120 answers, got ${answerCount}`
      }), { status: 400, headers: corsHeaders });
    }

    // Initialize services
    const db = new DatabaseHelper(env.DB);
    const careerService = new CareerMatchingService(env.DB);

    // Check if session exists and is not already completed
    const session = await db.getSession(body.sessionId);
    if (!session) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session not found'
      }), { status: 404, headers: corsHeaders });
    }

    if (session.status === 'completed') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Assessment already completed'
      }), { status: 400, headers: corsHeaders });
    }

    // Step 1: Calculate Big Five scores
    console.log('[/api/v1/assessment/submit] Calculating Big Five scores');
    const bigFive = calculateBigFiveScores(body.answers);

    // Step 2: Calculate Holland Code
    console.log('[/api/v1/assessment/submit] Calculating Holland Code');
    const hollandCode = calculateHollandCode(body.answers);

    // Step 3: Get career recommendations
    console.log('[/api/v1/assessment/submit] Getting career recommendations');
    const careerMatches = await careerService.getRecommendations({
      bigFive,
      hollandCode
    }, 10);

    // Step 4: Store results in database
    console.log('[/api/v1/assessment/submit] Storing results');
    const resultId = await db.storeAssessmentResults({
      sessionId: body.sessionId,
      userId: session.userId,
      bigFive,
      hollandCode,
      careerMatches
    });

    // Success response - return minimal data, client should fetch details from results endpoint
    return new Response(JSON.stringify({
      success: true,
      resultId,
      sessionId: body.sessionId,
      message: 'Assessment completed successfully',
      completedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/assessment/submit] Error:', error);
    
    // Generic error message for security - avoid exposing internal details
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process assessment. Please try again later.'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
