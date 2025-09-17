/**
 * Enhanced keyboard feedback system for Video Speed Controller
 * Provides visual feedback when keyboard shortcuts are used
 */

window.VSC = window.VSC || {};

class VSCKeyboardFeedback {
  constructor() {
    this.feedbackElement = null;
    this.feedbackTimeout = null;
    this.isVisible = false;
    
    this.createFeedbackElement();
    this.setupKeyboardListener();
  }

  createFeedbackElement() {
    if (this.feedbackElement) return;
    
    this.feedbackElement = document.createElement('div');
    this.feedbackElement.className = 'vsc-keyboard-feedback';
    this.feedbackElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: var(--vsc-surface, rgba(255, 255, 255, 0.95));
      backdrop-filter: var(--vsc-backdrop-blur, blur(12px));
      -webkit-backdrop-filter: var(--vsc-backdrop-blur, blur(12px));
      border: 1px solid var(--vsc-border, rgba(229, 231, 235, 0.8));
      border-radius: var(--vsc-border-radius, 12px);
      box-shadow: var(--vsc-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04));
      color: var(--vsc-text, #1f2937);
      padding: 20px 24px;
      z-index: 2147483647;
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      text-align: center;
      min-width: 200px;
      max-width: 300px;
    `;
    
    document.body.appendChild(this.feedbackElement);
  }

  show(content, duration = 1500) {
    if (!this.feedbackElement) return;
    
    // Clear any existing timeout
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
    
    // Update content
    this.feedbackElement.innerHTML = content;
    
    // Show with animation
    this.feedbackElement.style.opacity = '1';
    this.feedbackElement.style.transform = 'translate(-50%, -50%) scale(1)';
    this.isVisible = true;
    
    // Auto-hide after duration
    this.feedbackTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    if (!this.feedbackElement || !this.isVisible) return;
    
    this.feedbackElement.style.opacity = '0';
    this.feedbackElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
    this.isVisible = false;
    
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }
  }

  setupKeyboardListener() {
    document.addEventListener('keydown', (event) => {
      // Only show feedback for VSC shortcuts
      if (this.isVSCShortcut(event)) {
        this.handleShortcut(event);
      }
    });
  }

  isVSCShortcut(event) {
    // Check if this is a VSC shortcut key
    const key = event.key.toLowerCase();
    const vscKeys = ['s', 'd', 'r', 'z', 'x', 'g', 'v', 'm', 'j'];
    
    // Don't trigger if user is typing in an input field
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    )) {
      return false;
    }
    
    return vscKeys.includes(key) && !event.ctrlKey && !event.metaKey && !event.altKey;
  }

  handleShortcut(event) {
    const key = event.key.toLowerCase();
    const shortcutInfo = this.getShortcutInfo(key);
    
    if (shortcutInfo) {
      this.showShortcutFeedback(shortcutInfo);
    }
  }

  getShortcutInfo(key) {
    const shortcuts = {
      's': {
        name: 'Decrease Speed',
        icon: '⏪',
        description: 'Slow down playback'
      },
      'd': {
        name: 'Increase Speed',
        icon: '⏩',
        description: 'Speed up playback'
      },
      'r': {
        name: 'Reset Speed',
        icon: '⏯️',
        description: 'Reset to 1.0x speed'
      },
      'z': {
        name: 'Rewind',
        icon: '⏮️',
        description: 'Go back 10 seconds'
      },
      'x': {
        name: 'Forward',
        icon: '⏭️',
        description: 'Go forward 10 seconds'
      },
      'g': {
        name: 'Toggle Preferred',
        icon: '🔄',
        description: 'Toggle preferred speed'
      },
      'v': {
        name: 'Toggle Controller',
        icon: '👁️',
        description: 'Show/hide controller'
      },
      'm': {
        name: 'Set Marker',
        icon: '📍',
        description: 'Mark current position'
      },
      'j': {
        name: 'Jump to Marker',
        icon: '🎯',
        description: 'Jump to marked position'
      }
    };
    
    return shortcuts[key];
  }

  showShortcutFeedback(shortcutInfo) {
    const content = `
      <div class="vsc-feedback-content">
        <div class="vsc-feedback-icon">${shortcutInfo.icon}</div>
        <div class="vsc-feedback-name">${shortcutInfo.name}</div>
        <div class="vsc-feedback-description">${shortcutInfo.description}</div>
      </div>
    `;
    
    // Add internal styles if not already added
    if (!document.querySelector('#vsc-feedback-styles')) {
      const style = document.createElement('style');
      style.id = 'vsc-feedback-styles';
      style.textContent = `
        .vsc-feedback-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .vsc-feedback-icon {
          font-size: 32px;
          line-height: 1;
        }
        
        .vsc-feedback-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--vsc-primary, #6366f1);
        }
        
        .vsc-feedback-description {
          font-size: 13px;
          color: var(--vsc-text-secondary, #6b7280);
          opacity: 0.8;
        }
      `;
      document.head.appendChild(style);
    }
    
    this.show(content);
  }

  showSpeedChange(speed, action = '') {
    const speedText = `${speed.toFixed(1)}x`;
    const actionText = action ? ` (${action})` : '';
    
    const content = `
      <div class="vsc-feedback-content">
        <div class="vsc-feedback-icon">⚡</div>
        <div class="vsc-feedback-name">Speed: ${speedText}</div>
        <div class="vsc-feedback-description">Playback speed changed${actionText}</div>
      </div>
    `;
    
    this.show(content, 1000);
  }

  showCustomMessage(icon, title, description, duration = 1500) {
    const content = `
      <div class="vsc-feedback-content">
        <div class="vsc-feedback-icon">${icon}</div>
        <div class="vsc-feedback-name">${title}</div>
        <div class="vsc-feedback-description">${description}</div>
      </div>
    `;
    
    this.show(content, duration);
  }
}

// Create global instance
window.VSC.keyboardFeedback = new VSCKeyboardFeedback();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VSCKeyboardFeedback;
}