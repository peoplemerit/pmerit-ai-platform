/**
 * PMERIT Chat Module
 * Version: 1.0
 * 
 * Dedicated chat functionality for managing conversations
 */

(function(window) {
    'use strict';

    // ============================================
    // CHAT MANAGER
    // ============================================
    
    const ChatManager = {
        messages: [],
        isTyping: false,
        typingTimeout: null,
        maxMessages: 100,
        
        /**
         * Initialize Chat Manager
         */
        init: function() {
            console.log('✅ Chat Manager initialized');
        },
        
        /**
         * Add message to chat
         */
        addMessage: function(sender, text, isUser = false) {
            const message = {
                id: this.generateMessageId(),
                sender: sender,
                text: text,
                isUser: isUser,
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(message);
            
            // Limit message history
            if (this.messages.length > this.maxMessages) {
                this.messages.shift();
            }
            
            return message;
        },
        
        /**
         * Create chat bubble element
         */
        createBubble: function(sender, text, isUser = false) {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'bubble-avatar';
            avatar.innerHTML = isUser 
                ? '<i class="fas fa-user"></i>' 
                : '<i class="fas fa-robot"></i>';
            
            const content = document.createElement('div');
            content.className = 'bubble-content';
            
            const senderLabel = document.createElement('h3');
            senderLabel.className = 'bubble-sender';
            senderLabel.textContent = sender;
            
            const textElement = document.createElement('p');
            textElement.className = 'bubble-text';
            textElement.textContent = text;
            
            content.appendChild(senderLabel);
            content.appendChild(textElement);
            bubble.appendChild(avatar);
            bubble.appendChild(content);
            
            return bubble;
        },
        
        /**
         * Display message in chat container
         */
        displayMessage: function(sender, text, isUser = false, containerId = 'chatMessages') {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Chat container "${containerId}" not found`);
                return;
            }
            
            const bubble = this.createBubble(sender, text, isUser);
            container.appendChild(bubble);
            
            // Add to message history
            this.addMessage(sender, text, isUser);
            
            // Scroll to bottom
            this.scrollToBottom(containerId);
            
            return bubble;
        },
        
        /**
         * Send user message
         */
        sendUserMessage: function(text, containerId = 'chatMessages') {
            if (!text || !text.trim()) return;
            
            // Display user message
            this.displayMessage('You', text, true, containerId);
            
            // Show typing indicator
            this.showTypingIndicator(containerId);
            
            // Simulate AI response (replace with actual API call)
            setTimeout(() => {
                this.hideTypingIndicator(containerId);
                const response = this.generateResponse(text);
                this.displayMessage('PMERIT AI', response, false, containerId);
                
                // Speak response if TTS is enabled
                if (window.PMERITState && window.PMERITState.settings.ttsEnabled) {
                    if (window.PMERITVoice) {
                        window.PMERITVoice.speak(response);
                    }
                }
            }, 1500);
        },
        
        /**
         * Generate AI response (mock)
         */
        generateResponse: function(message) {
            const lowerMessage = message.toLowerCase();
            
            // Context-aware responses
            if (lowerMessage.includes('course') || lowerMessage.includes('program') || lowerMessage.includes('class')) {
                return 'We offer a wide range of courses including programming, data science, web development, and career preparation. Would you like to explore our course catalog or take an assessment to find the best path for you?';
            }
            
            if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
                return 'Our career tracks are designed to prepare you for success: Global Remote Careers (12 courses), Local Career Pathways (12 courses), and University Preparation (12 courses). Which path interests you most?';
            }
            
            if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist')) {
                return 'I\'m here to help! You can ask about courses, career paths, assessments, or any questions about your learning journey. What would you like to know more about?';
            }
            
            if (lowerMessage.includes('assessment') || lowerMessage.includes('test') || lowerMessage.includes('evaluate')) {
                return 'Our personalized assessment takes about 5 minutes and helps us understand your learning style, interests, and skills. It will create a custom learning plan just for you. Would you like to begin?';
            }
            
            if (lowerMessage.includes('language') || lowerMessage.includes('translate')) {
                return 'PMERIT supports multiple languages including English, Yorùbá, Igbo, and Hausa. You can change your language preference using the language selector in the header.';
            }
            
            if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free')) {
                return 'PMERIT is committed to making education accessible. Many of our courses are free, and we offer scholarship opportunities for qualified learners. Would you like to learn more about our pricing and scholarship options?';
            }
            
            if (lowerMessage.includes('certificate') || lowerMessage.includes('certification')) {
                return 'Yes! Upon completing courses, you\'ll receive certificates that you can share on your resume and LinkedIn profile. Our certificates are recognized by employers worldwide.';
            }
            
            if (lowerMessage.includes('time') || lowerMessage.includes('duration') || lowerMessage.includes('long')) {
                return 'Course durations vary based on your pace. Most courses can be completed in 4-8 weeks with 5-10 hours of study per week. You can learn at your own pace and on your own schedule.';
            }
            
            if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('enroll')) {
                return 'Great! You can start by taking our free assessment to find the best courses for you, or browse our course catalog directly. Would you like to begin your assessment now?';
            }
            
            if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
                return 'Hello! Welcome to PMERIT. I\'m your learning companion, here to help you explore courses, career paths, and answer any questions. What would you like to know?';
            }
            
            if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
                return 'You\'re welcome! Is there anything else I can help you with today?';
            }
            
            // Default response
            return 'That\'s a great question! I can help you with information about our courses, career paths, assessments, and learning resources. What specific area would you like to explore?';
        },
        
        /**
         * Show typing indicator
         */
        showTypingIndicator: function(containerId = 'chatMessages') {
            const indicatorId = containerId === 'chatMessages' ? 'typingIndicator' : 'desktopTypingIndicator';
            const indicator = document.getElementById(indicatorId);
            
            if (indicator) {
                indicator.style.display = 'flex';
                this.isTyping = true;
                this.scrollToBottom(containerId);
            }
        },
        
        /**
         * Hide typing indicator
         */
        hideTypingIndicator: function(containerId = 'chatMessages') {
            const indicatorId = containerId === 'chatMessages' ? 'typingIndicator' : 'desktopTypingIndicator';
            const indicator = document.getElementById(indicatorId);
            
            if (indicator) {
                indicator.style.display = 'none';
                this.isTyping = false;
            }
        },
        
        /**
         * Scroll chat to bottom
         */
        scrollToBottom: function(containerId = 'chatMessages') {
            const container = document.getElementById(containerId);
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        /**
         * Clear all messages
         */
        clearMessages: function(containerId = 'chatMessages') {
            const container = document.getElementById(containerId);
            if (container) {
                // Keep the welcome message if it exists
                const welcomeMessage = container.querySelector('.chat-bubble:first-child');
                container.innerHTML = '';
                if (welcomeMessage) {
                    container.appendChild(welcomeMessage);
                }
            }
            
            this.messages = [];
        },
        
        /**
         * Get message history
         */
        getMessages: function() {
            return this.messages;
        },
        
        /**
         * Export chat history
         */
        exportChat: function() {
            return JSON.stringify(this.messages, null, 2);
        },
        
        /**
         * Generate unique message ID
         */
        generateMessageId: function() {
            return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },
        
        /**
         * Search messages
         */
        searchMessages: function(query) {
            const lowerQuery = query.toLowerCase();
            return this.messages.filter(message => 
                message.text.toLowerCase().includes(lowerQuery) ||
                message.sender.toLowerCase().includes(lowerQuery)
            );
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITChat = ChatManager;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ChatManager.init());
    } else {
        ChatManager.init();
    }

})(window);
