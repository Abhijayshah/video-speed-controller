/**
 * Modern notification system for Video Speed Controller
 * Provides elegant toast notifications for user feedback
 */

window.VSC = window.VSC || {};

class VSCNotification {
  constructor() {
    this.container = null;
    this.activeNotifications = new Set();
    this.maxNotifications = 3;
    this.defaultDuration = 3000;
    
    this.createContainer();
  }

  createContainer() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.className = 'vsc-notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    `;
    
    document.body.appendChild(this.container);
  }

  show(options = {}) {
    const {
      title = 'Video Speed Controller',
      message = '',
      type = 'info', // info, success, warning, error
      duration = this.defaultDuration,
      icon = null
    } = options;

    // Remove oldest notification if we have too many
    if (this.activeNotifications.size >= this.maxNotifications) {
      const oldest = this.activeNotifications.values().next().value;
      if (oldest) {
        this.remove(oldest);
      }
    }

    const notification = this.createNotification(title, message, type, icon);
    this.container.appendChild(notification);
    this.activeNotifications.add(notification);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      notification.classList.add('vsc-notification-show');
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  createNotification(title, message, type, icon) {
    const notification = document.createElement('div');
    notification.className = `vsc-notification vsc-notification-${type}`;
    
    const iconHtml = icon || this.getDefaultIcon(type);
    
    notification.innerHTML = `
      <div class="vsc-notification-content">
        <div class="vsc-notification-header">
          <div class="vsc-notification-icon">${iconHtml}</div>
          <div class="vsc-notification-title">${title}</div>
          <button class="vsc-notification-close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        ${message ? `<div class="vsc-notification-message">${message}</div>` : ''}
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      background: var(--vsc-surface, rgba(255, 255, 255, 0.95));
      backdrop-filter: var(--vsc-backdrop-blur, blur(12px));
      -webkit-backdrop-filter: var(--vsc-backdrop-blur, blur(12px));
      border: 1px solid var(--vsc-border, rgba(229, 231, 235, 0.8));
      border-radius: var(--vsc-border-radius, 12px);
      box-shadow: var(--vsc-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04));
      color: var(--vsc-text, #1f2937);
      margin-bottom: 12px;
      max-width: 320px;
      min-width: 280px;
      pointer-events: auto;
      transform: translateX(100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
    `;

    // Type-specific styling
    if (type === 'success') {
      notification.style.borderLeftColor = '#10b981';
    } else if (type === 'warning') {
      notification.style.borderLeftColor = '#f59e0b';
    } else if (type === 'error') {
      notification.style.borderLeftColor = '#ef4444';
    } else {
      notification.style.borderLeftColor = '#6366f1';
    }

    // Add internal styles
    const style = document.createElement('style');
    style.textContent = `
      .vsc-notification-show {
        transform: translateX(0) !important;
        opacity: 1 !important;
      }
      
      .vsc-notification-content {
        padding: 16px;
      }
      
      .vsc-notification-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      
      .vsc-notification-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .vsc-notification-title {
        font-weight: 600;
        font-size: 14px;
        flex: 1;
      }
      
      .vsc-notification-close {
        background: none;
        border: none;
        color: var(--vsc-text-secondary, #6b7280);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      
      .vsc-notification-close:hover {
        background-color: var(--vsc-surface-variant, rgba(0, 0, 0, 0.05));
        color: var(--vsc-text, #1f2937);
      }
      
      .vsc-notification-message {
        font-size: 13px;
        color: var(--vsc-text-secondary, #6b7280);
        margin-left: 28px;
        line-height: 1.4;
      }
    `;
    
    if (!document.querySelector('#vsc-notification-styles')) {
      style.id = 'vsc-notification-styles';
      document.head.appendChild(style);
    }

    // Add close button functionality
    const closeBtn = notification.querySelector('.vsc-notification-close');
    closeBtn.addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  getDefaultIcon(type) {
    const icons = {
      info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="#6366f1">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10A1,1 0 0,1 13,11V7A1,1 0 0,1 12,6A1,1 0 0,1 11,7V11A1,1 0 0,1 12,10Z"/>
      </svg>`,
      success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="#10b981">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
      </svg>`,
      warning: `<svg viewBox="0 0 24 24" width="20" height="20" fill="#f59e0b">
        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
      </svg>`,
      error: `<svg viewBox="0 0 24 24" width="20" height="20" fill="#ef4444">
        <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
      </svg>`
    };
    
    return icons[type] || icons.info;
  }

  remove(notification) {
    if (!notification || !this.activeNotifications.has(notification)) return;

    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      this.activeNotifications.delete(notification);
    }, 300);
  }

  clear() {
    this.activeNotifications.forEach(notification => {
      this.remove(notification);
    });
  }

  // Convenience methods
  info(title, message, duration) {
    return this.show({ title, message, type: 'info', duration });
  }

  success(title, message, duration) {
    return this.show({ title, message, type: 'success', duration });
  }

  warning(title, message, duration) {
    return this.show({ title, message, type: 'warning', duration });
  }

  error(title, message, duration) {
    return this.show({ title, message, type: 'error', duration });
  }

  speedChange(speed, action = '') {
    const speedText = `${speed.toFixed(1)}x`;
    const actionText = action ? ` (${action})` : '';
    
    return this.show({
      title: 'Speed Changed',
      message: `Playback speed: ${speedText}${actionText}`,
      type: 'info',
      duration: 2000,
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="#6366f1">
        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
      </svg>`
    });
  }
}

// Create global instance
window.VSC.notification = new VSCNotification();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VSCNotification;
}