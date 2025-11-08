/**
 * Big Five Personality Scoring Algorithm
 * Implements IPIP-NEO-120 scoring methodology
 *
 * @module BigFiveScoring
 * @version 1.0.0
 * @created November 4, 2025
 */

// IPIP-NEO-120 Configuration Constants
const IPIP_CONFIG = {
  TOTAL_QUESTIONS: 120,
  TRAITS_COUNT: 5,
  FACETS_PER_TRAIT: 6,
  QUESTIONS_PER_FACET: 4,
  MIN_ANSWER_VALUE: 1,
  MAX_ANSWER_VALUE: 5
};

// Trait mapping configuration
const TRAIT_MAPPING = {
  'O': { start: 1, facets: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'] },
  'C': { start: 25, facets: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
  'E': { start: 49, facets: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'] },
  'A': { start: 73, facets: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'] },
  'N': { start: 97, facets: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'] }
};

// Question keying configuration (which questions are reverse-scored)
const REVERSE_KEYED_QUESTIONS = [2, 4]; // Question indices that are reverse-keyed

/**
 * Calculate Big Five personality scores from 120 IPIP answers
 * @param {Object} answers - All 120 answers (key: question_id, value: 1-5)
 * @returns {Object} Big Five scores with raw, percentile, and label
 *
 * @example
 * const scores = calculateBigFiveScores({
 *   O1_1: 4, O1_2: 2, ... // 120 answers
 * });
 * // Returns: { openness: { raw: 4.2, percentile: 85, label: "Very High" }, ... }
 */
export function calculateBigFiveScores(answers) {
  // Validate input
  if (!answers || typeof answers !== 'object') {
    throw new Error('answers must be an object');
  }

  const answerCount = Object.keys(answers).length;
  if (answerCount !== IPIP_CONFIG.TOTAL_QUESTIONS) {
    throw new Error(`Expected ${IPIP_CONFIG.TOTAL_QUESTIONS} answers, got ${answerCount}`);
  }

  // Calculate each trait
  const openness = calculateTraitScore(answers, 'O');
  const conscientiousness = calculateTraitScore(answers, 'C');
  const extraversion = calculateTraitScore(answers, 'E');
  const agreeableness = calculateTraitScore(answers, 'A');
  const neuroticism = calculateTraitScore(answers, 'N');

  return {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism
  };
}

/**
 * Calculate score for a single Big Five trait (24 questions per trait)
 * @param {Object} answers - All answers
 * @param {string} traitCode - Trait code (O, C, E, A, N)
 * @returns {Object} Trait score with raw, percentile, label
 */
function calculateTraitScore(answers, traitCode) {
  // Get questions for this trait
  const traitQuestions = getTraitQuestions(traitCode);

  let sum = 0;
  let count = 0;

  for (const q of traitQuestions) {
    const answer = answers[q.question_id];

    if (answer === undefined || answer === null) {
      throw new Error(`Missing answer for question: ${q.question_id}`);
    }

    // Validate answer range
    if (answer < IPIP_CONFIG.MIN_ANSWER_VALUE || answer > IPIP_CONFIG.MAX_ANSWER_VALUE) {
      throw new Error(`Answer for ${q.question_id} must be between ${IPIP_CONFIG.MIN_ANSWER_VALUE} and ${IPIP_CONFIG.MAX_ANSWER_VALUE}, got ${answer}`);
    }

    // Reverse score if needed (keyed "minus")
    const score = q.keyed === 'minus' ? (IPIP_CONFIG.MAX_ANSWER_VALUE + 1 - answer) : answer;
    sum += score;
    count++;
  }

  if (count !== IPIP_CONFIG.FACETS_PER_TRAIT * IPIP_CONFIG.QUESTIONS_PER_FACET) {
    throw new Error(`Expected ${IPIP_CONFIG.FACETS_PER_TRAIT * IPIP_CONFIG.QUESTIONS_PER_FACET} questions for trait ${traitCode}, found ${count}`);
  }

  // Calculate raw score (mean of 24 questions)
  const raw = sum / count;

  // Convert to percentile and label
  const percentile = rawToPercentile(raw, traitCode);
  const label = percentileToLabel(percentile);

  return {
    raw: Math.round(raw * 100) / 100, // Round to 2 decimals
    percentile,
    label
  };
}

/**
 * Get all questions for a specific trait
 * Based on IPIP-NEO-120 structure
 */
function getTraitQuestions(traitCode) {
  const trait = TRAIT_MAPPING[traitCode];
  if (!trait) {
    throw new Error(`Invalid trait code: ${traitCode}`);
  }

  const questions = [];

  // IPIP-NEO-120 uses interleaved question numbering
  for (let facetIdx = 0; facetIdx < IPIP_CONFIG.FACETS_PER_TRAIT; facetIdx++) {
    const facetId = trait.facets[facetIdx];

    for (let qIdx = 1; qIdx <= IPIP_CONFIG.QUESTIONS_PER_FACET; qIdx++) {
      // Calculate question number using interleaved pattern
      const questionNum = (qIdx - 1) * (IPIP_CONFIG.FACETS_PER_TRAIT * IPIP_CONFIG.TRAITS_COUNT) + facetIdx + trait.start;

      // Determine keying based on question index
      const keyed = REVERSE_KEYED_QUESTIONS.includes(qIdx) ? 'minus' : 'plus';

      questions.push({
        question_id: `${facetId}_${qIdx}`,
        question_number: questionNum,
        keyed
      });
    }
  }

  return questions;
}

/**
 * Convert raw score (1-5) to percentile (0-100)
 * Uses approximate norm tables based on IPIP research
 *
 * @param {number} raw - Raw score (mean of 1-5 scale)
 * @param {string} traitCode - Trait code for trait-specific norms
 * @returns {number} Percentile (0-100)
 */
function rawToPercentile(raw, _traitCode) {
  // Simplified norm conversion
  // In production, use actual norm tables from IPIP research
  // These are approximate values based on normal distribution assumptions

  // Standard norm table (can be customized per trait)
  const normTable = [
    { raw: 1.0, percentile: 1 },
    { raw: 1.5, percentile: 5 },
    { raw: 2.0, percentile: 10 },
    { raw: 2.5, percentile: 25 },
    { raw: 3.0, percentile: 50 },
    { raw: 3.5, percentile: 75 },
    { raw: 4.0, percentile: 90 },
    { raw: 4.5, percentile: 95 },
    { raw: 5.0, percentile: 99 }
  ];

  // Linear interpolation
  for (let i = 0; i < normTable.length - 1; i++) {
    if (raw >= normTable[i].raw && raw <= normTable[i + 1].raw) {
      const ratio = (raw - normTable[i].raw) / (normTable[i + 1].raw - normTable[i].raw);
      const percentile = normTable[i].percentile +
        ratio * (normTable[i + 1].percentile - normTable[i].percentile);
      return Math.round(percentile);
    }
  }

  // Edge cases
  if (raw < normTable[0].raw) {return normTable[0].percentile;}
  if (raw > normTable[normTable.length - 1].raw) {return normTable[normTable.length - 1].percentile;}

  return 50; // Default to median
}

/**
 * Convert percentile to descriptive label
 * @param {number} percentile - Percentile (0-100)
 * @returns {string} Label
 */
function percentileToLabel(percentile) {
  if (percentile >= 85) {return 'Very High';}
  if (percentile >= 65) {return 'High';}
  if (percentile >= 35) {return 'Moderate';}
  if (percentile >= 15) {return 'Low';}
  return 'Very Low';
}

export default {
  calculateBigFiveScores
};
