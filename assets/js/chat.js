/**
 * PMERIT Chat Interface - Unified for Mobile & Desktop
 * Version: 7.0 (Chat Persistence with localStorage)
 * Last Updated: November 21, 2025
 * 
 * NEW: Chat history persists across page refreshes
 * Changes: Added localStorage persistence, auto-expiry, size limits
 * Handles: Mobile + Desktop inputs, Streaming AI, typing indicators, TTS
 * Connects to: Cloudflare Workers API
 */

// ========== CONFIGURATION ==========
const CONFIG = {
  API_URL: 'https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/ai/chat',
  MAX_HISTORY: 10,
  SYSTEM_PROMPT: '',  // System prompt now handled by backend
  
  // ✅ NEW: Persistence settings
  STORAGE_KEY: 'pmerit_chat_history',
  STORAGE_EXPIRY_HOURS: 24,  // Chat history expires after 24 hours
  MAX_STORED_MESSAGES: 20     // Limit storage to 20 messages max
};

// Helper to get page identifier for analytics
function pageId() {
  return location.pathname.includes('/portal/classroom') ? 'classroom' : 'home';
}

// ========== SHARED CONVERSATION HISTORY ==========
let conversationHistory = [];

// ========== LOCALSTORAGE HELPERS ==========

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
  try {
    const data = {
      version: '7.0',
      timestamp: Date.now(),
      page: pageId(),
      history: conversationHistory.slice(-CONFIG.MAX_STORED_MESSAGES) // Limit size
    };
    
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    logger.debug('💾 Chat history saved:', conversationHistory.length, 'messages');
  } catch (error) {
    console.warn('⚠️ Could not save chat history:', error.message);
    // Fail silently - localStorage may be disabled or full
  }
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
  try {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    
    if (!stored) {
      logger.debug('📭 No saved chat history found');
      return null;
    }
    
    const data = JSON.parse(stored);
    
    // Check expiry
    const ageHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (ageHours > CONFIG.STORAGE_EXPIRY_HOURS) {
      logger.debug('⏰ Chat history expired (age:', ageHours.toFixed(1), 'hours)');
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      return null;
    }
    
    // Only restore if on same page
    if (data.page !== pageId()) {
      logger.debug('📄 Chat history is from different page, not restoring');
      return null;
    }
    
    logger.debug('✅ Chat history loaded:', data.history.length, 'messages');
    return data.history;
    
  } catch (error) {
    console.warn('⚠️ Could not load chat history:', error.message);
    return null;
  }
}

/**
 * Clear stored chat history
 */
function clearStoredHistory() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    logger.debug('🧹 Stored chat history cleared');
  } catch (error) {
    console.warn('⚠️ Could not clear stored history:', error.message);
  }
}

/**
 * Restore UI from saved conversation history
 */
function restoreChatUI(history) {
  if (!history || history.length === 0) {
    return;
  }
  
  logger.debug('🔄 Restoring chat UI from history...');
  
  // Detect which chat interface is active
  const mobileMessages = document.getElementById('chatMessages');
  const desktopMessages = document.getElementById('desktopChatMessages');
  
  const source = mobileMessages ? 'mobile' : 'desktop';
  
  // Restore each message
  history.forEach((msg) => {
    if (msg.role === 'user') {
      addMessage(source, 'user', msg.content);
    } else if (msg.role === 'assistant') {
      addMessage(source, 'ai', msg.content);
    }
  });
  
  logger.debug('✅ Chat UI restored with', history.length, 'messages');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  logger.debug('💬 PMERIT Chat initializing...');
  
  // ✅ NEW: Load saved chat history
  const savedHistory = loadChatHistory();
  if (savedHistory) {
    conversationHistory = savedHistory;
    
    // Restore UI after a brief delay to ensure DOM is ready
    setTimeout(() => {
      restoreChatUI(savedHistory);
    }, 100);
  }
  
  initializeMobileChat();
  initializeDesktopChat();
  
  logger.debug('✅ Chat interface ready');
  logger.debug('🤖 Connected to:', CONFIG.API_URL);
  logger.debug('🚀 Model: Llama 3 8B Instruct (Streaming Enabled)');
  logger.debug('💾 Persistence: ENABLED (24h expiry)');
});

