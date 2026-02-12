/**
 * PMERIT Approval Gate UI
 * Version: 1.0
 * Created: February 12, 2026
 * 
 * Purpose: Handle approval gate interactions
 * 
 * Features:
 * - Display readiness breakdown (L, P, V)
 * - Show created artifacts
 * - APPROVE/REJECT/FEEDBACK actions
 * - Scope verification interface
 */

(function(window) {
  'use strict';
  
  /**
   * ApprovalGateUI - Approval gate interaction handler
   */
  class ApprovalGateUI {
    constructor() {
      this.currentProjectId = null;
      this.currentScopeId = null;
      this.modal = null;
    }
    
    /**
     * Initialize approval gate UI
     */
    init() {
      // Create modal container if it doesn't exist
      if (!document.getElementById('approval-gate-modal')) {
        this.createModal();
      }
      this.modal = document.getElementById('approval-gate-modal');
    }
    
    /**
     * Create modal HTML structure
     */
    createModal() {
      const modalHtml = `
        <div id="approval-gate-modal" class="modal" style="display: none;">
          <div class="modal-overlay" onclick="ApprovalGateUI.close()"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="modal-title">Approval Gate</h2>
              <button class="modal-close" onclick="ApprovalGateUI.close()">&times;</button>
            </div>
            <div class="modal-body" id="modal-body">
              <!-- Dynamic content -->
            </div>
            <div class="modal-footer" id="modal-footer">
              <!-- Dynamic actions -->
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    /**
     * Show scope verification form
     * @param {string} projectId - Project UUID
     * @param {string} scopeId - Scope UUID
     * @param {Object} scope - Scope data
     */
    async showScopeVerification(projectId, scopeId, scope) {
      this.currentProjectId = projectId;
      this.currentScopeId = scopeId;
      
      document.getElementById('modal-title').textContent = `Verify Scope: ${scope.scope_name}`;
      
      const modalBody = document.getElementById('modal-body');
      modalBody.innerHTML = `
        <div class="verification-form">
          <div class="scope-info">
            <h3>Scope Details</h3>
            <p><strong>Name:</strong> ${this.escapeHtml(scope.scope_name)}</p>
            <p><strong>Allocated WU:</strong> ${scope.allocated_wu.toFixed(2)}</p>
            <p><strong>Status:</strong> ${scope.status}</p>
          </div>
          
          <div class="acceptance-criteria">
            <h3>Acceptance Criteria</h3>
            <ul>
              ${scope.acceptance_criteria.map(c => `
                <li>${this.escapeHtml(c.criterion || c)}</li>
              `).join('')}
            </ul>
          </div>
          
          <div class="dmaic-scores">
            <h3>DMAIC Readiness Scores</h3>
            <p class="help-text">Enter scores from 0.0 to 1.0 based on DMAIC validation</p>
            
            <div class="score-input">
              <label for="logic-score">
                Logic Score (L)
                <span class="help-icon" title="Requirements clarity, DAG completeness, logical consistency">?</span>
              </label>
              <input type="number" id="logic-score" min="0" max="1" step="0.01" value="${scope.logic_score || 0}" />
              <div class="score-range">
                <span>0.0 = No logic</span>
                <span>1.0 = Perfect logic</span>
              </div>
            </div>
            
            <div class="score-input">
              <label for="procedural-score">
                Procedural Score (P)
                <span class="help-icon" title="Process adherence, methodology compliance, procedural correctness">?</span>
              </label>
              <input type="number" id="procedural-score" min="0" max="1" step="0.01" value="${scope.procedural_score || 0}" />
              <div class="score-range">
                <span>0.0 = No process</span>
                <span>1.0 = Perfect process</span>
              </div>
            </div>
            
            <div class="score-input">
              <label for="validation-score">
                Validation Score (V)
                <span class="help-icon" title="Acceptance criteria met, verification complete, validation passed">?</span>
              </label>
              <input type="number" id="validation-score" min="0" max="1" step="0.01" value="${scope.validation_score || 0}" />
              <div class="score-range">
                <span>0.0 = Not validated</span>
                <span>1.0 = Fully validated</span>
              </div>
            </div>
            
            <div class="readiness-calculation">
              <h4>Readiness Score (R = L × P × V)</h4>
              <div id="readiness-preview" class="readiness-preview">
                <span class="readiness-value">0.00</span>
                <span class="readiness-label">(0% of WU will transfer)</span>
              </div>
              <div id="wu-transfer-preview" class="wu-transfer-preview">
                Transfer: 0.00 WU
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Set up real-time calculation
      this.setupRealtimeCalculation(scope.allocated_wu);
      
      // Modal footer with actions
      const modalFooter = document.getElementById('modal-footer');
      modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="ApprovalGateUI.close()">Cancel</button>
        <button class="btn btn-primary" onclick="ApprovalGateUI.submitVerification()">Verify Scope</button>
      `;
      
      // Show modal
      this.modal.style.display = 'flex';
    }
    
    /**
     * Set up real-time readiness calculation
     * @param {number} allocatedWu - Allocated work units
     */
    setupRealtimeCalculation(allocatedWu) {
      const updateCalculation = () => {
        const L = parseFloat(document.getElementById('logic-score').value) || 0;
        const P = parseFloat(document.getElementById('procedural-score').value) || 0;
        const V = parseFloat(document.getElementById('validation-score').value) || 0;
        
        const R = L * P * V;
        const transfer = allocatedWu * R;
        
        document.getElementById('readiness-preview').innerHTML = `
          <span class="readiness-value">${R.toFixed(4)}</span>
          <span class="readiness-label">(${(R * 100).toFixed(1)}% of WU will transfer)</span>
        `;
        
        document.getElementById('wu-transfer-preview').innerHTML = `
          Transfer: <strong>${transfer.toFixed(2)} WU</strong> out of ${allocatedWu.toFixed(2)} WU allocated
        `;
      };
      
      // Add event listeners
      ['logic-score', 'procedural-score', 'validation-score'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', updateCalculation);
      });
      
      // Initial calculation
      updateCalculation();
    }
    
    /**
     * Submit scope verification (static method for onclick)
     */
    static async submitVerification() {
      const instance = window.ApprovalGateUI;
      
      try {
        // Get scores
        const logic_score = parseFloat(document.getElementById('logic-score').value);
        const procedural_score = parseFloat(document.getElementById('procedural-score').value);
        const validation_score = parseFloat(document.getElementById('validation-score').value);
        
        // Validate
        if (isNaN(logic_score) || logic_score < 0 || logic_score > 1) {
          alert('Logic score must be between 0 and 1');
          return;
        }
        if (isNaN(procedural_score) || procedural_score < 0 || procedural_score > 1) {
          alert('Procedural score must be between 0 and 1');
          return;
        }
        if (isNaN(validation_score) || validation_score < 0 || validation_score > 1) {
          alert('Validation score must be between 0 and 1');
          return;
        }
        
        // Show loading
        const submitBtn = event.target;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
        
        // Submit verification
        const result = await ProjectsAPI.verifyScope(
          instance.currentProjectId,
          instance.currentScopeId,
          { logic_score, procedural_score, validation_score }
        );
        
        if (result.success) {
          // Show success message
          instance.showSuccess(`
            <h3>Scope Verified Successfully</h3>
            <p><strong>Readiness Score:</strong> ${(result.readiness_score * 100).toFixed(1)}%</p>
            <p><strong>Work Units Transferred:</strong> ${result.wu_transferred.toFixed(2)} WU</p>
            <div class="formula-explanation">
              <p><strong>Calculation:</strong></p>
              <code>${result.formula.calculation}</code>
              <br/>
              <code>${result.formula.transfer}</code>
            </div>
          `);
          
          // Reload dashboard after 2 seconds
          setTimeout(() => {
            instance.close();
            if (window.GovernanceDashboard) {
              window.GovernanceDashboard.loadDashboard();
            }
          }, 2000);
        }
        
      } catch (error) {
        console.error('[ApprovalGateUI] Verification error:', error);
        alert('Failed to verify scope: ' + error.message);
        
        // Re-enable button
        const submitBtn = event.target;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Scope';
      }
    }
    
    /**
     * Show success message
     * @param {string} html - Success HTML content
     */
    showSuccess(html) {
      document.getElementById('modal-body').innerHTML = `
        <div class="success-message">
          <div class="success-icon">✓</div>
          ${html}
        </div>
      `;
      
      document.getElementById('modal-footer').innerHTML = `
        <button class="btn btn-primary" onclick="ApprovalGateUI.close()">Close</button>
      `;
    }
    
    /**
     * Show ideation gate check results
     * @param {string} projectId - Project UUID
     */
    async showIdeationGate(projectId) {
      this.currentProjectId = projectId;
      
      try {
        // Check ideation gate
        const result = await ProjectsAPI.checkIdeationGate(projectId);
        
        document.getElementById('modal-title').textContent = 'Ideation Gate Check';
        
        const statusClass = result.gate_status === 'PASSED' ? 'success' : 'warning';
        const statusIcon = result.gate_status === 'PASSED' ? '✓' : '⚠';
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
          <div class="gate-check-results ${statusClass}">
            <div class="gate-status">
              <span class="status-icon">${statusIcon}</span>
              <h3>Gate Status: ${result.gate_status}</h3>
            </div>
            
            <div class="gate-checks">
              <h4>Criteria Checks</h4>
              <ul>
                <li class="${result.checks.has_scopes ? 'pass' : 'fail'}">
                  ${result.checks.has_scopes ? '✓' : '✗'} Has scopes: ${result.checks.total_scopes || 0}
                </li>
                <li class="${result.checks.all_have_criteria ? 'pass' : 'fail'}">
                  ${result.checks.all_have_criteria ? '✓' : '✗'} All scopes have acceptance criteria
                </li>
                <li class="${result.checks.wu_allocation_complete ? 'pass' : 'fail'}">
                  ${result.checks.wu_allocation_complete ? '✓' : '✗'} WU allocation complete
                  <br/><small>Allocated: ${result.checks.total_allocated_wu?.toFixed(2)} / Project Total: ${result.checks.project_total_wu?.toFixed(2)}</small>
                </li>
              </ul>
            </div>
            
            ${result.messages && result.messages.length > 0 ? `
              <div class="gate-messages">
                <h4>Messages</h4>
                <ul>
                  ${result.messages.map(msg => `<li>${this.escapeHtml(msg)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;
        
        const modalFooter = document.getElementById('modal-footer');
        modalFooter.innerHTML = `
          <button class="btn btn-primary" onclick="ApprovalGateUI.close()">Close</button>
        `;
        
        // Show modal
        this.modal.style.display = 'flex';
        
      } catch (error) {
        console.error('[ApprovalGateUI] Ideation gate error:', error);
        alert('Failed to check ideation gate: ' + error.message);
      }
    }
    
    /**
     * Close modal (static method for onclick)
     */
    static close() {
      const instance = window.ApprovalGateUI;
      if (instance.modal) {
        instance.modal.style.display = 'none';
      }
    }
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }
  
  // Export to global namespace
  window.ApprovalGateUI = new ApprovalGateUI();
  
  console.log('[ApprovalGateUI] Module loaded successfully');
  
})(window);
