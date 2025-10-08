/**
 * PMERIT Chat Interface Controller
 * Version: 2.0
 * Last Updated: October 2025
 * 
 * Handles chat messages, auto-scroll, typing indicators, and message submission
 */

class ChatInterface {
    constructor() {
        this.chatContainer = document.querySelector('.chat-container');
        this.messageInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.chat-send-button');
        this.messagesWrapper = document.querySelector('.chat-messages');
        
        this.messages = [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        if (!this.messageInput || !this.sendButton) {
            return;
        }
        
        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Auto-resize textarea as user types
        if (this.messageInput.tagName === 'TEXTAREA') {
            this.messageInput.addEventListener('input', () => this.autoResize());
        }
        
        // Load any existing messages
        this.loadMessages();
    }
    
    handleSend() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage({
            text: message,
            sender: 'user',
            timestamp: new Date()
        });
        
        // Clear input
        this.messageInput.value = '';
        this.autoResize();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage({
                text: this.generateResponse(message),
                sender: 'ai',
                timestamp: new Date()
            });
        }, 1500);
    }
    
    handleKeydown(e) {
        // Send on Enter (but not Shift+Enter for multiline)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    }
    
    addMessage(messageData) {
        // Store message
        this.messages.push(messageData);
        
        // Create message element
        const messageEl = this.createMessageElement(messageData);
        
        // Add to DOM
        if (this.messagesWrapper) {
            this.messagesWrapper.appendChild(messageEl);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Save to localStorage (optional)
        this.saveMessages();
    }
    
    createMessageElement(messageData) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-${messageData.sender}`;
        
        // Message bubble
        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble';
        bubbleEl.textContent = messageData.text;
        
        // Timestamp
        const timeEl = document.createElement('div');
        timeEl.className = 'chat-timestamp';
        timeEl.textContent = this.formatTimestamp(messageData.timestamp);
        
        messageEl.appendChild(bubbleEl);
        messageEl.appendChild(timeEl);
        
        return messageEl;
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-typing-indicator';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="chat-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        
        if (this.messagesWrapper) {
            this.messagesWrapper.appendChild(typingEl);
            this.scrollToBottom();
        }
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }
    
    scrollToBottom() {
        if (this.messagesWrapper) {
            // Smooth scroll to bottom
            this.messagesWrapper.scrollTo({
                top: this.messagesWrapper.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
    
    autoResize() {
        // Auto-resize textarea based on content
        if (this.messageInput.tagName === 'TEXTAREA') {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = `${this.messageInput.scrollHeight}px`;
        }
    }
    
    formatTimestamp(date) {
        const now = new Date();
        const diff = now - date;
        
        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }
        
        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        }
        
        // Today
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
            });
        }
        
        // Older
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    generateResponse(userMessage) {
        // Placeholder AI response (replace with actual API call)
        const responses = [
            "That's a great question! Let me help you with that.",
            "I understand what you're looking for. Here's what I can tell you...",
            "Based on your interests, I recommend exploring our programming courses.",
            "Let me provide you with some personalized guidance on that topic.",
            "Great choice! Here are some resources that might help you."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    saveMessages() {
        // Save messages to localStorage (optional)
        try {
            const messagesData = this.messages.map(msg => ({
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp.toISOString()
            }));
            // Note: localStorage is not available in Claude artifacts
            // This would work in a real browser environment
            // localStorage.setItem('pmerit_chat_messages', JSON.stringify(messagesData));
        } catch (e) {
            // Silently fail if localStorage is not available
        }
    }
    
    loadMessages() {
        // Load messages from localStorage (optional)
        try {
            // const savedMessages = localStorage.getItem('pmerit_chat_messages');
            // if (savedMessages) {
            //     const messagesData = JSON.parse(savedMessages);
            //     messagesData.forEach(msg => {
            //         this.addMessage({
            //             text: msg.text,
            //             sender: msg.sender,
            //             timestamp: new Date(msg.timestamp)
            //         });
            //     });
            // }
        } catch (e) {
            // Silently fail if localStorage is not available
        }
    }
    
    clearMessages() {
        this.messages = [];
        if (this.messagesWrapper) {
            this.messagesWrapper.innerHTML = '';
        }
        
        try {
            // localStorage.removeItem('pmerit_chat_messages');
        } catch (e) {
            // Silently fail
        }
    }
}

// Initialize chat interface when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatInterface = new ChatInterface();
    });
} else {
    window.chatInterface = new ChatInterface();
}

// Export for use in other modules
export default ChatInterface;