// ========== MOBILE CHAT INITIALIZATION ==========
function initializeMobileChat() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const charCount = document.getElementById('charCount');

  if (!chatInput || !sendBtn) {
    logger.debug('📱 Mobile chat elements not found (may be desktop view)');
    return;
  }

  logger.debug('📱 Initializing mobile chat...');

  // Character counter
  chatInput.addEventListener('input', function() {
    if (charCount) {
      charCount.textContent = `${this.value.length}/1000`;
      
      if (this.value.length > 0) {
        charCount.classList.remove('hidden');
      } else {
        charCount.classList.add('hidden');
      }
    }
    autoResize(this);
  });

  // Enter key to send (Shift+Enter for new line)
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('mobile');
    }
  });

  // Send button click
  sendBtn.addEventListener('click', () => sendMessage('mobile'));

  logger.debug('✅ Mobile chat initialized');
}

// ========== DESKTOP CHAT INITIALIZATION ==========
function initializeDesktopChat() {
  const desktopInput = document.getElementById('desktopChatInput');
  const desktopSendBtn = document.getElementById('sendBtnDesktop');
  const desktopCharCount = document.getElementById('desktopCharCount');

  if (!desktopInput || !desktopSendBtn) {
    logger.debug('🖥️ Desktop chat elements not found (may be mobile view)');
    return;
  }

  logger.debug('🖥️ Initializing desktop chat...');

  // Character counter
  desktopInput.addEventListener('input', function() {
    if (desktopCharCount) {
      desktopCharCount.textContent = `${this.value.length}/1000`;
      
      if (this.value.length > 0) {
        desktopCharCount.classList.remove('hidden');
      } else {
        desktopCharCount.classList.add('hidden');
      }
    }
    autoResize(this);
  });

  // Enter key to send (Shift+Enter for new line)
  desktopInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('desktop');
    }
  });

  // Send button click
  desktopSendBtn.addEventListener('click', () => sendMessage('desktop'));

  logger.debug('✅ Desktop chat initialized');
}

