/**
 * chat.js
 * Handles chat interface, message display, and AI interactions
 */

(function() {
  'use strict';

  const ChatInterface = {
    chatBody: null,
    chatInput: null,
    sendBtn: null,
    chatInputMobile: null,
    sendBtnMobile: null,
    countDisplay: null,
    countMobileDisplay: null,
    typingIndicator: null,
    isTyping: false,

    init() {
      this.initializeElements();
      this.initializeEventListeners();
    },

    initializeElements() {
      this.chatBody = document.getElementById('chatBody');
      this.chatInput = document.getElementById('chatInput');
      this.sendBtn = document.getElementById('sendBtn');
      this.chatInputMobile = document.getElementById('chatInputMobile');
      this.sendBtnMobile = document.getElementById('sendBtnMobile');
      this.countDisplay = document.getElementById('count');
      this.countMobileDisplay = document.getElementById('countMobile');
    },

    initializeEventListeners() {
      // Desktop chat input
      if (this.chatInput) {
        this.chatInput.addEventListener('input', () => {
          this.updateCharCount(this.chatInput, this.countDisplay);
        });

        this.chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
          }
        });
      }

      // Mobile chat input
      if (this.chatInputMobile) {
        this.chatInputMobile.addEventListener('input', () => {
          this.updateCharCount(this.chatInputMobile, this.countMobileDisplay);
        });
      }

      // Send buttons
      if (this.sendBtn) {
        this.sendBtn.addEventListener('click', () => {
          this.sendMessage();
        });
      }

      if (this.sendBtnMobile) {
        this.sendBtnMobile.addEventListener('click', () => {
          this.sendMessage(true);
        });
      }
    },

    updateCharCount(input, display) {
      if (!input || !display) return;
      const count = input.value.length;
      const max = input.getAttribute('maxlength') || 1000;
      display.textContent = `${count}/${max}`;
    },

    sendMessage(isMobile = false) {
      const input = isMobile ? this.chatInputMobile : this.chatInput;
      const message = input?.value.trim();

      if (!message || this.isTyping) return;

      // Add user message
      this.addMessage('user', message, true);
      input.value = '';
      this.updateCharCount(input, isMobile ? this.countMobileDisplay : this.countDisplay);

      // Show typing indicator and get AI response
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        const response = this.getAIResponse(message);
        this.addMessage('ai', response, false);
      }, 1500);
    },

    addMessage(sender, text, isUser) {
      if (!this.chatBody) return;

      const article = document.createElement('article');
      article.className = `bubble ${sender}`;

      const avatar = document.createElement('div');
      avatar.className = 'ava';
      avatar.innerHTML = isUser 
        ? '<i class="fas fa-user"></i>' 
        : '<i class="fas fa-user-circle"></i>';

      const content = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = isUser ? 'You:' : 'PMERIT AI:';
      
      const paragraph = document.createElement('p');
      paragraph.textContent = text;

      content.appendChild(heading);
      content.appendChild(paragraph);
      
      article.appendChild(avatar);
      article.appendChild(content);
      
      this.chatBody.appendChild(article);
      this.scrollToBottom();

      // Trigger TTS if enabled
      if (!isUser && window.ttsEnabled) {
        this.speak(text);
      }

      // Update VH captions if in VH mode
      if (!isUser && window.virtualHumanMode) {
        this.updateVHCaptions(text);
      }
    },

    showTypingIndicator() {
      if (!this.chatBody) return;
      
      this.isTyping = true;
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.id = 'typingIndicator';
      indicator.innerHTML = '<span>AI is thinking</span><span class="dots"><span>.</span><span>.</span><span>.</span></span>';
      
      this.chatBody.appendChild(indicator);
      this.scrollToBottom();
    },

    hideTypingIndicator() {
      this.isTyping = false;
      const indicator = document.getElementById('typingIndicator');
      if (indicator) {
        indicator.remove();
      }
    },

    scrollToBottom() {
      if (this.chatBody) {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }
    },

    getAIResponse(message) {
      // Simple context-aware responses
      const msg = message.toLowerCase();
      
      // Support mode responses
      if (window.customerServiceMode) {
        if (msg.includes('help') || msg.includes('support')) {
          return "I'm here to help! You can reach our support team via email at support@pmerit.com or through our live chat. What specific issue can I assist you with?";
        }
        if (msg.includes('account') || msg.includes('login')) {
          return "For account-related questions, please use the 'Sign In' button at the top. If you're having trouble accessing your account, try the 'Forgot Password' link or contact support@pmerit.com.";
        }
        return "I'm in Customer Service mode. How can I help you today? You can ask about account issues, technical problems, or general platform questions.";
      }

      // Regular AI assistant responses
      if (msg.includes('course') || msg.includes('learn')) {
        return "PMERIT offers a wide range of courses in technology, business, and personal development. Would you like to explore our course catalog or get personalized recommendations based on your goals?";
      }
      if (msg.includes('career') || msg.includes('job')) {
        return "I can help you explore career paths! Our Career Track feature provides personalized guidance based on your interests and skills. Would you like to take a quick assessment to discover your ideal career path?";
      }
      if (msg.includes('assessment') || msg.includes('test')) {
        return "Our learning assessment helps identify your strengths and recommends a personalized learning plan. It takes about 10 minutes to complete. Ready to begin your assessment?";
      }
      if (msg.includes('virtual human') || msg.includes('vh')) {
        return "Virtual Human mode provides an immersive learning experience with an AI avatar. You can enable it from the Quick Actions menu on the left. Would you like to try it?";
      }

      // Default responses
      const responses = [
        "That's a great question! PMERIT is designed to make education accessible and personalized. What specific area would you like to explore?",
        "I'd be happy to help with that! Can you tell me more about your learning goals or what you're interested in?",
        "Interesting! At PMERIT, we believe in learning that adapts to you. Would you like to take an assessment to get personalized recommendations?",
        "I'm here to guide your educational journey. Whether you're interested in courses, career planning, or skill development, I can help you find the right path."
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    },

    speak(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },

    updateVHCaptions(text) {
      const captions = document.getElementById('captions');
      if (captions) {
        captions.textContent = text;
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ChatInterface.init();
    });
  } else {
    ChatInterface.init();
  }

  // Export for global access
  window.ChatInterface = ChatInterface;
})();
