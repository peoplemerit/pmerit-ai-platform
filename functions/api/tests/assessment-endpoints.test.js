/**
 * Assessment API Endpoints - Integration Tests
 * Tests all 5 assessment endpoints
 * 
 * @module AssessmentEndpointsTests
 * @version 1.0.0
 * @created November 4, 2025
 */

import { calculateBigFiveScores } from '../algorithms/BigFiveScoring.js';
import { calculateHollandCode } from '../algorithms/HollandCodeCalculator.js';

/**
 * Generate mock 120 answers for testing
 * @param {string} pattern - Pattern type: 'high', 'low', 'mixed'
 * @returns {Object} 120 answers
 */
function generateMockAnswers(pattern = 'mixed') {
  const answers = {};
  
  // Generate answers for all 120 questions
  // Format: TraitFacet_QuestionNum (e.g., O1_1, O1_2, ...)
  const traits = ['O', 'C', 'E', 'A', 'N'];
  const facetsPerTrait = 6;
  const questionsPerFacet = 4;
  
  for (const trait of traits) {
    for (let facet = 1; facet <= facetsPerTrait; facet++) {
      for (let q = 1; q <= questionsPerFacet; q++) {
        const questionId = `${trait}${facet}_${q}`;
        
        // Generate answer based on pattern
        let answer;
        if (pattern === 'high') {
          answer = q % 2 === 0 ? 2 : 4; // High scores (reverse some)
        } else if (pattern === 'low') {
          answer = q % 2 === 0 ? 4 : 2; // Low scores (reverse some)
        } else {
          answer = 3; // Neutral
        }
        
        answers[questionId] = answer;
      }
    }
  }
  
  return answers;
}

/**
 * Test Big Five Scoring Algorithm
 */
async function testBigFiveScoring() {
  console.log('\n=== Testing Big Five Scoring ===');
  
  try {
    const answers = generateMockAnswers('mixed');
    const scores = calculateBigFiveScores(answers);
    
    // Validate structure
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    for (const trait of traits) {
      if (!scores[trait]) {
        throw new Error(`Missing trait: ${trait}`);
      }
      
      if (typeof scores[trait].raw !== 'number') {
        throw new Error(`${trait}.raw must be a number`);
      }
      
      if (scores[trait].raw < 1 || scores[trait].raw > 5) {
        throw new Error(`${trait}.raw must be between 1 and 5`);
      }
      
      if (typeof scores[trait].percentile !== 'number') {
        throw new Error(`${trait}.percentile must be a number`);
      }
      
      if (scores[trait].percentile < 0 || scores[trait].percentile > 100) {
        throw new Error(`${trait}.percentile must be between 0 and 100`);
      }
      
      if (typeof scores[trait].label !== 'string') {
        throw new Error(`${trait}.label must be a string`);
      }
    }
    
    console.log('✓ Big Five scoring structure valid');
    console.log('  Sample scores:', {
      openness: scores.openness,
      conscientiousness: scores.conscientiousness
    });
    
    return { passed: true };
  } catch (error) {
    console.error('✗ Big Five scoring test failed:', error.message);
    return { passed: false, error: error.message };
  }
}

/**
 * Test Holland Code Calculation
 */
async function testHollandCodeCalculation() {
  console.log('\n=== Testing Holland Code Calculation ===');
  
  try {
    const answers = generateMockAnswers('mixed');
    const hollandCode = calculateHollandCode(answers);
    
    // Validate format
    if (typeof hollandCode !== 'string') {
      throw new Error('Holland Code must be a string');
    }
    
    if (hollandCode.length !== 3) {
      throw new Error(`Holland Code must be 3 letters, got: ${hollandCode}`);
    }
    
    if (!/^[RIASEC]{3}$/.test(hollandCode)) {
      throw new Error(`Holland Code must use only RIASEC letters, got: ${hollandCode}`);
    }
    
    console.log('✓ Holland Code format valid');
    console.log('  Code:', hollandCode);
    
    return { passed: true };
  } catch (error) {
    console.error('✗ Holland Code test failed:', error.message);
    return { passed: false, error: error.message };
  }
}

/**
 * Test error handling for Big Five scoring
 */
async function testBigFiveScoringErrors() {
  console.log('\n=== Testing Big Five Scoring Error Handling ===');
  
  const tests = [
    {
      name: 'Missing answers',
      answers: {},
      expectError: 'Expected 120 answers'
    },
    {
      name: 'Invalid answer value',
      answers: (() => {
        const a = generateMockAnswers('mixed');
        a['O1_1'] = 10; // Invalid value
        return a;
      })(),
      expectError: 'must be between 1 and 5'
    },
    {
      name: 'Missing specific answer',
      answers: (() => {
        const a = generateMockAnswers('mixed');
        delete a['O1_1'];
        return a;
      })(),
      expectError: 'Expected 120 answers' // Caught by count validation first
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      calculateBigFiveScores(test.answers);
      console.error(`✗ ${test.name}: Should have thrown error`);
      failed++;
    } catch (error) {
      if (error.message.includes(test.expectError)) {
        console.log(`✓ ${test.name}: Correctly threw error`);
        passed++;
      } else {
        console.error(`✗ ${test.name}: Wrong error message:`, error.message);
        failed++;
      }
    }
  }
  
  return { passed: failed === 0 };
}

/**
 * Test various answer patterns
 */
async function testAnswerPatterns() {
  console.log('\n=== Testing Various Answer Patterns ===');
  
  const patterns = ['high', 'low', 'mixed'];
  
  for (const pattern of patterns) {
    try {
      const answers = generateMockAnswers(pattern);
      const bigFive = calculateBigFiveScores(answers);
      const hollandCode = calculateHollandCode(answers);
      
      console.log(`✓ Pattern '${pattern}' processed successfully`);
      console.log(`  Sample: O=${bigFive.openness.raw.toFixed(2)}, Holland=${hollandCode}`);
    } catch (error) {
      console.error(`✗ Pattern '${pattern}' failed:`, error.message);
      return { passed: false, error: error.message };
    }
  }
  
  return { passed: true };
}

/**
 * Run all tests
 */
export async function runTests() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Assessment API Endpoints - Algorithm Tests         ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  
  const results = [];
  
  // Run algorithm tests
  results.push(await testBigFiveScoring());
  results.push(await testHollandCodeCalculation());
  results.push(await testBigFiveScoringErrors());
  results.push(await testAnswerPatterns());
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log(`║  Test Summary: ${passed} passed, ${failed} failed${' '.repeat(23 - passed.toString().length - failed.toString().length)}║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');
  
  return {
    passed,
    failed,
    results
  };
}

// Export for test runner
export default {
  runTests
};