// ========== UNIFIED SEND MESSAGE WITH STREAMING ==========
async function sendMessage(source) {
  // Get the correct elements based on source
  const chatInput = source === 'mobile' 
    ? document.getElementById('chatInput')
    : document.getElementById('desktopChatInput');
    
  const sendBtn = source === 'mobile'
    ? document.getElementById('sendBtn')
    : document.getElementById('sendBtnDesktop');
    
  const chatMessages = source === 'mobile'
    ? document.getElementById('chatMessages')
    : document.getElementById('desktopChatMessages');
    
  const charCount = source === 'mobile'
    ? document.getElementById('charCount')
    : document.getElementById('desktopCharCount');

  if (!chatInput || !chatMessages) {
    console.error('❌ Chat elements not found for:', source);
    return;
  }

  const message = chatInput.value.trim();
  if (message === '') return;

  logger.debug(`📤 Sending message from ${source}:`, message);
  
  // Track user message
  window.analytics?.track('chat_message_user', {
    page: pageId(),
    ts: Date.now(),
    chars: message.length
  });

  // Disable input while processing
  chatInput.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  // Add user message to UI
  addMessage(source, 'user', message);

  // Add to conversation history
  conversationHistory.push({
    role: 'user',
    content: message
  });

  // Maintain history limit
  if (conversationHistory.length > CONFIG.MAX_HISTORY * 2) {
    conversationHistory = conversationHistory.slice(-(CONFIG.MAX_HISTORY * 2));
  }
  
  // ✅ NEW: Save to localStorage after user message
  saveChatHistory();

  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  if (charCount) {
    charCount.textContent = '0/1000';
    charCount.classList.add('hidden');
  }

  // Auto-scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Show typing indicator
  const typingIndicator = addTypingIndicator(source);

  try {
    logger.debug('🚀 Calling Cloudflare Workers AI (Streaming)...');
    const startTime = performance.now();
    
    // Call Workers API with streaming enabled
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory,
        stream: true
      })
    });

    // Remove typing indicator
    if (typingIndicator) {
      typingIndicator.remove();
    }

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = '';
    
    // Create AI message bubble (empty at first)
    const messageDiv = source === 'mobile' 
      ? createMobileMessageBubble('ai')
      : createDesktopMessageBubble('ai');
    
    chatMessages.appendChild(messageDiv);
    
    // Get the text content element
    const contentElement = source === 'mobile'
      ? messageDiv.querySelector('p')
      : messageDiv.querySelector('.message-content p');
    
    logger.debug('📡 Streaming response...');
    
    // Read stream chunks
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        logger.debug('✅ Stream complete');
        break;
      }
      
      // Decode chunk
      const chunk = decoder.decode(value, { stream: true });
      
      // Parse SSE data (Server-Sent Events format)
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.response) {
              // Append to response
              aiResponse += data.response;
              
              // Update UI in real-time
              if (contentElement) {
                contentElement.textContent = aiResponse;
              }
              
              // Auto-scroll as text appears
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            if (data.done) {
              break;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }
    
    const responseTime = ((performance.now() - startTime) / 1000).toFixed(2);
    logger.debug(`✅ Complete response received in ${responseTime}s`);
    
    // Track assistant message
    window.analytics?.track('chat_message_assistant', {
      page: pageId(),
      ts: Date.now(),
      chars: aiResponse.length
    });
    
    // Add to conversation history
    conversationHistory.push({
      role: 'assistant',
      content: aiResponse
    });
    
    // ✅ NEW: Save to localStorage after AI response
    saveChatHistory();
    
    // Speak if TTS enabled OR if Virtual Human mode is active
    if (document.body.classList.contains('tts-enabled') || document.body.classList.contains('vh-mode')) {
      speakMessage(aiResponse);
    }

  } catch (error) {
    // Remove typing indicator if still present
    if (typingIndicator) {
      typingIndicator.remove();
    }

    console.error('❌ AI Error:', error);
    
    // User-friendly error message
    let errorMessage = '⚠️ Sorry, I encountered an error connecting to the AI service. ';
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Please check your internet connection and try again.';
    } else if (error.message.includes('404')) {
      errorMessage += 'The AI service endpoint was not found. Please contact support.';
    } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      errorMessage += 'The AI service is temporarily unavailable. Please try again in a moment.';
    } else {
      errorMessage += 'Please try again or contact support if the problem persists.';
    }
    
    addMessage(source, 'ai', errorMessage);
  } finally {
    // Re-enable input
    chatInput.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    chatInput.focus();
  }
}

// ========== CREATE MOBILE MESSAGE BUBBLE ==========
function createMobileMessageBubble(sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  const messageContent = document.createElement('p');
  
  if (sender === 'ai') {
    const strong = document.createElement('strong');
    strong.textContent = '👋 PMERIT AI: ';
    messageContent.appendChild(strong);
  }
  
  messageDiv.appendChild(messageContent);

  // Fade-in animation
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease-out';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);

  return messageDiv;
}

// ========== CREATE DESKTOP MESSAGE BUBBLE ==========
function createDesktopMessageBubble(sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `desktop-chat-message ${sender === 'ai' ? 'ai-message' : 'user-message'}`;
  
  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = sender === 'ai' 
    ? '<i class="fas fa-robot"></i>' 
    : '<i class="fas fa-user"></i>';
  
  // Content
  const content = document.createElement('div');
  content.className = 'message-content';
  
  if (sender === 'ai') {
    const header = document.createElement('div');
    header.className = 'message-header';
    header.innerHTML = '<strong>PMERIT AI:</strong>';
    content.appendChild(header);
  }
  
  const p = document.createElement('p');
  content.appendChild(p);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  // Fade-in animation
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease-out';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);

  return messageDiv;
}

