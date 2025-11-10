/**
 * Neon Database Helper (HTTP API)
 * Uses Neon's HTTP API with fetch() - no dependencies required
 * Perfect for Cloudflare Pages Functions
 * 
 * @created November 10, 2025
 * @issue Database connectivity workaround
 */

/**
 * Parse Neon connection string to extract API endpoint
 * @param {string} connectionString - PostgreSQL connection string
 * @returns {Object} Parsed connection details
 */
function parseConnectionString(connectionString) {
  // Format: postgresql://user:password@host:port/database?params
  const match = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  
  if (!match) {
    throw new Error('Invalid Neon connection string format');
  }
  
  const [, user, password, host, port, database] = match;
  
  // Extract project ID from host (format: ep-xxx-xxx.region.aws.neon.tech)
  const projectMatch = host.match(/ep-[^.]+/);
  const endpoint = projectMatch ? projectMatch[0] : null;
  
  return {
    user,
    password,
    host,
    port,
    database,
    endpoint
  };
}

/**
 * Execute SQL query using Neon HTTP API
 * @param {string} connectionString - Neon connection string
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function executeQuery(connectionString, query, params = []) {
  const connDetails = parseConnectionString(connectionString);
  
  // Neon HTTP API endpoint
  const apiUrl = `https://${connDetails.host}/sql`;
  
  // Replace $1, $2, etc. with actual values for HTTP API
  let processedQuery = query;
  params.forEach((param, index) => {
    const placeholder = `$${index + 1}`;
    const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
    processedQuery = processedQuery.replace(placeholder, value);
  });
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${connDetails.password}`
    },
    body: JSON.stringify({
      query: processedQuery
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Neon HTTP API error: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  return result.rows || [];
}

/**
 * Get Neon database connection string from environment
 * @param {Object} env - Environment variables containing NEON_CONNECTION_STRING
 * @returns {string} Connection string
 */
export function getNeonDB(env) {
  if (!env.NEON_CONNECTION_STRING) {
    throw new Error('NEON_CONNECTION_STRING not configured in environment variables');
  }
  
  return env.NEON_CONNECTION_STRING;
}

/**
 * Execute a query and return first result
 * Mimics Hyperdrive's prepare().first() API
 * @param {Object} env - Environment variables
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} First result row
 */
export async function queryFirst(env, query, params = []) {
  const connectionString = getNeonDB(env);
  const results = await executeQuery(connectionString, query, params);
  return results[0] || null;
}

/**
 * Execute a query and return all results
 * Mimics Hyperdrive's prepare().all() API
 * @param {Object} env - Environment variables
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} All result rows
 */
export async function queryAll(env, query, params = []) {
  const connectionString = getNeonDB(env);
  return await executeQuery(connectionString, query, params);
}