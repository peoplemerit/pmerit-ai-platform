/**
 * Career Matching Service
 * Orchestration for career recommendations
 *
 * Uses DatabaseHelper.searchCareersByPersonality per project decisions.
 */

import CareerMatcher from '../algorithms/CareerMatcher.js';
import BLSClient from '../integrations/BLSClient.js';
import CareerEnrichmentService from './CareerEnrichmentService.js';
import DatabaseHelper from '../db/DatabaseHelper.js';

class CareerMatchingService {
  constructor(hyperdriveOrEnv, deps = {}) {
    this.db = deps.databaseHelper ?? new DatabaseHelper(hyperdriveOrEnv);
    this.matcher = deps.matcher ?? new CareerMatcher(this.db);
    this.bls = deps.blsClient ?? new BLSClient({ apiKey: deps.apiKey });
    this.enrichment = deps.enrichmentService ?? new CareerEnrichmentService(this.bls, this.db, {
      kvBinding: deps.kvBinding,
      ttlSeconds: deps.ttlSeconds
    });
  }

  async getRecommendations(assessmentResults, limit = 10) {
    try {
      const matches = await this.matcher.findMatches(assessmentResults, limit);
      const enrichedMatches = await this.enrichment.enrichMatches(matches);
      return this.formatRecommendations(enrichedMatches);
    } catch (error) {
      console.error('[CareerMatchingService] Error:', error);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  formatRecommendations(matches) {
    return matches.map((match, index) => ({
      rank: index + 1,
      career_id: match.career_id,
      title: match.title,
      fit_score: Math.round(match.fit_score || 0),
      rationale: match.rationale,
      salary: {
        median: match.salary_median,
        range: (match.salary_min != null && match.salary_max != null) ? `$${match.salary_min}-$${match.salary_max}` : null
      },
      growth_outlook: match.growth_outlook,
      education_required: match.education_required,
      skills_required: match.skills_required,
      onet_code: match.onet_code,
      holland_codes: match.holland_codes
    }));
  }
}

export default CareerMatchingService;