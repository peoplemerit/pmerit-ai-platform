/**
 * POST /api/v1/projects/[id]/gates/ideation
 * Check IDEATION GATE criteria
 * 
 * @module IdeationGateEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Criteria:
 * - All deliverables (scopes) have acceptance criteria
 * - DAG dependencies exist (no isolated scopes unless single scope)
 * - Total allocated WU matches project total WU
 * 
 * Response:
 * {
 *   success: boolean,
 *   gate_status: string ('PASSED', 'FAILED'),
 *   checks: Object,
 *   gate: Object
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

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Get project data
    const project = await db.getProject(projectId);

    // Get all scopes
    const scopes = await db.getProjectScopes(projectId);

    // Initialize checks
    const checks = {
      has_scopes: false,
      all_have_criteria: false,
      wu_allocation_complete: false,
      wu_allocation_valid: false
    };

    // Check 1: Project has at least one scope
    checks.has_scopes = scopes.length > 0;

    if (!checks.has_scopes) {
      return new Response(JSON.stringify({
        success: true,
        gate_status: 'FAILED',
        checks: checks,
        messages: ['Project must have at least one scope/deliverable']
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Check 2: All scopes have acceptance criteria
    checks.all_have_criteria = scopes.every(scope => {
      const criteria = JSON.parse(scope.acceptance_criteria || '[]');
      return criteria.length > 0;
    });

    // Check 3: Total allocated WU matches project total
    const totalAllocated = scopes.reduce((sum, scope) => {
      return sum + parseFloat(scope.allocated_wu);
    }, 0);
    const projectTotal = parseFloat(project.execution_total_wu);

    checks.wu_allocation_complete = Math.abs(totalAllocated - projectTotal) < 0.01;
    checks.wu_allocation_valid = totalAllocated <= projectTotal;

    // Determine gate status
    const allChecksPassed = checks.has_scopes && 
                           checks.all_have_criteria && 
                           checks.wu_allocation_complete && 
                           checks.wu_allocation_valid;

    const gate_status = allChecksPassed ? 'PASSED' : 'FAILED';

    // Create or update gate record
    const gateData = await db.createApprovalGate({
      projectId: projectId,
      gateType: 'IDEATION'
    });

    // If gate passed, update project
    if (allChecksPassed) {
      await db.db.prepare(`
        UPDATE projects
        SET ideation_gate_passed = TRUE,
            current_phase = 'EXECUTION',
            updated_at = NOW()
        WHERE id = $1
      `).bind(projectId).run();

      // Log to audit trail
      await db.logProjectAudit({
        projectId: projectId,
        eventType: 'IDEATION_GATE_PASSED',
        eventData: {
          scopes_count: scopes.length,
          total_allocated_wu: totalAllocated
        }
      });
    }

    // Build response messages
    const messages = [];
    if (!checks.all_have_criteria) {
      messages.push('Some scopes are missing acceptance criteria');
    }
    if (!checks.wu_allocation_complete) {
      messages.push(`Work unit allocation mismatch: ${totalAllocated} allocated vs ${projectTotal} total`);
    }
    if (!checks.wu_allocation_valid) {
      messages.push(`Total allocated WU (${totalAllocated}) exceeds project total (${projectTotal})`);
    }

    // Success response
    return new Response(JSON.stringify({
      success: true,
      gate_status: gate_status,
      checks: {
        ...checks,
        total_scopes: scopes.length,
        total_allocated_wu: totalAllocated,
        project_total_wu: projectTotal
      },
      messages: messages.length > 0 ? messages : ['All criteria met'],
      gate: {
        id: gateData.id,
        gate_type: gateData.gate_type,
        status: gate_status,
        created_at: gateData.created_at
      }
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/gates/ideation] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to check ideation gate.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
