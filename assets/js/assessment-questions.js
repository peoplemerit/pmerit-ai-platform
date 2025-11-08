/**
 * PMERIT Assessment Questions Module
 * Version: 1.0
 * Last Updated: November 2025
 * 
 * Purpose: Manage the 120-question Big Five personality assessment
 * 
 * Features:
 * - Load questions from IPIP-NEO-120 JSON
 * - Display questions one at a time with Likert scale
 * - Track progress and update UI
 * - Auto-save every 5 questions
 * - Resume capability
 * - Navigate between questions
 * - Redirect to processing page on completion
 */

(function(window) {
  'use strict';
  
  /**
   * AssessmentQuestions - Main class for managing assessment questions
   */
  class AssessmentQuestions {
    constructor() {
      // Storage keys
      this.storageKey = 'pmerit-assessment-questions';
      this.autoSaveInterval = 5; // Save every 5 questions
      
      // State
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.sessionId = null;
      this.startTime = null;
      
      // DOM elements
      this.progressFill = null;
      this.progressText = null;
      this.sectionIndicators = null;
      this.questionNumber = null;
      this.traitLabel = null;
      this.facetLabel = null;
      this.questionText = null;
      this.answerOptions = null;
      this.prevBtn = null;
      this.nextBtn = null;
      this.autosaveIndicator = null;
      this.resumeModal = null;
      this.loadingOverlay = null;
      
      // Trait mapping for section indicators
      this.traitMap = {
        'O': 'Openness to Experience',
        'C': 'Conscientiousness',
        'E': 'Extraversion',
        'A': 'Agreeableness',
        'N': 'Neuroticism'
      };
    }
    
    /**
     * Initialize the assessment
     */
    async init() {
      console.log('[AssessmentQuestions] Initializing...');
      
      // Get DOM elements
      this.getDOMElements();
      
      // Show loading overlay
      this.showLoading();
      
      try {
        // Load questions from JSON
        await this.loadQuestions();
        
        // Check for saved progress
        const savedProgress = this.loadProgress();
        
        if (savedProgress && savedProgress.answers && Object.keys(savedProgress.answers).length > 0) {
          // Show resume modal
          this.hideLoading();
          this.showResumeModal(savedProgress);
        } else {
          // Start fresh
          this.startFresh();
          this.hideLoading();
          this.renderQuestion();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
      } catch (error) {
        console.error('[AssessmentQuestions] Initialization error:', error);
        this.hideLoading();
        alert('Failed to load assessment. Please refresh the page and try again.');
      }
    }
    
    /**
     * Get all required DOM elements
     */
    getDOMElements() {
      this.progressFill = document.getElementById('progressFill');
      this.progressText = document.getElementById('progressText');
      this.sectionIndicators = document.getElementById('sectionIndicators');
      this.questionNumber = document.getElementById('questionNumber');
      this.traitLabel = document.getElementById('traitLabel');
      this.facetLabel = document.getElementById('facetLabel');
      this.questionText = document.getElementById('questionText');
      this.answerOptions = document.getElementById('answerOptions');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.autosaveIndicator = document.getElementById('autosaveIndicator');
      this.resumeModal = document.getElementById('resumeModal');
      this.loadingOverlay = document.getElementById('loadingOverlay');
    }
    
    /**
     * Load questions from JSON file
     */
    async loadQuestions() {
      console.log('[AssessmentQuestions] Loading questions from JSON...');
      
      try {
        const response = await fetch('assets/data/ipip-neo-120.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Flatten the questions array
        this.questions = [];
        data.traits.forEach(trait => {
          trait.facets.forEach(facet => {
            facet.questions.forEach(question => {
              this.questions.push({
                ...question,
                trait_id: trait.trait_id,
                trait_name: trait.trait_name,
                facet_id: facet.facet_id,
                facet_name: facet.facet_name
              });
            });
          });
        });
        
        // Sort by question_number to ensure correct order
        this.questions.sort((a, b) => a.question_number - b.question_number);
        
        console.log(`[AssessmentQuestions] Loaded ${this.questions.length} questions`);
        
      } catch (error) {
        console.error('[AssessmentQuestions] Error loading questions:', error);
        throw error;
      }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Answer selection
      const radioButtons = this.answerOptions.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', () => this.handleAnswerSelect());
      });
      
      // Navigation buttons
      this.prevBtn.addEventListener('click', () => this.goToPrevious());
      this.nextBtn.addEventListener('click', () => this.goToNext());
      
      // Resume modal buttons
      const resumeBtn = document.getElementById('resumeBtn');
      const startOverBtn = document.getElementById('startOverBtn');
      
      if (resumeBtn) {
        resumeBtn.addEventListener('click', () => this.resumeAssessment());
      }
      
      if (startOverBtn) {
        startOverBtn.addEventListener('click', () => this.startOver());
      }
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(e) {
      // Number keys 1-5 for answers
      if (e.key >= '1' && e.key <= '5') {
        const radio = document.getElementById(`answer-${e.key}`);
        if (radio) {
          radio.checked = true;
          this.handleAnswerSelect();
        }
      }
      
      // Arrow keys for navigation
      if (e.key === 'ArrowLeft' && !this.prevBtn.disabled) {
        this.goToPrevious();
      } else if (e.key === 'ArrowRight' && !this.nextBtn.disabled) {
        this.goToNext();
      }
    }
    
    /**
     * Start fresh assessment
     */
    startFresh() {
      this.sessionId = this.generateSessionId();
      this.startTime = new Date().toISOString();
      this.currentQuestionIndex = 0;
      this.answers = {};
    }
    
    /**
     * Start over (clear saved progress)
     */
    startOver() {
      this.clearProgress();
      this.startFresh();
      this.hideResumeModal();
      this.renderQuestion();
    }
    
    /**
     * Resume saved assessment
     */
    resumeAssessment() {
      const saved = this.loadProgress();
      if (saved) {
        this.sessionId = saved.sessionId;
        this.startTime = saved.startTime;
        this.answers = saved.answers || {};
        this.currentQuestionIndex = saved.currentQuestionIndex || 0;
      }
      this.hideResumeModal();
      this.renderQuestion();
    }
    
    /**
     * Render current question
     */
    renderQuestion() {
      const question = this.questions[this.currentQuestionIndex];
      
      if (!question) {
        console.error('[AssessmentQuestions] Question not found at index:', this.currentQuestionIndex);
        return;
      }
      
      // Update question info
      this.questionNumber.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
      this.traitLabel.textContent = question.trait_name;
      this.facetLabel.textContent = question.facet_name;
      this.questionText.textContent = question.question_text;
      
      // Update progress
      this.updateProgress();
      
      // Update section indicators
      this.updateSectionIndicators(question.trait_id);
      
      // Load saved answer if exists
      const savedAnswer = this.answers[question.question_id];
      if (savedAnswer) {
        const radio = this.answerOptions.querySelector(`input[value="${savedAnswer}"]`);
        if (radio) {
          radio.checked = true;
        }
      } else {
        // Clear all radio buttons
        const radios = this.answerOptions.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
      }
      
      // Update button states
      this.updateButtonStates();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * Update progress bar and text
     */
    updateProgress() {
      const answeredCount = Object.keys(this.answers).length;
      const totalQuestions = this.questions.length;
      const percentage = Math.round((answeredCount / totalQuestions) * 100);
      
      this.progressFill.style.width = `${percentage}%`;
      this.progressText.textContent = `${answeredCount} of ${totalQuestions} (${percentage}%)`;
    }
    
    /**
     * Update section indicators
     */
    updateSectionIndicators(currentTraitId) {
      const indicators = this.sectionIndicators.querySelectorAll('.indicator');
      indicators.forEach(indicator => {
        const traitId = indicator.getAttribute('data-trait');
        if (traitId === currentTraitId) {
          indicator.classList.add('active');
          indicator.textContent = '●';
        } else {
          indicator.classList.remove('active');
          indicator.textContent = '○';
        }
      });
    }
    
    /**
     * Handle answer selection
     */
    handleAnswerSelect() {
      const selectedRadio = this.answerOptions.querySelector('input[type="radio"]:checked');
      
      if (selectedRadio) {
        const question = this.questions[this.currentQuestionIndex];
        const answer = parseInt(selectedRadio.value);
        
        // Save answer
        this.answers[question.question_id] = answer;
        
        // Enable next button
        this.nextBtn.disabled = false;
        
        // Update progress
        this.updateProgress();
        
        console.log(`[AssessmentQuestions] Answer saved: ${question.question_id} = ${answer}`);
      }
    }
    
    /**
     * Go to previous question
     */
    goToPrevious() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.renderQuestion();
      }
    }
    
    /**
     * Go to next question
     */
    goToNext() {
      // Save progress if needed
      if ((this.currentQuestionIndex + 1) % this.autoSaveInterval === 0) {
        this.saveProgress();
        this.showAutoSaveIndicator();
      }
      
      // Check if this is the last question
      if (this.currentQuestionIndex === this.questions.length - 1) {
        this.completeAssessment();
      } else {
        this.currentQuestionIndex++;
        this.renderQuestion();
      }
    }
    
    /**
     * Update button states
     */
    updateButtonStates() {
      // Previous button
      this.prevBtn.disabled = this.currentQuestionIndex === 0;
      
      // Next button
      const question = this.questions[this.currentQuestionIndex];
      const hasAnswer = this.answers[question.question_id] !== undefined;
      this.nextBtn.disabled = !hasAnswer;
      
      // Update next button text for last question
      if (this.currentQuestionIndex === this.questions.length - 1) {
        this.nextBtn.innerHTML = 'Complete Assessment <i class="fas fa-check"></i>';
      } else {
        this.nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
      }
    }
    
    /**
     * Save progress to localStorage
     */
    saveProgress() {
      const progress = {
        sessionId: this.sessionId,
        startTime: this.startTime,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        timestamp: new Date().toISOString()
      };
      
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
        console.log('[AssessmentQuestions] Progress saved');
      } catch (error) {
        console.error('[AssessmentQuestions] Error saving progress:', error);
      }
    }
    
    /**
     * Load progress from localStorage
     */
    loadProgress() {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          return JSON.parse(data);
        }
      } catch (error) {
        console.error('[AssessmentQuestions] Error loading progress:', error);
      }
      return null;
    }
    
    /**
     * Clear saved progress
     */
    clearProgress() {
      try {
        localStorage.removeItem(this.storageKey);
        console.log('[AssessmentQuestions] Progress cleared');
      } catch (error) {
        console.error('[AssessmentQuestions] Error clearing progress:', error);
      }
    }
    
    /**
     * Show auto-save indicator
     */
    showAutoSaveIndicator() {
      const textElement = this.autosaveIndicator.querySelector('.autosave-text');
      textElement.textContent = 'Progress saved ✓';
      textElement.classList.add('show');
      
      setTimeout(() => {
        textElement.classList.remove('show');
      }, 2000);
    }
    
    /**
     * Show resume modal
     */
    showResumeModal(savedProgress) {
      const answeredCount = Object.keys(savedProgress.answers || {}).length;
      document.getElementById('resumeQuestionCount').textContent = answeredCount;
      this.resumeModal.style.display = 'flex';
    }
    
    /**
     * Hide resume modal
     */
    hideResumeModal() {
      this.resumeModal.style.display = 'none';
    }
    
    /**
     * Show loading overlay
     */
    showLoading() {
      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = 'flex';
      }
    }
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = 'none';
      }
    }
    
    /**
     * Complete assessment
     */
    completeAssessment() {
      console.log('[AssessmentQuestions] Assessment completed!');
      
      // Save final progress
      this.saveProgress();
      
      // Show loading
      this.showLoading();
      
      // In real implementation, would submit to backend
      // For now, just redirect to processing page
      setTimeout(() => {
        window.location.href = 'assessment-processing.html';
      }, 1000);
    }
    
    /**
     * Generate a unique session ID
     */
    generateSessionId() {
      const timestamp = Date.now();
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);
        const randomString = Array.from(randomBytes)
          .map(b => b.toString(36))
          .join('')
          .substring(0, 9);
        return `assessment_questions_${timestamp}_${randomString}`;
      }
      return `assessment_questions_${timestamp}_${Math.random().toString(36).substring(2, 11)}`;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const assessmentQuestions = new AssessmentQuestions();
      assessmentQuestions.init();
    });
  } else {
    const assessmentQuestions = new AssessmentQuestions();
    assessmentQuestions.init();
  }
  
  console.log('[AssessmentQuestions] Module loaded successfully');
  
})(window);
