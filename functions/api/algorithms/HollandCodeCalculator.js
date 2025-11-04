/**
 * Holland Code (RIASEC) Calculation Algorithm
 * Calculates 3-letter Holland Code from assessment answers
 * 
 * @module HollandCodeCalculator
 * @version 1.0.0
 * @created November 4, 2025
 */

/**
 * Calculate Holland Code (RIASEC) from assessment answers
 * @param {Object} answers - All 120 answers
 * @returns {string} 3-letter Holland Code (e.g., "IAE")
 * 
 * @example
 * const hollandCode = calculateHollandCode({
 *   O1_1: 4, O1_2: 2, ... // 120 answers
 * });
 * // Returns: "IAE"
 */
export function calculateHollandCode(answers) {
  // Validate input
  if (!answers || typeof answers !== 'object') {
    throw new Error('answers must be an object');
  }

  // Calculate scores for each RIASEC type
  const scores = {
    R: calculateRIASECScore(answers, 'R'), // Realistic
    I: calculateRIASECScore(answers, 'I'), // Investigative
    A: calculateRIASECScore(answers, 'A'), // Artistic
    S: calculateRIASECScore(answers, 'S'), // Social
    E: calculateRIASECScore(answers, 'E'), // Enterprising
    C: calculateRIASECScore(answers, 'C')  // Conventional
  };

  // Sort types by score (descending)
  const sortedTypes = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // Return top 3 as Holland Code
  const hollandCode = sortedTypes.slice(0, 3).join('');

  console.log('[HollandCode] Scores:', scores);
  console.log('[HollandCode] Code:', hollandCode);

  return hollandCode;
}

/**
 * Calculate score for a single RIASEC type
 * Maps Big Five traits to RIASEC types using research-based correlations
 * 
 * @param {Object} answers - All answers
 * @param {string} typeCode - RIASEC type code (R, I, A, S, E, C)
 * @returns {number} Score for this type
 */
function calculateRIASECScore(answers, typeCode) {
  // Holland Code can be inferred from Big Five scores
  // Research shows correlations between Big Five and RIASEC
  // This is a simplified implementation
  
  // Calculate Big Five facet averages that correlate with RIASEC
  const facetScores = calculateFacetAverages(answers);
  
  // RIASEC type correlations with Big Five facets
  const correlations = {
    'R': {
      // Realistic: Low Openness to Ideas, Low Extraversion-Warmth
      facets: [
        { facet: 'O3', weight: -0.3 }, // Ideas (inverse)
        { facet: 'E1', weight: -0.2 }, // Warmth (inverse)
        { facet: 'A4', weight: -0.2 }  // Tender-mindedness (inverse)
      ]
    },
    'I': {
      // Investigative: High Openness to Ideas, High Openness-Intellect
      facets: [
        { facet: 'O3', weight: 0.5 },  // Ideas
        { facet: 'O5', weight: 0.4 },  // Intellect
        { facet: 'C5', weight: 0.3 }   // Self-discipline
      ]
    },
    'A': {
      // Artistic: High Openness to Aesthetics, High Openness-Fantasy
      facets: [
        { facet: 'O1', weight: 0.5 },  // Imagination
        { facet: 'O2', weight: 0.5 },  // Artistic Interests
        { facet: 'O4', weight: 0.3 }   // Actions/Adventurousness
      ]
    },
    'S': {
      // Social: High Extraversion-Warmth, High Agreeableness
      facets: [
        { facet: 'E1', weight: 0.4 },  // Warmth
        { facet: 'A4', weight: 0.4 },  // Tender-mindedness
        { facet: 'A3', weight: 0.3 }   // Altruism
      ]
    },
    'E': {
      // Enterprising: High Extraversion-Assertiveness, High Extraversion-Activity
      facets: [
        { facet: 'E3', weight: 0.5 },  // Assertiveness
        { facet: 'E4', weight: 0.3 },  // Activity
        { facet: 'E2', weight: 0.3 }   // Gregariousness
      ]
    },
    'C': {
      // Conventional: High Conscientiousness, Low Openness
      facets: [
        { facet: 'C2', weight: 0.5 },  // Order
        { facet: 'C4', weight: 0.4 },  // Achievement Striving
        { facet: 'O6', weight: -0.3 }  // Values (inverse)
      ]
    }
  };

  const typeCorrelation = correlations[typeCode];
  if (!typeCorrelation) {
    throw new Error(`Invalid RIASEC type code: ${typeCode}`);
  }

  // Calculate weighted score
  let score = 0;
  for (const { facet, weight } of typeCorrelation.facets) {
    const facetScore = facetScores[facet] || 3.0; // Default to neutral
    score += facetScore * weight;
  }

  // Normalize to positive scale (add offset)
  score += 3.0;

  return score;
}

