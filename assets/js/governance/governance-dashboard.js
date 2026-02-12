/**
 * PMERIT Governance Dashboard
 * Version: 1.0
 * Created: February 12, 2026
 * 
 * Purpose: Display governance metrics and project status
 * 
 * Features:
 * - Real-time work unit conservation tracking
 * - Scope readiness visualization
 * - AIXORD phase tracking
 * - Approval gate status
 */

(function(window) {
  'use strict';
  
  /**
   * GovernanceDashboard - Main dashboard controller
   */
  class GovernanceDashboard {
    constructor() {
      this.projectId = null;
      this.dashboardData = null;
      this.refreshInterval = null;
    }
    
    /**
     * Initialize dashboard for a project
     * @param {string} projectId - Project UUID
     */
    async init(projectId) {
      try {
        this.projectId = projectId;
        
        // Load dashboard data
        await this.loadDashboard();
        
        // Set up auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
          this.loadDashboard();
        }, 30000);
        
      } catch (error) {
        console.error('[GovernanceDashboard] Init error:', error);
        this.showError('Failed to initialize dashboard');
      }
    }
    
    /**
     * Load dashboard data from API
     */
    async loadDashboard() {
      try {
        const result = await ProjectsAPI.getDashboard(this.projectId);
        
        if (result.success) {
          this.dashboardData = result;
          this.render();
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        console.error('[GovernanceDashboard] Load error:', error);
        this.showError('Failed to load dashboard data');
      }
    }
    
    /**
     * Render dashboard UI
     */
    render() {
      if (!this.dashboardData) return;
      
      // Render project header
      this.renderProjectHeader();
      
      // Render conservation status
      this.renderConservationStatus();
      
      // Render scopes table
      this.renderScopes();
      
      // Render approval gates
      this.renderGates();
      
      // Render metrics cards
      this.renderMetrics();
    }
    
    /**
     * Render project header
     */
    renderProjectHeader() {
      const { project } = this.dashboardData;
      
      const headerEl = document.getElementById('project-header');
      if (!headerEl) return;
      
      headerEl.innerHTML = `
        <div class="project-header">
          <div class="project-title-section">
            <h1>${this.escapeHtml(project.title)}</h1>
            <p class="project-objective">${this.escapeHtml(project.objective)}</p>
          </div>
          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">Phase:</span>
              <span class="badge phase-${project.current_phase.toLowerCase()}">${project.current_phase}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Ideation Gate:</span>
              <span class="badge ${project.ideation_gate_passed ? 'success' : 'pending'}">
                ${project.ideation_gate_passed ? 'PASSED' : 'PENDING'}
              </span>
            </div>
            ${project.locked_at ? `
              <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="badge locked">LOCKED</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    /**
     * Render conservation status
     */
    renderConservationStatus() {
      const { conservation } = this.dashboardData;
      
      const conservationEl = document.getElementById('conservation-status');
      if (!conservationEl) return;
      
      const statusClass = conservation.is_valid ? 'valid' : 'invalid';
      const statusIcon = conservation.is_valid ? '✓' : '⚠';
      
      conservationEl.innerHTML = `
        <div class="conservation-card ${statusClass}">
          <h2>Work Unit Conservation</h2>
          <div class="conservation-formula">
            <code>${conservation.formula}</code>
          </div>
          <div class="conservation-breakdown">
            <div class="wu-item">
              <span class="wu-label">Execution Total:</span>
              <span class="wu-value">${conservation.execution_total_wu.toFixed(2)} WU</span>
            </div>
            <div class="wu-item">
              <span class="wu-label">Formula Execution:</span>
              <span class="wu-value">${conservation.formula_execution_wu.toFixed(2)} WU</span>
            </div>
            <div class="wu-item">
              <span class="wu-label">Verified Reality:</span>
              <span class="wu-value">${conservation.verified_reality_wu.toFixed(2)} WU</span>
            </div>
          </div>
          <div class="conservation-status ${statusClass}">
            <span class="status-icon">${statusIcon}</span>
            <span class="status-text">${conservation.explanation}</span>
          </div>
          ${!conservation.is_valid ? `
            <div class="conservation-warning">
              Deviation: ${Math.abs(conservation.deviation).toFixed(4)} WU
            </div>
          ` : ''}
        </div>
      `;
    }
    
    /**
     * Render scopes table
     */
    renderScopes() {
      const { scopes } = this.dashboardData;
      
      const scopesEl = document.getElementById('scopes-table');
      if (!scopesEl) return;
      
      if (scopes.length === 0) {
        scopesEl.innerHTML = '<p class="empty-state">No scopes defined yet.</p>';
        return;
      }
      
      const rows = scopes.map(scope => `
        <tr class="scope-row status-${scope.status.toLowerCase()}">
          <td class="scope-name">${this.escapeHtml(scope.scope_name)}</td>
          <td class="scope-status">
            <span class="badge ${scope.status.toLowerCase()}">${scope.status}</span>
          </td>
          <td class="scope-wu">
            ${scope.allocated_wu.toFixed(2)} WU
          </td>
          <td class="scope-verified">
            ${scope.verified_wu.toFixed(2)} WU
          </td>
          <td class="scope-readiness">
            <div class="readiness-breakdown">
              <div class="readiness-bar" style="width: ${scope.readiness.overall * 100}%">
                ${(scope.readiness.overall * 100).toFixed(0)}%
              </div>
              <div class="readiness-scores" title="L: ${scope.readiness.logic}, P: ${scope.readiness.procedural}, V: ${scope.readiness.validation}">
                L:${scope.readiness.logic.toFixed(2)} × P:${scope.readiness.procedural.toFixed(2)} × V:${scope.readiness.validation.toFixed(2)}
              </div>
            </div>
          </td>
          <td class="scope-criteria">
            ${scope.acceptance_criteria.length}
          </td>
          <td class="scope-actions">
            <button class="btn-small" onclick="GovernanceDashboard.viewScope('${scope.id}')">View</button>
          </td>
        </tr>
      `).join('');
      
      scopesEl.innerHTML = `
        <table class="scopes-table">
          <thead>
            <tr>
              <th>Scope Name</th>
              <th>Status</th>
              <th>Allocated WU</th>
              <th>Verified WU</th>
              <th>Readiness (R = L × P × V)</th>
              <th>Criteria</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }
    
    /**
     * Render approval gates
     */
    renderGates() {
      const { gates } = this.dashboardData;
      
      const gatesEl = document.getElementById('approval-gates');
      if (!gatesEl) return;
      
      if (gates.length === 0) {
        gatesEl.innerHTML = '<p class="empty-state">No approval gates yet.</p>';
        return;
      }
      
      const gateCards = gates.map(gate => `
        <div class="gate-card status-${gate.status.toLowerCase()}">
          <div class="gate-header">
            <span class="gate-type">${gate.gate_type}</span>
            <span class="gate-status badge ${gate.status.toLowerCase()}">${gate.status}</span>
          </div>
          ${gate.approval_message ? `
            <p class="gate-message">${this.escapeHtml(gate.approval_message)}</p>
          ` : ''}
          <div class="gate-meta">
            <span class="gate-date">Created: ${new Date(gate.created_at).toLocaleDateString()}</span>
            ${gate.approved_at ? `
              <span class="gate-date">Approved: ${new Date(gate.approved_at).toLocaleDateString()}</span>
            ` : ''}
          </div>
        </div>
      `).join('');
      
      gatesEl.innerHTML = gateCards;
    }
    
    /**
     * Render metrics cards
     */
    renderMetrics() {
      const { metrics } = this.dashboardData;
      
      const metricsEl = document.getElementById('metrics-cards');
      if (!metricsEl) return;
      
      metricsEl.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">${metrics.total_scopes}</div>
          <div class="metric-label">Total Scopes</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${metrics.verified_scopes}</div>
          <div class="metric-label">Verified</div>
        </div>
        <div class="metric-card warning">
          <div class="metric-value">${metrics.in_progress_scopes}</div>
          <div class="metric-label">In Progress</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.completion_rate}%</div>
          <div class="metric-label">Completion Rate</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.total_allocated_wu.toFixed(2)}</div>
          <div class="metric-label">Allocated WU</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${metrics.total_verified_wu.toFixed(2)}</div>
          <div class="metric-label">Verified WU</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${(metrics.average_readiness * 100).toFixed(0)}%</div>
          <div class="metric-label">Avg Readiness</div>
        </div>
        <div class="metric-card ${metrics.pending_gates > 0 ? 'warning' : ''}">
          <div class="metric-value">${metrics.pending_gates}</div>
          <div class="metric-label">Pending Gates</div>
        </div>
      `;
    }
    
    /**
     * View scope details (static method for onclick)
     * @param {string} scopeId - Scope UUID
     */
    static viewScope(scopeId) {
      // This would open a modal or navigate to scope details
      console.log('View scope:', scopeId);
      // TODO: Implement scope details view
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
      const errorEl = document.getElementById('dashboard-error');
      if (errorEl) {
        errorEl.innerHTML = `
          <div class="error-message">
            <span class="error-icon">⚠</span>
            <span>${this.escapeHtml(message)}</span>
          </div>
        `;
        errorEl.style.display = 'block';
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
    
    /**
     * Cleanup
     */
    destroy() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    }
  }
  
  // Export to global namespace
  window.GovernanceDashboard = new GovernanceDashboard();
  
  console.log('[GovernanceDashboard] Module loaded successfully');
  
})(window);
