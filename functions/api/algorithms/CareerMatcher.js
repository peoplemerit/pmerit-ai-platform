/**
 * Career Matching Algorithm
 * Matches Big Five personality traits and Holland Code to careers
 *
 * @module CareerMatcher
 * @requires DatabaseHelper for career queries
 * @version 1.0.0
 */

class CareerMatcher {
  constructor(database) {
    // Accept either a raw D1/Hyperdrive connection or a DatabaseHelper
    // If it's a DatabaseHelper, extract the underlying database
    this.db = database.db || database;

    // Holland Code hexagonal adjacency matrix
    // Distance: 0 = same, 1 = adjacent, 2 = alternate, 3 = opposite
    this.hollandAdjacency = {
      'R': { 'R': 0, 'I': 1, 'A': 2, 'S': 3, 'E': 2, 'C': 1 },
      'I': { 'R': 1, 'I': 0, 'A': 1, 'S': 2, 'E': 3, 'C': 2 },
      'A': { 'R': 2, 'I': 1, 'A': 0, 'S': 1, 'E': 2, 'C': 3 },
      'S': { 'R': 3, 'I': 2, 'A': 1, 'S': 0, 'E': 1, 'C': 2 },
      'E': { 'R': 2, 'I': 3, 'A': 2, 'S': 1, 'E': 0, 'C': 1 },
      'C': { 'R': 1, 'I': 2, 'A': 3, 'S': 2, 'E': 1, 'C': 0 }
    };
  }

  /**
   * Main matching function
   * @param {Object} assessmentData - Assessment results
   * @param {Object} assessmentData.bigFive - Big Five scores
   * @param {string} assessmentData.hollandCode - Holland RIASEC code (3 letters)
   * @param {number} limit - Number of matches to return (default: 10)
   * @returns {Promise<Array>} Ranked career matches with fit scores
   *
   * @example
   * const matches = await matcher.findMatches({
   *   bigFive: {
   *     openness: { raw: 4.2, percentile: 85 },
   *     conscientiousness: { raw: 3.8, percentile: 70 },
   *     extraversion: { raw: 2.9, percentile: 45 },
   *     agreeableness: { raw: 3.5, percentile: 60 },
   *     neuroticism: { raw: 2.2, percentile: 30 }
   *   },
   *   hollandCode: 'IAE'
   * }, 10);
   */
  async findMatches(assessmentData, limit = 10) {
    try {
      const { bigFive, hollandCode } = assessmentData;

      // Validate input
      if (!bigFive || typeof bigFive !== 'object') {
        throw new Error('bigFive is required and must be an object');
      }

      if (!hollandCode || typeof hollandCode !== 'string' || hollandCode.length !== 3) {
        throw new Error('hollandCode must be a 3-character string (e.g., "IAE")');
      }

      // Validate Holland Code characters
      const validCodes = ['R', 'I', 'A', 'S', 'E', 'C'];
      for (const char of hollandCode.toUpperCase()) {
        if (!validCodes.includes(char)) {
          throw new Error(`Invalid Holland Code character: ${char}. Must be one of: R, I, A, S, E, C`);
        }
      }

      // Query all careers from database
      const careers = await this.db.prepare(`
        SELECT
          career_id,
          title,
          description,
          onet_code,
          holland_codes,
          salary_median,
          salary_min,
          salary_max,
          growth_outlook,
          education_required,
          skills_required,
          openness_importance,
          conscientiousness_importance,
          extraversion_importance,
          agreeableness_importance,
          neuroticism_importance
        FROM careers
        ORDER BY career_id
      `).all();

      if (!careers.results || careers.results.length === 0) {
        console.warn('[CareerMatcher] No careers found in database');
        return [];
      }

      // Calculate fit scores for each career
      const scoredCareers = careers.results.map((career) => {
        const fitScore = this.calculateFitScore(bigFive, hollandCode.toUpperCase(), career);
        const rationale = this.generateRationale(bigFive, hollandCode.toUpperCase(), career, fitScore);

        return {
          ...career,
          fit_score: fitScore,
          rationale: rationale
        };
      });

      // Sort by fit score (descending) and return top N
      scoredCareers.sort((a, b) => b.fit_score - a.fit_score);

      const topMatches = scoredCareers.slice(0, limit);

      return topMatches;

    } catch (error) {
      console.error('[CareerMatcher] findMatches error:', error);
      throw new Error(`Failed to find matches: ${error.message}`);
    }
  }

