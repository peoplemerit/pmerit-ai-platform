/**
 * PMERIT AI Platform - Homepage Functionality
 * Handles chat interface, assessments, and user interactions
 * Version: 2.1 - Fixed Implementation
 */

class PMERITHome {
  constructor() {
    this.chatMessages = [];
    this.aiEndpoint = 'https://ai.pmerit.com';
    this.initialized = false;
    
    // Wait for boot system to complete
    window.addEventListener('pmerit:initialized', () => {
      this.initialize();
    });
    
    // Fallback initialization
    setTimeout(() => {
      if (!this.initialized) {
        this.initialize();
      }
    }, 2000);
  }

  initialize() {
    if (this.initialized) return;
    
    console.log('[PMERIT] Initializing homepage functionality...');
    
    this.setupChatInterface();
    this.setupAssessmentHandlers();
    this.setupMobileAccordions();
    this.setupVirtualHumanToggle();
    this.setupSupportMode();
    
    this.initialized = true;
    console.log('[PMERIT] ✓ Homepage initialized');
  }

  /**
   * Setup chat interface
   */
  setupChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatCounter = document.getElementById('chatCounter');
    const vhModeBtn = document.getElementById('vhModeBtn');
    const readAboutBtn = document.getElementById('readAboutBtn');

    if (!chatInput || !sendBtn) {
      console.warn('[PMERIT] Chat elements not found, skipping chat setup');
      return;
    }

