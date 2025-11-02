/**
 * PMERIT Assessment Entry Page Module
 * Version: 1.0
 * Last Updated: November 2024
 *
 * Purpose: Handle consent validation, saved progress checking, and assessment initialization
 *
 * Features:
 * - Consent checkbox validation
 * - Enable/disable "Begin Assessment" button based on consent state
 * - Check for and display saved assessment progress
 * - Resume or restart assessment functionality
 * - Form submission handling with API integration
 * - Analytics event tracking
 */

(function () {
  'use strict';

  // DOM Elements - initialized in init() function after DOM is ready
  let consentForm;
  let consent1;
  let consent2;
  let beginBtn;
  let loadingOverlay;
  let resumeCard;
  let resumeBtn;
  let startFreshBtn;

  /**
   * Check if there is saved assessment progress in localStorage
   * @returns {boolean} - True if valid saved progress exists, false otherwise
   */
  function checkSavedProgress() {
    const savedProgress = localStorage.getItem('pmerit-assessment-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.currentStep && progress.currentStep > 1) {
          if (resumeCard) {
            resumeCard.classList.add('active');
          }
          return true;
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
    return false;
  }

  /**
   * Update the state of the "Begin Assessment" button based on consent checkboxes
   * Button is enabled only when both required consents are checked
   */
  function updateButtonState() {
    const allChecked = consent1.checked && consent2.checked;
    beginBtn.disabled = !allChecked;
  }

  /**
   * Handle resume assessment button click
   * Reads saved progress from localStorage and navigates to assessment page with resume parameters
   */
  function handleResumeAssessment() {
    const savedProgressStr = localStorage.getItem('pmerit-assessment-progress');
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr);
        if (savedProgress && savedProgress.currentStep) {
          // Validate step number to prevent XSS
          const stepNumber = parseInt(savedProgress.currentStep, 10);
          if (!isNaN(stepNumber) && stepNumber > 0) {
            // Navigate to assessment page with resume parameter
            window.location.href = `assessment.html?resume=true&step=${stepNumber}`;
          }
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
  }

  /**
   * Handle start fresh button click
   * Prompts user for confirmation and clears saved progress if confirmed
   */
  function handleStartFresh() {
    // Simple confirmation - in production, consider using a custom modal
    const userConfirmed = confirm('Are you sure you want to start fresh? Your previous progress will be lost.');
    if (userConfirmed) {
      localStorage.removeItem('pmerit-assessment-progress');
      if (resumeCard) {
        resumeCard.classList.remove('active');
      }
    }
  }

  /**
   * Handle consent form submission
   * Validates consents, saves consent data, calls API, and navigates to assessment
   * @param {Event} e - Form submit event
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate required consents
    if (!consent1.checked || !consent2.checked) {
      // Simple alert - in production, consider using inline error messages
      alert('Please accept all required consents to continue.');
      return;
    }

    // Show loading overlay
    loadingOverlay.classList.add('active');
    beginBtn.disabled = true;

    try {
      // Collect consent data
      const marketingCheckbox = document.getElementById('marketing');
      const consentData = {
        privacyPolicy: consent1.checked,
        dataProcessing: consent2.checked,
        marketing: marketingCheckbox ? marketingCheckbox.checked : false,
        timestamp: new Date().toISOString()
      };

      // Save consent to localStorage
      localStorage.setItem('pmerit-assessment-consent', JSON.stringify(consentData));

      // Call assessment API to start assessment
      if (window.AssessmentAPI && typeof window.AssessmentAPI.startAssessment === 'function') {
        const result = await window.AssessmentAPI.startAssessment(consentData);

        if (result.success) {
          // Navigate to assessment page
          window.location.href = 'assessment.html';
        } else {
          throw new Error(result.error || 'Failed to start assessment');
        }
      } else {
        // Fallback: Direct navigation if API not available
        console.warn('Assessment API not loaded, using fallback navigation');

        // Simulate a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigate to assessment page
        window.location.href = 'assessment.html';
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      // Simple alert - in production, consider using toast notifications or inline errors
      alert('An error occurred while starting the assessment. Please try again.');
      loadingOverlay.classList.remove('active');
      beginBtn.disabled = false;
    }
  }

  /**
   * Dispatch analytics event for page view tracking
   */
  function trackPageView() {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: {
          event: 'assessment_entry_page_view',
          page: 'assessment-entry'
        }
      }));
    }
  }

  /**
   * Initialize the assessment entry page
   * Sets up event listeners and checks for saved progress
   */
  function init() {
    // Initialize DOM elements
    consentForm = document.getElementById('consent-form');
    consent1 = document.getElementById('consent1');
    consent2 = document.getElementById('consent2');
    beginBtn = document.getElementById('begin-assessment-btn');
    loadingOverlay = document.getElementById('loading-overlay');
    resumeCard = document.getElementById('resume-card');
    resumeBtn = document.getElementById('resume-btn');
    startFreshBtn = document.getElementById('start-fresh-btn');

    // Verify required elements exist
    if (!consentForm || !consent1 || !consent2 || !beginBtn) {
      console.error('Required DOM elements not found');
      return;
    }

    // Event listeners for consent checkboxes
    consent1.addEventListener('change', updateButtonState);
    consent2.addEventListener('change', updateButtonState);

    // Resume assessment handler (if elements exist)
    if (resumeBtn) {
      resumeBtn.addEventListener('click', handleResumeAssessment);
    }

    // Start fresh handler (if element exists)
    if (startFreshBtn) {
      startFreshBtn.addEventListener('click', handleStartFresh);
    }

    // Form submission handler
    consentForm.addEventListener('submit', handleFormSubmit);

    // Check for saved progress on page load
    checkSavedProgress();

    // Track page view
    trackPageView();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
