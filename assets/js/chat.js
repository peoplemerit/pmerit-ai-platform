/**
 * PMERIT Chat Interface
 * Version: 3.0 (Modular - Fixed IDs)
 * Last Updated: October 12, 2025
 * 
 * Handles: Chat messages, auto-scroll, typing indicators, TTS
 * IDs updated to match index.html camelCase naming
 */

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  initializeChat();
});

function initializeChat() {
  console.log('💬 Chat interface initializing...');
  
  // Mobile chat
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const charCount = document.getElementById('charCount');

  if (chatInput && sendBtn) {
    // Character counter
    chatInput.addEventListener('input', function() {
      if (charCount) {
        charCount.textContent = `${this.value.length}/1000`;
      }
      autoResize(this);
    });

    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Send button click
    sendBtn.addEventListener('click', sendMessage);
  }
  
  console.log('✅ Chat interface initialized');
}

// ========== SEND MESSAGE ==========
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const charCount = document.getElementById('charCount');

  if (!chatInput || !chatMessages) return;

  const message = chatInput.value.trim();
  if (message === '') return;

  // Add user message
  addMessage('user', message);

  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  if (charCount) {
    charCount.textContent = '0/1000';
  }

  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simulate AI response (1.5 second delay)
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    addMessage('ai', aiResponse);
    
    // Speak if TTS enabled
    if (document.body.classList.contains('tts-enabled')) {
      speakMessage(aiResponse);
    }
  }, 1500);
}

// ========== ADD MESSAGE ==========
function addMessage(sender, text) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  // Create message content
  const messageContent = document.createElement('p');
  
  if (sender === 'ai') {
    const strong = document.createElement('strong');
    strong.textContent = '👋 PMERIT AI: ';
    messageContent.appendChild(strong);
  }
  
  const textNode = document.createTextNode(text);
  messageContent.appendChild(textNode);
  
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  // Fade-in animation
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease-out';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);

  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========== AI RESPONSE GENERATION ==========
function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();

  // Course-related queries
  if (message.includes('course') || message.includes('program') || message.includes('class')) {
    return "We offer a wide range of courses including programming, data science, business, design, and more. Would you like to explore a specific field?";
  }

  // Career-related queries
  if (message.includes('career') || message.includes('job') || message.includes('path')) {
    return "Great question about career planning! I can help you explore various career paths and create a personalized learning plan. Would you like to take our career assessment?";
  }

  // Programming queries
  if (message.includes('programming') || message.includes('coding') || message.includes('developer') || message.includes('python') || message.includes('javascript')) {
    return "We have excellent programming courses for all levels! From beginner-friendly Python and JavaScript to advanced topics like machine learning and cloud computing. What's your current experience level?";
  }

  // Assessment queries
  if (message.includes('assessment') || message.includes('test') || message.includes('evaluate') || message.includes('skill')) {
    return "Our personalized assessment helps identify your learning style, interests, and goals. It takes about 10-15 minutes to complete. Would you like to begin the assessment now?";
  }

  // Virtual human queries
  if (message.includes('virtual') || message.includes('avatar') || message.includes('human')) {
    return "Virtual Human Mode provides an immersive learning experience with an AI-powered avatar. You can enable it from the menu. Would you like to try it?";
  }

  // Support queries
  if (message.includes('help') || message.includes('support') || message.includes('problem')) {
    return "I'm here to help! What specific issue are you experiencing? You can also enable Customer Service Mode for dedicated support from our team.";
  }

  // Price/cost queries
  if (message.includes('price') || message.includes('cost') || message.includes('free') || message.includes('pay')) {
    return "PMERIT offers both free and premium courses. Many foundational courses are completely free to make quality education accessible to everyone. Premium courses provide certificates and advanced features.";
  }

  // Language queries
  if (message.includes('language') || message.includes('translate') || message.includes('yoruba') || message.includes('igbo') || message.includes('hausa')) {
    return "PMERIT supports multiple languages including English, Yorùbá, Igbo, and Hausa! You can change your language preference from the menu at any time.";
  }

  // Default responses (random)
  const defaultResponses = [
    "That's a great question! PMERIT is designed to make quality education accessible worldwide. What specific aspect would you like to know more about?",
    "I'd be happy to help you with that! Can you tell me a bit more about what you're looking for? Whether it's courses, career guidance, or general information, I'm here to assist.",
    "Excellent inquiry! At PMERIT, we believe in personalized learning. Based on your interests, I can recommend courses, career paths, and resources. What area interests you most?",
    "Thanks for reaching out! I can help you explore our courses, take career assessments, or answer questions about the platform. What would you like to do first?"
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
  }
}

// ========== UTILITY FUNCTIONS ==========
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// ========== EXPORT FOR EXTERNAL ACCESS ==========
window.sendMessage = sendMessage;
