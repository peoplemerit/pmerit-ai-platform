/**
 * POST /api/v1/projects/[id]/scopes
 * Create scope with work unit allocation
 * 
 * @module ProjectScopesEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Request Body:
 * {
 *   scopeName: string,
 *   allocated_wu: number,
 *   acceptance_criteria: Array<{criterion: string, status: string}>
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   scopeId: UUID,
 *   scope: Object
 * }
 */

import DatabaseHelper from '../../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request, params } = context;
  
  // CORS headers
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.scopeName || body.scopeName.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'scopeName is required and cannot be empty'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!body.allocated_wu || typeof body.allocated_wu !== 'number' || body.allocated_wu <= 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'allocated_wu is required and must be a positive number'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Create scope (DatabaseHelper validates WU allocation)
    const scope = await db.createScope({
      projectId: projectId,
      scopeName: body.scopeName.trim(),
      allocated_wu: body.allocated_wu,
      acceptance_criteria: body.acceptance_criteria || []
    });

    // Log scope creation
    await db.logProjectAudit({
      projectId: projectId,
      scopeId: scope.id,
      eventType: 'SCOPE_CREATED',
      eventData: {
        scope_name: scope.scope_name,
        allocated_wu: body.allocated_wu,
        criteria_count: (body.acceptance_criteria || []).length
      }
    });

    // Success response
    return new Response(JSON.stringify({
      success: true,
      scopeId: scope.id,
      scope: {
        id: scope.id,
        project_id: scope.project_id,
        scope_name: scope.scope_name,
        allocated_wu: parseFloat(scope.allocated_wu),
        verified_wu: parseFloat(scope.verified_wu),
        logic_score: parseFloat(scope.logic_score),
        procedural_score: parseFloat(scope.procedural_score),
        validation_score: parseFloat(scope.validation_score),
        readiness_score: parseFloat(scope.readiness_score),
        status: scope.status,
        acceptance_criteria: JSON.parse(scope.acceptance_criteria || '[]'),
        created_at: scope.created_at
      },
      message: 'Scope created successfully'
    }), {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/scopes] Error:', error);
    
    // Check for WU allocation error
    if (error.message && error.message.includes('Cannot allocate')) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create scope. Please try again later.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * GET /api/v1/projects/[id]/scopes
 * Get all scopes for a project
 */
export async function onRequestGet(context) {
  const { env, params } = context;
  
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const projectId = params.id;
    const db = new DatabaseHelper(env.DB);

    // Get all scopes
    const scopes = await db.getProjectScopes(projectId);

    // Format response
    const formattedScopes = scopes.map(scope => ({
      id: scope.id,
      project_id: scope.project_id,
      scope_name: scope.scope_name,
      allocated_wu: parseFloat(scope.allocated_wu),
      verified_wu: parseFloat(scope.verified_wu),
      logic_score: parseFloat(scope.logic_score),
      procedural_score: parseFloat(scope.procedural_score),
      validation_score: parseFloat(scope.validation_score),
      readiness_score: parseFloat(scope.readiness_score),
      status: scope.status,
      acceptance_criteria: JSON.parse(scope.acceptance_criteria || '[]'),
      created_at: scope.created_at,
      verified_at: scope.verified_at
    }));

    return new Response(JSON.stringify({
      success: true,
      scopes: formattedScopes,
      total: formattedScopes.length
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/[id]/scopes] GET Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to retrieve scopes.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
