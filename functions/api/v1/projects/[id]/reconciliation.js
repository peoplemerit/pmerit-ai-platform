/**
 * GET /api/v1/projects/[id]/reconciliation
 * AIXORD Reconciliation Triad: PLANNED vs CLAIMED vs VERIFIED
 * 
 * @module ProjectReconciliationEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Response:
 * {
 *   success: boolean,
 *   reconciliation: {
 *     planned: Object,
 *     claimed: Object,
 *     verified: Object,
 *     divergences: Array
 *   }
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

    // PLANNED: Sum of allocated WU from scopes
    const planned_wu = scopes.reduce((sum, scope) => {
      return sum + parseFloat(scope.allocated_wu);
    }, 0);

    // CLAIMED: Formula execution WU (AI agent claims)
    const claimed_wu = parseFloat(project.formula_execution_wu);

    // VERIFIED: Sum of verified WU from scopes
    const verified_wu = scopes.reduce((sum, scope) => {
      return sum + parseFloat(scope.verified_wu);
    }, 0);

    // Also get verified reality WU from project
    const verified_reality_wu = parseFloat(project.verified_reality_wu);

    // Calculate divergences
    const divergences = [];

    // Divergence 1: PLANNED vs PROJECT TOTAL
    const planned_vs_total_diff = Math.abs(planned_wu - parseFloat(project.execution_total_wu));
    if (planned_vs_total_diff >= 0.01) {
      divergences.push({
        type: 'PLANNED_TOTAL_MISMATCH',
        severity: 'HIGH',
        description: `Total allocated WU (${planned_wu.toFixed(2)}) does not match project total (${parseFloat(project.execution_total_wu).toFixed(2)})`,
        difference: planned_vs_total_diff,
        recommendation: 'Adjust scope allocations or project total WU'
      });
    }

    // Divergence 2: VERIFIED (scopes) vs VERIFIED_REALITY (project)
    const verified_diff = Math.abs(verified_wu - verified_reality_wu);
    if (verified_diff >= 0.01) {
      divergences.push({
        type: 'VERIFIED_MISMATCH',
        severity: 'MEDIUM',
        description: `Sum of scope verified WU (${verified_wu.toFixed(2)}) does not match project verified reality WU (${verified_reality_wu.toFixed(2)})`,
        difference: verified_diff,
        recommendation: 'Re-run scope verification to sync values'
      });
    }

    // Divergence 3: Conservation formula check
    const conservation_sum = parseFloat(project.formula_execution_wu) + parseFloat(project.verified_reality_wu);
    const conservation_diff = Math.abs(parseFloat(project.execution_total_wu) - conservation_sum);
    if (conservation_diff >= 0.01) {
      divergences.push({
        type: 'CONSERVATION_VIOLATION',
        severity: 'CRITICAL',
        description: `Conservation formula violated: ${parseFloat(project.execution_total_wu).toFixed(2)} ≠ ${parseFloat(project.formula_execution_wu).toFixed(2)} + ${parseFloat(project.verified_reality_wu).toFixed(2)}`,
        difference: conservation_diff,
        recommendation: 'Database constraint should prevent this. Contact system administrator.'
      });
    }

    // Scope-level divergences
    scopes.forEach(scope => {
      // Check if verified WU exceeds allocated WU
      if (parseFloat(scope.verified_wu) > parseFloat(scope.allocated_wu) + 0.01) {
        divergences.push({
          type: 'SCOPE_OVERVERIFIED',
          severity: 'HIGH',
          scope_id: scope.id,
          scope_name: scope.scope_name,
          description: `Scope "${scope.scope_name}" has verified WU (${parseFloat(scope.verified_wu).toFixed(2)}) exceeding allocated WU (${parseFloat(scope.allocated_wu).toFixed(2)})`,
          difference: parseFloat(scope.verified_wu) - parseFloat(scope.allocated_wu),
          recommendation: 'Review verification calculation or increase allocation'
        });
      }

      // Check if scope is verified but readiness score is 0
      if (scope.status === 'VERIFIED' && parseFloat(scope.readiness_score) === 0) {
        divergences.push({
          type: 'ZERO_READINESS_VERIFIED',
          severity: 'MEDIUM',
          scope_id: scope.id,
          scope_name: scope.scope_name,
          description: `Scope "${scope.scope_name}" is marked VERIFIED but has 0 readiness score`,
          recommendation: 'Update DMAIC scores or change status'
        });
      }
    });

    // Calculate reconciliation summary
    const total_planned = planned_wu;
    const total_claimed = claimed_wu;
    const total_verified = verified_reality_wu;
    const reconciliation_status = divergences.length === 0 ? 'ALIGNED' : 'DIVERGENT';

    // Success response
    return new Response(JSON.stringify({
      success: true,
      reconciliation: {
        status: reconciliation_status,
        planned: {
          label: 'PLANNED (Scope Allocations)',
          total_wu: total_planned,
          scopes: scopes.map(s => ({
            scope_name: s.scope_name,
            allocated_wu: parseFloat(s.allocated_wu)
          }))
        },
        claimed: {
          label: 'CLAIMED (Formula Execution)',
          total_wu: total_claimed,
          explanation: 'Work units from AI agent execution planning'
        },
        verified: {
          label: 'VERIFIED (Reality)',
          total_wu: total_verified,
          scopes: scopes.map(s => ({
            scope_name: s.scope_name,
            verified_wu: parseFloat(s.verified_wu),
            readiness_score: parseFloat(s.readiness_score)
          }))
        },
        conservation: {
          formula: 'TOTAL = CLAIMED + VERIFIED',
          total: parseFloat(project.execution_total_wu),
          claimed: total_claimed,
          verified: total_verified,
          sum: total_claimed + total_verified,
          is_valid: conservation_diff < 0.01
        },
        divergences: divergences,
        summary: {
          total_divergences: divergences.length,
          critical: divergences.filter(d => d.severity === 'CRITICAL').length,
          high: divergences.filter(d => d.severity === 'HIGH').length,
          medium: divergences.filter(d => d.severity === 'MEDIUM').length
        }
      }
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/reconciliation] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to retrieve reconciliation data.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
