/**
 * PMERIT Chat Interface - Phase 3
 * Version: 2.1
 * Last Updated: October 2025
 * 
 * Handles chat messages, auto-scroll, typing indicators, and TTS
 * Compatible with both mobile and desktop layouts
 */

// ========== CHAT STATE ==========
const chatState = {
  isMobile: window.innerWidth < 1024,
  isTyping: false,
  messageCount: 0
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  initializeChat();
});

window.addEventListener('resize', function() {
  chatState.isMobile = window.innerWidth < 1024;
});

function initializeChat() {
  console.log('💬 Initializing chat interface...');

  // Mobile chat
  const mobileChatInput = document.getElementById('chat-input');
  const mobileSendBtn = document.getElementById('send-btn');
  const mobileCharCount = document.getElementById('char-count');

  if (mobileChatInput && mobileSendBtn) {
    mobileChatInput.addEventListener('input', function() {
      updateCharCount(this, mobileCharCount);
      autoResize(this);
    });

    mobileChatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage('mobile');
      }
    });

    mobileSendBtn.addEventListener('click', function() {
      sendMessage('mobile');
    });
  }

  // Desktop chat
  const desktopChatInput = document.getElementById('desktop-chat-input');
  const desktopSendBtn = document.getElementById('desktop-send-btn');
  const desktopCharCount = document.getElementById('desktop-char-count');

  if (desktopChatInput && desktopSendBtn) {
    desktopChatInput.addEventListener('input', function() {
      updateCharCount(this, desktopCharCount);
      autoResize(this);
    });

    desktopChatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage('desktop');
      }
    });

    desktopSendBtn.addEventListener('click', function() {
      sendMessage('desktop');
    });
  }

  console.log('✅ Chat interface initialized');
}

// ========== SEND MESSAGE ==========
function sendMessage(layout = 'mobile') {
  if (chatState.isTyping) return;

  const inputId = layout === 'mobile' ? 'chat-input' : 'desktop-chat-input';
  const input = document.getElementById(inputId);

  if (!input) return;

  const message = input.value.trim();

  if (message === '') return;

  // Add user message
  addMessage('user', message, layout);

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Update char count
  const charCountId = layout === 'mobile' ? 'char-count' : 'desktop-char-count';
  const charCount = document.getElementById(charCountId);
  if (charCount) {
    charCount.textContent = '0/1000';
  }

  // Show typing indicator
  showTypingIndicator(layout);

  // Simulate AI response
  setTimeout(() => {
    hideTypingIndicator(layout);
    const aiResponse = generateAIResponse(message);
    addMessage('ai', aiResponse, layout);

    // Speak if TTS enabled
    const ttsEnabled = document.body.classList.contains('tts-enabled');
    if (ttsEnabled) {
      speakMessage(aiResponse);
    }
  }, 1500);
}

