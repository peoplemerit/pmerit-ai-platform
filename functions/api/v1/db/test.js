/**
 * DatabaseHelper Test Suite
 * Comprehensive tests for all CRUD operations
 * 
 * @note Run this from Cloudflare Workers or locally with wrangler dev
 */

import DatabaseHelper from './DatabaseHelper.js';

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
 * Main test suite
 * @param {Object} env - Cloudflare Workers environment bindings
 */
export async function runTests(env) {
  console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}DatabaseHelper Test Suite${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  const runner = new TestRunner();
  const db = new DatabaseHelper(env.DB);

  // Test data that will be used across tests
  let testSessionId = null;
  let testResultId = null;

  // =========================================================================
  // CONNECTION TESTS
  // =========================================================================

  console.log(`${colors.bright}Connection Tests:${colors.reset}`);

  await runner.test('Database connection works', async () => {
    const connected = await db.testConnection();
    if (!connected) throw new Error('Database connection failed');
  });

  await runner.test('Get database info', async () => {
    const info = await db.getDatabaseInfo();
    if (!info.connected) throw new Error('Database not connected');
    if (info.tableCount < 50) throw new Error('Expected at least 50 tables');
  });

  // =========================================================================
  // SESSION TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Session Tests:${colors.reset}`);

  await runner.test('Create assessment session (anonymous)', async () => {
    testSessionId = await db.createAssessmentSession({
      userId: null,
      consentData: {
        privacy: true,
        data: true,
        terms: true
      }
    });

    if (!testSessionId) throw new Error('Session ID not returned');
    if (typeof testSessionId !== 'string') throw new Error('Session ID must be string');
  });

  await runner.test('Get session by ID', async () => {
    const session = await db.getSession(testSessionId);
    if (!session) throw new Error('Session not found');
    if (session.status !== 'started') throw new Error('Status should be "started"');
    if (session.currentQuestion !== 0) throw new Error('Current question should be 0');
  });

  await runner.test('Save assessment progress (Q1-5)', async () => {
    const result = await db.saveAssessmentProgress(testSessionId, {
      currentQuestion: 5,
      answers: {
        'O1': 4,
        'O2': 3,
        'O3': 5,
        'O4': 2,
        'O5': 4
      }
    });

    if (!result.success) throw new Error('Save failed');
    if (result.currentQuestion !== 5) throw new Error('Current question mismatch');
    if (result.answerCount !== 5) throw new Error('Answer count mismatch');
  });

  await runner.test('Save assessment progress (Q6-10)', async () => {
    await db.saveAssessmentProgress(testSessionId, {
      currentQuestion: 10,
      answers: {
        'O1': 4, 'O2': 3, 'O3': 5, 'O4': 2, 'O5': 4,
        'C1': 3, 'C2': 4, 'C3': 5, 'C4': 3, 'C5': 4
      }
    });
  });

  await runner.test('Resume assessment from saved progress', async () => {
    const resumed = await db.resumeAssessment(testSessionId);
    if (!resumed.canResume) throw new Error('Should be able to resume');
    if (resumed.currentQuestion !== 10) throw new Error('Should resume at question 10');
    if (Object.keys(resumed.answers).length !== 10) throw new Error('Should have 10 answers');
  });

  await runner.test('Validate progress tracking', async () => {
    const session = await db.getSession(testSessionId);
    if (session.status !== 'in_progress') throw new Error('Status should be "in_progress"');
    if (!session.updatedAt) throw new Error('Updated timestamp missing');
  });

  // =========================================================================
  // RESULTS TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Results Tests:${colors.reset}`);

  await runner.test('Store assessment results', async () => {
    const mockBigFive = {
      openness: { raw: 4.2, percentile: 85, label: 'Very High' },
      conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
      extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
      agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
      neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
    };

    const mockCareerMatches = [
      {
        career_id: 'c001',
        title: 'Data Scientist',
        fit_score: 95,
        onet_code: '15-2051.00',
        salary_median: 95000
      },
      {
        career_id: 'c002',
        title: 'Software Developer',
        fit_score: 92,
        onet_code: '15-1252.00',
        salary_median: 110000
      }
    ];

    testResultId = await db.storeAssessmentResults({
      sessionId: testSessionId,
      userId: null,
      bigFive: mockBigFive,
      hollandCode: 'IAE',
      careerMatches: mockCareerMatches
    });

    if (!testResultId) throw new Error('Result ID not returned');
  });

  await runner.test('Session marked as completed', async () => {
    const session = await db.getSession(testSessionId);
    if (session.status !== 'completed') throw new Error('Status should be "completed"');
  });

  await runner.test('Get assessment results by result_id', async () => {
    const results = await db.getAssessmentResults(testResultId);
    if (!results) throw new Error('Results not found');
    if (results.hollandCode !== 'IAE') throw new Error('Holland Code mismatch');
    if (!results.bigFive.openness) throw new Error('Big Five data missing');
    if (results.careerMatches.length !== 2) throw new Error('Career matches count mismatch');
  });

  await runner.test('Get assessment results by session_id', async () => {
    const results = await db.getResultsBySession(testSessionId);
    if (!results) throw new Error('Results not found');
    if (results.resultId !== testResultId) throw new Error('Result ID mismatch');
  });

  await runner.test('Cannot resume completed assessment', async () => {
    try {
      await db.resumeAssessment(testSessionId);
      throw new Error('Should throw error for completed assessment');
    } catch (error) {
      if (!error.message.includes('already completed')) {
        throw new Error('Wrong error message: ' + error.message);
      }
    }
  });

  // =========================================================================
  // VALIDATION TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Validation Tests:${colors.reset}`);

  await runner.test('Reject invalid consent data', async () => {
    try {
      await db.createAssessmentSession({
        userId: null,
        consentData: null // Invalid
      });
      throw new Error('Should throw error for invalid consent');
    } catch (error) {
      if (!error.message.includes('consentData')) {
        throw new Error('Wrong validation error');
      }
    }
  });

  await runner.test('Reject invalid current question', async () => {
    try {
      await db.saveAssessmentProgress(testSessionId, {
        currentQuestion: 150, // Out of range
        answers: {}
      });
      throw new Error('Should throw error for invalid question');
    } catch (error) {
      if (!error.message.includes('between 0 and 119')) {
        throw new Error('Wrong validation error');
      }
    }
  });

  await runner.test('Reject invalid Holland Code format', async () => {
    try {
      await db.storeAssessmentResults({
        sessionId: testSessionId,
        userId: null,
        bigFive: {
          openness: { raw: 4.2, percentile: 85, label: 'High' },
          conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
          extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
          agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
          neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
        },
        hollandCode: 'XYZ', // Invalid - not RIASEC letters
        careerMatches: []
      });
      throw new Error('Should throw error for invalid Holland Code');
    } catch (error) {
      if (!error.message.includes('RIASEC')) {
        throw new Error('Wrong validation error');
      }
    }
  });

  await runner.test('Reject incomplete Big Five data', async () => {
    try {
      await db.storeAssessmentResults({
        sessionId: testSessionId,
        userId: null,
        bigFive: {
          openness: { raw: 4.2, percentile: 85, label: 'High' }
          // Missing other 4 traits
        },
        hollandCode: 'IAE',
        careerMatches: []
      });
      throw new Error('Should throw error for incomplete Big Five');
    } catch (error) {
      if (!error.message.includes('is required')) {
        throw new Error('Wrong validation error');
      }
    }
  });

  // =========================================================================
  // STATS TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Statistics Tests:${colors.reset}`);

  await runner.test('Get assessment statistics', async () => {
    const stats = await db.getAssessmentStats();
    if (stats.totalSessions < 1) throw new Error('Should have at least 1 session');
    if (stats.completedSessions < 1) throw new Error('Should have at least 1 completed');
    if (stats.totalResults < 1) throw new Error('Should have at least 1 result');
    if (typeof stats.completionRate !== 'number') throw new Error('Completion rate must be number');
  });

  // =========================================================================
  // EDGE CASE TESTS
  // =========================================================================

  console.log(`\n${colors.bright}Edge Case Tests:${colors.reset}`);

  await runner.test('Handle non-existent session', async () => {
    const session = await db.getSession('00000000-0000-0000-0000-000000000000');
    if (session !== null) throw new Error('Should return null for non-existent session');
  });

  await runner.test('Handle non-existent result', async () => {
    try {
      await db.getAssessmentResults('00000000-0000-0000-0000-000000000000');
      throw new Error('Should throw error for non-existent result');
    } catch (error) {
      if (!error.message.includes('not found')) {
        throw new Error('Wrong error message');
      }
    }
  });

  await runner.test('Get history for non-existent user', async () => {
    const history = await db.getUserAssessmentHistory(999999);
    if (!Array.isArray(history)) throw new Error('Should return empty array');
    if (history.length !== 0) throw new Error('Should be empty for non-existent user');
  });

  // =========================================================================
  // SUMMARY
  // =========================================================================

  runner.summary();

  return {
    passed: runner.passed,
    failed: runner.failed,
    tests: runner.tests,
    success: runner.failed === 0
  };
}

/**
 * Export test endpoint for Cloudflare Workers
 * GET /api/v1/db/test
 */
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const results = await runTests(env);

    return new Response(JSON.stringify({
      success: results.success,
      passed: results.passed,
      failed: results.failed,
      tests: results.tests,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
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
