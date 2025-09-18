function addMessage(sender, text, isUser = false) {
  if (document.getElementById('welcomeMsg')) {
    welcomeMsg.remove();
  }
  
  // Hide typing indicator when adding a message
  hideTypingIndicator();

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
  
  if (state.tts && !isUser && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  
  if (state.vh && !isUser) {
    document.getElementById('captions').textContent = text;
  }
}

function showTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.style.display = 'flex';
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage('You', text, true);
  
  chatInput.value = '';
  count.textContent = '0/1000';
  
  // Show typing indicator before AI response
  showTypingIndicator();
  
  setTimeout(() => {
    const reply = state.support
      ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
      : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
    addMessage('PMERIT AI', reply);
  }, 1500);
}
