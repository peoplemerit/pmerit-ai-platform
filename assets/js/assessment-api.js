/**
 * PMERIT Assessment API Module
 * Version: 1.0
 * Last Updated: November 2024
 * 
 * Purpose: Handle assessment-related API calls and data management
 * 
 * Features:
 * - Start new assessments
 * - Save assessment progress
 * - Resume assessments
 * - Submit assessment responses
 * - Retrieve assessment results
 */

(function(window) {
  'use strict';
  
  /**
   * AssessmentAPI - Main API class for assessment operations
   */
  class AssessmentAPI {
    constructor() {
      this.apiBaseUrl = '/api/assessment'; // Placeholder - update with actual API endpoint
      this.storageKey = 'pmerit-assessment-progress';
      this.consentKey = 'pmerit-assessment-consent';
    }
    
    /**
     * Start a new assessment
     * @param {Object} consentData - User consent information
     * @returns {Promise<Object>} - Assessment session data
     */
    async startAssessment(consentData) {
      try {
        console.log('[AssessmentAPI] Starting new assessment');
        
        // Validate consent data
        if (!consentData || !consentData.privacyPolicy || !consentData.dataProcessing) {
          throw new Error('Required consents not provided');
        }
        
        // Initialize assessment session
        const sessionData = {
          sessionId: this.generateSessionId(),
          startTime: new Date().toISOString(),
          consent: consentData,
          currentStep: 1,
          totalSteps: 10, // Adjust based on actual assessment structure
          responses: {},
          status: 'in_progress'
        };
        
        // Save to localStorage
        this.saveProgress(sessionData);
        
        // In a real implementation, this would make an API call:
        // const response = await fetch(`${this.apiBaseUrl}/start`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ consent: consentData })
        // });
        // const result = await response.json();
        
        // For now, return mock success
        return {
          success: true,
          sessionId: sessionData.sessionId,
          message: 'Assessment started successfully'
        };
        
      } catch (error) {
        console.error('[AssessmentAPI] Error starting assessment:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    /**
     * Save assessment progress to localStorage
     * @param {Object} progressData - Current progress data
     */
    saveProgress(progressData) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(progressData));
        console.log('[AssessmentAPI] Progress saved:', progressData.currentStep);
      } catch (error) {
        console.error('[AssessmentAPI] Error saving progress:', error);
      }
    }
    
    /**
     * Load assessment progress from localStorage
     * @returns {Object|null} - Saved progress or null
     */
    loadProgress() {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          return JSON.parse(data);
        }
        return null;
      } catch (error) {
        console.error('[AssessmentAPI] Error loading progress:', error);
        return null;
      }
    }
    
    /**
     * Clear assessment progress
     */
    clearProgress() {
      try {
        localStorage.removeItem(this.storageKey);
        console.log('[AssessmentAPI] Progress cleared');
      } catch (error) {
        console.error('[AssessmentAPI] Error clearing progress:', error);
      }
    }
    
    /**
     * Submit an assessment response
     * @param {number} stepNumber - Current step number
     * @param {Object} response - User's response data
     * @returns {Promise<Object>} - Submission result
     */
    async submitResponse(stepNumber, response) {
      try {
        console.log(`[AssessmentAPI] Submitting response for step ${stepNumber}`);
        
        // Load current progress
        const progress = this.loadProgress();
        if (!progress) {
          throw new Error('No active assessment session found');
        }
        
        // Update progress with new response
        progress.responses[stepNumber] = response;
        progress.currentStep = stepNumber + 1;
        progress.lastUpdated = new Date().toISOString();
        
        // Save updated progress
        this.saveProgress(progress);
        
        // In a real implementation, this would make an API call:
        // const apiResponse = await fetch(`${this.apiBaseUrl}/submit-response`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     sessionId: progress.sessionId,
        //     stepNumber,
        //     response
        //   })
        // });
        // const result = await apiResponse.json();
        
        return {
          success: true,
          nextStep: progress.currentStep,
          message: 'Response submitted successfully'
        };
        
      } catch (error) {
        console.error('[AssessmentAPI] Error submitting response:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    /**
     * Complete the assessment and get results
     * @returns {Promise<Object>} - Assessment results
     */
    async completeAssessment() {
      try {
        console.log('[AssessmentAPI] Completing assessment');
        
        // Load progress
        const progress = this.loadProgress();
        if (!progress) {
          throw new Error('No active assessment session found');
        }
        
        // Mark as completed
        progress.status = 'completed';
        progress.completedTime = new Date().toISOString();
        
        // Calculate duration
        const startTime = new Date(progress.startTime);
        const endTime = new Date(progress.completedTime);
        progress.duration = Math.round((endTime - startTime) / 1000 / 60); // Duration in minutes
        
        // Save final state
        this.saveProgress(progress);
        
        // In a real implementation, this would call the API to get results:
        // const response = await fetch(`${this.apiBaseUrl}/complete`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     sessionId: progress.sessionId,
        //     responses: progress.responses
        //   })
        // });
        // const results = await response.json();
        
        // Mock results for now
        const results = {
          success: true,
          results: {
            careerPaths: [
              { name: 'Data Analytics', match: 85 },
              { name: 'UX Design', match: 78 },
              { name: 'Digital Marketing', match: 72 }
            ],
            learningStyle: 'Visual',
            skillGaps: ['Python', 'SQL', 'Data Visualization'],
            recommendedCourses: []
          }
        };
        
        return results;
        
      } catch (error) {
        console.error('[AssessmentAPI] Error completing assessment:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    /**
     * Resume an existing assessment
     * @returns {Object|null} - Progress data or null
     */
    resumeAssessment() {
      const progress = this.loadProgress();
      if (progress && progress.status === 'in_progress') {
        console.log('[AssessmentAPI] Resuming assessment at step', progress.currentStep);
        return progress;
      }
      return null;
    }
    
    /**
     * Get assessment consent data
     * @returns {Object|null} - Consent data or null
     */
    getConsent() {
      try {
        const data = localStorage.getItem(this.consentKey);
        if (data) {
          return JSON.parse(data);
        }
        return null;
      } catch (error) {
        console.error('[AssessmentAPI] Error getting consent:', error);
        return null;
      }
    }
    
    /**
     * Generate a unique session ID using crypto for better security
     * @returns {string} - Session ID
     */
    generateSessionId() {
      const timestamp = Date.now();
      // Use crypto.getRandomValues for secure random generation if available
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);
        const randomString = Array.from(randomBytes)
          .map(b => b.toString(36))
          .join('')
          .substring(0, 9);
        return `assessment_${timestamp}_${randomString}`;
      }
      // Fallback to Math.random (non-security-critical context)
      return `assessment_${timestamp}_${Math.random().toString(36).substring(2, 11)}`;
    }
    
    /**
     * Validate assessment session
     * @returns {boolean} - True if valid session exists
     */
    hasActiveSession() {
      const progress = this.loadProgress();
      return progress !== null && progress.status === 'in_progress';
    }
  }
  
  // Export to global namespace
  window.AssessmentAPI = new AssessmentAPI();
  
  console.log('[AssessmentAPI] Module loaded successfully');
  
})(window);
