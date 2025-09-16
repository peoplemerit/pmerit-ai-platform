// Chatbox interactivity (stub for extensibility)
window.addEventListener('DOMContentLoaded', () => {
  // Character count for chat input
  document.body.addEventListener('input', (e) => {
    if (e.target.matches('textarea')) {
      const countSpan = document.querySelector('.count');
      if (countSpan) countSpan.textContent = `${e.target.value.length}/500`;
    }
  });

  // Send button (stub action)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#sendBtn')) {
      const textarea = document.querySelector('textarea');
      if (textarea && textarea.value.trim().length > 0) {
        // Insert a user bubble (stub, expand for real chat)
        const chatBody = document.querySelector('.chat-body');
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = `<span class="ava"><i class="fas fa-user"></i></span>
          <div>
            <p>${textarea.value}</p>
          </div>`;
        chatBody.appendChild(bubble);
        textarea.value = '';
        document.querySelector('.count').textContent = '0/500';
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  });
});
