/**
 * Career Matching Algorithm Tests
 * Comprehensive test suite for career matching functionality
 *
 * @module career-matching.test
 * @version 1.0.0
 */

import CareerMatcher from '../algorithms/CareerMatcher.js';
import CareerMatchingService from '../services/CareerMatchingService.js';
import BLSClient from '../integrations/BLSClient.js';
import CareerEnrichmentService from '../services/CareerEnrichmentService.js';

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

// Test Data
const sampleBigFive = {
  openness: { raw: 4.2, percentile: 85, label: 'Very High' },
  conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
  extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
  agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
  neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
};

const sampleHollandCode = 'IAE';

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

    return { passed: this.passed, failed: this.failed };
  }
}

/**
 * Mock Database (mimics Cloudflare D1 API)
 */
class MockDatabase {
  constructor() {
    this.mockCareers = [
      {
        career_id: 'c001',
        title: 'Software Developer',
        description: 'Develop and maintain software applications',
        onet_code: '15-1252.00',
        holland_codes: 'IRC',
        salary_median: 110140,
        salary_min: 70000,
        salary_max: 150000,
        growth_outlook: 'Much faster than average',
        education_required: 'Bachelor\'s degree',
        skills_required: 'Programming, Problem Solving, Debugging',
        openness_importance: 0.3,
        conscientiousness_importance: 0.25,
        extraversion_importance: 0.1,
        agreeableness_importance: 0.15,
        neuroticism_importance: 0.2
      },
      {
        career_id: 'c002',
        title: 'Data Scientist',
        description: 'Analyze complex data to help organizations make decisions',
        onet_code: '15-2051.00',
        holland_codes: 'IAE',
        salary_median: 100910,
        salary_min: 60000,
        salary_max: 140000,
        growth_outlook: 'Much faster than average',
        education_required: 'Master\'s degree',
        skills_required: 'Statistics, Machine Learning, Data Analysis',
        openness_importance: 0.35,
        conscientiousness_importance: 0.25,
        extraversion_importance: 0.1,
        agreeableness_importance: 0.1,
        neuroticism_importance: 0.2
      },
      {
        career_id: 'c003',
        title: 'Sales Manager',
        description: 'Direct sales team to achieve targets',
        onet_code: '11-2022.00',
        holland_codes: 'ESC',
        salary_median: 132290,
        salary_min: 60000,
        salary_max: 200000,
        growth_outlook: 'Average',
        education_required: 'Bachelor\'s degree',
        skills_required: 'Leadership, Communication, Negotiation',
        openness_importance: 0.15,
        conscientiousness_importance: 0.25,
        extraversion_importance: 0.35,
        agreeableness_importance: 0.15,
        neuroticism_importance: 0.1
      }
    ];
  }

  prepare(query) {
    const self = this;
    return {
      all: async () => {
        return { results: self.mockCareers };
      },
      first: async () => {
        return self.mockCareers[0];
      },
      bind: () => {
        return self.prepare(query);
      },
      run: async () => {
        return { success: true };
      }
    };
  }
}

/**
 * Mock DatabaseHelper for testing
 */
class MockDatabaseHelper {
  constructor(mockDb) {
    this.db = mockDb || new MockDatabase();
  }

  prepare(query) {
    return this.db.prepare(query);
  }

  async testConnection() {
    return { connected: true, database: 'mock', version: '1.0.0' };
  }
}

/**
 * Run all career matching tests
 * @param {Object} env - Cloudflare Workers environment (optional, uses mocks if not provided)
 * @returns {Promise<Object>} Test results
 */
