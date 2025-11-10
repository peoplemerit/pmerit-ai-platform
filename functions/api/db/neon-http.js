/**
 * Neon HTTP API Helper
 * Direct fetch() calls to Neon's HTTP API - NO dependencies needed
 * 
 * @created November 10, 2025
 * @version 1.0.0
 */

/**
 * Execute SQL query using Neon's HTTP API
 * @param {string} connectionString - Neon connection string
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters (optional)
 * @returns {Promise<Object>} Query result
 */
export async function executeQuery(connectionString, query, params = []) {
  // Extract connection details
  const url = new URL(connectionString);
  const host = url.hostname;
  const password = url.password;
  
  // Neon HTTP API endpoint
  const apiUrl = `https://${host}/sql`;
  
  // Replace $1, $2 etc with actual values
  let processedQuery = query;
  params.forEach((param, index) => {
    const placeholder = `$${index + 1}`;
    const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
    processedQuery = processedQuery.replace(new RegExp(`\\${placeholder}`, 'g'), value);
  });
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${password}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: processedQuery
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Neon API error: ${response.status} - ${error}`);
  }
  
  return await response.json();
}