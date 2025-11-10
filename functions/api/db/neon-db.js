/**
 * Neon Database Helper (HTTP/Serverless Driver)
 * Uses Neon's serverless driver instead of Hyperdrive
 * Works perfectly with Cloudflare Pages Functions
 * 
 * @created November 10, 2025
 * @issue Database connectivity workaround
 */

import { neon } from '@neondatabase/serverless';

/**
 * Get Neon database connection
 * @param {Object} env - Environment variables containing NEON_CONNECTION_STRING
 * @returns {Function} Neon SQL query function
 */
export function getNeonDB(env) {
  if (!env.NEON_CONNECTION_STRING) {
    throw new Error('NEON_CONNECTION_STRING not configured in environment variables');
  }
  
  // Create Neon serverless connection
  const sql = neon(env.NEON_CONNECTION_STRING);
  
  return sql;
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
  const sql = getNeonDB(env);
  const results = await sql(query, params);
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
  const sql = getNeonDB(env);
  return await sql(query, params);
}