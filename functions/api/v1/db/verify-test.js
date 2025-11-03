/**
 * Schema Verification Test Endpoint
 * GET /api/v1/db/verify-test
 * 
 * Runs automated tests for schema verification functionality
 * Tests that the schema exists and matches expected structure
 * 
 * @endpoint GET /api/v1/db/verify-test
 * @version 1.0.0
 * @created November 3, 2025
 * @issue #18 - Database Integration & Schema Verification
 */

import { runSchemaVerificationTests } from '../../db/test-schema-verification.js';

/**
 * Handle GET request to run schema verification tests
 * @param {Object} context - Cloudflare Pages context
 * @param {Object} context.env - Environment bindings
 * @returns {Response} JSON response with test results
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

    // Run schema verification tests
    console.log('[verify-test-endpoint] Starting schema verification tests...');
    const results = await runSchemaVerificationTests(env);

    // Return appropriate status code based on test success
    const statusCode = results.success ? 200 : 500;

    return new Response(JSON.stringify({
      success: results.success,
      passed: results.passed,
      failed: results.failed,
      tests: results.tests,
      verificationResult: results.verificationResult,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: statusCode,
      headers
    });

  } catch (error) {
    console.error('[verify-test-endpoint] Error:', error);

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
