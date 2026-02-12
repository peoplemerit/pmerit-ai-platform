/**
 * PMERIT Projects API Client
 * Version: 1.0
 * Created: February 12, 2026
 * 
 * Purpose: Handle governance project API calls
 * 
 * Features:
 * - Create projects with work unit allocation
 * - Create scopes with acceptance criteria
 * - Verify scopes with DMAIC scores
 * - Check approval gates
 * - Retrieve dashboard metrics
 * - Get reconciliation data
 */

(function(window) {
  'use strict';
  
  /**
   * ProjectsAPI - Main API class for governance project operations
   */
  class ProjectsAPI {
    constructor() {
      this.apiBaseUrl = '/api/v1/projects';
    }
    
    /**
     * Create a new project
     * @param {Object} data - Project data
     * @param {number} data.userId - User ID
     * @param {string} data.title - Project title
     * @param {string} data.objective - Project objective
     * @param {number} data.execution_total_wu - Total work units
     * @returns {Promise<Object>} - API response
     */
    async createProject(data) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create project');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error creating project:', error);
        throw error;
      }
    }
    
    /**
     * Create a new scope
     * @param {string} projectId - Project UUID
     * @param {Object} data - Scope data
     * @param {string} data.scopeName - Scope name
     * @param {number} data.allocated_wu - Allocated work units
     * @param {Array} data.acceptance_criteria - Acceptance criteria
     * @returns {Promise<Object>} - API response
     */
    async createScope(projectId, data) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/scopes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create scope');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error creating scope:', error);
        throw error;
      }
    }
    
    /**
     * Get all scopes for a project
     * @param {string} projectId - Project UUID
     * @returns {Promise<Object>} - API response with scopes array
     */
    async getScopes(projectId) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/scopes`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to get scopes');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error getting scopes:', error);
        throw error;
      }
    }
    
    /**
     * Verify a scope with DMAIC scores
     * @param {string} projectId - Project UUID
     * @param {string} scopeId - Scope UUID
     * @param {Object} scores - DMAIC scores
     * @param {number} scores.logic_score - Logic score (0-1)
     * @param {number} scores.procedural_score - Procedural score (0-1)
     * @param {number} scores.validation_score - Validation score (0-1)
     * @returns {Promise<Object>} - API response
     */
    async verifyScope(projectId, scopeId, scores) {
      try {
        // Validate scores
        const validateScore = (score, name) => {
          if (typeof score !== 'number' || score < 0 || score > 1) {
            throw new Error(`${name} must be between 0 and 1`);
          }
        };
        
        validateScore(scores.logic_score, 'logic_score');
        validateScore(scores.procedural_score, 'procedural_score');
        validateScore(scores.validation_score, 'validation_score');
        
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/scopes/${scopeId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scores)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to verify scope');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error verifying scope:', error);
        throw error;
      }
    }
    
    /**
     * Check ideation gate
     * @param {string} projectId - Project UUID
     * @returns {Promise<Object>} - API response with gate status
     */
    async checkIdeationGate(projectId) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/gates/ideation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to check ideation gate');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error checking ideation gate:', error);
        throw error;
      }
    }
    
    /**
     * Get project dashboard data
     * @param {string} projectId - Project UUID
     * @returns {Promise<Object>} - Dashboard data
     */
    async getDashboard(projectId) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/dashboard`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to get dashboard');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error getting dashboard:', error);
        throw error;
      }
    }
    
    /**
     * Get project reconciliation data
     * @param {string} projectId - Project UUID
     * @returns {Promise<Object>} - Reconciliation data
     */
    async getReconciliation(projectId) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${projectId}/reconciliation`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to get reconciliation');
        }
        
        return result;
        
      } catch (error) {
        console.error('[ProjectsAPI] Error getting reconciliation:', error);
        throw error;
      }
    }
  }
  
  // Export to global namespace
  window.ProjectsAPI = new ProjectsAPI();
  
  console.log('[ProjectsAPI] Module loaded successfully');
  
})(window);
