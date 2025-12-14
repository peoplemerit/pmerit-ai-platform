/**
 * PMERIT Voice Preview Modal
 * Allows users to preview and select TTS voices
 * Features: Voice preview, selection persistence, quota display
 *
 * Voice Tiers:
 * - Standard: AI-generated voice (MeloTTS via Cloudflare)
 * - Primo: Premium natural human voice (Piper TTS via RunPod)
 *
 * @version 2.0.0
 * @updated December 13, 2025 - Simplified to Standard + Primo voices
 */

class VoicePreviewModal {
  constructor() {
    this.modal = null;
    // Migrate old voice selections to new system
    const oldVoice = localStorage.getItem('tts_voice');
    const validVoices = ['standard-male', 'standard-female', 'standard-young', 'primo', 'primo-female'];
    if (oldVoice && !validVoices.includes(oldVoice)) {
      // Migrate from old voice IDs (alloy, echo, standard, etc.) to 'standard-male'
      localStorage.setItem('tts_voice', 'standard-male');
    }
    this.selectedVoice = localStorage.getItem('tts_voice') || 'standard-male';

    // Available voices - Free voices with variety + Premium options
    this.voices = [
      // FREE VOICES - Edge TTS (genuine variety)
      {
        id: 'standard-male',
        name: 'Standard Male',
        description: 'Clear male voice',
        icon: '🎤',
        tier: 'free',
        provider: 'edge-tts',
        badge: 'FREE'
      },
      {
        id: 'standard-female',
        name: 'Standard Female',
        description: 'Clear female voice',
        icon: '🎤',
        tier: 'free',
        provider: 'edge-tts',
        badge: 'FREE'
      },
      {
        id: 'standard-young',
        name: 'Young Voice',
        description: 'Friendly young voice (great for kids)',
        icon: '🧒',
        tier: 'free',
        provider: 'edge-tts',
        badge: 'FREE'
      },
      // PREMIUM VOICES - Piper TTS (subscription required)
      {
        id: 'primo',
        name: 'Primo Voice',
        description: 'Natural human voice with realistic speech',
        icon: '✨',
        tier: 'premium',
        provider: 'piper-tts',
        badge: 'PREMIUM',
        requiresSubscription: true
      },
      {
        id: 'primo-female',
        name: 'Primo Female',
        description: 'Natural female voice with realistic speech',
        icon: '✨',
        tier: 'premium',
        provider: 'piper-tts',
        badge: 'PREMIUM',
        requiresSubscription: true
      }
    ];

    // User subscription status (loaded from API/localStorage)
    this.userSubscription = {
      isPremium: false,
      tier: 'free'
    };
    
    // Sample text for voice preview
    this.sampleText = "Hello! I'm here to help you learn and grow. This is what my voice sounds like.";
    
    // Preview state
    this.isPlaying = false;
    this.currentPreviewVoice = null;
    
    logger.debug('[Voice Preview] Modal initialized with voice:', this.selectedVoice);
  }

  /**
   * Show the voice preview modal
   */
  show() {
    this.render();
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Update quota display
    this.updateQuota();
    
    logger.debug('[Voice Preview] Modal opened');
  }

  /**
   * Hide the voice preview modal
   */
  hide() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
      
      // Stop any playing preview
      if (this.isPlaying) {
        window.TTSClient.stop();
        this.isPlaying = false;
        this.currentPreviewVoice = null;
      }
      
