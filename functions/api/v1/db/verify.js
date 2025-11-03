/**
 * Schema Verification Endpoint
 * GET /api/v1/db/verify
 * 
 * Verifies that the assessment database schema is correctly configured
 * Returns success status and detailed verification report
 * 
 * @endpoint GET /api/v1/db/verify
 * @version 1.0.0
 * @created November 3, 2025
 * @issue #18 - Database Integration & Schema Verification
 */

import { verifySchema, generateReport } from '../../db/verify-schema.js';

/**
 * Handle GET request to verify schema
 * @param {Object} context - Cloudflare Pages context
 * @param {Object} context.env - Environment bindings
 * @returns {Response} JSON response with verification results
 */
export async function onRequestGet(context) {
  const { env } = context;

  // Set CORS headers for API access
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // Check if DB binding exists
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database connection not configured',
        details: {
          message: 'DB binding (Hyperdrive) not found in environment',
          hint: 'Configure Hyperdrive binding in wrangler.toml or Pages settings'
        },
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 503,
        headers
      });
    }

    // Run schema verification
    console.log('[verify-endpoint] Starting schema verification...');
    const result = await verifySchema(env.DB);

    // Generate human-readable report
    const report = generateReport(result);
    console.log(report);

    // Return appropriate status code
    const statusCode = result.success ? 200 : 500;

    return new Response(JSON.stringify({
      success: result.success,
      details: result.details,
      report: report,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: statusCode,
      headers
    });

  } catch (error) {
    console.error('[verify-endpoint] Error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 500,
      headers
    });
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
