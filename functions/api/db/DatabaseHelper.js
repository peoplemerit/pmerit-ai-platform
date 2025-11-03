/**
 * PMERIT Database Helper
 * Provides CRUD operations for assessment system via Hyperdrive connection
 * 
 * @module DatabaseHelper
 * @requires Hyperdrive connection (Neon PostgreSQL)
 * @version 1.0.0
 * @created November 2, 2025
 * @issue #18 - Database Integration & Schema Verification
 */

class DatabaseHelper {
  /**
   * Initialize DatabaseHelper with Hyperdrive connection
   * @param {Object} hyperdrive - Cloudflare Hyperdrive binding to Neon PostgreSQL
   */
  constructor(hyperdrive) {
    if (!hyperdrive) {
      throw new Error('DatabaseHelper requires a Hyperdrive connection');
    }
    this.db = hyperdrive;
  }

  // =========================================================================
  // ASSESSMENT SESSION OPERATIONS
  // =========================================================================

  /**
   * Create new assessment session
   * @param {Object} data - Session data
   * @param {number|null} data.userId - User ID (null for anonymous)
   * @param {Object} data.consentData - Consent information
   * @returns {Promise<string>} Generated session_id (UUID)
   * 
   * @example
   * const sessionId = await db.createAssessmentSession({
   *   userId: 123,
   *   consentData: { privacy: true, data: true, terms: true }
   * });
   */
  async createAssessmentSession(data) {
    try {
      const { userId, consentData } = data;

      // Validate input
      if (!consentData || typeof consentData !== 'object') {
        throw new Error('consentData is required and must be an object');
      }

      const result = await this.db.prepare(`
        INSERT INTO assessment_sessions (user_id, consent_data, status)
        VALUES ($1, $2, 'started')
        RETURNING session_id
      `).bind(
        userId || null,
        JSON.stringify(consentData)
      ).first();

      if (!result || !result.session_id) {
        throw new Error('Failed to create assessment session');
      }

      console.log('[DatabaseHelper] Session created:', result.session_id);
      return result.session_id;

    } catch (error) {
      console.error('[DatabaseHelper] createAssessmentSession error:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * Save assessment progress (auto-save every 5 questions)
   * @param {string} sessionId - Session UUID
   * @param {Object} data - Progress data
   * @param {number} data.currentQuestion - Current question index (0-119)
   * @param {Object} data.answers - Answers object {question_id: answer_value}
   * @returns {Promise<Object>} Success confirmation
   * 
   * @example
   * await db.saveAssessmentProgress('uuid-here', {
   *   currentQuestion: 10,
   *   answers: { O1: 4, O2: 3, O3: 5 }
   * });
   */
  async saveAssessmentProgress(sessionId, data) {
    try {
      const { currentQuestion, answers } = data;

      // Validate input
      if (typeof currentQuestion !== 'number' || currentQuestion < 0 || currentQuestion > 119) {
        throw new Error('currentQuestion must be between 0 and 119');
      }

      if (!answers || typeof answers !== 'object') {
        throw new Error('answers is required and must be an object');
      }

      await this.db.prepare(`
        UPDATE assessment_sessions
        SET 
          current_question = $1,
          answers = $2,
          updated_at = NOW(),
          status = 'in_progress'
        WHERE session_id = $3
      `).bind(
        currentQuestion,
        JSON.stringify(answers),
        sessionId
      ).run();

      console.log('[DatabaseHelper] Progress saved:', sessionId, 'Q:', currentQuestion);
      
      return {
        success: true,
        saved: true,
        currentQuestion,
        answerCount: Object.keys(answers).length
      };

    } catch (error) {
      console.error('[DatabaseHelper] saveAssessmentProgress error:', error);
      throw new Error(`Failed to save progress: ${error.message}`);
    }
  }

  /**
   * Resume assessment from saved session
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Session data with progress
   * 
   * @example
   * const session = await db.resumeAssessment('uuid-here');
   * // Returns: { currentQuestion: 10, answers: {...}, status: 'in_progress' }
   */
  async resumeAssessment(sessionId) {
    try {
      const session = await this.db.prepare(`
        SELECT 
          session_id,
          current_question,
          answers,
          status,
          started_at,
          updated_at
        FROM assessment_sessions
        WHERE session_id = $1
      `).bind(sessionId).first();

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.status === 'completed') {
        throw new Error('Assessment already completed');
      }

      console.log('[DatabaseHelper] Session resumed:', sessionId);

      return {
        sessionId: session.session_id,
        currentQuestion: session.current_question,
        answers: JSON.parse(session.answers || '{}'),
        status: session.status,
        startedAt: session.started_at,
        updatedAt: session.updated_at,
        canResume: true
      };

    } catch (error) {
      console.error('[DatabaseHelper] resumeAssessment error:', error);
      throw new Error(`Failed to resume assessment: ${error.message}`);
    }
  }

  /**
   * Get session by ID (for validation/checking)
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object|null>} Session data or null
   */
  async getSession(sessionId) {
    try {
      const session = await this.db.prepare(`
        SELECT 
          session_id,
          user_id,
          consent_data,
          current_question,
          answers,
          started_at,
          updated_at,
          status,
          created_at
        FROM assessment_sessions
        WHERE session_id = $1
      `).bind(sessionId).first();

      if (!session) {
        return null;
      }

      return {
        sessionId: session.session_id,
        userId: session.user_id,
        consentData: JSON.parse(session.consent_data || '{}'),
        currentQuestion: session.current_question,
        answers: JSON.parse(session.answers || '{}'),
        startedAt: session.started_at,
        updatedAt: session.updated_at,
        status: session.status,
        createdAt: session.created_at
      };

    } catch (error) {
      console.error('[DatabaseHelper] getSession error:', error);
      throw new Error(`Failed to get session: ${error.message}`);
    }
  }

  // =========================================================================
  // ASSESSMENT RESULTS OPERATIONS
  // =========================================================================

  /**
   * Store completed assessment results
   * @param {Object} data - Assessment results
   * @param {string} data.sessionId - Session UUID
   * @param {number|null} data.userId - User ID
   * @param {Object} data.bigFive - Big Five personality scores
   * @param {string} data.hollandCode - Holland RIASEC code (e.g., "IAE")
   * @param {Array} data.careerMatches - Top career matches
   * @returns {Promise<string>} Generated result_id (UUID)
   * 
   * @example
   * const resultId = await db.storeAssessmentResults({
   *   sessionId: 'session-uuid',
   *   userId: 123,
   *   bigFive: {
   *     openness: { raw: 4.2, percentile: 85, label: "Very High" },
   *     conscientiousness: { raw: 3.8, percentile: 70, label: "High" },
   *     extraversion: { raw: 2.9, percentile: 45, label: "Moderate" },
   *     agreeableness: { raw: 3.5, percentile: 60, label: "High" },
   *     neuroticism: { raw: 2.2, percentile: 30, label: "Low" }
   *   },
   *   hollandCode: 'IAE',
   *   careerMatches: [
   *     { career_id: 'c001', title: 'Data Scientist', fit_score: 95 }
   *   ]
   * });
   */
  async storeAssessmentResults(data) {
    try {
      const { sessionId, userId, bigFive, hollandCode, careerMatches } = data;

      // Validate required fields
      if (!sessionId) throw new Error('sessionId is required');
      if (!bigFive || typeof bigFive !== 'object') throw new Error('bigFive is required and must be an object');
      if (!hollandCode || typeof hollandCode !== 'string') throw new Error('hollandCode is required and must be a string');
      if (!Array.isArray(careerMatches)) throw new Error('careerMatches is required and must be an array');

      // Validate Big Five structure
      const requiredTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
      for (const trait of requiredTraits) {
        if (!bigFive[trait]) {
          throw new Error(`bigFive.${trait} is required`);
        }
      }

      // Validate Holland Code format (3 letters from RIASEC)
      if (!/^[RIASEC]{3}$/.test(hollandCode)) {
        throw new Error('hollandCode must be 3 letters from RIASEC (e.g., "IAE")');
      }

      // Store results
      const result = await this.db.prepare(`
        INSERT INTO assessment_results 
        (session_id, user_id, big_five, holland_code, career_matches)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING result_id
      `).bind(
        sessionId,
        userId || null,
        JSON.stringify(bigFive),
        hollandCode,
        JSON.stringify(careerMatches)
      ).first();

      if (!result || !result.result_id) {
        throw new Error('Failed to store assessment results');
      }

      // Mark session as completed
      await this.db.prepare(`
        UPDATE assessment_sessions
        SET status = 'completed', updated_at = NOW()
        WHERE session_id = $1
      `).bind(sessionId).run();

      console.log('[DatabaseHelper] Results stored:', result.result_id);
      
      return result.result_id;

    } catch (error) {
      console.error('[DatabaseHelper] storeAssessmentResults error:', error);
      throw new Error(`Failed to store results: ${error.message}`);
    }
  }

  /**
   * Get assessment results by result_id
   * @param {string} resultId - Result UUID
   * @returns {Promise<Object>} Complete assessment results
   * 
   * @example
   * const results = await db.getAssessmentResults('result-uuid');
   * console.log(results.bigFive.openness.percentile); // 85
   */
  async getAssessmentResults(resultId) {
    try {
      const result = await this.db.prepare(`
        SELECT 
          ar.*,
          u.email,
          u.name
        FROM assessment_results ar
        LEFT JOIN users u ON ar.user_id = u.id
        WHERE ar.result_id = $1
      `).bind(resultId).first();

      if (!result) {
        throw new Error('Results not found');
      }

      console.log('[DatabaseHelper] Results retrieved:', resultId);

      return {
        resultId: result.result_id,
        sessionId: result.session_id,
        bigFive: JSON.parse(result.big_five),
        hollandCode: result.holland_code,
        careerMatches: JSON.parse(result.career_matches),
        completedAt: result.completed_at,
        createdAt: result.created_at,
        user: result.email ? {
          email: result.email,
          name: result.name
        } : null
      };

    } catch (error) {
      console.error('[DatabaseHelper] getAssessmentResults error:', error);
      throw new Error(`Failed to get results: ${error.message}`);
    }
  }

  /**
   * Get assessment results by session_id
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object|null>} Results or null if not completed
   */
  async getResultsBySession(sessionId) {
    try {
      const result = await this.db.prepare(`
        SELECT 
          ar.*,
          u.email,
          u.name
        FROM assessment_results ar
        LEFT JOIN users u ON ar.user_id = u.id
        WHERE ar.session_id = $1
      `).bind(sessionId).first();

      if (!result) {
        return null; // Session not completed yet
      }

      return {
        resultId: result.result_id,
        sessionId: result.session_id,
        bigFive: JSON.parse(result.big_five),
        hollandCode: result.holland_code,
        careerMatches: JSON.parse(result.career_matches),
        completedAt: result.completed_at,
        createdAt: result.created_at,
        user: result.email ? {
          email: result.email,
          name: result.name
        } : null
      };

    } catch (error) {
      console.error('[DatabaseHelper] getResultsBySession error:', error);
      throw new Error(`Failed to get results by session: ${error.message}`);
    }
  }

  // =========================================================================
  // USER HISTORY & ANALYTICS
  // =========================================================================

  /**
   * Get user's assessment history
   * @param {number} userId - User ID
   * @param {number} limit - Max number of results (default: 10)
   * @returns {Promise<Array>} Array of past assessments
   * 
   * @example
   * const history = await db.getUserAssessmentHistory(123, 5);
   * history.forEach(result => {
   *   console.log(`Completed: ${result.completedAt}`);
   *   console.log(`Holland Code: ${result.hollandCode}`);
   * });
   */
  async getUserAssessmentHistory(userId, limit = 10) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('userId is required and must be a number');
      }

      const results = await this.db.prepare(`
        SELECT 
          ar.result_id,
          ar.session_id,
          ar.holland_code,
          ar.big_five,
          ar.completed_at,
          ar.created_at
        FROM assessment_results ar
        WHERE ar.user_id = $1
        ORDER BY ar.completed_at DESC
        LIMIT $2
      `).bind(userId, limit).all();

      console.log('[DatabaseHelper] History retrieved for user:', userId, 'Count:', results.results?.length || 0);

      return (results.results || []).map(r => ({
        resultId: r.result_id,
        sessionId: r.session_id,
        hollandCode: r.holland_code,
        bigFive: JSON.parse(r.big_five),
        completedAt: r.completed_at,
        createdAt: r.created_at
      }));

    } catch (error) {
      console.error('[DatabaseHelper] getUserAssessmentHistory error:', error);
      throw new Error(`Failed to get user history: ${error.message}`);
    }
  }

  /**
   * Get total assessment count (analytics)
   * @returns {Promise<Object>} Assessment statistics
   */
  async getAssessmentStats() {
    try {
      const stats = await this.db.prepare(`
        SELECT 
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(DISTINCT CASE WHEN status = 'completed' THEN session_id END) as completed_sessions,
          COUNT(DISTINCT CASE WHEN status = 'in_progress' THEN session_id END) as in_progress_sessions,
          COUNT(DISTINCT user_id) as unique_users
        FROM assessment_sessions
      `).first();

      const results = await this.db.prepare(`
        SELECT COUNT(*) as total_results
        FROM assessment_results
      `).first();

      console.log('[DatabaseHelper] Stats retrieved');

      return {
        totalSessions: stats.total_sessions || 0,
        completedSessions: stats.completed_sessions || 0,
        inProgressSessions: stats.in_progress_sessions || 0,
        uniqueUsers: stats.unique_users || 0,
        totalResults: results.total_results || 0,
        completionRate: stats.total_sessions > 0 
          ? Math.round((stats.completed_sessions / stats.total_sessions) * 100) 
          : 0
      };

    } catch (error) {
      console.error('[DatabaseHelper] getAssessmentStats error:', error);
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  // =========================================================================
  // SEARCH & QUERY OPERATIONS
  // =========================================================================

  /**
   * Search careers by personality fit (placeholder for Issue #19)
   * @param {Object} bigFive - Big Five personality scores
   * @param {string} hollandCode - Holland RIASEC code
   * @param {number} limit - Number of results (default: 10)
   * @returns {Promise<Array>} Career matches
   * 
   * @note This is a placeholder. Full implementation in Issue #19 (Career Matching Algorithm)
   */
  async searchCareersByPersonality(bigFive, hollandCode, limit = 10) {
    try {
      // Basic query - will be enhanced in Issue #19
      const careers = await this.db.prepare(`
        SELECT 
          career_id,
          title,
          description,
          onet_code,
          salary_median,
          growth_outlook,
          holland_codes
        FROM careers
        WHERE holland_codes LIKE $1
        LIMIT $2
      `).bind(
        `%${hollandCode[0]}%`,  // Match first letter of Holland Code
        limit
      ).all();

      console.log('[DatabaseHelper] Career search:', careers.results?.length || 0, 'found');

      return careers.results || [];

    } catch (error) {
      console.error('[DatabaseHelper] searchCareersByPersonality error:', error);
      // Return empty array instead of throwing (careers table may not exist yet)
      return [];
    }
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Test database connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const result = await this.db.prepare(`SELECT 1 as test`).first();
      return result?.test === 1;
    } catch (error) {
      console.error('[DatabaseHelper] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database version and info
   * @returns {Promise<Object>} Database information
   */
  async getDatabaseInfo() {
    try {
      const version = await this.db.prepare(`SELECT version()`).first();
      const tables = await this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `).first();

      return {
        version: version.version,
        tableCount: tables.count,
        connected: true
      };
    } catch (error) {
      console.error('[DatabaseHelper] getDatabaseInfo error:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

// Export for use in Cloudflare Workers
export default DatabaseHelper;
