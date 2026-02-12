/**
 * POST /api/v1/projects/[id]/scopes/[scopeId]/verify
 * Verify scope and transfer work units using readiness metric
 * 
 * @module ScopeVerifyEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Request Body:
 * {
 *   logic_score: number (0-1),
 *   procedural_score: number (0-1),
 *   validation_score: number (0-1)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   scope: Object,
 *   wu_transferred: number,
 *   readiness_score: number,
 *   project: Object
 * }
 */

import DatabaseHelper from '../../../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request, params } = context;
  
  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const projectId = params.id;
    const scopeId = params.scopeId;

    // Parse request body
    const body = await request.json();
    
    // Validate DMAIC scores (0-1 range)
    const validateScore = (score, name) => {
      if (typeof score !== 'number' || score < 0 || score > 1) {
        throw new Error(`${name} must be a number between 0 and 1`);
      }
    };

    validateScore(body.logic_score, 'logic_score');
    validateScore(body.procedural_score, 'procedural_score');
    validateScore(body.validation_score, 'validation_score');

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Verify scope and calculate WU transfer
    // Transfer rule: WU_transferred = allocated_wu × R
    // where R = L × P × V (readiness score)
    const result = await db.verifyScope(scopeId, {
      logic_score: body.logic_score,
      procedural_score: body.procedural_score,
      validation_score: body.validation_score
    });

    // Get updated project data
    const project = await db.getProject(projectId);

    // Log scope verification to audit trail
    await db.logProjectAudit({
      projectId: projectId,
      scopeId: scopeId,
      eventType: 'SCOPE_VERIFIED',
      eventData: {
        logic_score: body.logic_score,
        procedural_score: body.procedural_score,
        validation_score: body.validation_score,
        readiness_score: result.readiness_score,
        wu_transferred: result.wu_transferred
      },
      execution_total_wu: project.execution_total_wu,
      formula_execution_wu: project.formula_execution_wu,
      verified_reality_wu: project.verified_reality_wu
    });

    // Success response
    return new Response(JSON.stringify({
      success: true,
      scope: {
        id: result.scope.id,
        scope_name: result.scope.scope_name,
        allocated_wu: parseFloat(result.scope.allocated_wu),
        verified_wu: parseFloat(result.scope.verified_wu || result.wu_transferred),
        logic_score: parseFloat(result.scope.logic_score),
        procedural_score: parseFloat(result.scope.procedural_score),
        validation_score: parseFloat(result.scope.validation_score),
        readiness_score: parseFloat(result.scope.readiness_score),
        status: result.scope.status,
        verified_at: result.scope.verified_at
      },
      wu_transferred: result.wu_transferred,
      readiness_score: result.readiness_score,
      project: {
        id: project.id,
        execution_total_wu: parseFloat(project.execution_total_wu),
        formula_execution_wu: parseFloat(project.formula_execution_wu),
        verified_reality_wu: parseFloat(project.verified_reality_wu)
      },
      message: 'Scope verified successfully',
      formula: {
        explanation: 'R = L × P × V (Readiness = Logic × Procedural × Validation)',
        calculation: `${body.logic_score} × ${body.procedural_score} × ${body.validation_score} = ${result.readiness_score}`,
        transfer: `WU_transferred = ${parseFloat(result.scope.allocated_wu)} × ${result.readiness_score} = ${result.wu_transferred}`
      }
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/scopes/[scopeId]/verify] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to verify scope.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
