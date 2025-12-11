/**
 * Assessment Results Module
 *
 * Loads and displays Big Five personality assessment results,
 * including radar chart visualization and career recommendations.
 *
 * @module assessment-results
 * @requires Chart.js (for radar chart)
 * @requires jsPDF (for PDF export)
 * @requires assessment-api.js (for API calls)
 */

/* global Chart */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    API_BASE: '/api/v1',
    SHARE_BASE_URL: 'https://pmerit-ai-platform.pages.dev/assessment-results.html',
    CHART_COLORS: {
      primary: 'rgba(42, 91, 140, 0.2)',
      border: 'rgba(42, 91, 140, 1)',
      point: 'rgba(42, 91, 140, 1)'
    },
    NARRATIVE_PATHS: {
      personality: '/assets/data/personality-narratives.json',
      holland: '/assets/data/holland-narratives.json'
    }
  };

  // State
  let assessmentData = null;
  let bigFiveChart = null;
  let personalityNarratives = null;
  let hollandNarratives = null;

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);

  /**
   * Initialize the results page
   */
  async function init() {
    try {
      showLoadingState();

      // Load narrative data and assessment data in parallel
      const [narrativesLoaded, assessmentLoaded] = await Promise.all([
        loadNarrativeData(),
        loadAssessmentData()
      ]);

      assessmentData = assessmentLoaded;

      if (!assessmentData) {
        showErrorState('No assessment data found');
        return;
      }

      // Render all components with enhanced narratives
      renderBigFiveChart(assessmentData.big_five);
      renderTraitCards(assessmentData.big_five);
      renderHollandCode(assessmentData.holland_code);
      renderCareerMatches(assessmentData.career_matches);

      // Setup event listeners
      setupEventListeners();

      // Hide loading state
      hideLoadingState();

      // Track analytics
      trackResultsView(assessmentData.assessment_id);

    } catch (error) {
      console.error('Failed to initialize results page:', error);
      showErrorState('Failed to load results');
    }
  }

  /**
   * Load narrative JSON files for enhanced descriptions
   * @returns {Promise<boolean>} Success status
   */
  async function loadNarrativeData() {
    try {
      const [personalityRes, hollandRes] = await Promise.all([
        fetch(CONFIG.NARRATIVE_PATHS.personality),
        fetch(CONFIG.NARRATIVE_PATHS.holland)
      ]);

      if (personalityRes.ok) {
        personalityNarratives = await personalityRes.json();
      }
      if (hollandRes.ok) {
        hollandNarratives = await hollandRes.json();
      }

      return true;
    } catch (error) {
      console.warn('Could not load narrative data, using defaults:', error);
      return false;
    }
  }

  /**
   * Load assessment data from localStorage or API
   * @returns {Object|null} Assessment data
   */
  async function loadAssessmentData() {
    // Try URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');

    if (assessmentId) {
      return await loadFromAPI(assessmentId);
    }

    // Fallback to localStorage
    return loadFromLocalStorage();
  }

  /**
   * Load from API endpoint
   * @param {string} assessmentId - UUID of assessment
   * @returns {Object|null} Assessment data
   */
  async function loadFromAPI(assessmentId) {
    try {
      const response = await fetch(`${CONFIG.API_BASE}/assessment/results/${assessmentId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache to localStorage for offline access
      if (data.success && data.result) {
        localStorage.setItem('pmerit_assessment_results', JSON.stringify(data.result));
        return data.result;
      }

      return null;
    } catch (error) {
      console.error('Failed to load from API:', error);
      // Fallback to localStorage
      return loadFromLocalStorage();
    }
  }

  /**
   * Load from localStorage
   * @returns {Object|null} Assessment data
   */
  function loadFromLocalStorage() {
    const cached = localStorage.getItem('pmerit_assessment_results');
    if (cached) {
      return JSON.parse(cached);
    }

    // Return mock data for development/demo
    return getMockData();
  }

  /**
   * Get mock assessment data for development
   * @returns {Object} Mock assessment data
   */
  function getMockData() {
    return {
      assessment_id: `demo-${ Date.now()}`,
      big_five: {
        O: { score: 82, percentile: 85, level: 'high' },
        C: { score: 75, percentile: 78, level: 'high' },
        E: { score: 45, percentile: 48, level: 'moderate' },
        A: { score: 68, percentile: 65, level: 'high' },
        N: { score: 35, percentile: 32, level: 'low' }
      },
      holland_code: {
        code: 'ISA',
        full_name: 'Investigative, Social, Artistic'
      },
      career_matches: [
        {
          title: 'Software Developer',
          fit_score: 95,
          description: 'Designs, develops, and maintains software applications and systems. Requires strong problem-solving skills and attention to detail.',
          salary_median: 110000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Much faster than average growth',
          onet_code: '15-1252.00'
        },
        {
          title: 'Data Scientist',
          fit_score: 92,
          description: 'Analyzes complex data to inform business decisions. Combines statistics, programming, and domain expertise.',
          salary_median: 100000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Much faster than average growth',
          onet_code: '15-2051.00'
        },
        {
          title: 'UX Designer',
          fit_score: 89,
          description: 'Creates user-centered designs for digital products. Combines creativity with analytical thinking.',
          salary_median: 85000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Faster than average growth',
          onet_code: '15-1255.00'
        },
        {
          title: 'Technical Writer',
          fit_score: 85,
          description: 'Creates technical documentation and user guides. Requires strong writing skills and technical understanding.',
          salary_median: 74000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Average growth',
          onet_code: '27-3042.00'
        },
        {
          title: 'Systems Analyst',
          fit_score: 83,
          description: 'Analyzes and designs information systems. Bridges business needs with technical solutions.',
          salary_median: 93000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Faster than average growth',
          onet_code: '15-1121.00'
        },
        {
          title: 'Research Scientist',
          fit_score: 81,
          description: 'Conducts scientific research to advance knowledge. Requires analytical thinking and methodical approach.',
          salary_median: 82000,
          education_required: 'Master\'s degree',
          growth_outlook: 'Average growth',
          onet_code: '19-1029.00'
        },
        {
          title: 'Graphic Designer',
          fit_score: 79,
          description: 'Creates visual concepts to communicate ideas. Combines artistic ability with technical skills.',
          salary_median: 53000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Average growth',
          onet_code: '27-1024.00'
        },
        {
          title: 'Product Manager',
          fit_score: 77,
          description: 'Oversees product development from conception to launch. Requires strategic thinking and collaboration.',
          salary_median: 115000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Faster than average growth',
          onet_code: '11-3021.00'
        },
        {
          title: 'School Counselor',
          fit_score: 75,
          description: 'Provides academic and personal counseling to students. Requires empathy and strong interpersonal skills.',
          salary_median: 58000,
          education_required: 'Master\'s degree',
          growth_outlook: 'Average growth',
          onet_code: '21-1012.00'
        },
        {
          title: 'Market Research Analyst',
          fit_score: 73,
          description: 'Studies market conditions to examine potential sales. Combines analytical skills with business acumen.',
          salary_median: 63000,
          education_required: 'Bachelor\'s degree',
          growth_outlook: 'Faster than average growth',
          onet_code: '13-1161.00'
        }
      ]
    };
  }

  /**
   * Render Big Five radar chart using Chart.js
   * @param {Object} bigFive - Big Five scores object
   */
  function renderBigFiveChart(bigFive) {
    const ctx = document.getElementById('bigFiveChart');
    if (!ctx || !window.Chart) {
      console.error('Chart.js not loaded or canvas element not found');
      return;
    }

    // Destroy existing chart if present
    if (bigFiveChart) {
      bigFiveChart.destroy();
    }

    // Note: Neuroticism is inverted for display
    // High N score = Low Emotional Stability
    // So we display (100 - N) for better UX
    const emotionalStability = 100 - bigFive.N.score;

    bigFiveChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Openness',
          'Conscientiousness',
          'Extraversion',
          'Agreeableness',
          'Emotional Stability'
        ],
        datasets: [{
          label: 'Your Scores',
          data: [
            bigFive.O.score,
            bigFive.C.score,
            bigFive.E.score,
            bigFive.A.score,
            emotionalStability
          ],
          backgroundColor: CONFIG.CHART_COLORS.primary,
          borderColor: CONFIG.CHART_COLORS.border,
          borderWidth: 2,
          pointBackgroundColor: CONFIG.CHART_COLORS.point,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: CONFIG.CHART_COLORS.border,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              callback: function (value) {
                return `${value }%`;
              }
            },
            pointLabels: {
              font: {
                size: 14,
                family: 'Inter, sans-serif'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed.r}% (${getPercentile(context.label, context.parsed.r)}th percentile)`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get percentile for a given score
   * @param {string} trait - Trait name
   * @param {number} score - Score value
   * @returns {number} Percentile
   */
  function getPercentile(trait, score) {
    // Simplified percentile calculation
    // In production, use actual normative data
    const traitMap = {
      'Openness': 'O',
      'Conscientiousness': 'C',
      'Extraversion': 'E',
      'Agreeableness': 'A',
      'Emotional Stability': 'N'
    };

    const traitKey = traitMap[trait];
    if (traitKey && assessmentData.big_five[traitKey]) {
      return assessmentData.big_five[traitKey].percentile || Math.round(score * 0.95);
    }
    return Math.round(score * 0.95);
  }

  /**
   * Render Big Five trait cards with scores and enhanced narratives
   * @param {Object} bigFive - Big Five scores object
   */
  function renderTraitCards(bigFive) {
    const traits = ['O', 'C', 'E', 'A', 'N'];

    // Mapping from trait codes to narrative keys
    const traitToNarrativeKey = {
      O: 'openness',
      C: 'conscientiousness',
      E: 'extraversion',
      A: 'agreeableness',
      N: 'emotionalStability'
    };

    // Default descriptions (fallback if JSON not loaded)
    const defaultDescriptions = {
      O: {
        high: 'You are imaginative, creative, and appreciate art and novel experiences.',
        moderate: 'You balance practical thinking with openness to new ideas.',
        low: 'You prefer familiar routines and conventional approaches.'
      },
      C: {
        high: 'You are organized, reliable, and persistent in achieving goals.',
        moderate: 'You balance structure with flexibility in your approach.',
        low: 'You prefer spontaneity and adapt easily to changing situations.'
      },
      E: {
        high: 'You are outgoing, energetic, and thrive in social situations.',
        moderate: 'You balance social interaction with time alone, adapting as needed.',
        low: 'You prefer quiet environments and recharge through solitude.'
      },
      A: {
        high: 'You are compassionate, cooperative, and value harmony in relationships.',
        moderate: 'You balance empathy with assertiveness when needed.',
        low: 'You are direct, skeptical, and prioritize efficiency over harmony.'
      },
      N: {
        high: 'You are calm, emotionally stable, and resilient under stress.',
        moderate: 'You experience typical emotional responses to life events.',
        low: 'You are sensitive, emotionally reactive, and cautious.'
      }
    };

    traits.forEach((trait) => {
      const data = bigFive[trait];
      let score = data.score;
      let percentile = data.percentile;

      // Invert Neuroticism for display
      if (trait === 'N') {
        score = 100 - score;
        percentile = 100 - percentile;
      }

      const level = getTraitLevel(score);

      // Get enhanced narrative from JSON or use default
      const narrativeData = getEnhancedNarrative(trait, level, traitToNarrativeKey, defaultDescriptions);

      // Update DOM elements
      const scoreEl = document.getElementById(`score${trait}`);
      const percentileEl = document.getElementById(`percentile${trait}`);
      const levelEl = document.getElementById(`level${trait}`);
      const descEl = document.getElementById(`desc${trait}`);
      const strengthsEl = document.getElementById(`strengths${trait}`);
      const growthEl = document.getElementById(`growth${trait}`);
      const careerFitEl = document.getElementById(`careerFit${trait}`);

      if (scoreEl) {
        scoreEl.textContent = Math.round(score);
      }
      if (percentileEl) {
        percentileEl.textContent = `${Math.round(percentile)}th percentile`;
      }
      if (levelEl) {
        levelEl.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        levelEl.className = `trait-level ${level}`;
      }
      if (descEl) {
        descEl.textContent = narrativeData.narrative;
      }

      // Render enhanced sections if elements exist
      if (strengthsEl && narrativeData.strengths) {
        strengthsEl.innerHTML = narrativeData.strengths.map(s => `<span class="tag tag-strength">${s}</span>`).join('');
      }
      if (growthEl && narrativeData.growthAreas) {
        growthEl.innerHTML = narrativeData.growthAreas.map(g => `<span class="tag tag-growth">${g}</span>`).join('');
      }
      if (careerFitEl && narrativeData.careerFit) {
        careerFitEl.textContent = narrativeData.careerFit;
      }
    });
  }

  /**
   * Get enhanced narrative from JSON data or fallback to default
   * @param {string} trait - Trait code (O, C, E, A, N)
   * @param {string} level - Level (high, moderate, low)
   * @param {Object} traitToNarrativeKey - Mapping object
   * @param {Object} defaultDescriptions - Fallback descriptions
   * @returns {Object} Narrative data with narrative, strengths, growthAreas, careerFit
   */
  function getEnhancedNarrative(trait, level, traitToNarrativeKey, defaultDescriptions) {
    const narrativeKey = traitToNarrativeKey[trait];

    // Try to get from loaded JSON
    if (personalityNarratives && personalityNarratives[narrativeKey] && personalityNarratives[narrativeKey][level]) {
      const data = personalityNarratives[narrativeKey][level];
      return {
        narrative: data.narrative,
        strengths: data.strengths || [],
        growthAreas: data.growthAreas || [],
        careerFit: data.careerFit || ''
      };
    }

    // Fallback to default
    return {
      narrative: defaultDescriptions[trait][level],
      strengths: [],
      growthAreas: [],
      careerFit: ''
    };
  }

  /**
   * Determine trait level from score
   * @param {number} score - Score value (0-100)
   * @returns {string} Level ('low', 'moderate', 'high')
   */
  function getTraitLevel(score) {
    if (score <= 40) {
      return 'low';
    }
    if (score <= 60) {
      return 'moderate';
    }
    return 'high';
  }

  /**
   * Render Holland Code (RIASEC) with enhanced narratives
   * @param {Object} hollandCode - Holland code object
   */
  function renderHollandCode(hollandCode) {
    const codeLetters = hollandCode.code.split('');

    // Update code letters with tooltips
    codeLetters.forEach((letter, index) => {
      const element = document.getElementById(`hollandCode${index + 1}`);
      if (element) {
        element.textContent = letter;

        // Add tooltip with code description from narratives
        if (hollandNarratives && hollandNarratives.codes && hollandNarratives.codes[letter]) {
          const codeData = hollandNarratives.codes[letter];
          element.title = `${codeData.name}: ${codeData.shortDescription}`;
        }
      }
    });

    // Update description - use enhanced narrative if available
    const descElement = document.getElementById('hollandDescription');
    if (descElement) {
      const enhancedDesc = getHollandEnhancedDescription(hollandCode.code, codeLetters);
      descElement.textContent = enhancedDesc || hollandCode.full_name;
    }

    // Render Holland narrative section if element exists
    const hollandNarrativeEl = document.getElementById('hollandNarrative');
    if (hollandNarrativeEl) {
      const narrative = getHollandCombinationNarrative(hollandCode.code);
      if (narrative) {
        hollandNarrativeEl.innerHTML = `<p class="holland-narrative-text">${narrative}</p>`;
      }
    }

    // Render suggested careers from Holland code if element exists
    const hollandCareersEl = document.getElementById('hollandSuggestedCareers');
    if (hollandCareersEl) {
      const suggestedCareers = getHollandSuggestedCareers(hollandCode.code);
      if (suggestedCareers && suggestedCareers.length > 0) {
        hollandCareersEl.innerHTML = suggestedCareers.map(c => `<span class="tag tag-career">${c}</span>`).join('');
      }
    }

    // Update top traits list
    const topTraitsList = document.getElementById('topTraitsList');
    if (topTraitsList && assessmentData.big_five) {
      const topTraits = getTopTraits(assessmentData.big_five);
      topTraitsList.innerHTML = topTraits.map((trait) =>
        `<li><strong>${trait.name}:</strong> ${trait.description}</li>`
      ).join('');
    }
  }

  /**
   * Get enhanced Holland code description using narrative data
   * @param {string} code - Holland code (e.g., "ISA")
   * @param {Array} codeLetters - Array of code letters
   * @returns {string} Enhanced description
   */
  function getHollandEnhancedDescription(code, codeLetters) {
    if (!hollandNarratives || !hollandNarratives.codes) {
      return null;
    }

    // Build description from individual codes
    const descriptions = codeLetters.map(letter => {
      const codeData = hollandNarratives.codes[letter];
      return codeData ? `${codeData.name} (${codeData.shortDescription})` : letter;
    });

    return descriptions.join(', ');
  }

  /**
   * Get Holland combination narrative
   * @param {string} code - Holland code (e.g., "ISA")
   * @returns {string|null} Combination narrative
   */
  function getHollandCombinationNarrative(code) {
    if (!hollandNarratives || !hollandNarratives.combinations) {
      return null;
    }

    // Try exact match first
    if (hollandNarratives.combinations[code]) {
      return hollandNarratives.combinations[code].narrative;
    }

    // Try default
    if (hollandNarratives.combinations._default) {
      return hollandNarratives.combinations._default.narrative;
    }

    return null;
  }

  /**
   * Get suggested careers from Holland code combination
   * @param {string} code - Holland code (e.g., "ISA")
   * @returns {Array} Suggested careers
   */
  function getHollandSuggestedCareers(code) {
    if (!hollandNarratives || !hollandNarratives.combinations) {
      return [];
    }

    // Try exact match first
    if (hollandNarratives.combinations[code] && hollandNarratives.combinations[code].suggestedCareers) {
      return hollandNarratives.combinations[code].suggestedCareers;
    }

    // Fallback: get example careers from individual codes
    const careers = [];
    const codeLetters = code.split('');
    codeLetters.forEach(letter => {
      if (hollandNarratives.codes[letter] && hollandNarratives.codes[letter].exampleCareers) {
        careers.push(...hollandNarratives.codes[letter].exampleCareers.slice(0, 2));
      }
    });

    return [...new Set(careers)].slice(0, 6); // Remove duplicates, limit to 6
  }

  /**
   * Get top 3 personality traits
   * @param {Object} bigFive - Big Five scores
   * @returns {Array} Top 3 traits
   */
  function getTopTraits(bigFive) {
    const traits = [
      { key: 'O', name: 'High Openness', score: bigFive.O.score, desc: 'Creative and curious' },
      { key: 'C', name: 'High Conscientiousness', score: bigFive.C.score, desc: 'Organized and reliable' },
      { key: 'E', name: 'High Extraversion', score: bigFive.E.score, desc: 'Outgoing and energetic' },
      { key: 'A', name: 'High Agreeableness', score: bigFive.A.score, desc: 'Compassionate and cooperative' },
      { key: 'N', name: 'High Emotional Stability', score: 100 - bigFive.N.score, desc: 'Calm and resilient' }
    ];

    return traits
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((t) => ({ name: t.name, description: t.desc }));
  }

  /**
   * Render top 10 career matches
   * @param {Array} careerMatches - Array of career objects
   */
  function renderCareerMatches(careerMatches) {
    const careerList = document.getElementById('careerList');
    if (!careerList || !careerMatches || careerMatches.length === 0) {
      return;
    }

    careerList.innerHTML = ''; // Clear existing

    careerMatches.slice(0, 10).forEach((career, index) => {
      const rank = index + 1;
      const badge = getRankBadge(rank);

      const careerCard = document.createElement('div');
      careerCard.className = `career-card rank-${rank}`;
      careerCard.innerHTML = `
        <div class="career-rank">
          <span class="rank-number">#${rank}</span>
          <span class="rank-badge">${badge}</span>
        </div>

        <div class="career-content">
          <h3 class="career-title">${career.title}</h3>

          <div class="fit-score">
            <div class="score-bar">
              <div class="score-fill" style="width: ${career.fit_score}%"></div>
            </div>
            <span class="score-text">${career.fit_score}% Match</span>
          </div>

          <p class="career-description">
            ${career.description}
          </p>

          <div class="career-meta">
            <span class="meta-item">
              <i class="fas fa-dollar-sign"></i>
              ${formatSalary(career.salary_median)} median salary
            </span>
            <span class="meta-item">
              <i class="fas fa-graduation-cap"></i>
              ${career.education_required}
            </span>
            <span class="meta-item">
              <i class="fas fa-chart-line"></i>
              ${career.growth_outlook}
            </span>
          </div>

          <div class="career-actions">
            <button class="btn btn-sm btn-outline" data-career-id="${career.onet_code}" onclick="window.viewCareerDetails('${career.onet_code}')">
              View Full Details
            </button>
            <button class="btn btn-sm btn-primary" data-career-id="${career.onet_code}" onclick="window.explorePathway('${career.onet_code}')">
              Explore Pathway
            </button>
          </div>
        </div>
      `;

      careerList.appendChild(careerCard);
    });
  }

  /**
   * Get rank badge text
   * @param {number} rank - Career rank (1-10)
   * @returns {string} Badge text
   */
  function getRankBadge(rank) {
    if (rank === 1) {
      return 'Best Match';
    }
    if (rank <= 3) {
      return 'Great Match';
    }
    return 'Good Match';
  }

  /**
   * Format salary for display
   * @param {number} salary - Salary amount
   * @returns {string} Formatted salary
   */
  function formatSalary(salary) {
    return `$${ (salary / 1000).toFixed(0) }k`;
  }

  /**
   * Setup event listeners for action buttons
   */
  function setupEventListeners() {
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', handleSave);
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }

    // Export PDF button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', handleExportPDF);
    }

    // Close share modal
    const closeShareModal = document.getElementById('closeShareModal');
    if (closeShareModal) {
      closeShareModal.addEventListener('click', () => {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
          shareModal.style.display = 'none';
        }
      });
    }

    // Copy share link
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', handleCopyLink);
    }

    // Close modal on background click
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
      shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
          shareModal.style.display = 'none';
        }
      });
    }
  }

  /**
   * Handle save to profile
   */
  async function handleSave() {
    // Check if user is authenticated
    const token = localStorage.getItem('pmerit_auth_token');

    if (!token) {
      // Show login modal
      showSuccessMessage('Please sign in to save your results');
      // Redirect to signin page
      setTimeout(() => {
        window.location.href = `/signin.html?redirect=${ encodeURIComponent(window.location.href)}`;
      }, 1500);
      return;
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE}/assessment/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assessment_id: assessmentData.assessment_id
        })
      });

      if (response.ok) {
        showSuccessMessage('Results saved to your profile!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      showErrorMessage('Failed to save results. Please try again.');
    }
  }

  /**
   * Handle share functionality
   */
  function handleShare() {
    const shareModal = document.getElementById('shareModal');
    const shareLink = document.getElementById('shareLink');

    // Generate shareable link
    const link = `${CONFIG.SHARE_BASE_URL}?id=${assessmentData.assessment_id || 'demo'}`;
    if (shareLink) {
      shareLink.value = link;
    }

    // Show modal
    if (shareModal) {
      shareModal.style.display = 'flex';
    }
  }

  /**
   * Handle copy share link
   */
  function handleCopyLink() {
    const shareLink = document.getElementById('shareLink');
    if (!shareLink) {
      return;
    }

    shareLink.select();
    document.execCommand('copy');

    // Show feedback
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    }
  }

  /**
   * Handle PDF export
   */
  async function handleExportPDF() {
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        showErrorMessage('PDF export library not loaded. Please refresh the page and try again.');
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PMERIT Career Assessment Results', 20, 20);

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 28);

      // Big Five Scores
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Personality Profile', 20, 45);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const bigFive = assessmentData.big_five;
      let y = 55;

      Object.keys(bigFive).forEach((trait) => {
        const data = bigFive[trait];
        const traitName = getTraitName(trait);
        const score = trait === 'N' ? 100 - data.score : data.score;
        doc.text(`${traitName}: ${Math.round(score)}% (${data.percentile}th percentile)`, 20, y);
        y += 8;
      });

      // Holland Code
      y += 5;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Holland Code (RIASEC)', 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${assessmentData.holland_code.code} - ${assessmentData.holland_code.full_name}`, 20, y);

      // Career Matches
      y += 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Top Career Matches', 20, y);
      y += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      assessmentData.career_matches.slice(0, 10).forEach((career, index) => {
        if (y > 270) { // Page break
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${career.title}`, 20, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.text(`   Match: ${career.fit_score}% | Salary: ${formatSalary(career.salary_median)}`, 20, y);
        y += 6;
        doc.text(`   Education: ${career.education_required}`, 20, y);
        y += 10;
      });

      // Footer
      doc.setFontSize(8);
      doc.text('PMERIT - Personalized Career Guidance', 20, 290);
      doc.text('https://pmerit.com', 150, 290);

      // Save
      doc.save('pmerit-assessment-results.pdf');

      // Track analytics
      trackPDFExport(assessmentData.assessment_id);

    } catch (error) {
      console.error('PDF export failed:', error);
      showErrorMessage('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Get full trait name
   * @param {string} trait - Trait key (O, C, E, A, N)
   * @returns {string} Full name
   */
  function getTraitName(trait) {
    const names = {
      O: 'Openness',
      C: 'Conscientiousness',
      E: 'Extraversion',
      A: 'Agreeableness',
      N: 'Emotional Stability'
    };
    return names[trait] || trait;
  }

  /**
   * Show loading state
   */
  function showLoadingState() {
    // Show loading spinner or skeleton
    logger.debug('Loading results...');
  }

  /**
   * Hide loading state
   */
  function hideLoadingState() {
    // Hide loading UI
    logger.debug('Results loaded');
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  function showErrorState(message) {
    console.error(message);
    // Show error UI
    showErrorMessage(message);
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  function showSuccessMessage(message) {
    // Show toast or notification
    logger.debug('Success:', message);
    // In the future, implement a proper toast notification
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  function showErrorMessage(message) {
    // Show toast or notification
    console.error('Error:', message);
    // In the future, implement a proper toast notification
  }

  /**
   * Track results view (analytics)
   * @param {string} assessmentId - Assessment UUID
   */
  function trackResultsView(assessmentId) {
    // Send to analytics
    logger.debug('Results viewed:', assessmentId);
  }

  /**
   * Track PDF export (analytics)
   * @param {string} assessmentId - Assessment UUID
   */
  function trackPDFExport(assessmentId) {
    // Send to analytics
    logger.debug('PDF exported:', assessmentId);
  }

  // Export career action functions to window for onclick handlers
  window.viewCareerDetails = function (onetCode) {
    logger.debug('View career details:', onetCode);
    window.location.href = `/pathways.html?id=${onetCode}`;
  };

  window.explorePathway = function (onetCode) {
    logger.debug('Explore pathway:', onetCode);
    window.location.href = `/pathways.html?id=${onetCode}#pathway`;
  };

})();
