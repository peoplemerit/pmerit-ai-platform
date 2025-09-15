// PMERIT Chat System
class PMERITChat {
  constructor() {
    this.chatBody = document.getElementById('chatBody');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.charCount = document.getElementById('count');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCharCount();
  }

  setupEventListeners() {
    // Send button
    this.sendBtn?.addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter key to send
    this.chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Character count update
    this.chatInput?.addEventListener('input', () => {
      this.updateCharCount();
    });

    // Quick action buttons
    document.getElementById('vhQuick')?.addEventListener('click', () => {
      this.insertQuickText('Switch to Virtual Human mode');
    });

    document.getElementById('readAbout')?.addEventListener('click', () => {
      this.insertQuickText('Tell me about PMERIT courses');
    });
  }

  sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage('You', message, 'user');
    
    // Clear input
    this.chatInput.value = '';
    this.updateCharCount();
    
    // Simulate AI response
    setTimeout(() => {
      this.generateAIResponse(message);
    }, 1000);
  }

  addMessage(sender, content, type = 'ai') {
    const messageDiv = document.createElement('article');
    messageDiv.className = 'bubble';
    
    const avatar = type === 'user' ? '👤' : '🤖';
    const senderColor = type === 'user' ? 'var(--accent)' : 'var(--primary)';
    
    messageDiv.innerHTML = `
      <div class="ava" style="background: ${type === 'user' ? 'var(--accent)' : 'linear-gradient(135deg, var(--primary), var(--accent))'}">
        ${avatar}
      </div>
      <div>
        <h3 style="color: ${senderColor}">${sender}:</h3>
        <p>${content}</p>
      </div>
    `;
    
    this.chatBody.appendChild(messageDiv);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  generateAIResponse(userMessage) {
    const responses = [
      "Great question! I'm here to help you explore PMERIT's educational opportunities. What specific area interests you most?",
      "That's interesting! PMERIT offers comprehensive learning paths in technology, business, and creative fields. Would you like to explore any particular track?",
      "I understand you're looking for guidance. Let me suggest some popular courses that might align with your goals.",
      "Excellent! Our AI-powered learning system can create a personalized path based on your interests and career objectives.",
      "That's a great starting point! PMERIT's adaptive learning platform adjusts to your pace and learning style."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.addMessage('PMERIT AI', randomResponse);
  }

  insertQuickText(text) {
    this.chatInput.value = text;
    this.updateCharCount();
    this.chatInput.focus();
  }

  updateCharCount() {
    const length = this.chatInput?.value.length || 0;
    if (this.charCount) {
      this.charCount.textContent = `${length}/1000`;
      
      // Color coding for character limit
      if (length > 900) {
        this.charCount.style.color = '#EF4444'; // Red
      } else if (length > 750) {
        this.charCount.style.color = '#F59E0B'; // Orange
      } else {
        this.charCount.style.color = 'var(--text-secondary)';
      }
    }
  }
}

// Virtual Human Chat Integration
class VirtualHumanChat {
  constructor() {
    this.captions = document.getElementById('captions');
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.updateCaptions('Virtual Human activated. How can I assist your learning today?');
  }

  deactivate() {
    this.isActive = false;
    this.updateCaptions('Virtual Human is standing by...');
  }

  updateCaptions(text) {
    if (this.captions) {
      this.captions.textContent = text;
    }
  }

  simulateSpeaking(text) {
    if (!this.isActive) return;
    
    this.updateCaptions(`Speaking: ${text}`);
    
    // Simulate speech duration
    const duration = Math.max(2000, text.length * 50);
    setTimeout(() => {
      this.updateCaptions('Virtual Human is listening...');
    }, duration);
  }
}

// Initialize chat systems
document.addEventListener('DOMContentLoaded', () => {
  window.pmeritChat = new PMERITChat();
  window.virtualHumanChat = new VirtualHumanChat();
});
