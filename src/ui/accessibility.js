/**
 * Accessibility enhancements for Video Speed Controller
 * Provides screen reader support, ARIA labels, and keyboard navigation
 */

window.VSC = window.VSC || {};

class VSCAccessibility {
  constructor() {
    this.announcer = null;
    this.lastAnnouncement = '';
    this.announcementTimeout = null;
    
    this.createScreenReaderAnnouncer();
    this.enhanceExistingElements();
    this.setupKeyboardNavigation();
  }

  createScreenReaderAnnouncer() {
    if (this.announcer) return;
    
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.setAttribute('role', 'status');
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    `;
    
    document.body.appendChild(this.announcer);
  }

  announce(message, priority = 'polite') {
    if (!this.announcer || !message || message === this.lastAnnouncement) return;
    
    // Clear any pending announcement
    if (this.announcementTimeout) {
      clearTimeout(this.announcementTimeout);
    }
    
    // Set aria-live attribute based on priority
    this.announcer.setAttribute('aria-live', priority);
    
    // Clear and set new message
    this.announcer.textContent = '';
    
    this.announcementTimeout = setTimeout(() => {
      this.announcer.textContent = message;
      this.lastAnnouncement = message;
      
      // Clear after announcement to avoid repetition
      setTimeout(() => {
        this.announcer.textContent = '';
      }, 1000);
    }, 100);
  }

  enhanceExistingElements() {
    // Enhance controller elements when they're created
    this.observeControllerCreation();
    
    // Enhance any existing controllers
    this.enhanceControllers();
  }

  observeControllerCreation() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'VSC-CONTROLLER' || node.classList?.contains('vsc-controller')) {
              this.enhanceController(node);
            }
            
            // Check for controllers in added subtree
            const controllers = node.querySelectorAll?.('vsc-controller, .vsc-controller');
            controllers?.forEach(controller => this.enhanceController(controller));
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  enhanceControllers() {
    const controllers = document.querySelectorAll('vsc-controller, .vsc-controller');
    controllers.forEach(controller => this.enhanceController(controller));
  }

  enhanceController(controller) {
    if (!controller || controller.hasAttribute('data-vsc-accessible')) return;
    
    // Mark as enhanced
    controller.setAttribute('data-vsc-accessible', 'true');
    
    // Add ARIA attributes
    controller.setAttribute('role', 'toolbar');
    controller.setAttribute('aria-label', 'Video Speed Controller');
    controller.setAttribute('aria-description', 'Controls for adjusting video playback speed');
    
    // Make focusable
    if (!controller.hasAttribute('tabindex')) {
      controller.setAttribute('tabindex', '0');
    }
    
    // Add keyboard navigation
    this.addControllerKeyboardNavigation(controller);
    
    // Enhance child elements
    this.enhanceControllerChildren(controller);
  }

  enhanceControllerChildren(controller) {
    // Enhance speed display
    const speedDisplay = controller.querySelector('.vsc-speed-display, [class*="speed"]');
    if (speedDisplay) {
      speedDisplay.setAttribute('role', 'status');
      speedDisplay.setAttribute('aria-live', 'polite');
      speedDisplay.setAttribute('aria-label', 'Current playback speed');
    }
    
    // Enhance buttons
    const buttons = controller.querySelectorAll('button, .vsc-btn');
    buttons.forEach((button, index) => {
      if (!button.hasAttribute('aria-label') && !button.hasAttribute('title')) {
        const text = button.textContent?.trim() || `Control ${index + 1}`;
        button.setAttribute('aria-label', text);
      }
      
      // Ensure buttons are focusable
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
    });
  }

  addControllerKeyboardNavigation(controller) {
    controller.addEventListener('keydown', (event) => {
      const focusableElements = this.getFocusableElements(controller);
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          this.focusNext(focusableElements, currentIndex);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          this.focusPrevious(focusableElements, currentIndex);
          break;
          
        case 'Home':
          event.preventDefault();
          this.focusFirst(focusableElements);
          break;
          
        case 'End':
          event.preventDefault();
          this.focusLast(focusableElements);
          break;
          
        case 'Escape':
          event.preventDefault();
          controller.blur();
          break;
      }
    });
  }

  getFocusableElements(container) {
    const selector = 'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';
    return container.querySelectorAll(selector);
  }

  focusNext(elements, currentIndex) {
    const nextIndex = (currentIndex + 1) % elements.length;
    elements[nextIndex]?.focus();
  }

  focusPrevious(elements, currentIndex) {
    const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    elements[prevIndex]?.focus();
  }

  focusFirst(elements) {
    elements[0]?.focus();
  }

  focusLast(elements) {
    elements[elements.length - 1]?.focus();
  }

  setupKeyboardNavigation() {
    // Global keyboard shortcuts with announcements
    document.addEventListener('keydown', (event) => {
      if (this.shouldHandleKeyboard(event)) {
        this.handleAccessibleKeyboard(event);
      }
    });
  }

  shouldHandleKeyboard(event) {
    // Don't handle if user is typing in an input
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    )) {
      return false;
    }
    
    return true;
  }

  handleAccessibleKeyboard(event) {
    const key = event.key.toLowerCase();
    
    // Don't interfere with modifier keys
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    
    switch (key) {
      case 's':
        this.announce('Decreasing playback speed', 'assertive');
        break;
      case 'd':
        this.announce('Increasing playback speed', 'assertive');
        break;
      case 'r':
        this.announce('Resetting playback speed to normal', 'assertive');
        break;
      case 'z':
        this.announce('Rewinding 10 seconds', 'assertive');
        break;
      case 'x':
        this.announce('Fast forwarding 10 seconds', 'assertive');
        break;
      case 'g':
        this.announce('Toggling preferred speed', 'assertive');
        break;
      case 'v':
        this.announce('Toggling speed controller visibility', 'assertive');
        break;
      case 'm':
        this.announce('Setting marker at current position', 'assertive');
        break;
      case 'j':
        this.announce('Jumping to marked position', 'assertive');
        break;
    }
  }

  announceSpeedChange(speed, action = '') {
    const speedText = `${speed.toFixed(1)} times normal speed`;
    const actionText = action ? ` ${action}` : '';
    const message = `Playback speed changed to ${speedText}${actionText}`;
    
    this.announce(message, 'assertive');
  }

  announceError(message) {
    this.announce(`Error: ${message}`, 'assertive');
  }

  announceSuccess(message) {
    this.announce(message, 'polite');
  }

  // High contrast mode detection and enhancement
  detectHighContrastMode() {
    // Check for Windows high contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.enableHighContrastMode();
    }
    
    // Listen for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableHighContrastMode();
      } else {
        this.disableHighContrastMode();
      }
    });
  }

  enableHighContrastMode() {
    document.documentElement.classList.add('vsc-high-contrast');
    
    // Add high contrast styles if not already added
    if (!document.querySelector('#vsc-high-contrast-styles')) {
      const style = document.createElement('style');
      style.id = 'vsc-high-contrast-styles';
      style.textContent = `
        .vsc-high-contrast .vsc-controller,
        .vsc-high-contrast vsc-controller {
          border: 2px solid !important;
          background: Window !important;
          color: WindowText !important;
        }
        
        .vsc-high-contrast .vsc-btn,
        .vsc-high-contrast button {
          border: 2px solid WindowText !important;
          background: ButtonFace !important;
          color: ButtonText !important;
        }
        
        .vsc-high-contrast .vsc-btn:hover,
        .vsc-high-contrast button:hover {
          background: Highlight !important;
          color: HighlightText !important;
        }
        
        .vsc-high-contrast .vsc-btn:focus,
        .vsc-high-contrast button:focus {
          outline: 3px solid Highlight !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  disableHighContrastMode() {
    document.documentElement.classList.remove('vsc-high-contrast');
  }

  // Reduced motion support
  setupReducedMotionSupport() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableReducedMotion();
    }
    
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableReducedMotion();
      } else {
        this.disableReducedMotion();
      }
    });
  }

  enableReducedMotion() {
    document.documentElement.classList.add('vsc-reduced-motion');
  }

  disableReducedMotion() {
    document.documentElement.classList.remove('vsc-reduced-motion');
  }

  // Initialize all accessibility features
  init() {
    this.detectHighContrastMode();
    this.setupReducedMotionSupport();
    this.announce('Video Speed Controller accessibility features enabled');
  }
}

// Create global instance and initialize
window.VSC.accessibility = new VSCAccessibility();
window.VSC.accessibility.init();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VSCAccessibility;
}