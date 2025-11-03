/**
 * Schema Verification Test Suite
 * Tests the schema verification functionality
 * 
 * @module test-schema-verification
 * @requires verify-schema module
 * @version 1.0.0
 * @created November 3, 2025
 * @issue #18 - Database Integration & Schema Verification
 */

import { verifySchema, generateReport } from './verify-schema.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Test result tracker
 */
class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async test(name, fn) {
    try {
      await fn();
      this.passed++;
      this.tests.push({ name, status: 'PASS' });
      console.log(`${colors.green}✓${colors.reset} ${name}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ name, status: 'FAIL', error: error.message });
      console.log(`${colors.red}✗${colors.reset} ${name}`);
      console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    }
  }

  summary() {
    console.log(`\n${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bright}Test Summary${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.green}Passed: ${this.passed}${colors.reset}`);
    if (this.failed > 0) {
      console.log(`${colors.red}Failed: ${this.failed}${colors.reset}`);
    }
    console.log(`Total: ${this.passed + this.failed}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
  }
}

/**
 * Run schema verification tests
 * @param {Object} env - Cloudflare Workers environment bindings
 * @returns {Promise<Object>} Test results
 */
export async function runSchemaVerificationTests(env) {
  console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}Schema Verification Test Suite${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  const runner = new TestRunner();

  // =========================================================================
  // CONNECTION TESTS
  // =========================================================================

  console.log(`${colors.bright}Connection Tests:${colors.reset}`);

  await runner.test('Database binding exists', async () => {
    if (!env.DB) {
      throw new Error('DB binding not found in environment');
    }
  });

  await runner.test('Database connection works', async () => {
    const result = await env.DB.prepare('SELECT 1 as test').first();
    if (result?.test !== 1) {
      throw new Error('Database connection test failed');
    }
  });

  // =========================================================================
  // SCHEMA VERIFICATION TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Schema Verification Tests:${colors.reset}`);

  let verificationResult = null;

  await runner.test('verifySchema function executes without errors', async () => {
    verificationResult = await verifySchema(env.DB);
    if (!verificationResult) {
      throw new Error('verifySchema returned null or undefined');
    }
    if (typeof verificationResult !== 'object') {
      throw new Error('verifySchema should return an object');
    }
  });

  await runner.test('Verification result has required properties', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }
    if (!('success' in verificationResult)) {
      throw new Error('Result missing "success" property');
    }
    if (!('details' in verificationResult)) {
      throw new Error('Result missing "details" property');
    }
  });

  await runner.test('Schema verification passes (tables exist)', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }
    
    if (!verificationResult.success) {
      // Generate detailed report for debugging
      const report = generateReport(verificationResult);
      console.log(`\n${colors.yellow}${report}${colors.reset}`);
      throw new Error('Schema verification failed - see report above');
    }
  });

  await runner.test('Both assessment tables are present', async () => {
    if (!verificationResult || !verificationResult.details.tables) {
      throw new Error('No table details available');
    }

    const tables = verificationResult.details.tables;
    
    if (!tables.assessment_sessions) {
      throw new Error('assessment_sessions table not found in results');
    }
    
    if (!tables.assessment_results) {
      throw new Error('assessment_results table not found in results');
    }
    
    if (!tables.assessment_sessions.exists) {
      throw new Error('assessment_sessions table does not exist');
    }
    
    if (!tables.assessment_results.exists) {
      throw new Error('assessment_results table does not exist');
    }
  });

  await runner.test('assessment_sessions has required columns', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const table = verificationResult.details.tables.assessment_sessions;
    const requiredColumns = [
      'id', 'session_id', 'user_id', 'consent_data', 
      'current_question', 'answers', 'status'
    ];

    for (const col of requiredColumns) {
      if (!table.columns.valid.includes(col)) {
        throw new Error(`Missing or invalid column: ${col}`);
      }
    }
  });

  await runner.test('assessment_results has required columns', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const table = verificationResult.details.tables.assessment_results;
    const requiredColumns = [
      'id', 'result_id', 'session_id', 'user_id',
      'big_five', 'holland_code', 'career_matches'
    ];

    for (const col of requiredColumns) {
      if (!table.columns.valid.includes(col)) {
        throw new Error(`Missing or invalid column: ${col}`);
      }
    }
  });

  await runner.test('Required indexes are present', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const summary = verificationResult.details.summary;
    if (summary.indexesMissing.length > 0) {
      throw new Error(
        `Missing indexes: ${summary.indexesMissing.join(', ')}`
      );
    }
  });

  await runner.test('Foreign keys are properly configured', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const summary = verificationResult.details.summary;
    if (summary.foreignKeysMissing.length > 0) {
      throw new Error(
        `Missing foreign keys: ${summary.foreignKeysMissing.join(', ')}`
      );
    }
  });

  // =========================================================================
  // REPORT GENERATION TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Report Generation Tests:${colors.reset}`);

  await runner.test('generateReport produces output', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const report = generateReport(verificationResult);
    if (!report || typeof report !== 'string') {
      throw new Error('generateReport should return a string');
    }
    if (report.length < 10) {
      throw new Error('Report is too short');
    }
  });

  await runner.test('Report contains verification status', async () => {
    if (!verificationResult) {
      throw new Error('No verification result available');
    }

    const report = generateReport(verificationResult);
    const hasStatus = report.includes('PASSED') || report.includes('FAILED');
    if (!hasStatus) {
      throw new Error('Report should indicate PASSED or FAILED status');
    }
  });

  // =========================================================================
  // EDGE CASE TESTS (Simulated)
  // =========================================================================

  console.log(`\n${colors.bright}Edge Case Tests:${colors.reset}`);

  await runner.test('Handle missing table gracefully', async () => {
    // This test simulates checking for a non-existent table
    // In reality, the function will report it as missing
    // We just verify it doesn't crash
    const mockResult = {
      success: false,
      details: {
        tables: {
          missing_table: { exists: false }
        },
        summary: {
          tablesChecked: 1,
          tablesValid: 0,
          columnsMissing: [],
          indexesMissing: [],
          foreignKeysMissing: []
        }
      }
    };

    const report = generateReport(mockResult);
    if (!report.includes('FAILED')) {
      throw new Error('Report should indicate failure for missing table');
    }
  });

  await runner.test('Handle verification errors gracefully', async () => {
    const errorResult = {
      success: false,
      details: {
        error: 'Simulated error'
      }
    };

    const report = generateReport(errorResult);
    if (!report.includes('Error:')) {
      throw new Error('Report should display error message');
    }
  });

  // =========================================================================
  // SUMMARY
  // =========================================================================

  runner.summary();

  // Print final verification report if available
  if (verificationResult) {
    console.log(`${colors.bright}${colors.cyan}Final Schema Verification Report:${colors.reset}`);
    const report = generateReport(verificationResult);
    console.log(report);
  }

  return {
    passed: runner.passed,
    failed: runner.failed,
    tests: runner.tests,
    success: runner.failed === 0,
    verificationResult
  };
}
