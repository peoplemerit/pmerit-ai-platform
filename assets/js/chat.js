// Add message to chat
function addMessage(sender, text, isUser = false) {
  if (document.getElementById('welcomeMsg')) {
    welcomeMsg.remove();
  }

  const messageEl = document.createElement('article');
  messageEl.className = 'bubble';
  
  messageEl.innerHTML = `
    <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
      <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
    </div>
    <div>
      <h3>${sender}</h3>
      <p>${text}</p>
    </div>
  `;
  
  chatBody.appendChild(messageEl);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // If TTS is enabled and it's an AI message, speak it
  if (state.tts && !isUser && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  
  // If VH mode is active, update captions
  if (state.vh && !isUser) {
    document.getElementById('captions').textContent = text;
  }
}

// Send message function
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage('You', text, true);
  
  // Clear input
  chatInput.value = '';
  count.textContent = '0/1000';
  
  // Simulate AI response
  setTimeout(() => {
    const reply = state.support
      ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
      : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
    addMessage('PMERIT AI', reply);
  }, 1000);
}
