/**
 * BLS API Client
 * Fetches labor statistics for career matching
 *
 * @module BLSClient
 * @version 1.0.0
 */

class BLSClient {
  constructor(apiKey = null) {
    // [HUMAN REVIEW NEEDED]: API key should be moved to environment variables
    // For production use: this.apiKey = apiKey || env.BLS_API_KEY
    // Current implementation uses provided key for development/testing
    this.apiKey = apiKey || 'f3b54462bdd64a829a09dd23d1acb7cd';
    this.baseURL = 'https://api.bls.gov/publicAPI/v2/';
    this.requestTimeout = 10000; // 10 seconds
    this.maxRetries = 2;
  }

  /**
   * Get occupation data by SOC code
   * @param {string} socCode - Standard Occupational Classification code
   * @returns {Promise<Object>} Occupation data including salary, growth
   *
   * [HUMAN REVIEW NEEDED]: BLS API integration is INCOMPLETE
   * - Requires SOC-to-SeriesID mapping before production use
   * - Current implementation returns placeholder structure
   * - Real API calls are commented out and need completion
   */
  async getOccupationData(socCode) {
    try {
      if (!socCode) {
        throw new Error('SOC code is required');
      }

      console.log('[BLSClient] Fetching occupation data for SOC:', socCode);

      // Attempt to fetch salary and growth data
      const [salaryData, growthData] = await Promise.allSettled([
        this.getSalaryData(socCode),
        this.getGrowthOutlook(socCode)
      ]);

      // Combine results
      const result = {
        socCode,
        salary: salaryData.status === 'fulfilled' ? salaryData.value : null,
        growth: growthData.status === 'fulfilled' ? growthData.value : null,
        lastUpdated: new Date().toISOString()
      };

      console.log('[BLSClient] Occupation data fetched successfully');

      return result;

    } catch (error) {
      console.error('[BLSClient] getOccupationData error:', error);
      // Return partial data instead of failing completely
      return {
        socCode,
        salary: null,
        growth: null,
        error: error.message
      };
    }
  }

  /**
   * Get salary data for occupation
   * @param {string} socCode - SOC code
   * @returns {Promise<Object>} Salary statistics
   */
  async getSalaryData(socCode) {
    try {
      // [HUMAN REVIEW NEEDED]: BLS API structure requires series ID construction
      // This is a placeholder implementation
      // Real implementation would need to:
      // 1. Map SOC code to appropriate BLS series ID
      // 2. Fetch data from timeseries/data/ endpoint
      // 3. Parse and format the response

      console.log('[BLSClient] Fetching salary data for:', socCode);

      // For now, return mock structure that can be replaced with real API call
      // When ready to integrate, uncomment and modify the following:
      /*
      const seriesId = this.mapSOCtoSeriesId(socCode);
      const response = await this.makeRequest('timeseries/data/', {
        seriesid: [seriesId],
        startyear: new Date().getFullYear() - 1,
        endyear: new Date().getFullYear(),
        registrationkey: this.apiKey
      });

      // Parse response and extract salary data
      const latestData = response.Results?.series?.[0]?.data?.[0];
      */

      // Placeholder return structure
      return {
        median: null,
        mean: null,
        percentile10: null,
        percentile90: null,
        source: 'BLS',
        note: 'BLS API integration pending - requires series ID mapping'
      };

    } catch (error) {
      console.error('[BLSClient] getSalaryData error:', error);
      throw new Error(`Failed to fetch salary data: ${error.message}`);
    }
  }

  /**
   * Get employment projections
   * @param {string} socCode - SOC code
   * @returns {Promise<Object>} Growth outlook
   */
  async getGrowthOutlook(socCode) {
    try {
      // [HUMAN REVIEW NEEDED]: BLS employment projections API integration
      // This is a placeholder implementation

      console.log('[BLSClient] Fetching growth outlook for:', socCode);

      // Placeholder return structure
      return {
        growthRate: null,
        outlook: 'Average',
        demand: 'Moderate',
        projection_year: new Date().getFullYear() + 10,
        source: 'BLS',
        note: 'BLS API integration pending - requires projections endpoint'
      };

    } catch (error) {
      console.error('[BLSClient] getGrowthOutlook error:', error);
      throw new Error(`Failed to fetch growth outlook: ${error.message}`);
    }
  }

  /**
   * Make HTTP request to BLS API with retries
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request payload
   * @returns {Promise<Object>} API response
   * @private
   */
  async makeRequest(endpoint, data) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`BLS API returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.status !== 'REQUEST_SUCCEEDED') {
          throw new Error(`BLS API error: ${result.message || 'Unknown error'}`);
        }

        return result;

      } catch (error) {
        lastError = error;
        console.warn(`[BLSClient] Request attempt ${attempt + 1} failed:`, error.message);

        // Don't retry on abort/timeout for last attempt
        if (attempt === this.maxRetries) {
          break;
        }

        // Wait before retrying (exponential backoff)
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError;
  }

  /**
   * Helper to sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   * @private
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Map SOC code to BLS series ID
   * [HUMAN REVIEW NEEDED]: This mapping needs to be completed
   * @param {string} socCode - Standard Occupational Classification code
   * @returns {string} BLS series ID
   * @private
   */
  mapSOCtoSeriesId(socCode) {
    // This would contain the actual mapping logic
    // BLS uses specific series ID formats like OEUN000000000000015-1252
    // where the suffix corresponds to SOC codes
    return `OEUM${socCode.replace('-', '')}`;
  }
}

export default BLSClient;
