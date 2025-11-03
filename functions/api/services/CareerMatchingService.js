/**
 * Career Matching Service
 * Main orchestration layer for career recommendations
 *
 * @module CareerMatchingService
 * @version 1.0.0
 */

import CareerMatcher from '../algorithms/CareerMatcher.js';
import BLSClient from '../integrations/BLSClient.js';
import CareerEnrichmentService from './CareerEnrichmentService.js';
import DatabaseHelper from '../db/DatabaseHelper.js';

class CareerMatchingService {
  constructor(hyperdrive, blsApiKey = null) {
    this.db = new DatabaseHelper(hyperdrive);
    this.matcher = new CareerMatcher(this.db);
    this.bls = new BLSClient(blsApiKey);
    this.enrichment = new CareerEnrichmentService(this.bls, this.db);
  }

  /**
   * Complete career matching workflow
   * @param {Object} assessmentResults - Big Five + Holland Code
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Array>} Ranked, enriched career recommendations
   *
   * @example
   * const service = new CareerMatchingService(env.DB);
   * const recommendations = await service.getRecommendations({
   *   bigFive: { ... },
   *   hollandCode: 'IAE'
   * }, 10);
   */
  async getRecommendations(assessmentResults, limit = 10) {
    const startTime = Date.now();

    try {
      console.log('[CareerMatchingService] Starting recommendation workflow');

      // Validate input
      if (!assessmentResults || typeof assessmentResults !== 'object') {
        throw new Error('assessmentResults is required and must be an object');
      }

      if (!assessmentResults.bigFive) {
        throw new Error('assessmentResults.bigFive is required');
      }

      if (!assessmentResults.hollandCode) {
        throw new Error('assessmentResults.hollandCode is required');
      }

      // Step 1: Find matches using algorithm
      console.log('[CareerMatchingService] Step 1: Finding matches');
      const matches = await this.matcher.findMatches(assessmentResults, limit);

      if (!matches || matches.length === 0) {
        console.warn('[CareerMatchingService] No matches found');
        return [];
      }

      // Step 2: Enrich with BLS data
      console.log('[CareerMatchingService] Step 2: Enriching matches');
      const enrichedMatches = await this.enrichment.enrichMatches(matches);

      // Step 3: Format for API response
      console.log('[CareerMatchingService] Step 3: Formatting response');
      const formattedRecommendations = this.formatRecommendations(enrichedMatches);

      // Log performance
      const duration = Date.now() - startTime;
      console.log(`[CareerMatchingService] Completed in ${duration}ms (${formattedRecommendations.length} recommendations)`);

      if (duration > 500) {
        console.warn(`[CareerMatchingService] Response time ${duration}ms exceeds 500ms target`);
      }

      return formattedRecommendations;

    } catch (error) {
      console.error('[CareerMatchingService] Error:', error);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  /**
   * Format recommendations for API response
   * @param {Array} matches - Enriched matches
   * @returns {Array} Formatted recommendations
   */
  formatRecommendations(matches) {
    try {
      return matches.map((match, index) => {
        // Base recommendation structure
        const recommendation = {
          rank: index + 1,
          career_id: match.career_id,
          title: match.title,
          fit_score: Math.round(match.fit_score),
          rationale: match.rationale,
          onet_code: match.onet_code,
          holland_codes: match.holland_codes
        };

        // Add salary information
        if (match.salary_median || match.bls_salary?.median) {
          recommendation.salary = {
            median: match.bls_salary?.median || match.salary_median,
            min: match.salary_min,
            max: match.salary_max
          };

          // Format salary range
          if (recommendation.salary.min && recommendation.salary.max) {
            recommendation.salary.range = `$${this.formatNumber(recommendation.salary.min)}-$${this.formatNumber(recommendation.salary.max)}`;
          } else if (recommendation.salary.median) {
            recommendation.salary.range = `$${this.formatNumber(recommendation.salary.median)}`;
          }
        }

        // Add growth outlook
        if (match.growth_outlook || match.bls_growth?.outlook) {
          recommendation.growth_outlook = match.bls_growth?.outlook || match.growth_outlook;
        }

        // Add education requirements
        if (match.education_required) {
          recommendation.education_required = match.education_required;
        }

        // Add skills if available
        if (match.skills_required) {
          recommendation.skills_required = match.skills_required;
        }

        // Add hot factor if available
        if (match.hot_factor !== undefined) {
          recommendation.hot_factor = Math.round(match.hot_factor);
        }

        // Add description if available
        if (match.description) {
          recommendation.description = match.description;
        }

        return recommendation;
      });

    } catch (error) {
      console.error('[CareerMatchingService] formatRecommendations error:', error);
      throw new Error(`Failed to format recommendations: ${error.message}`);
    }
  }

  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   * @private
   */
  formatNumber(num) {
    if (typeof num !== 'number') {
      return String(num);
    }
    return num.toLocaleString('en-US');
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} Health status
   */
  async getHealthStatus() {
    try {
      // Check database connection
      const dbStatus = await this.db.testConnection();

      // Get cache stats
      const cacheStats = this.enrichment.getCacheStats();

      return {
        status: dbStatus.connected ? 'healthy' : 'degraded',
        database: dbStatus,
        cache: cacheStats,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('[CareerMatchingService] getHealthStatus error:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default CareerMatchingService;
