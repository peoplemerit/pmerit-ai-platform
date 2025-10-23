(function () {
  function initChat() {
    const form = document.getElementById('chat-form');
    const log = document.getElementById('chat-log');
    if (!form || !log) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const value = (input.value || '').trim();
      if (!value) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg chat-msg-user';
      userMsg.textContent = value;
      log.appendChild(userMsg);
      input.value = '';

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg chat-msg-bot';
      botMsg.textContent = 'Thinking... (mock response)';
      log.appendChild(botMsg);
      log.scrollTop = log.scrollHeight;
    });
  }

  document.addEventListener('DOMContentLoaded', initChat);
})();
