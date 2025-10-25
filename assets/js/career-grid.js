/**
 * PMERIT Career Grid Component
 * Version: 1.0
 * Phase: 3.2
 * 
 * Reusable component for displaying career paths and educational tracks
 * with tabbed filtering and keyboard navigation
 */

class CareerGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`CareerGrid: Container #${containerId} not found`);
      return;
    }

    this.options = {
      dataUrl: options.dataUrl || '/assets/data/career_showcase.json',
      i18nUrl: options.i18nUrl || '/assets/i18n/en.json',
      showBadge: options.showBadge !== false,
      showCTAs: options.showCTAs !== false,
      ...options
    };

    this.data = null;
    this.i18n = null;
    this.currentTab = 'global_remote_tracks';
    this.tabs = [];
    
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      await this.loadI18n();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('CareerGrid initialization error:', error);
      this.renderError();
    }
  }

  async loadData() {
    try {
      const response = await fetch(this.options.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading career data:', error);
      throw error;
    }
  }

  async loadI18n() {
    try {
      const response = await fetch(this.options.i18nUrl);
      if (!response.ok) {
        // Fallback to default strings if i18n file not found
        this.i18n = this.getDefaultStrings();
        return;
      }
      const data = await response.json();
      this.i18n = data.career || this.getDefaultStrings();
    } catch (error) {
      console.warn('Error loading i18n, using defaults:', error);
      this.i18n = this.getDefaultStrings();
    }
  }

  getDefaultStrings() {
    return {
      section_title: 'Career Track & Explore Paths',
      section_description: 'Discover your path to success with PMERIT\'s diverse learning opportunities',
      showcase_badge: 'Showcase (demo)',
      tab_global: 'Global Remote Tracks',
      tab_education: 'Local Education (Nursery–College)',
      tab_pathways: 'Local Career Pathways',
      learn_more: 'Learn More',
      cta_discover: 'Discover Your Path',
      cta_signin: 'Sign In to Start Learning',
      cta_courses: 'See All Courses',
      no_items: 'No items available at this time.',
      loading: 'Loading career paths...'
    };
  }

  render() {
    if (!this.data) {
      this.renderLoading();
      return;
    }

    const html = `
      <div class="career-grid-header">
        <h2 class="career-grid-title">${this.i18n.section_title}</h2>
        <p class="career-grid-description">${this.i18n.section_description}</p>
        ${this.options.showBadge ? `<span class="career-showcase-badge">${this.i18n.showcase_badge}</span>` : ''}
      </div>

      <div class="career-tabs" role="tablist" aria-label="Career path categories">
        <button 
          class="career-tab" 
          role="tab" 
          aria-selected="true" 
          aria-controls="panel-global_remote_tracks"
          id="tab-global_remote_tracks"
          data-tab="global_remote_tracks"
        >
          ${this.i18n.tab_global}
        </button>
        <button 
          class="career-tab" 
          role="tab" 
          aria-selected="false" 
          aria-controls="panel-local_education"
          id="tab-local_education"
          data-tab="local_education"
        >
          ${this.i18n.tab_education}
        </button>
        <button 
          class="career-tab" 
          role="tab" 
          aria-selected="false" 
          aria-controls="panel-local_career_pathways"
          id="tab-local_career_pathways"
          data-tab="local_career_pathways"
        >
          ${this.i18n.tab_pathways}
        </button>
      </div>

      <div class="career-cards-container">
        <div class="career-cards-grid" role="tabpanel" id="panel-${this.currentTab}" aria-labelledby="tab-${this.currentTab}">
          ${this.renderCards(this.currentTab)}
        </div>
      </div>

      ${this.options.showCTAs ? this.renderCTAs() : ''}
    `;

    this.container.innerHTML = html;
  }

  renderCards(tabKey) {
    const items = this.data[tabKey] || [];
    
    if (items.length === 0) {
      return `<div class="career-no-items">${this.i18n.no_items}</div>`;
    }

    return items.map(item => this.renderCard(item)).join('');
  }

  renderCard(item) {
    const iconHtml = item.icon ? `<i class="fas fa-${item.icon}" aria-hidden="true"></i>` : '';
    
    return `
      <article class="career-card" data-card-id="${item.id}">
        <div class="career-card-header">
          <div class="career-card-icon">
            ${iconHtml}
          </div>
        </div>
        <h3 class="career-card-title">${this.escapeHtml(item.title)}</h3>
        <p class="career-card-blurb">${this.escapeHtml(item.blurb)}</p>
        <div class="career-card-footer">
          <span class="career-card-tag">${this.escapeHtml(item.level_tag)}</span>
          <a 
            href="${this.escapeHtml(item.href)}" 
            class="career-card-link"
            aria-label="${this.i18n.learn_more} about ${this.escapeHtml(item.title)}"
          >
            ${this.i18n.learn_more}
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </article>
    `;
  }

  renderCTAs() {
    return `
      <div class="career-cta-section">
        <div class="career-cta-buttons">
          <a href="/assessment.html" class="career-cta-btn career-cta-btn-primary" data-cta="discover">
            <i class="fas fa-compass" aria-hidden="true"></i>
            ${this.i18n.cta_discover}
          </a>
          <a href="/courses.html" class="career-cta-btn career-cta-btn-secondary" data-cta="see_all_courses">
            <i class="fas fa-book" aria-hidden="true"></i>
            ${this.i18n.cta_courses}
          </a>
          <a href="/signin.html" class="career-cta-btn career-cta-btn-secondary" data-cta="signin">
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
            ${this.i18n.cta_signin}
          </a>
        </div>
      </div>
    `;
  }

  renderLoading() {
    this.container.innerHTML = `<div class="career-loading">${this.i18n?.loading || 'Loading...'}</div>`;
  }

  renderError() {
    this.container.innerHTML = `<div class="career-error">Failed to load career paths. Please try again later.</div>`;
  }

  attachEventListeners() {
    // Tab switching
    this.tabs = this.container.querySelectorAll('.career-tab');
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e));
    });

    // Keyboard navigation for tabs
    this.container.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

    // Card link clicks for analytics
    const cardLinks = this.container.querySelectorAll('.career-card-link');
    cardLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleCardClick(e));
    });

    // CTA button clicks for analytics
    const ctaButtons = this.container.querySelectorAll('.career-cta-btn');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleCTAClick(e));
    });
  }

  handleTabClick(event) {
    const tab = event.currentTarget;
    const tabKey = tab.dataset.tab;

    if (tabKey === this.currentTab) return;

    // Update tab states
    this.tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
    });
    tab.setAttribute('aria-selected', 'true');

    // Update current tab
    this.currentTab = tabKey;

    // Re-render cards
    const cardsContainer = this.container.querySelector('.career-cards-grid');
    cardsContainer.innerHTML = this.renderCards(tabKey);
    cardsContainer.id = `panel-${tabKey}`;
    cardsContainer.setAttribute('aria-labelledby', `tab-${tabKey}`);

    // Re-attach card link listeners
    const cardLinks = cardsContainer.querySelectorAll('.career-card-link');
    cardLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleCardClick(e));
    });

    // Analytics event
    this.trackEvent('career_tab_select', tabKey);
  }

  handleKeyboardNav(event) {
    const currentTab = event.target;
    if (!currentTab.classList.contains('career-tab')) return;

    const tabsArray = Array.from(this.tabs);
    const currentIndex = tabsArray.indexOf(currentTab);

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = tabsArray.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= tabsArray.length) newIndex = 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabsArray.length - 1;
        break;
      default:
        return;
    }

    tabsArray[newIndex].focus();
    tabsArray[newIndex].click();
  }

  handleCardClick(event) {
    const card = event.currentTarget.closest('.career-card');
    const cardId = card?.dataset.cardId;
    
    if (cardId) {
      this.trackEvent('career_card_click', cardId);
    }
  }

  handleCTAClick(event) {
    const cta = event.currentTarget.dataset.cta;
    
    if (cta) {
      this.trackEvent('career_cta_click', cta);
    }
  }

  trackEvent(eventName, value) {
    // Log to console for now (Phase 3.2)
    // Ready to be swapped with real analytics later
    console.log(`📊 Analytics: ${eventName}:${value}`);
    
    // Dispatch custom event for potential analytics listeners
    window.dispatchEvent(new CustomEvent('pmerit-analytics', {
      detail: {
        event: eventName,
        value: value,
        timestamp: new Date().toISOString()
      }
    }));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInitContainers = document.querySelectorAll('[data-career-grid]');
  autoInitContainers.forEach(container => {
    const options = {
      dataUrl: container.dataset.dataUrl,
      i18nUrl: container.dataset.i18nUrl,
      showBadge: container.dataset.showBadge !== 'false',
      showCTAs: container.dataset.showCtas !== 'false'
    };
    new CareerGrid(container.id, options);
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CareerGrid;
}

// Make available globally
window.CareerGrid = CareerGrid;
