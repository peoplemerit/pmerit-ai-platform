/**
 * PMERIT Modal Controller
 * Version: 2.0
 * Last Updated: October 2025
 * 
 * Handles modal dialogs (sign-in, sign-up, etc.)
 * Features: Focus trap, keyboard navigation, backdrop close
 */

class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.modalId = modalId;
        this.isOpen = false;
        this.previousFocus = null;
        
        if (this.modal) {
            this.init();
        }
    }
    
    init() {
        // Find modal elements
        this.backdrop = this.modal.querySelector('.modal-backdrop');
        this.closeButton = this.modal.querySelector('.modal-close');
        this.modalContent = this.modal.querySelector('.modal-content');
        
        // Event listeners
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        if (this.backdrop) {
            this.backdrop.addEventListener('click', (e) => {
                // Only close if clicking backdrop directly, not content
                if (e.target === this.backdrop) {
                    this.close();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Tab switching (if modal has tabs like Sign In / Sign Up)
        this.initTabs();
    }
    
    open() {
        if (this.isOpen || !this.modal) return;
        
        this.isOpen = true;
        
        // Store currently focused element
        this.previousFocus = document.activeElement;
        
        // Show modal
        this.modal.classList.add('modal-open');
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element in modal
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Trap focus
        this.trapFocus();
    }
    
    close() {
        if (!this.isOpen || !this.modal) return;
        
        this.isOpen = false;
        
        // Hide modal
        this.modal.classList.remove('modal-open');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to previous element
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = null;
        }
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    handleKeyboard(e) {
        // Close modal on Escape key
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    
    trapFocus() {
        if (!this.isOpen) return;
        
        const focusableElements = this.modal.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleFocusTrap = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        this.modal.addEventListener('keydown', handleFocusTrap);
    }
    
    initTabs() {
        // Handle tab switching (Sign In / Sign Up)
        const tabButtons = this.modal.querySelectorAll('[role="tab"]');
        const tabPanels = this.modal.querySelectorAll('[role="tabpanel"]');
        
        if (tabButtons.length === 0) return;
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Update buttons
                tabButtons.forEach(btn => {
                    btn.setAttribute('aria-selected', 'false');
                    btn.classList.remove('active');
                });
                button.setAttribute('aria-selected', 'true');
                button.classList.add('active');
                
                // Update panels
                tabPanels.forEach(panel => {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.classList.remove('active');
                });
                if (tabPanels[index]) {
                    tabPanels[index].setAttribute('aria-hidden', 'false');
                    tabPanels[index].classList.add('active');
                }
            });
            
            // Keyboard navigation for tabs
            button.addEventListener('keydown', (e) => {
                let newIndex = index;
                
                if (e.key === 'ArrowRight') {
                    newIndex = (index + 1) % tabButtons.length;
                } else if (e.key === 'ArrowLeft') {
                    newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                } else {
                    return;
                }
                
                e.preventDefault();
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            });
        });
    }
}

// Modal Manager - manages multiple modals
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }
    
    init() {
        // Find all modals on page
        const modalElements = document.querySelectorAll('[role="dialog"], .modal');
        modalElements.forEach(modalEl => {
            const modalId = modalEl.id;
            if (modalId) {
                this.modals.set(modalId, new Modal(modalId));
            }
        });
        
        // Listen for open modal triggers
        document.querySelectorAll('[data-modal-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetModalId = trigger.getAttribute('data-modal-target');
                this.open(targetModalId);
            });
        });
    }
    
    open(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.open();
        }
    }
    
    close(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.close();
        }
    }
    
    closeAll() {
        this.modals.forEach(modal => modal.close());
    }
}

// Initialize modal manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modalManager = new ModalManager();
    });
} else {
    window.modalManager = new ModalManager();
}

// Export classes to global scope for compatibility
window.Modal = Modal;
window.ModalManager = ModalManager;
