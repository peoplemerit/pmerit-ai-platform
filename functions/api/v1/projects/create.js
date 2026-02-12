/**
 * POST /api/v1/projects/create
 * Create new project with work unit initialization
 * 
 * @module ProjectCreateEndpoint
 * @version 1.0.0
 * @created February 12, 2026
 * 
 * Request Body:
 * {
 *   userId: number,
 *   title: string,
 *   objective: string,
 *   execution_total_wu: number
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   projectId: UUID,
 *   project: {
 *     id: UUID,
 *     title: string,
 *     objective: string,
 *     execution_total_wu: number,
 *     formula_execution_wu: number,
 *     verified_reality_wu: number,
 *     current_phase: string,
 *     created_at: ISO8601
 *   }
 * }
 */

import DatabaseHelper from '../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  
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
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || typeof body.userId !== 'number') {
      return new Response(JSON.stringify({
        success: false,
        error: 'userId is required and must be a number'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!body.title || body.title.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'title is required and cannot be empty'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!body.objective || body.objective.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'objective is required and cannot be empty'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!body.execution_total_wu || typeof body.execution_total_wu !== 'number' || body.execution_total_wu <= 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'execution_total_wu is required and must be a positive number'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Initialize DatabaseHelper
    const db = new DatabaseHelper(env.DB);

    // Create project with initial work unit allocation
    // Conservation formula: execution_total_wu = formula_execution_wu + verified_reality_wu
    // Initially: formula_execution_wu = execution_total_wu, verified_reality_wu = 0
    const project = await db.createProject({
      userId: body.userId,
      title: body.title.trim(),
      objective: body.objective.trim(),
      execution_total_wu: body.execution_total_wu,
      formula_execution_wu: body.execution_total_wu, // All WU start in formula
      verified_reality_wu: 0 // None verified yet
    });

    // Log project creation to audit trail
    await db.logProjectAudit({
      projectId: project.id,
      eventType: 'PROJECT_CREATED',
      eventData: {
        title: project.title,
        objective: project.objective,
        initial_wu: body.execution_total_wu
      },
      execution_total_wu: project.execution_total_wu,
      formula_execution_wu: project.formula_execution_wu,
      verified_reality_wu: project.verified_reality_wu
    });

    // Success response
    return new Response(JSON.stringify({
      success: true,
      projectId: project.id,
      project: {
        id: project.id,
        title: project.title,
        objective: project.objective,
        execution_total_wu: parseFloat(project.execution_total_wu),
        formula_execution_wu: parseFloat(project.formula_execution_wu),
        verified_reality_wu: parseFloat(project.verified_reality_wu),
        current_phase: project.current_phase,
        ideation_gate_passed: project.ideation_gate_passed,
        created_at: project.created_at
      },
      message: 'Project created successfully'
    }), {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[/api/v1/projects/create] Error:', error);
    
    // Check for conservation constraint violation
    if (error.message && error.message.includes('conservation_check')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Work unit conservation formula violated. Please verify WU allocation.'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create project. Please try again later.',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