    // Character counter
    if (chatInput && chatCounter) {
      chatInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        chatCounter.textContent = `${length}/1000`;
        
        if (length > 900) {
          chatCounter.style.color = '#ef4444';
        } else {
          chatCounter.style.color = '#6b7280';
        }
      });
    }

    // Send message handler
    const sendMessage = async () => {
      const message = chatInput.value.trim();
      
      if (!message) return;
      
      // Disable input during processing
      chatInput.disabled = true;
      sendBtn.disabled = true;
      
      try {
        await this.handleChatMessage(message);
        chatInput.value = '';
        
        if (chatCounter) {
          chatCounter.textContent = '0/1000';
          chatCounter.style.color = '#6b7280';
        }
        
      } catch (error) {
        console.error('[PMERIT] Chat error:', error);
        this.showChatError('Sorry, I encountered an issue. Please try again.');
      } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
      }
    };

    // Event listeners
    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    // Mode buttons
    if (vhModeBtn) {
      vhModeBtn.addEventListener('click', () => {
        this.toggleVirtualHuman();
      });
    }

    if (readAboutBtn) {
      readAboutBtn.addEventListener('click', () => {
        this.insertReadAboutMessage();
      });
    }
  }

  /**
   * Handle chat message processing
   */
  async handleChatMessage(message) {
    // Add user message to chat
    this.addChatMessage('user', message);
    
    // Show typing indicator
    const typingIndicator = this.showTypingIndicator();
    
    try {
      // For now, use local responses due to CORS issues
      const response = await this.generateLocalResponse(message);
      
      // Remove typing indicator
      typingIndicator.remove();
      
      // Add AI response
      this.addChatMessage('ai', response);
      
    } catch (error) {
      console.error('[PMERIT] Chat processing error:', error);
      typingIndicator.remove();
      throw error;
    }
  }

  /**
   * Generate local AI response (fallback for CORS issues)
   */
  async generateLocalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Educational responses
    if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
      return "🎓 I'd love to help you explore our courses! We offer three main tracks:\n\n" +
             "📱 **Global Remote Career Track** - Digital skills for worldwide opportunities\n" +
             "🏠 **Local Career Pathways** - Skills for your local job market\n" +
             "📚 **Local Education Support** - Academic tutoring and career prep\n\n" +
             "What type of learning interests you most?";
    }
    
    if (lowerMessage.includes('assessment') || lowerMessage.includes('test')) {
      return "🔍 Our AI assessment helps discover your ideal learning path! It covers:\n\n" +
             "🧠 **Personality Profile** - Learning style and preferences\n" +
             "💡 **Interest Mapping** - Career areas that excite you\n" +
             "⚡ **Skills Assessment** - Current abilities and growth areas\n\n" +
             "Click 'Begin Assessment' to start your personalized journey!";
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return "🚀 PMERIT connects your learning to real career opportunities!\n\n" +
             "We integrate with:\n" +
             "📊 Nigerian Bureau of Statistics (NBS) for local jobs\n" +
             "🇺🇸 US Bureau of Labor Statistics for global opportunities\n\n" +
             "This ensures you're learning skills that lead to actual employment. What career field interests you?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "💪 I'm here to help! You can ask me about:\n\n" +
             "📚 Course recommendations\n" +
             "🎯 Career guidance\n" +
             "📊 Assessment explanations\n" +
             "🛠️ Platform features\n" +
             "💰 Pricing and scholarships\n\n" +
             "What would you like to know more about?";
    }
    
    // Default response
    return "Hello! I'm PMERIT AI, your educational guide. 🎓\n\n" +
           "I'm here to help you discover your learning potential and connect it to real career opportunities. " +
           "Our platform offers accessible, high-quality education designed to break poverty cycles through knowledge.\n\n" +
           "Try asking me about courses, careers, or taking our assessment to get started!";
  }

  /**
   * Add message to chat interface
   */
  addChatMessage(sender, message) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const messageElement = document.createElement('article');
    messageElement.className = 'chat-bubble';
    
    if (sender === 'user') {
      messageElement.classList.add('user-message');
      messageElement.innerHTML = `
        <div class="chat-avatar user-avatar">
          <i class="fas fa-user" aria-hidden="true"></i>
        </div>
        <div class="chat-content">
          <h3>You</h3>
          <p>${this.escapeHtml(message)}</p>
        </div>
      `;
    } else {
      messageElement.innerHTML = `
        <div class="chat-avatar">
          <i class="fas fa-graduation-cap" aria-hidden="true"></i>
        </div>
        <div class="chat-content">
          <h3>PMERIT AI</h3>
          <div class="ai-response">${this.formatAIResponse(message)}</div>
        </div>
      `;
    }

    chatBody.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth' });
    
    this.chatMessages.push({ sender, message, timestamp: Date.now() });
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return { remove: () => {} };

    const indicator = document.createElement('article');
    indicator.className = 'chat-bubble typing-indicator';
    indicator.innerHTML = `
      <div class="chat-avatar">
        <i class="fas fa-graduation-cap" aria-hidden="true"></i>
      </div>
      <div class="chat-content">
        <h3>PMERIT AI</h3>
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    chatBody.appendChild(indicator);
    indicator.scrollIntoView({ behavior: 'smooth' });
    
    return indicator;
  }

  /**
   * Show chat error message
   */
  showChatError(errorMessage) {
    this.addChatMessage('ai', `❌ ${errorMessage}`);
  }

  /**
   * Setup assessment handlers
   */
  setupAssessmentHandlers() {
    const assessmentBtns = document.querySelectorAll('#beginAssessment, #mobileBeginAssessment');
    
    assessmentBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.startAssessment();
        });
      }
    });
  }

  /**
   * Start assessment flow
   */
  startAssessment() {
    // For now, show information about the assessment
    this.addChatMessage('ai', 
      "🎯 **Starting Your Personalized Assessment**\n\n" +
      "This comprehensive evaluation will help us understand:\n" +
      "• Your learning preferences and strengths\n" +
      "• Career interests and goals\n" +
      "• Current skill levels and growth areas\n\n" +
      "Based on your results, we'll create a customized learning plan aligned with real job market opportunities.\n\n" +
      "Assessment coming soon! In the meantime, tell me about your learning goals."
    );

    // Focus on chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.focus();
    }
  }

  /**
   * Setup mobile accordions
   */
  setupMobileAccordions() {
    const accordions = document.querySelectorAll('.mobile-accordion details');
    
    accordions.forEach(accordion => {
      const summary = accordion.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', () => {
          // Close other accordions when opening one
          accordions.forEach(other => {
            if (other !== accordion && other.hasAttribute('open')) {
              other.removeAttribute('open');
            }
          });
        });
      }
    });

    // Setup mobile action handlers
    const mobileVHToggle = document.getElementById('mobileVHToggle');
    const mobileCareerPaths = document.getElementById('mobileCareerPaths');
    const mobileSupportToggle = document.getElementById('mobileSupportToggle');

    if (mobileVHToggle) {
      mobileVHToggle.addEventListener('click', () => {
        this.toggleVirtualHuman();
      });
    }

    if (mobileCareerPaths) {
      mobileCareerPaths.addEventListener('click', () => {
        this.showCareerPaths();
      });
    }

    if (mobileSupportToggle) {
      mobileSupportToggle.addEventListener('click', () => {
        this.toggleSupportMode();
      });
    }
  }

  /**
   * Toggle virtual human mode
   */
  toggleVirtualHuman() {
    this.addChatMessage('ai', 
      "🤖 **Virtual Human Mode**\n\n" +
      "Our immersive Virtual Human interface is coming soon! This feature will provide:\n\n" +
      "• Voice-based conversations in multiple languages\n" +
      "• Cultural representation and local context\n" +
      "• Interactive visual learning experiences\n" +
      "• Personalized avatar interactions\n\n" +
      "For now, I'm here to help through text chat. What would you like to learn about?"
    );
  }

  /**
   * Show career paths information
   */
  showCareerPaths() {
    this.addChatMessage('ai', 
      "🎯 **Explore Career Paths**\n\n" +
      "**Global Remote Career (GRC) Track:**\n" +
      "💻 Software Development, Digital Marketing, Data Analysis\n\n" +
      "**Local Career Pathways (LCP) Track:**\n" +
      "🌱 Agricultural Technology, Healthcare, Small Business\n\n" +
      "**Local Education (LEd) Track:**\n" +
      "📚 Academic Support, STEM, Career Preparation\n\n" +
      "Each path is aligned with real job market data. Which area interests you most?"
    );
  }

  /**
   * Setup support mode
   */
  setupSupportMode() {
    const supportBtns = document.querySelectorAll('#vhSupportBtn, #supportModeBtn');
    
    supportBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.toggleSupportMode();
        });
      }
    });
  }

  /**
   * Toggle support mode
   */
  toggleSupportMode() {
    this.addChatMessage('ai', 
      "🛟 **Customer Support Mode**\n\n" +
      "I'm here to help with any questions about PMERIT! I can assist with:\n\n" +
      "• Account and registration issues\n" +
      "• Technical problems\n" +
      "• Course enrollment and access\n" +
      "• Platform navigation\n" +
      "• Billing and subscription questions\n\n" +
      "What can I help you with today?"
    );
  }

  /**
   * Insert "Read About" message
   */
  insertReadAboutMessage() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.value = "Tell me about PMERIT and how it can help me learn";
      chatInput.focus();
    }
  }

  /**
   * Format AI response with markdown-like formatting
   */
  formatAIResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PMERITHome();
  });
} else {
  new PMERITHome();
}