// ========== ADD MESSAGE ==========
function addMessage(sender, text, layout = 'mobile') {
  const messagesId = layout === 'mobile' ? 'chat-messages' : 'desktop-chat-messages';
  const messagesContainer = document.getElementById(messagesId);

  if (!messagesContainer) return;

  const messageId = `msg-${++chatState.messageCount}-${Date.now()}`;
  const isUser = sender === 'user';
  const timestamp = formatTime(new Date());

  // Create message bubble
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-bubble ${isUser ? 'user-message' : 'ai-message'}`;
  messageDiv.setAttribute('data-message-id', messageId);

  // Create avatar
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = isUser 
    ? '<i class="fas fa-user" aria-hidden="true"></i>' 
    : '<i class="fas fa-robot" aria-hidden="true"></i>';

  // Create content
  const content = document.createElement('div');
  content.className = 'message-content';

  const senderName = document.createElement('h3');
  senderName.className = 'message-sender';
  senderName.textContent = isUser ? 'You' : 'PMERIT AI';

  const messageText = document.createElement('p');
  messageText.className = 'message-text';
  messageText.textContent = text;

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = timestamp;

  // Assemble message
  content.appendChild(senderName);
  content.appendChild(messageText);
  content.appendChild(time);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  // Add to container
  messagesContainer.appendChild(messageDiv);

  // Auto-scroll to bottom
  scrollToBottom(messagesContainer);

  console.log(`💬 ${sender} message added: "${text.substring(0, 50)}..."`);
}

// ========== TYPING INDICATOR ==========
function showTypingIndicator(layout = 'mobile') {
  chatState.isTyping = true;

  const indicatorId = layout === 'mobile' ? 'typing-indicator' : 'desktop-typing-indicator';
  const indicator = document.getElementById(indicatorId);

  if (indicator) {
    indicator.style.display = 'flex';

    // Scroll to show indicator
    const messagesId = layout === 'mobile' ? 'chat-messages' : 'desktop-chat-messages';
    const messagesContainer = document.getElementById(messagesId);
    if (messagesContainer) {
      setTimeout(() => scrollToBottom(messagesContainer, indicator), 50);
    }
  }
}

function hideTypingIndicator(layout = 'mobile') {
  chatState.isTyping = false;

  const indicatorId = layout === 'mobile' ? 'typing-indicator' : 'desktop-typing-indicator';
  const indicator = document.getElementById(indicatorId);

  if (indicator) {
    indicator.style.display = 'none';
  }
}

// ========== AI RESPONSE GENERATION ==========
function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();

  // Course-related queries
  if (message.includes('course') || message.includes('program') || message.includes('class')) {
    return "We offer a wide range of courses including programming, data science, business, design, and more. Would you like to explore a specific field? I can help you find courses that match your interests and goals.";
  }

  // Career-related queries
  if (message.includes('career') || message.includes('job') || message.includes('path')) {
    return "Great question about career planning! I can help you explore various career paths and create a personalized learning plan. Would you like to take our career assessment? It only takes a few minutes and will help identify your strengths and interests.";
  }

  // Programming queries
  if (message.includes('programming') || message.includes('coding') || message.includes('developer')) {
    return "We have excellent programming courses for all levels! From beginner-friendly Python and JavaScript to advanced topics like machine learning and cloud computing. What's your current experience level, and what would you like to build?";
  }

  // Assessment queries
  if (message.includes('assessment') || message.includes('test') || message.includes('evaluate')) {
    return "Our personalized assessment helps identify your learning style, interests, and goals. It takes about 10-15 minutes to complete. Would you like to begin the assessment now? I'll guide you through each step.";
  }

  // Virtual human queries
  if (message.includes('virtual human') || message.includes('vh mode') || message.includes('avatar')) {
    return "Virtual Human Mode provides an immersive learning experience with an AI-powered avatar that can demonstrate concepts, provide visual feedback, and make learning more engaging. You can enable it from the menu. Would you like to try it?";
  }

  // Support queries
  if (message.includes('help') || message.includes('support') || message.includes('problem')) {
    return "I'm here to help! What specific issue are you experiencing? You can also enable Customer Service Mode for dedicated support from our team. Just let me know what you need assistance with.";
  }

  // Default responses
  const defaultResponses = [
    "That's a great question! Let me provide you with some information. PMERIT is designed to make quality education accessible worldwide. What specific aspect would you like to know more about?",
    "I'd be happy to help you with that! Can you tell me a bit more about what you're looking for? Whether it's courses, career guidance, or general information, I'm here to assist.",
    "Excellent inquiry! At PMERIT, we believe in personalized learning. Based on your interests, I can recommend courses, career paths, and resources. What area interests you most?",
    "Thanks for reaching out! I can help you explore our courses, take career assessments, or answer questions about the platform. What would you like to do first?",
    "I understand you're interested in learning more. Let me guide you through the options available. Would you like to browse courses, explore career paths, or learn about our platform features?"
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ========== TEXT-TO-SPEECH ==========
function speakMessage(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
    console.log('🔊 Speaking message via TTS');
  }
}

// ========== UTILITY FUNCTIONS ==========

function updateCharCount(input, charCountElement) {
  if (!charCountElement) return;
  const count = input.value.length;
  const max = input.maxLength || 1000;
  charCountElement.textContent = `${count}/${max}`;

  // Warn if approaching limit
  if (count > max * 0.9) {
    charCountElement.style.color = 'var(--warning)';
  } else {
    charCountElement.style.color = 'var(--text-secondary)';
  }
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function scrollToBottom(container, additionalElement = null) {
  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;

    // If there's an additional element (like typing indicator), ensure it's visible
    if (additionalElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = additionalElement.getBoundingClientRect();

      if (elementRect.bottom > containerRect.bottom) {
        additionalElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  });
}

function formatTime(date) {
  const now = new Date();
  const diff = now - date;

  // Just now (< 1 minute)
  if (diff < 60000) {
    return 'Just now';
  }

  // Minutes ago (< 1 hour)
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Today (same day)
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Older (show date)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeChat,
    sendMessage,
    addMessage,
    showTypingIndicator,
    hideTypingIndicator,
    generateAIResponse,
    speakMessage
  };
}