/**
 * Calculate average scores for each Big Five facet
 * @param {Object} answers - All answers
 * @returns {Object} Facet averages (e.g., { O1: 4.2, O2: 3.8, ... })
 */
function calculateFacetAverages(answers) {
  const facets = {};
  
  // Define facets and their questions
  const facetMapping = {
    // Openness facets
    'O1': ['O1_1', 'O1_2', 'O1_3', 'O1_4'],
    'O2': ['O2_1', 'O2_2', 'O2_3', 'O2_4'],
    'O3': ['O3_1', 'O3_2', 'O3_3', 'O3_4'],
    'O4': ['O4_1', 'O4_2', 'O4_3', 'O4_4'],
    'O5': ['O5_1', 'O5_2', 'O5_3', 'O5_4'],
    'O6': ['O6_1', 'O6_2', 'O6_3', 'O6_4'],
    
    // Conscientiousness facets
    'C1': ['C1_1', 'C1_2', 'C1_3', 'C1_4'],
    'C2': ['C2_1', 'C2_2', 'C2_3', 'C2_4'],
    'C3': ['C3_1', 'C3_2', 'C3_3', 'C3_4'],
    'C4': ['C4_1', 'C4_2', 'C4_3', 'C4_4'],
    'C5': ['C5_1', 'C5_2', 'C5_3', 'C5_4'],
    'C6': ['C6_1', 'C6_2', 'C6_3', 'C6_4'],
    
    // Extraversion facets
    'E1': ['E1_1', 'E1_2', 'E1_3', 'E1_4'],
    'E2': ['E2_1', 'E2_2', 'E2_3', 'E2_4'],
    'E3': ['E3_1', 'E3_2', 'E3_3', 'E3_4'],
    'E4': ['E4_1', 'E4_2', 'E4_3', 'E4_4'],
    'E5': ['E5_1', 'E5_2', 'E5_3', 'E5_4'],
    'E6': ['E6_1', 'E6_2', 'E6_3', 'E6_4'],
    
    // Agreeableness facets
    'A1': ['A1_1', 'A1_2', 'A1_3', 'A1_4'],
    'A2': ['A2_1', 'A2_2', 'A2_3', 'A2_4'],
    'A3': ['A3_1', 'A3_2', 'A3_3', 'A3_4'],
    'A4': ['A4_1', 'A4_2', 'A4_3', 'A4_4'],
    'A5': ['A5_1', 'A5_2', 'A5_3', 'A5_4'],
    'A6': ['A6_1', 'A6_2', 'A6_3', 'A6_4'],
    
    // Neuroticism facets
    'N1': ['N1_1', 'N1_2', 'N1_3', 'N1_4'],
    'N2': ['N2_1', 'N2_2', 'N2_3', 'N2_4'],
    'N3': ['N3_1', 'N3_2', 'N3_3', 'N3_4'],
    'N4': ['N4_1', 'N4_2', 'N4_3', 'N4_4'],
    'N5': ['N5_1', 'N5_2', 'N5_3', 'N5_4'],
    'N6': ['N6_1', 'N6_2', 'N6_3', 'N6_4']
  };

  // Calculate average for each facet
  for (const [facetId, questionIds] of Object.entries(facetMapping)) {
    let sum = 0;
    let count = 0;
    
    for (const qId of questionIds) {
      if (answers[qId] !== undefined && answers[qId] !== null) {
        // Apply reverse scoring for minus-keyed questions (typically Q2 and Q4)
        const qNum = parseInt(qId.split('_')[1]);
        const isReversed = (qNum === 2 || qNum === 4);
        const score = isReversed ? (6 - answers[qId]) : answers[qId];
        
        sum += score;
        count++;
      }
    }
    
    if (count > 0) {
      facets[facetId] = sum / count;
    }
  }

  return facets;
}

export default {
  calculateHollandCode
};