// ========== ADD MESSAGE (MOBILE) ==========
function addMessageMobile(sender, text) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const messageDiv = createMobileMessageBubble(sender);
  const messageContent = messageDiv.querySelector('p');
  
  if (sender === 'ai') {
    // Text goes after "PMERIT AI: "
    const textNode = document.createTextNode(text);
    messageContent.appendChild(textNode);
  } else {
    messageContent.textContent = text;
  }
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========== ADD MESSAGE (DESKTOP) ==========
function addMessageDesktop(sender, text) {
  const chatMessages = document.getElementById('desktopChatMessages');
  if (!chatMessages) return;

  const messageDiv = createDesktopMessageBubble(sender);
  const p = messageDiv.querySelector('.message-content p');
  p.textContent = text;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========== UNIFIED ADD MESSAGE ==========
function addMessage(source, sender, text) {
  if (source === 'mobile') {
    addMessageMobile(sender, text);
  } else {
    addMessageDesktop(sender, text);
  }
}

// ========== TYPING INDICATOR (MOBILE) ==========
function addTypingIndicatorMobile() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return null;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message ai typing-indicator';
  typingDiv.id = 'typingIndicatorMobile';
  
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = '👋 PMERIT AI: ';
  
  const dots = document.createElement('span');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  
  p.appendChild(strong);
  p.appendChild(dots);
  typingDiv.appendChild(p);
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return typingDiv;
}

// ========== TYPING INDICATOR (DESKTOP) ==========
function addTypingIndicatorDesktop() {
  const chatMessages = document.getElementById('desktopChatMessages');
  if (!chatMessages) return null;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'desktop-chat-message ai-message typing-indicator';
  typingDiv.id = 'typingIndicatorDesktop';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = '<i class="fas fa-robot"></i>';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  
  const header = document.createElement('div');
  header.className = 'message-header';
  header.innerHTML = '<strong>PMERIT AI:</strong>';
  
  const dots = document.createElement('span');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  
  content.appendChild(header);
  content.appendChild(dots);
  
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(content);
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return typingDiv;
}

// ========== UNIFIED TYPING INDICATOR ==========
function addTypingIndicator(source) {
  if (source === 'mobile') {
    return addTypingIndicatorMobile();
  } else {
    return addTypingIndicatorDesktop();
  }
}

// ========== TEXT-TO-SPEECH ==========
function speakMessage(text) {
  // Use new TTSClient if available
  if (window.TTSClient && typeof window.TTSClient.speak === 'function') {
    window.TTSClient.speak(text)
      .catch(error => {
        console.error('❌ TTS error:', error);
        // TTS client handles fallback internally, no need for additional fallback
      });
  } else {
    // Legacy browser TTS fallback (if TTSClient not loaded)
    console.warn('⚠️ TTSClient not loaded, using legacy browser TTS');
    fallbackToSpeechSynthesis(text);
  }
}

function fallbackToSpeechSynthesis(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('⚠️ Browser does not support speech synthesis');
    return;
  }
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

function fallbackToSpeechSynthesis(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// ========== AUTO-RESIZE TEXTAREA ==========
function autoResize(textarea) {
  textarea.style.height = 'auto';
  const maxHeight = textarea.classList.contains('desktop-chat-input') ? 140 : 120;
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
}

// ========== CLEAR CHAT (ENHANCED) ==========
function clearChat() {
  const mobileMessages = document.getElementById('chatMessages');
  const desktopMessages = document.getElementById('desktopChatMessages');
  
  if (mobileMessages) {
    mobileMessages.innerHTML = '';
  }
  
  if (desktopMessages) {
    desktopMessages.innerHTML = '';
  }
  
  // Reset conversation history
  conversationHistory = [];
  
  // ✅ NEW: Clear stored history
  clearStoredHistory();
  
  logger.debug('🧹 Chat cleared (UI + localStorage)');
}

// ========== EXPORT FOR EXTERNAL ACCESS ==========
window.sendMessage = sendMessage;
window.clearChat = clearChat;

// ✅ NEW: Export storage functions for debugging
window.PMERIT_Chat = {
  saveChatHistory,
  loadChatHistory,
  clearStoredHistory,
  getHistory: () => conversationHistory
};

// ========== DEBUG INFO ==========
logger.debug('📋 Chat Configuration:', {
  apiUrl: CONFIG.API_URL,
  model: 'Llama 3 8B Instruct (Cloudflare Workers AI)',
  streaming: 'ENABLED',
  maxHistory: CONFIG.MAX_HISTORY,
  backend: 'Cloudflare Workers (Edge Network)',
  persistence: 'ENABLED',
  storageExpiry: CONFIG.STORAGE_EXPIRY_HOURS + ' hours',
  maxStoredMessages: CONFIG.MAX_STORED_MESSAGES
});