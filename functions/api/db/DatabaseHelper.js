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
  // GOVERNANCE PROJECT OPERATIONS
  // =========================================================================

  /**
   * Create new project with work unit conservation
   * @param {Object} data - Project data
   * @param {number} data.userId - User ID
   * @param {string} data.title - Project title
   * @param {string} data.objective - Project objective
   * @param {number} data.execution_total_wu - Total work units
   * @param {number} data.formula_execution_wu - Formula WU
   * @param {number} data.verified_reality_wu - Verified WU
   * @returns {Promise<Object>} Created project
   */
  async createProject(data) {
    try {
      const { userId, title, objective, execution_total_wu, formula_execution_wu, verified_reality_wu } = data;

      const result = await this.db.prepare(`
        INSERT INTO projects (
          user_id, title, objective,
          execution_total_wu, formula_execution_wu, verified_reality_wu
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `).bind(
        userId,
        title,
        objective,
        execution_total_wu,
        formula_execution_wu,
        verified_reality_wu
      ).first();

      console.log('[DatabaseHelper] Project created:', result.id);
      return result;

    } catch (error) {
      console.error('[DatabaseHelper] createProject error:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  /**
   * Get project by ID
   * @param {string} projectId - Project UUID
   * @returns {Promise<Object>} Project data
   */
  async getProject(projectId) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM projects WHERE id = $1
      `).bind(projectId).first();

      if (!result) {
        throw new Error('Project not found');
      }

      return result;

    } catch (error) {
      console.error('[DatabaseHelper] getProject error:', error);
      throw new Error(`Failed to get project: ${error.message}`);
    }
  }

  /**
   * Update project
   * @param {string} projectId - Project UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(projectId, updates) {
    try {
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      // Build SET clause dynamically
      for (const [key, value] of Object.entries(updates)) {
        setClauses.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }

      // Always update timestamp
      setClauses.push(`updated_at = NOW()`);

      const query = `
        UPDATE projects
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.db.prepare(query).bind(...values, projectId).first();

      if (!result) {
        throw new Error('Project not found');
      }

      console.log('[DatabaseHelper] Project updated:', projectId);
      return result;

    } catch (error) {
      console.error('[DatabaseHelper] updateProject error:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  /**
   * Create scope with work unit allocation
   * @param {Object} data - Scope data
   * @param {string} data.projectId - Project UUID
   * @param {string} data.scopeName - Scope name
   * @param {number} data.allocated_wu - Allocated work units
   * @param {Array} data.acceptance_criteria - Acceptance criteria
   * @returns {Promise<Object>} Created scope
   */
  async createScope(data) {
    try {
      const { projectId, scopeName, allocated_wu, acceptance_criteria } = data;

      // Verify project exists and has enough unallocated WU
      const project = await this.getProject(projectId);
      
      // Get total allocated WU across all scopes
      const allocatedSum = await this.db.prepare(`
        SELECT COALESCE(SUM(allocated_wu), 0) as total_allocated
        FROM scopes
        WHERE project_id = $1
      `).bind(projectId).first();

      const totalAllocated = parseFloat(allocatedSum.total_allocated || 0);
      const projectTotal = parseFloat(project.execution_total_wu);

      if (totalAllocated + allocated_wu > projectTotal) {
        throw new Error(`Cannot allocate ${allocated_wu} WU. Project has ${projectTotal} total, ${totalAllocated} already allocated, ${projectTotal - totalAllocated} remaining.`);
      }

      const result = await this.db.prepare(`
        INSERT INTO scopes (
          project_id, scope_name, allocated_wu, acceptance_criteria
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `).bind(
        projectId,
        scopeName,
        allocated_wu,
        JSON.stringify(acceptance_criteria || [])
      ).first();

      console.log('[DatabaseHelper] Scope created:', result.id);
      return result;

    } catch (error) {
      console.error('[DatabaseHelper] createScope error:', error);
      throw new Error(`Failed to create scope: ${error.message}`);
    }
  }

  /**
   * Verify scope and transfer work units
   * @param {string} scopeId - Scope UUID
   * @param {Object} scores - DMAIC scores
   * @param {number} scores.logic_score - Logic score (0-1)
   * @param {number} scores.procedural_score - Procedural score (0-1)
   * @param {number} scores.validation_score - Validation score (0-1)
   * @returns {Promise<Object>} Updated scope with WU transfer
   */
  async verifyScope(scopeId, scores) {
    try {
      const { logic_score, procedural_score, validation_score } = scores;

      // Update scope with scores (readiness_score is computed automatically)
      const scope = await this.db.prepare(`
        UPDATE scopes
        SET 
          logic_score = $1,
          procedural_score = $2,
          validation_score = $3,
          verified_at = NOW(),
          status = 'VERIFIED',
          updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `).bind(
        logic_score,
        procedural_score,
        validation_score,
        scopeId
      ).first();

      if (!scope) {
        throw new Error('Scope not found');
      }

      // Calculate transferred WU using readiness score
      // Transfer rule: WU_transferred = allocated_wu × R
      const readiness = parseFloat(scope.readiness_score);
      const allocated = parseFloat(scope.allocated_wu);
      const transferred = allocated * readiness;

      // Update verified_wu
      await this.db.prepare(`
        UPDATE scopes
        SET verified_wu = $1
        WHERE id = $2
      `).bind(transferred, scopeId).run();

      // Update project WU (transfer from formula to verified)
      const project = await this.getProject(scope.project_id);
      const newFormulaWu = parseFloat(project.formula_execution_wu) - transferred;
      const newVerifiedWu = parseFloat(project.verified_reality_wu) + transferred;

      await this.db.prepare(`
        UPDATE projects
        SET 
          formula_execution_wu = $1,
          verified_reality_wu = $2,
          updated_at = NOW()
        WHERE id = $3
      `).bind(newFormulaWu, newVerifiedWu, scope.project_id).run();

      console.log('[DatabaseHelper] Scope verified:', scopeId, 'WU transferred:', transferred);

      return {
        scope: scope,
        wu_transferred: transferred,
        readiness_score: readiness
      };

    } catch (error) {
      console.error('[DatabaseHelper] verifyScope error:', error);
      throw new Error(`Failed to verify scope: ${error.message}`);
    }
  }

  /**
   * Create approval gate
   * @param {Object} data - Gate data
   * @param {string} data.projectId - Project UUID (optional)
   * @param {string} data.scopeId - Scope UUID (optional)
   * @param {string} data.gateType - Gate type
   * @returns {Promise<Object>} Created gate
   */
  async createApprovalGate(data) {
    try {
      const { projectId, scopeId, gateType } = data;

      const result = await this.db.prepare(`
        INSERT INTO approval_gates (project_id, scope_id, gate_type, status)
        VALUES ($1, $2, $3, 'PENDING')
        RETURNING *
      `).bind(
        projectId || null,
        scopeId || null,
        gateType
      ).first();

      console.log('[DatabaseHelper] Approval gate created:', result.id);
      return result;

    } catch (error) {
      console.error('[DatabaseHelper] createApprovalGate error:', error);
      throw new Error(`Failed to create approval gate: ${error.message}`);
    }
  }

  /**
   * Update approval gate status
   * @param {string} gateId - Gate UUID
   * @param {Object} data - Update data
   * @param {string} data.status - New status
   * @param {number} data.approvedBy - User ID
   * @param {string} data.approvalMessage - Approval message
   * @returns {Promise<Object>} Updated gate
   */
  async updateApprovalGate(gateId, data) {
    try {
      const { status, approvedBy, approvalMessage } = data;

      const result = await this.db.prepare(`
        UPDATE approval_gates
        SET 
          status = $1,
          approved_by = $2,
          approval_message = $3,
          approved_at = NOW()
        WHERE id = $4
        RETURNING *
      `).bind(status, approvedBy, approvalMessage, gateId).first();

      console.log('[DatabaseHelper] Approval gate updated:', gateId);
      return result;

    } catch (error) {
      console.error('[DatabaseHelper] updateApprovalGate error:', error);
      throw new Error(`Failed to update approval gate: ${error.message}`);
    }
  }

  /**
   * Log project audit event
   * @param {Object} data - Audit data
   * @param {string} data.projectId - Project UUID
   * @param {string} data.scopeId - Scope UUID (optional)
   * @param {string} data.eventType - Event type
   * @param {Object} data.eventData - Event data
   * @param {number} data.execution_total_wu - WU snapshot
   * @param {number} data.formula_execution_wu - WU snapshot
   * @param {number} data.verified_reality_wu - WU snapshot
   * @returns {Promise<Object>} Audit log entry
   */
  async logProjectAudit(data) {
    try {
      const { projectId, scopeId, eventType, eventData, execution_total_wu, formula_execution_wu, verified_reality_wu } = data;

      const result = await this.db.prepare(`
        INSERT INTO project_audit_log (
          project_id, scope_id, event_type, event_data,
          execution_total_wu, formula_execution_wu, verified_reality_wu
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `).bind(
        projectId,
        scopeId || null,
        eventType,
        JSON.stringify(eventData || {}),
        execution_total_wu || null,
        formula_execution_wu || null,
        verified_reality_wu || null
      ).first();

      return result;

    } catch (error) {
      console.error('[DatabaseHelper] logProjectAudit error:', error);
      // Don't throw - audit logging should not break main operations
      return null;
    }
  }

  /**
   * Get project scopes
   * @param {string} projectId - Project UUID
   * @returns {Promise<Array>} Scopes array
   */
  async getProjectScopes(projectId) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM scopes
        WHERE project_id = $1
        ORDER BY created_at ASC
      `).bind(projectId).all();

      return result.results || [];

    } catch (error) {
      console.error('[DatabaseHelper] getProjectScopes error:', error);
      throw new Error(`Failed to get scopes: ${error.message}`);
    }
  }

  /**
   * Get project approval gates
   * @param {string} projectId - Project UUID
   * @returns {Promise<Array>} Gates array
   */
  async getProjectGates(projectId) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM approval_gates
        WHERE project_id = $1
        ORDER BY created_at DESC
      `).bind(projectId).all();

      return result.results || [];

    } catch (error) {
      console.error('[DatabaseHelper] getProjectGates error:', error);
      throw new Error(`Failed to get gates: ${error.message}`);
    }
  }

  /**
   * Get project audit log
   * @param {string} projectId - Project UUID
   * @param {number} limit - Number of entries (default: 50)
   * @returns {Promise<Array>} Audit log entries
   */
  async getProjectAuditLog(projectId, limit = 50) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM project_audit_log
        WHERE project_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `).bind(projectId, limit).all();

      return result.results || [];

    } catch (error) {
      console.error('[DatabaseHelper] getProjectAuditLog error:', error);
      throw new Error(`Failed to get audit log: ${error.message}`);
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