  /**
   * Calculate fit score between personality and career
   * @param {Object} bigFive - Big Five personality scores
   * @param {string} userHollandCode - User's Holland Code
   * @param {Object} career - Career data from database
   * @returns {number} Fit score (0-100)
   */
  calculateFitScore(bigFive, userHollandCode, career) {
    try {
      // Component 1: Big Five trait matching (60% weight)
      const traitScore = this.calculateTraitMatch(bigFive, career);

      // Component 2: Holland Code compatibility (40% weight)
      const hollandScore = this.calculateHollandCompatibility(
        userHollandCode,
        career.holland_codes || ''
      );

      // Calculate weighted final score
      const finalScore = (traitScore * 0.6) + (hollandScore * 0.4);

      // Return rounded score (0-100)
      return Math.round(Math.max(0, Math.min(100, finalScore)));

    } catch (error) {
      console.error('[CareerMatcher] calculateFitScore error:', error);
      return 0;
    }
  }

  /**
   * Match Big Five traits to career requirements
   * @param {Object} bigFive - User's Big Five scores
   * @param {Object} career - Career data with trait importance weights
   * @returns {number} Trait match score (0-100)
   */
  calculateTraitMatch(bigFive, career) {
    try {
      // Extract trait importance weights from career data (default to equal weights)
      const weights = {
        openness: career.openness_importance || 0.2,
        conscientiousness: career.conscientiousness_importance || 0.2,
        extraversion: career.extraversion_importance || 0.2,
        agreeableness: career.agreeableness_importance || 0.2,
        neuroticism: career.neuroticism_importance || 0.2
      };

      // Normalize weights to ensure they sum to 1.0
      const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
      const normalizedWeights = {};
      for (const trait in weights) {
        normalizedWeights[trait] = weights[trait] / totalWeight;
      }

      // Calculate weighted trait match score
      let weightedScore = 0;

      for (const trait of ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']) {
        if (bigFive[trait] && bigFive[trait].percentile !== undefined) {
          const userPercentile = bigFive[trait].percentile;

          // For most traits, higher alignment with career requirements is better
          // For neuroticism, lower scores are typically preferred (inverse relationship)
          let careerRequirement;
          if (trait === 'neuroticism') {
            // Assume careers prefer lower neuroticism (stress tolerance)
            careerRequirement = 30; // Default preference for emotional stability
          } else {
            // For other traits, use moderate to high requirements
            careerRequirement = 50; // Default neutral requirement
          }

          // Calculate trait match: 100 - absolute difference
          const traitMatchScore = 100 - Math.abs(userPercentile - careerRequirement);

          // Add weighted contribution
          weightedScore += traitMatchScore * normalizedWeights[trait];
        }
      }

      return Math.max(0, Math.min(100, weightedScore));

    } catch (error) {
      console.error('[CareerMatcher] calculateTraitMatch error:', error);
      return 50; // Return neutral score on error
    }
  }

