/**
 * Career Matching Algorithm Tests (updated)
 *
 * - Mocks DatabaseHelper.searchCareersByPersonality
 * - Mocks BLSClient and KV binding
 *
 * Use with your test runner (Node, Jest). This file uses assert for portability.
 */

import assert from 'assert';
import CareerMatcher from '../algorithms/CareerMatcher.js';
import CareerMatchingService from '../services/CareerMatchingService.js';
import BLSClient from '../integrations/BLSClient.js';
import CareerEnrichmentService from '../services/CareerEnrichmentService.js';

const sampleBigFive = {
  openness: { raw: 4.2, percentile: 85, label: "Very High" },
  conscientiousness: { raw: 3.8, percentile: 70, label: "High" },
  extraversion: { raw: 2.9, percentile: 45, label: "Moderate" },
  agreeableness: { raw: 3.5, percentile: 60, label: "High" },
  neuroticism: { raw: 2.2, percentile: 30, label: "Low" }
};
const sampleHollandCode = 'IAE';

// Mock careers
const mockCareers = [
  {
    id: '1',
    career_id: 'c001',
    title: 'Software Developer',
    holland_codes: 'IAE',
    onet_code: '15-2051.00',
    openness: 80,
    conscientiousness: 70,
    extraversion: 40,
    agreeableness: 50,
    neuroticism: 30,
    openness_importance: 0.3,
    conscientiousness_importance: 0.25
  },
  {
    id: '2',
    career_id: 'c002',
    title: 'Registered Nurse',
    holland_codes: 'SAE',
    onet_code: '29-1141.00',
    openness: 60,
    conscientiousness: 80,
    extraversion: 60,
    agreeableness: 75,
    neuroticism: 40
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `x${i}`,
    career_id: `x${i}`,
    title: `Career ${i}`,
    holland_codes: i % 2 === 0 ? 'RCI' : 'AES',
    onet_code: `99-999${i}.00`,
    openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50
  }))
];

class MockDB {
  async searchCareersByPersonality(bigFive, hollandCode, limit) {
    return mockCareers.slice(0, Math.max(limit || 10, 10));
  }
}

// Mock BLS client
class MockBLSClient {
  async getSalaryData(onet) {
    return { median: 90000, mean: 92000, p10: 50000, p90: 140000 };
  }
  async getGrowthOutlook(onet) {
    return { growthRate: 12, outlook: 'Much faster than average', demand: 'High' };
  }
}

// Mock KV binding (simple Map with async get/put/delete)
class MockKV {
  constructor() { this.map = new Map(); }
  async get(k) { return this.map.get(k) ?? null; }
  async put(k, v) { this.map.set(k, v); }
  async delete(k) { this.map.delete(k); }
}

export async function runTests() {
  console.log('🧪 Running Career Matching Tests...\n');
  const matcher = new CareerMatcher(new MockDB());
  const blsClient = new MockBLSClient();
  const kv = new MockKV();
  const enrichment = new CareerEnrichmentService(blsClient, new MockDB(), { kvBinding: kv });
  const service = new CareerMatchingService(null, {
    databaseHelper: new MockDB(),
    matcher,
    blsClient,
    enrichmentService: enrichment,
    kvBinding: kv
  });

  let passed = 0, failed = 0;

  async function run(name, fn) {
    try {
      await fn();
      console.log(`✅ ${name} - PASSED`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name} - FAILED`);
      console.error(err);
      failed++;
    }
  }

  await run('Test 1: Basic Matching returns 10 results', async () => {
    const matches = await matcher.findMatches({ bigFive: sampleBigFive, hollandCode: sampleHollandCode }, 10);
    assert.strictEqual(matches.length, 10);
    for (const m of matches) {
      assert.ok(m.career_id !== undefined);
      assert.ok(m.title);
      assert.ok(typeof m.fit_score === 'number');
      assert.ok(m.rationale);
      assert.ok(m.fit_score >= 0 && m.fit_score <= 100);
    }
    for (let i = 1; i < matches.length; i++) {
      assert.ok(matches[i - 1].fit_score >= matches[i].fit_score);
    }
  });

  await run('Test 2: Holland Code weighting', async () => {
    const scoreSame = matcher.calculateHollandCompatibility('R', 'R');
    const scoreAdj = matcher.calculateHollandCompatibility('R', 'I');
    const scoreOpp = matcher.calculateHollandCompatibility('R', 'S');
    assert.strictEqual(scoreSame, 100);
    assert.ok(scoreAdj > scoreOpp);
  });

  await run('Test 3: Trait matching high similarity', async () => {
    const careerReq = {
      openness: 80, conscientiousness: 70, extraversion: 40, agreeableness: 50, neuroticism: 30
    };
    const s = matcher.calculateTraitMatch(sampleBigFive, careerReq);
    assert.ok(s >= 0 && s <= 100);
    assert.ok(s > 60);
  });

  await run('Test 4: Fit score bounds', async () => {
    const career = { holland_codes: 'IAE', openness_importance: 0.3, conscientiousness_importance: 0.2, extraversion_importance: 0.2, agreeableness_importance: 0.2, neuroticism_importance: 0.1 };
    const f = matcher.calculateFitScore(sampleBigFive, sampleHollandCode, career);
    assert.ok(f >= 0 && f <= 100);
  });

  await run('Test 5: Enrichment and BLS mock', async () => {
    const onet = '15-2051.00';
    const sal = await blsClient.getSalaryData(onet);
    const growth = await blsClient.getGrowthOutlook(onet);
    assert.strictEqual(sal.median, 90000);
    assert.strictEqual(growth.growthRate, 12);
  });

  await run('Test 6: End-to-End', async () => {
    const start = Date.now();
    const recs = await service.getRecommendations({ bigFive: sampleBigFive, hollandCode: sampleHollandCode }, 10);
    const elapsed = Date.now() - start;
    assert.strictEqual(recs.length, 10);
    for (const r of recs) {
      assert.ok(typeof r.rank === 'number');
      assert.ok(r.title);
      assert.ok(r.fit_score >= 0 && r.fit_score <= 100);
    }
    assert.ok(elapsed < 5000, `expected reasonably fast (${elapsed}ms).`);
  });

  await run('Test 7: Edge case extremes', async () => {
    const extremes = {
      bigFive: {
        openness: { percentile: 100 }, conscientiousness: { percentile: 100 },
        extraversion: { percentile: 100 }, agreeableness: { percentile: 100 },
        neuroticism: { percentile: 100 }
      },
      hollandCode: 'RIA'
    };
    const res = await matcher.findMatches(extremes, 5);
    assert.ok(Array.isArray(res));
  });

  await run('Test 8: Error handling', async () => {
    let threw = false;
    try {
      await matcher.findMatches({ bigFive: null, hollandCode: null }, 5);
    } catch (err) {
      threw = true;
    }
    assert.ok(threw);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}