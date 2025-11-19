/**
 * PMERIT Customer Service Modal Controller
 * Version: 1.0
 * Created: Session 5
 * 
 * Controls the customer service modal interface
 */

(function() {
  'use strict';

  const CustomerServiceModal = {
    modal: null,
    isOpen: false,

    init: function() {
      // Wait for modal to be loaded into DOM
      this.modal = document.getElementById('customer-service-modal');
      
      if (!this.modal) {
        console.warn('[CustomerService] Modal not found in DOM');
        return;
      }

      this.bindEvents();
      console.log('✅ Customer Service Modal initialized');
    },

    bindEvents: function() {
      // Close button
      const closeBtn = this.modal.querySelector('.customer-service-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      // Backdrop click to close
      const backdrop = this.modal.querySelector('.customer-service-modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.close();
          }
        });
      }

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Quick action cards
      const actionCards = this.modal.querySelectorAll('.cs-action-card');
      actionCards.forEach(card => {
        card.addEventListener('click', (e) => {
          const action = e.currentTarget.dataset.action;
          this.handleQuickAction(action);
        });
      });

      // AI Connect button
      const aiConnectBtn = this.modal.querySelector('#cs-ai-connect');
      if (aiConnectBtn) {
        aiConnectBtn.addEventListener('click', () => this.connectToAI());
      }
    },

    open: function() {
      if (!this.modal) {
        console.error('[CustomerService] Cannot open - modal not initialized');
        return;
      }

      this.modal.setAttribute('aria-hidden', 'false');
      this.isOpen = true;
      document.body.style.overflow = 'hidden'; // Prevent background scroll

      // Analytics
      console.log('📊 Analytics: customer_service_modal_opened');
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: 'customer_service_modal_opened' }
      }));
    },

    close: function() {
      if (!this.modal) return;

      this.modal.setAttribute('aria-hidden', 'true');
      this.isOpen = false;
      document.body.style.overflow = ''; // Restore scroll

      // Analytics
      console.log('📊 Analytics: customer_service_modal_closed');
    },

    handleQuickAction: function(action) {
      console.log(`🎧 Customer Service: ${action} selected`);
      
      // Analytics
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { 
          event: 'customer_service_quick_action',
          action: action
        }
      }));

      // TODO: Route to appropriate AI context or support flow
      // For now, just show message and close
      this.close();
      
      // Set AI context based on action
      const contextMessages = {
        account: "I need help with my account or sign-in issues.",
        courses: "I have a question about courses or content.",
        technical: "I'm experiencing a technical problem.",
        general: "I have a general question about PMERIT."
      };

      // Populate chat with context (if chat is available)
      if (window.CHAT && window.CHAT.sendMessage) {
        setTimeout(() => {
          window.CHAT.sendMessage(contextMessages[action] || "I need help.");
        }, 300);
      } else {
        alert(`You selected: ${action}\n\nThis will route you to the appropriate AI assistant.\n(Full AI routing coming soon!)`);
      }
    },

    connectToAI: function() {
      console.log('🤖 Connecting to AI Receptionist');
      
      // Analytics
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: 'customer_service_ai_connect' }
      }));

      this.close();

      // TODO: Switch to Customer Service AI mode
      // For now, just show message
      setTimeout(() => {
        if (window.CHAT && window.CHAT.sendMessage) {
          window.CHAT.sendMessage("Hello! I'd like to speak with customer service.");
        } else {
          alert("Connecting to AI Receptionist...\n\n(AI chat integration coming soon!)");
        }
      }, 300);
    }
  };

  // Export to global scope
  window.CustomerServiceModal = CustomerServiceModal;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait a bit for modal HTML to be injected
      setTimeout(() => CustomerServiceModal.init(), 100);
    });
  } else {
    setTimeout(() => CustomerServiceModal.init(), 100);
  }
})();
EOF
cat customer-service-modal.js
Output

/**
 * PMERIT Customer Service Modal Controller
 * Version: 1.0
 * Created: Session 5
 * 
 * Controls the customer service modal interface
 */

(function() {
  'use strict';

  const CustomerServiceModal = {
    modal: null,
    isOpen: false,

    init: function() {
      // Wait for modal to be loaded into DOM
      this.modal = document.getElementById('customer-service-modal');
      
      if (!this.modal) {
        console.warn('[CustomerService] Modal not found in DOM');
        return;
      }

      this.bindEvents();
      console.log('✅ Customer Service Modal initialized');
    },

    bindEvents: function() {
      // Close button
      const closeBtn = this.modal.querySelector('.customer-service-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      // Backdrop click to close
      const backdrop = this.modal.querySelector('.customer-service-modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.close();
          }
        });
      }

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Quick action cards
      const actionCards = this.modal.querySelectorAll('.cs-action-card');
      actionCards.forEach(card => {
        card.addEventListener('click', (e) => {
          const action = e.currentTarget.dataset.action;
          this.handleQuickAction(action);
        });
      });

      // AI Connect button
      const aiConnectBtn = this.modal.querySelector('#cs-ai-connect');
      if (aiConnectBtn) {
        aiConnectBtn.addEventListener('click', () => this.connectToAI());
      }
    },

    open: function() {
      if (!this.modal) {
        console.error('[CustomerService] Cannot open - modal not initialized');
        return;
      }

      this.modal.setAttribute('aria-hidden', 'false');
      this.isOpen = true;
      document.body.style.overflow = 'hidden'; // Prevent background scroll

      // Analytics
      console.log('📊 Analytics: customer_service_modal_opened');
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: 'customer_service_modal_opened' }
      }));
    },

    close: function() {
      if (!this.modal) return;

      this.modal.setAttribute('aria-hidden', 'true');
      this.isOpen = false;
      document.body.style.overflow = ''; // Restore scroll

      // Analytics
      console.log('📊 Analytics: customer_service_modal_closed');
    },

    handleQuickAction: function(action) {
      console.log(`🎧 Customer Service: ${action} selected`);
      
      // Analytics
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { 
          event: 'customer_service_quick_action',
          action: action
        }
      }));

      // TODO: Route to appropriate AI context or support flow
      // For now, just show message and close
      this.close();
      
      // Set AI context based on action
      const contextMessages = {
        account: "I need help with my account or sign-in issues.",
        courses: "I have a question about courses or content.",
        technical: "I'm experiencing a technical problem.",
        general: "I have a general question about PMERIT."
      };

      // Populate chat with context (if chat is available)
      if (window.CHAT && window.CHAT.sendMessage) {
        setTimeout(() => {
          window.CHAT.sendMessage(contextMessages[action] || "I need help.");
        }, 300);
      } else {
        alert(`You selected: ${action}\n\nThis will route you to the appropriate AI assistant.\n(Full AI routing coming soon!)`);
      }
    },

    connectToAI: function() {
      console.log('🤖 Connecting to AI Receptionist');
      
      // Analytics
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: 'customer_service_ai_connect' }
      }));

      this.close();

      // TODO: Switch to Customer Service AI mode
      // For now, just show message
      setTimeout(() => {
        if (window.CHAT && window.CHAT.sendMessage) {
          window.CHAT.sendMessage("Hello! I'd like to speak with customer service.");
        } else {
          alert("Connecting to AI Receptionist...\n\n(AI chat integration coming soon!)");
        }
      }, 300);
    }
  };

  // Export to global scope
  window.CustomerServiceModal = CustomerServiceModal;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait a bit for modal HTML to be injected
      setTimeout(() => CustomerServiceModal.init(), 100);
    });
  } else {
    setTimeout(() => CustomerServiceModal.init(), 100);
  }
})();