  /**
   * Calculate Holland Code compatibility using hexagonal model
   * @param {string} userCode - User's Holland Code (e.g., "IAE")
   * @param {string} careerCode - Career's Holland Code
   * @returns {number} Holland compatibility score (0-100)
   *
   * Holland Hexagon Model:
   *        R
   *       / \
   *      I   C
   *      |   |
   *      A   E
   *       \ /
   *        S
   *
   * Distance determines compatibility:
   * - Same type (0): 100% compatibility
   * - Adjacent types (1): ~75% compatibility
   * - Alternate types (2): ~50% compatibility
   * - Opposite types (3): ~25% compatibility
   */
  calculateHollandCompatibility(userCode, careerCode) {
    try {
      if (!careerCode || careerCode.length === 0) {
        return 50; // Neutral score if career has no Holland Code
      }

      // Ensure codes are uppercase and truncate to 3 characters max
      const userCodeNorm = userCode.toUpperCase().substring(0, 3);
      const careerCodeNorm = careerCode.toUpperCase().substring(0, 3);

      // Calculate average distance across code positions
      // Weight first position highest (most important)
      const weights = [0.5, 0.3, 0.2];
      let totalDistance = 0;
      let totalWeight = 0;

      for (let i = 0; i < Math.max(userCodeNorm.length, careerCodeNorm.length); i++) {
        const userChar = userCodeNorm[i] || userCodeNorm[0]; // Fallback to first char
        const careerChar = careerCodeNorm[i] || careerCodeNorm[0];

        if (this.hollandAdjacency[userChar] && this.hollandAdjacency[userChar][careerChar] !== undefined) {
          const distance = this.hollandAdjacency[userChar][careerChar];
          const weight = weights[i] || 0.1; // Use position weight or small default
          totalDistance += distance * weight;
          totalWeight += weight;
        }
      }

      // Calculate average weighted distance
      const avgDistance = totalWeight > 0 ? totalDistance / totalWeight : 1.5;

      // Convert distance to compatibility score (0-100)
      // Using a better scaling function for Holland hexagon:
      // Distance 0 = 100%, Distance 1 = 80%, Distance 2 = 50%, Distance 3 = 20%
      let compatibilityScore;
      if (avgDistance === 0) {
        compatibilityScore = 100;
      } else if (avgDistance <= 1) {
        // Linear interpolation between 100 (distance 0) and 80 (distance 1)
        compatibilityScore = 100 - (avgDistance * 20);
      } else if (avgDistance <= 2) {
        // Linear interpolation between 80 (distance 1) and 50 (distance 2)
        compatibilityScore = 80 - ((avgDistance - 1) * 30);
      } else {
        // Linear interpolation between 50 (distance 2) and 20 (distance 3)
        compatibilityScore = 50 - ((avgDistance - 2) * 30);
      }

      return Math.max(0, Math.min(100, compatibilityScore));

    } catch (error) {
      console.error('[CareerMatcher] calculateHollandCompatibility error:', error);
      return 50; // Return neutral score on error
    }
  }

  /**
   * Generate rationale for career match
   * @param {Object} bigFive - User's personality scores
   * @param {string} hollandCode - User's Holland Code
   * @param {Object} career - Career data
   * @param {number} fitScore - Calculated fit score
   * @returns {string} Human-readable rationale
   */
  generateRationale(bigFive, hollandCode, career, fitScore) {
    try {
      const rationale = [];

      // Identify strongest personality traits
      const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness'];
      const strongTraits = traits.filter((trait) => {
        return bigFive[trait] && bigFive[trait].percentile >= 70;
      });

      // Add personality-based rationale
      if (strongTraits.length > 0) {
        const traitLabels = {
          openness: 'creativity and openness to new experiences',
          conscientiousness: 'organization and attention to detail',
          extraversion: 'social engagement and energy',
          agreeableness: 'cooperation and empathy'
        };

        const strongestTrait = strongTraits[0];
        const percentile = bigFive[strongestTrait].percentile;
        rationale.push(`Your high ${traitLabels[strongestTrait]} (${percentile}th percentile) aligns well with this career's requirements.`);
      }

      // Add Holland Code rationale
      if (career.holland_codes && career.holland_codes.length > 0) {
        const careerPrimary = career.holland_codes[0];
        const userPrimary = hollandCode[0];

        if (careerPrimary === userPrimary) {
          rationale.push('Your primary interest type matches this career perfectly.');
        } else {
          const distance = this.hollandAdjacency[userPrimary]?.[careerPrimary] || 2;
          if (distance === 1) {
            rationale.push('Your interests are highly compatible with this career\'s requirements.');
          } else if (distance === 2) {
            rationale.push('Your interests provide a good foundation for this career path.');
          }
        }
      }

      // Add fit score interpretation
      if (fitScore >= 80) {
        rationale.push('This is an excellent match for your personality profile.');
      } else if (fitScore >= 60) {
        rationale.push('This is a good match worth exploring further.');
      } else if (fitScore >= 40) {
        rationale.push('This career may offer some interesting opportunities.');
      }

      return rationale.length > 0
        ? rationale.join(' ')
        : 'This career matches several aspects of your personality and interests.';

    } catch (error) {
      console.error('[CareerMatcher] generateRationale error:', error);
      return 'Career match based on personality and interest assessment.';
    }
  }
}

export default CareerMatcher;