export async function runTests(env = null) {
  console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}Career Matching Algorithm Test Suite${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  const runner = new TestRunner();

  // Use mock database if no environment provided
  const mockDb = env?.DB ? env.DB : new MockDatabase();
  const dbHelper = new MockDatabaseHelper(mockDb);
  const matcher = new CareerMatcher(dbHelper);
  const bls = new BLSClient();
  const enrichment = new CareerEnrichmentService(bls, dbHelper);

  // =========================================================================
  // TEST 1: BASIC MATCHING
  // =========================================================================

  console.log(`${colors.bright}Basic Matching Tests:${colors.reset}`);

  await runner.test('Test 1.1: Matcher returns correct number of results', async () => {
    const matches = await matcher.findMatches({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 10);

    if (!Array.isArray(matches)) {
      throw new Error('Expected matches to be an array');
    }

    if (matches.length > 10) {
      throw new Error(`Expected max 10 results, got ${matches.length}`);
    }

    console.log(`    Found ${matches.length} matches`);
  });

  await runner.test('Test 1.2: Each match has required fields', async () => {
    const matches = await matcher.findMatches({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 5);

    if (matches.length === 0) {
      throw new Error('No matches returned');
    }

    const requiredFields = ['career_id', 'title', 'fit_score', 'rationale'];
    for (const match of matches) {
      for (const field of requiredFields) {
        if (!(field in match)) {
          throw new Error(`Match missing required field: ${field}`);
        }
      }
    }
  });

  await runner.test('Test 1.3: Fit scores are in valid range (0-100)', async () => {
    const matches = await matcher.findMatches({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 5);

    for (const match of matches) {
      if (typeof match.fit_score !== 'number') {
        throw new Error('Fit score must be a number');
      }
      if (match.fit_score < 0 || match.fit_score > 100) {
        throw new Error(`Fit score ${match.fit_score} out of range (0-100)`);
      }
    }
  });

  await runner.test('Test 1.4: Results are sorted by fit score (descending)', async () => {
    const matches = await matcher.findMatches({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 10);

    for (let i = 1; i < matches.length; i++) {
      if (matches[i].fit_score > matches[i - 1].fit_score) {
        throw new Error('Results not sorted correctly by fit_score');
      }
    }
  });

  // =========================================================================
  // TEST 2: HOLLAND CODE COMPATIBILITY
  // =========================================================================

  console.log(`\n${colors.bright}Holland Code Compatibility Tests:${colors.reset}`);

  await runner.test('Test 2.1: Same codes score 100', async () => {
    const score = matcher.calculateHollandCompatibility('R', 'R');
    if (score !== 100) {
      throw new Error(`Expected 100, got ${score}`);
    }
  });

  await runner.test('Test 2.2: Adjacent codes score high (>75)', async () => {
    const scoreRI = matcher.calculateHollandCompatibility('R', 'I');
    const scoreRC = matcher.calculateHollandCompatibility('R', 'C');

    if (scoreRI < 75) {
      throw new Error(`Adjacent R-I score ${scoreRI} too low (expected >75)`);
    }
    if (scoreRC < 75) {
      throw new Error(`Adjacent R-C score ${scoreRC} too low (expected >75)`);
    }

    console.log(`    R-I: ${scoreRI}, R-C: ${scoreRC}`);
  });

  await runner.test('Test 2.3: Opposite codes score low (<40)', async () => {
    const scoreRS = matcher.calculateHollandCompatibility('R', 'S');
    const scoreIE = matcher.calculateHollandCompatibility('I', 'E');

    if (scoreRS > 40) {
      throw new Error(`Opposite R-S score ${scoreRS} too high (expected <40)`);
    }
    if (scoreIE > 40) {
      throw new Error(`Opposite I-E score ${scoreIE} too high (expected <40)`);
    }

    console.log(`    R-S: ${scoreRS}, I-E: ${scoreIE}`);
  });

  await runner.test('Test 2.4: 3-letter code matching works', async () => {
    const score = matcher.calculateHollandCompatibility('IAE', 'IAE');
    if (score !== 100) {
      throw new Error(`Expected 100 for identical codes, got ${score}`);
    }

    const score2 = matcher.calculateHollandCompatibility('IAE', 'IRC');
    if (typeof score2 !== 'number' || score2 < 0 || score2 > 100) {
      throw new Error(`Invalid score for partial match: ${score2}`);
    }
  });

  // =========================================================================
  // TEST 3: BIG FIVE TRAIT MATCHING
  // =========================================================================

  console.log(`\n${colors.bright}Big Five Trait Matching Tests:${colors.reset}`);

  await runner.test('Test 3.1: Trait matching returns valid score', async () => {
    const career = {
      openness_importance: 0.3,
      conscientiousness_importance: 0.2,
      extraversion_importance: 0.2,
      agreeableness_importance: 0.2,
      neuroticism_importance: 0.1
    };

    const score = matcher.calculateTraitMatch(sampleBigFive, career);

    if (typeof score !== 'number') {
      throw new Error('Trait match score must be a number');
    }
    if (score < 0 || score > 100) {
      throw new Error(`Trait match score ${score} out of range (0-100)`);
    }

    console.log(`    Trait match score: ${score}`);
  });

  await runner.test('Test 3.2: High matching traits increase score', async () => {
    const perfectCareer = {
      openness_importance: 0.5,
      conscientiousness_importance: 0.2,
      extraversion_importance: 0.1,
      agreeableness_importance: 0.1,
      neuroticism_importance: 0.1
    };

    const score = matcher.calculateTraitMatch(sampleBigFive, perfectCareer);

    // User has high openness (85th percentile), so emphasizing openness should yield high score
    if (score < 60) {
      throw new Error(`Expected high score for matching traits, got ${score}`);
    }
  });

  // =========================================================================
  // TEST 4: FIT SCORE CALCULATION
  // =========================================================================

  console.log(`\n${colors.bright}Fit Score Calculation Tests:${colors.reset}`);

  await runner.test('Test 4.1: Fit score combines Big Five and Holland', async () => {
    const career = {
      holland_codes: 'IAE',
      openness_importance: 0.3,
      conscientiousness_importance: 0.2,
      extraversion_importance: 0.2,
      agreeableness_importance: 0.2,
      neuroticism_importance: 0.1
    };

    const fitScore = matcher.calculateFitScore(sampleBigFive, 'IAE', career);

    if (typeof fitScore !== 'number') {
      throw new Error('Fit score must be a number');
    }
    if (fitScore < 0 || fitScore > 100) {
      throw new Error(`Fit score ${fitScore} out of range (0-100)`);
    }

    console.log(`    Fit score: ${fitScore}`);
  });

  await runner.test('Test 4.2: Perfect match scores very high', async () => {
    const perfectCareer = {
      holland_codes: 'IAE',
      openness_importance: 0.35,
      conscientiousness_importance: 0.25,
      extraversion_importance: 0.1,
      agreeableness_importance: 0.2,
      neuroticism_importance: 0.1
    };

    const fitScore = matcher.calculateFitScore(sampleBigFive, 'IAE', perfectCareer);

    if (fitScore < 80) {
      throw new Error(`Perfect match should score >80, got ${fitScore}`);
    }
  });

  // =========================================================================
  // TEST 5: BLS API INTEGRATION
  // =========================================================================

  console.log(`\n${colors.bright}BLS API Integration Tests:${colors.reset}`);

  await runner.test('Test 5.1: BLS client initializes correctly', async () => {
    if (!bls.apiKey) {
      throw new Error('BLS API key not set');
    }
    if (!bls.baseURL) {
      throw new Error('BLS base URL not set');
    }
  });

  await runner.test('Test 5.2: getOccupationData returns structure', async () => {
    const socCode = '15-1252';
    const data = await bls.getOccupationData(socCode);

    if (!data || typeof data !== 'object') {
      throw new Error('Expected occupation data object');
    }

    if (!data.socCode) {
      throw new Error('Response missing socCode');
    }

    console.log('    BLS data structure validated');
  });

  // =========================================================================
  // TEST 6: ENRICHMENT SERVICE
  // =========================================================================

  console.log(`\n${colors.bright}Career Enrichment Tests:${colors.reset}`);

  await runner.test('Test 6.1: Enrichment service processes matches', async () => {
    const mockMatches = [
      {
        career_id: 'c001',
        title: 'Test Career',
        fit_score: 85,
        onet_code: '15-1252.00'
      }
    ];

    const enriched = await enrichment.enrichMatches(mockMatches);

    if (!Array.isArray(enriched) || enriched.length === 0) {
      throw new Error('Enrichment failed to return array');
    }
  });

  await runner.test('Test 6.2: Cache stores and retrieves data', async () => {
    const testData = { test: 'data', timestamp: Date.now() };
    enrichment.cacheCareerData('test_key', testData);

    const cached = enrichment.getFromCache('test_key');
    if (!cached || cached.test !== 'data') {
      throw new Error('Cache failed to store/retrieve data');
    }
  });

  // =========================================================================
  // TEST 7: END-TO-END WORKFLOW
  // =========================================================================

  console.log(`\n${colors.bright}End-to-End Workflow Tests:${colors.reset}`);

  await runner.test('Test 7.1: Complete recommendation workflow', async () => {
    const service = env?.DB ? new CareerMatchingService(env.DB) : new CareerMatchingService(mockDb);

    const startTime = Date.now();
    const recommendations = await service.getRecommendations({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 10);
    const duration = Date.now() - startTime;

    if (!Array.isArray(recommendations)) {
      throw new Error('Expected recommendations array');
    }

    console.log(`    Generated ${recommendations.length} recommendations in ${duration}ms`);

    if (duration > 5000) {
      console.warn(`    ${colors.yellow}Warning: Response time ${duration}ms exceeds reasonable limit${colors.reset}`);
    }
  });

  await runner.test('Test 7.2: Recommendations have all required fields', async () => {
    const service = env?.DB ? new CareerMatchingService(env.DB) : new CareerMatchingService(mockDb);

    const recommendations = await service.getRecommendations({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 5);

    if (recommendations.length === 0) {
      throw new Error('No recommendations returned');
    }

    const requiredFields = ['rank', 'career_id', 'title', 'fit_score', 'rationale'];
    for (const rec of recommendations) {
      for (const field of requiredFields) {
        if (!(field in rec)) {
          throw new Error(`Recommendation missing field: ${field}`);
        }
      }
    }
  });

  await runner.test('Test 7.3: Ranks are sequential', async () => {
    const service = env?.DB ? new CareerMatchingService(env.DB) : new CareerMatchingService(mockDb);

    const recommendations = await service.getRecommendations({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 5);

    for (let i = 0; i < recommendations.length; i++) {
      if (recommendations[i].rank !== i + 1) {
        throw new Error(`Expected rank ${i + 1}, got ${recommendations[i].rank}`);
      }
    }
  });

  // =========================================================================
  // TEST 8: ERROR HANDLING
  // =========================================================================

  console.log(`\n${colors.bright}Error Handling Tests:${colors.reset}`);

  await runner.test('Test 8.1: Missing Big Five throws error', async () => {
    try {
      await matcher.findMatches({ hollandCode: 'IAE' }, 10);
      throw new Error('Should have thrown error for missing bigFive');
    } catch (error) {
      if (!error.message.includes('bigFive')) {
        throw new Error('Wrong error message');
      }
    }
  });

  await runner.test('Test 8.2: Invalid Holland Code throws error', async () => {
    try {
      await matcher.findMatches({
        bigFive: sampleBigFive,
        hollandCode: 'XYZ'
      }, 10);
      throw new Error('Should have thrown error for invalid Holland Code');
    } catch (error) {
      if (!error.message.includes('Invalid Holland Code')) {
        throw new Error('Wrong error message');
      }
    }
  });

  await runner.test('Test 8.3: Empty database returns empty array', async () => {
    const emptyDb = new MockDatabase();
    emptyDb.mockCareers = [];

    const emptyDbHelper = new MockDatabaseHelper(emptyDb);
    const emptyMatcher = new CareerMatcher(emptyDbHelper);
    const matches = await emptyMatcher.findMatches({
      bigFive: sampleBigFive,
      hollandCode: sampleHollandCode
    }, 10);

    if (!Array.isArray(matches) || matches.length !== 0) {
      throw new Error('Expected empty array for empty database');
    }
  });

  // =========================================================================
  // SUMMARY
  // =========================================================================

  return runner.summary();
}
