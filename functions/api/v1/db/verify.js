/**
 * Database Schema Verification Endpoint
 * GET /api/v1/db/verify
 * 
 * @updated November 10, 2025 - Use HTTP API (no Hyperdrive)
 */

import { verifySchema, generateReport } from '../../db/verify-schema.js';

/**
 * Handle GET request to verify database schema
 */
export async function onRequestGet(context) {
  try {
    const { env } = context;
    
    // Verify schema using HTTP API
    const result = await verifySchema(env);
    
    // Generate report
    const report = generateReport(result);
    
    // Return results
    return new Response(JSON.stringify({
      success: result.success,
      details: result.details,
      report: report,
      timestamp: new Date().toISOString()
    }), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('[/api/v1/db/verify] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}