/**
 * Database Schema Verification Endpoint - PROXY VERSION
 * GET /api/v1/db/verify
 * 
 * @updated November 11, 2025 - Proxy to Worker API
 * @note Pages Functions cannot use Drizzle ORM, so we proxy to Worker
 */

// Worker API URL
const WORKER_API_URL = 'https://pmerit-api-worker.peoplemerit.workers.dev';

/**
 * Handle GET request - Proxy to Worker API
 */
export async function onRequestGet(context) {
  try {
    // Forward request to Worker API
    const response = await fetch(`${WORKER_API_URL}/api/v1/db/verify`);
    
    // Get the response data
    const data = await response.json();
    
    // Return the same response
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('[/api/v1/db/verify] Proxy Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to reach database API Worker',
      details: error.message,
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