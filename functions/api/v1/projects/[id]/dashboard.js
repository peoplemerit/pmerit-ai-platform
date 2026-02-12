/**
 * GET /api/v1/projects/[id]/dashboard
 * Get real-time governance metrics for project dashboard
 * 
 * @module ProjectDashboardEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Response:
 * {
 *   success: boolean,
 *   project: Object,
 *   conservation: Object,
 *   scopes: Array,
 *   gates: Array,
 *   metrics: Object
 * }
 */

import DatabaseHelper from '../../../db/DatabaseHelper.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  
  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle OPTIONS preflight
  if (context.request.method === 'OPTIONS') {
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

    // Get approval gates
    const gates = await db.getProjectGates(projectId);

    // Calculate metrics
    const totalScopes = scopes.length;
    const verifiedScopes = scopes.filter(s => s.status === 'VERIFIED').length;
    const inProgressScopes = scopes.filter(s => s.status === 'IN_PROGRESS').length;

    // Calculate total allocated and verified WU
    const totalAllocatedWu = scopes.reduce((sum, s) => sum + parseFloat(s.allocated_wu), 0);
    const totalVerifiedWu = scopes.reduce((sum, s) => sum + parseFloat(s.verified_wu), 0);

    // Calculate average readiness score
    const avgReadiness = scopes.length > 0 
      ? scopes.reduce((sum, s) => sum + parseFloat(s.readiness_score), 0) / scopes.length
      : 0;

    // Conservation formula validation
    const executionTotal = parseFloat(project.execution_total_wu);
    const formulaExecution = parseFloat(project.formula_execution_wu);
    const verifiedReality = parseFloat(project.verified_reality_wu);
    const conservationValid = Math.abs(executionTotal - (formulaExecution + verifiedReality)) < 0.01;
    const conservationDeviation = executionTotal - (formulaExecution + verifiedReality);

    // Pending gates
    const pendingGates = gates.filter(g => g.status === 'PENDING');

    // Format scopes with readiness breakdown
    const formattedScopes = scopes.map(scope => ({
      id: scope.id,
      scope_name: scope.scope_name,
      allocated_wu: parseFloat(scope.allocated_wu),
      verified_wu: parseFloat(scope.verified_wu),
      status: scope.status,
      readiness: {
        logic: parseFloat(scope.logic_score),
        procedural: parseFloat(scope.procedural_score),
        validation: parseFloat(scope.validation_score),
        overall: parseFloat(scope.readiness_score)
      },
      acceptance_criteria: JSON.parse(scope.acceptance_criteria || '[]'),
      created_at: scope.created_at,
      verified_at: scope.verified_at
    }));

    // Format gates
    const formattedGates = gates.map(gate => ({
      id: gate.id,
      gate_type: gate.gate_type,
      status: gate.status,
      approved_by: gate.approved_by,
      approval_message: gate.approval_message,
      created_at: gate.created_at,
      approved_at: gate.approved_at
    }));

    // Success response
    return new Response(JSON.stringify({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        objective: project.objective,
        current_phase: project.current_phase,
        ideation_gate_passed: project.ideation_gate_passed,
        locked_at: project.locked_at,
        created_at: project.created_at,
        updated_at: project.updated_at
      },
      conservation: {
        formula: 'EXECUTION_TOTAL = FORMULA_EXECUTION + VERIFIED_REALITY',
        execution_total_wu: executionTotal,
        formula_execution_wu: formulaExecution,
        verified_reality_wu: verifiedReality,
        is_valid: conservationValid,
        deviation: conservationDeviation,
        explanation: conservationValid 
          ? 'Conservation law satisfied' 
          : `Conservation violation: deviation of ${conservationDeviation.toFixed(2)} WU`
      },
      scopes: formattedScopes,
      gates: formattedGates,
      metrics: {
        total_scopes: totalScopes,
        verified_scopes: verifiedScopes,
        in_progress_scopes: inProgressScopes,
        pending_scopes: totalScopes - verifiedScopes - inProgressScopes,
        completion_rate: totalScopes > 0 ? Math.round((verifiedScopes / totalScopes) * 100) : 0,
        total_allocated_wu: totalAllocatedWu,
        total_verified_wu: totalVerifiedWu,
        average_readiness: parseFloat(avgReadiness.toFixed(2)),
        pending_gates: pendingGates.length
      }
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/dashboard] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to retrieve dashboard data.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