      logger.debug('[Voice Preview] Modal closed');
    }
  }

  /**
   * Render the modal HTML
   */
  render() {
    // Create modal HTML
    const modalHTML = `
      <div class="voice-preview-modal" id="voicePreviewModal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h3>🎤 Select Your Voice</h3>
            <button class="close-btn" aria-label="Close modal">×</button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <p class="modal-intro">Choose the voice you'd like to hear when I respond. Click Preview to hear each voice.</p>

            <!-- Free Voices Section -->
            <div class="voice-section-header">Free Voices</div>
            <div class="voice-list">
              ${this.voices.filter(v => v.tier === 'free').map(voice => this.renderVoiceItem(voice)).join('')}
            </div>

            <!-- Premium Voices Section -->
            <div class="voice-section-header voice-section-premium">Premium Voices</div>
            <div class="voice-list">
              ${this.voices.filter(v => v.tier === 'premium').map(voice => this.renderVoiceItem(voice)).join('')}
            </div>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer">
            <div class="quota-info">
              <span class="quota-icon">📊</span>
              <span class="quota-text">Daily quota: <span id="quotaRemaining" class="quota-value">Loading...</span> characters remaining</span>
            </div>
            <p class="quota-note">Browser fallback available when quota is exceeded</p>
          </div>
        </div>
      </div>
    `;

    // Add to DOM or update existing
    if (!this.modal) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.modal = document.getElementById('voicePreviewModal');
      this.attachEventListeners();
    } else {
      this.modal.outerHTML = modalHTML;
      this.modal = document.getElementById('voicePreviewModal');
      this.attachEventListeners();
    }
  }

  /**
   * Render individual voice item
   * @param {Object} voice - Voice configuration
   * @returns {string} HTML string
   */
  renderVoiceItem(voice) {
    const isSelected = this.selectedVoice === voice.id;
    const isPreviewing = this.isPlaying && this.currentPreviewVoice === voice.id;
    const isPremium = voice.tier === 'premium';
    const isFree = voice.tier === 'free';
    const isLocked = isPremium && voice.requiresSubscription && !this.userSubscription.isPremium;

    // Determine badge class
    const badgeClass = isFree ? 'free-badge' : 'premium-badge';

    return `
      <div class="voice-item ${isSelected ? 'selected' : ''} ${isPremium ? 'voice-premium' : 'voice-free'} ${isLocked ? 'voice-locked' : ''}"
           data-voice="${voice.id}"
           data-tier="${voice.tier}"
           ${isLocked ? 'data-locked="true"' : ''}>
        <div class="voice-icon">${voice.icon}</div>
        <div class="voice-info">
          <h4 class="voice-name">
            ${voice.name}
            ${voice.badge ? `<span class="${badgeClass}">${voice.badge}</span>` : ''}
          </h4>
          <p class="voice-description">${voice.description}</p>
          ${isPremium ? '<p class="voice-tier-note">Powered by Piper TTS</p>' : ''}
        </div>
        <div class="voice-actions">
          <button
            class="preview-btn ${isPreviewing ? 'playing' : ''}"
            data-voice="${voice.id}"
            aria-label="Preview ${voice.name}"
          >
            ${isPreviewing ? '⏸️ Playing...' : '▶️ Preview'}
          </button>
          ${isLocked
            ? `<button class="upgrade-btn" data-voice="${voice.id}" aria-label="Upgrade to use ${voice.name}">
                 🔒 Upgrade
               </button>`
            : `<button class="select-btn ${isSelected ? 'selected' : ''}" data-voice="${voice.id}" aria-label="Select ${voice.name}">
                 ${isSelected ? '✓ Selected' : 'Select'}
               </button>`
          }
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to modal elements
   */
  attachEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    // Modal overlay (click outside to close)
    const overlay = this.modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.hide());
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
        this.hide();
      }
    });

    // Preview buttons
    const previewButtons = this.modal.querySelectorAll('.preview-btn');
    previewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const voiceId = btn.getAttribute('data-voice');
        this.preview(voiceId);
      });
    });

    // Select buttons
    const selectButtons = this.modal.querySelectorAll('.select-btn');
    selectButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const voiceId = btn.getAttribute('data-voice');
        this.select(voiceId);
      });
    });

    // Upgrade buttons (for locked premium voices)
    const upgradeButtons = this.modal.querySelectorAll('.upgrade-btn');
    upgradeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showUpgradeModal();
      });
    });

    // Voice item click (select on click, unless locked)
    const voiceItems = this.modal.querySelectorAll('.voice-item');
    voiceItems.forEach(item => {
      item.addEventListener('click', () => {
        const isLocked = item.getAttribute('data-locked') === 'true';
        if (isLocked) {
          this.showUpgradeModal();
          return;
        }
        const voiceId = item.getAttribute('data-voice');
        this.select(voiceId);
      });
    });
  }

  /**
   * Show upgrade modal for premium voices
   */
  showUpgradeModal() {
    // Create and show upgrade prompt
    const upgradeHTML = `
      <div class="upgrade-modal-overlay" id="upgradeModalOverlay">
        <div class="upgrade-modal-content">
          <button class="upgrade-close-btn" aria-label="Close">×</button>
          <div class="upgrade-icon">✨</div>
          <h3>Upgrade to Premium</h3>
          <p>Unlock natural human voices powered by advanced AI speech synthesis.</p>
          <ul class="upgrade-features">
            <li>✓ Natural, human-like speech</li>
            <li>✓ Multiple premium voice options</li>
            <li>✓ Unlimited usage</li>
          </ul>
          <a href="/pricing" class="upgrade-cta-btn">View Plans</a>
          <button class="upgrade-later-btn">Maybe Later</button>
        </div>
      </div>
    `;

    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', upgradeHTML);

    const overlay = document.getElementById('upgradeModalOverlay');
    const closeBtn = overlay.querySelector('.upgrade-close-btn');
    const laterBtn = overlay.querySelector('.upgrade-later-btn');

    const closeUpgrade = () => {
      overlay.remove();
    };

    closeBtn.addEventListener('click', closeUpgrade);
    laterBtn.addEventListener('click', closeUpgrade);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeUpgrade();
    });
  }

  /**
   * Preview a voice
   * @param {string} voiceId - Voice ID to preview
   */
  async preview(voiceId) {
    try {
      // If already playing this voice, stop it
      if (this.isPlaying && this.currentPreviewVoice === voiceId) {
        window.TTSClient.stop();
        this.isPlaying = false;
        this.currentPreviewVoice = null;
        this.render(); // Re-render to update button state
        return;
      }

      // Stop any current preview
      if (this.isPlaying) {
        window.TTSClient.stop();
      }

      logger.debug('[Voice Preview] Previewing voice:', voiceId);

      // Set playing state
      this.isPlaying = true;
      this.currentPreviewVoice = voiceId;
      this.render(); // Re-render to show "Playing..." state

      // Temporarily change voice
      const originalVoice = window.TTSClient.currentVoice;
      window.TTSClient.setVoice(voiceId);

      // Play sample
      await window.TTSClient.speak(this.sampleText);

      // Restore original voice if not selected
      if (this.selectedVoice !== voiceId) {
        window.TTSClient.setVoice(originalVoice);
      }

      // Clear playing state
      this.isPlaying = false;
      this.currentPreviewVoice = null;
      this.render(); // Re-render to restore button state

    } catch (error) {
      console.error('[Voice Preview] Error previewing voice:', error);
      this.isPlaying = false;
      this.currentPreviewVoice = null;
      this.render();
      
      // Show user-friendly error
      this.showError('Unable to preview voice. Please try again.');
    }
  }

  /**
   * Select a voice
   * @param {string} voiceId - Voice ID to select
   */
  select(voiceId) {
    logger.debug('[Voice Preview] Voice selected:', voiceId);
    
    // Update selected voice
    this.selectedVoice = voiceId;
    window.TTSClient.setVoice(voiceId);
    
    // Re-render to update UI
    this.render();
    
    // Show success feedback
    this.showSuccess(`Voice changed to ${this.voices.find(v => v.id === voiceId).name}`);
  }

  /**
   * Update quota display
   */
  async updateQuota() {
    try {
      const quota = await window.TTSClient.checkQuota();
      const quotaElement = this.modal.querySelector('#quotaRemaining');
      
      if (quotaElement) {
        if (quota.remaining !== null) {
          quotaElement.textContent = quota.remaining.toLocaleString();
          
          // Add color based on quota level
          if (quota.percentage !== null) {
            if (quota.percentage < 10) {
              quotaElement.style.color = '#ef4444'; // Red
            } else if (quota.percentage < 25) {
              quotaElement.style.color = '#f59e0b'; // Orange
            } else {
              quotaElement.style.color = '#3b82f6'; // Blue
            }
          }
        } else {
          quotaElement.textContent = 'Unlimited';
          quotaElement.style.color = '#10b981'; // Green
        }
      }
    } catch (error) {
      console.error('[Voice Preview] Error updating quota:', error);
      const quotaElement = this.modal.querySelector('#quotaRemaining');
      if (quotaElement) {
        quotaElement.textContent = 'Unknown';
        quotaElement.style.color = '#6b7280'; // Gray
      }
    }
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'voice-toast voice-toast-success';
    toast.textContent = `✓ ${message}`;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'voice-toast voice-toast-error';
    toast.textContent = `✗ ${message}`;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Get currently selected voice info
   * @returns {Object}
   */
  getSelectedVoiceInfo() {
    return this.voices.find(v => v.id === this.selectedVoice) || this.voices[0];
  }
}

// Initialize global voice preview modal
logger.debug('[Voice Preview] Creating global instance...');
window.VoicePreview = new VoicePreviewModal();

logger.debug('[Voice Preview] Ready! Usage: window.VoicePreview.show()');