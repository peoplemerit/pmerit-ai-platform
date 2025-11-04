/**
 * Career Enrichment Service
 * Adds real-time data to career recommendations
 *
 * @module CareerEnrichmentService
 * @version 1.0.0
 */

class CareerEnrichmentService {
  constructor(blsClient, databaseHelper) {
    this.bls = blsClient;
    this.db = databaseHelper;
    this.cache = new Map();
    this.cacheTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Enrich career matches with live data
   * @param {Array} matches - Base career matches from algorithm
   * @returns {Promise<Array>} Enriched matches with current data
   */
  async enrichMatches(matches) {
    try {
      if (!Array.isArray(matches) || matches.length === 0) {
        return matches;
      }

      console.log('[CareerEnrichmentService] Enriching', matches.length, 'matches');

      // Enrich each match with BLS data
      const enrichedMatches = await Promise.all(
        matches.map(async (match) => {
          try {
            return await this.enrichSingleMatch(match);
          } catch (error) {
            console.error('[CareerEnrichmentService] Error enriching match:', match.career_id, error);
            // Return original match if enrichment fails
            return match;
          }
        })
      );

      console.log('[CareerEnrichmentService] Enrichment complete');

      return enrichedMatches;

    } catch (error) {
      console.error('[CareerEnrichmentService] enrichMatches error:', error);
      // Return original matches if enrichment fails
      return matches;
    }
  }

  /**
   * Enrich a single career match
   * @param {Object} match - Career match data
   * @returns {Promise<Object>} Enriched match
   * @private
   */
  async enrichSingleMatch(match) {
    try {
      // Check cache first
      const cacheKey = `career_${match.career_id}`;
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        console.log('[CareerEnrichmentService] Using cached data for:', match.career_id);
        return {
          ...match,
          ...cached
        };
      }

      // Fetch BLS data if SOC code is available
      let blsData = null;
      if (match.onet_code) {
        // Convert O*NET code to SOC code (they are similar formats)
        const socCode = this.convertONETtoSOC(match.onet_code);
        blsData = await this.bls.getOccupationData(socCode);
      }

      // Calculate "hot" factor (trending career score)
      const hotFactor = this.calculateHotFactor(match, blsData);

      // Prepare enriched data
      const enrichmentData = {
        bls_salary: blsData?.salary || null,
        bls_growth: blsData?.growth || null,
        hot_factor: hotFactor,
        data_updated: new Date().toISOString()
      };

      // Cache the enrichment data
      this.cacheCareerData(cacheKey, enrichmentData);

      // Return enriched match
      return {
        ...match,
        ...enrichmentData
      };

    } catch (error) {
      console.error('[CareerEnrichmentService] enrichSingleMatch error:', error);
      return match;
    }
  }

  /**
   * Calculate "hot" factor for trending careers
   * @param {Object} career - Career data
   * @param {Object} blsData - BLS data
   * @returns {number} Hot factor score (0-100)
   * @private
   */
  calculateHotFactor(career, blsData) {
    try {
      let score = 50; // Base score

      // Factor 1: Growth outlook (40% weight)
      if (blsData?.growth?.growthRate) {
        const growthRate = parseFloat(blsData.growth.growthRate);
        if (growthRate > 10) {
          score += 20;
        } else if (growthRate > 5) {
          score += 10;
        } else if (growthRate < 0) {
          score -= 10;
        }
      } else if (career.growth_outlook) {
        const outlook = career.growth_outlook.toLowerCase();
        if (outlook.includes('much faster') || outlook.includes('excellent')) {
          score += 20;
        } else if (outlook.includes('faster') || outlook.includes('good')) {
          score += 10;
        } else if (outlook.includes('decline')) {
          score -= 10;
        }
      }

      // Factor 2: Salary level (30% weight)
      const salary = career.salary_median || blsData?.salary?.median;
      if (salary) {
        if (salary > 100000) {
          score += 15;
        } else if (salary > 70000) {
          score += 10;
        } else if (salary < 40000) {
          score -= 5;
        }
      }

      // Factor 3: Education requirements (30% weight)
      // Lower education requirements increase accessibility = higher hot factor
      if (career.education_required) {
        const education = career.education_required.toLowerCase();
        if (education.includes('high school') || education.includes('associate')) {
          score += 15;
        } else if (education.includes('bachelor')) {
          score += 10;
        } else if (education.includes('master') || education.includes('doctoral')) {
          score += 5;
        }
      }

      return Math.max(0, Math.min(100, score));

    } catch (error) {
      console.error('[CareerEnrichmentService] calculateHotFactor error:', error);
      return 50; // Return neutral score on error
    }
  }

  /**
   * Convert O*NET code to SOC code
   * @param {string} onetCode - O*NET occupation code
   * @returns {string} SOC code
   * @private
   */
  convertONETtoSOC(onetCode) {
    // O*NET codes are typically in format: XX-XXXX.XX
    // SOC codes are typically: XX-XXXX
    // Extract first 7 characters (including hyphen)
    if (!onetCode || typeof onetCode !== 'string') {
      return '';
    }

    // Remove any decimal portion
    const socCode = onetCode.split('.')[0];
    return socCode;
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null
   * @private
   */
  getFromCache(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - cached.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache enrichment data to reduce API calls
   * @param {string} careerId - Career identifier
   * @param {Object} data - Data to cache
   */
  cacheCareerData(careerId, data) {
    try {
      const cacheEntry = {
        data: data,
        timestamp: Date.now()
      };

      this.cache.set(careerId, cacheEntry);

      console.log('[CareerEnrichmentService] Cached data for:', careerId);

      // Implement cache size limit to prevent memory issues
      if (this.cache.size > 1000) {
        // Remove oldest entries
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        // Remove oldest 10%
        const toRemove = Math.floor(entries.length * 0.1);
        for (let i = 0; i < toRemove; i++) {
          this.cache.delete(entries[i][0]);
        }
      }

    } catch (error) {
      console.error('[CareerEnrichmentService] cacheCareerData error:', error);
      // Don't throw - caching failure shouldn't break the workflow
    }
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
    console.log('[CareerEnrichmentService] Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      ttl_hours: this.cacheTTL / (60 * 60 * 1000)
    };
  }
}

export default CareerEnrichmentService;
