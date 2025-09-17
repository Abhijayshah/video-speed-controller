// Message type constants
const MessageTypes = {
  SET_SPEED: 'VSC_SET_SPEED',
  ADJUST_SPEED: 'VSC_ADJUST_SPEED',
  RESET_SPEED: 'VSC_RESET_SPEED',
  TOGGLE_DISPLAY: 'VSC_TOGGLE_DISPLAY'
};

document.addEventListener("DOMContentLoaded", function () {
  // Load settings and initialize speed controls
  loadSettingsAndInitialize();

  // Initialize keyboard shortcuts toggle
  initializeShortcutsToggle();

  // Initialize analytics toggle
  initializeAnalyticsToggle();

  // Initialize current speed display
  initializeCurrentSpeedDisplay();

  // Load analytics data
  loadAnalyticsData();

  // Settings button event listener
  document.querySelector("#config").addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });

  // Power button toggle event listener
  document.querySelector("#disable").addEventListener("click", function () {
    // Toggle based on current state
    const isCurrentlyEnabled = !this.classList.contains("disabled");
    toggleEnabled(!isCurrentlyEnabled, settingsSavedReloadMessage);
  });

  // Initialize enabled state
  chrome.storage.sync.get({ enabled: true }, function (storage) {
    toggleEnabledUI(storage.enabled);
  });

  function toggleEnabled(enabled, callback) {
    chrome.storage.sync.set(
      {
        enabled: enabled
      },
      function () {
        toggleEnabledUI(enabled);
        if (callback) callback(enabled);
      }
    );
  }

  function toggleEnabledUI(enabled) {
    const disableBtn = document.querySelector("#disable");
    disableBtn.classList.toggle("disabled", !enabled);

    // Update tooltip
    disableBtn.title = enabled ? "Disable Extension" : "Enable Extension";

    const suffix = enabled ? "" : "_disabled";
    chrome.action.setIcon({
      path: {
        "19": chrome.runtime.getURL(`assets/icons/icon19${suffix}.png`),
        "38": chrome.runtime.getURL(`assets/icons/icon38${suffix}.png`),
        "48": chrome.runtime.getURL(`assets/icons/icon48${suffix}.png`)
      }
    });

    // Notify background script of state change
    chrome.runtime.sendMessage({ type: 'EXTENSION_TOGGLE', enabled: enabled });
  }

  function settingsSavedReloadMessage(enabled) {
    setStatusMessage(
      `${enabled ? "Enabled" : "Disabled"}. Reload page.`
    );
  }

  function setStatusMessage(str) {
    const status_element = document.querySelector("#status");
    status_element.classList.toggle("hide", false);
    status_element.innerText = str;
  }

  // Load settings and initialize UI
  function loadSettingsAndInitialize() {
    chrome.storage.sync.get(null, function (storage) {
      // Find the step values from keyBindings
      let slowerStep = 0.1;
      let fasterStep = 0.1;
      let resetSpeed = 1.0;

      if (storage.keyBindings && Array.isArray(storage.keyBindings)) {
        const slowerBinding = storage.keyBindings.find(kb => kb.action === "slower");
        const fasterBinding = storage.keyBindings.find(kb => kb.action === "faster");
        const fastBinding = storage.keyBindings.find(kb => kb.action === "fast");

        if (slowerBinding && typeof slowerBinding.value === 'number') {
          slowerStep = slowerBinding.value;
        }
        if (fasterBinding && typeof fasterBinding.value === 'number') {
          fasterStep = fasterBinding.value;
        }
        if (fastBinding && typeof fastBinding.value === 'number') {
          resetSpeed = fastBinding.value;
        }
      }

      // Update the UI with dynamic values
      updateSpeedControlsUI(slowerStep, fasterStep, resetSpeed);

      // Initialize event listeners
      initializeSpeedControls(slowerStep, fasterStep);
    });
  }

  function updateSpeedControlsUI(slowerStep, fasterStep, resetSpeed) {
    // Update decrease button
    const decreaseBtn = document.querySelector("#speed-decrease");
    if (decreaseBtn) {
      decreaseBtn.dataset.delta = -slowerStep;
      decreaseBtn.querySelector("span").textContent = `-${slowerStep}`;
    }

    // Update increase button  
    const increaseBtn = document.querySelector("#speed-increase");
    if (increaseBtn) {
      increaseBtn.dataset.delta = fasterStep;
      increaseBtn.querySelector("span").textContent = `+${fasterStep}`;
    }

    // Update reset button
    const resetBtn = document.querySelector("#speed-reset");
    if (resetBtn) {
      resetBtn.textContent = resetSpeed.toString();
    }
  }

  // Speed Control Functions
  function initializeSpeedControls(slowerStep, fasterStep) {
    // Set up speed control button listeners
    document.querySelector("#speed-decrease").addEventListener("click", function () {
      const delta = parseFloat(this.dataset.delta);
      adjustSpeed(delta);
    });

    document.querySelector("#speed-increase").addEventListener("click", function () {
      const delta = parseFloat(this.dataset.delta);
      adjustSpeed(delta);
    });

    document.querySelector("#speed-reset").addEventListener("click", function () {
      // Set directly to preferred speed instead of toggling
      const preferredSpeed = parseFloat(this.textContent);
      setSpeed(preferredSpeed);
    });

    // Set up preset button listeners
    document.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const speed = parseFloat(this.dataset.speed);
        setSpeed(speed);
      });
    });
  }

  function setSpeed(speed) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: MessageTypes.SET_SPEED,
          payload: { speed: speed }
        });
        
        // Update current speed display
        updateCurrentSpeedDisplay(speed);
        
        // Add visual feedback
        addButtonFeedback(event.target);
      }
    });
  }

  function adjustSpeed(delta) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: MessageTypes.ADJUST_SPEED,
          payload: { delta: delta }
        });
        
        // Add visual feedback
        addButtonFeedback(event.target);
      }
    });
  }

  function resetSpeed() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: MessageTypes.RESET_SPEED
        });
        
        // Update current speed display
        updateCurrentSpeedDisplay(1.0);
        
        // Add visual feedback
        addButtonFeedback(event.target);
      }
    });
  }

  // Initialize keyboard shortcuts toggle functionality
  function initializeShortcutsToggle() {
    const toggle = document.querySelector("#shortcuts-toggle");
    const content = document.querySelector("#shortcuts-content");
    
    if (toggle && content) {
      toggle.addEventListener("click", function() {
        const isExpanded = content.classList.contains("expanded");
        
        if (isExpanded) {
          content.classList.remove("expanded");
          toggle.classList.remove("expanded");
        } else {
          content.classList.add("expanded");
          toggle.classList.add("expanded");
        }
      });
    }
  }

  // Initialize current speed display
  function initializeCurrentSpeedDisplay() {
    // Get current speed from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'VSC_GET_SPEED'
        }, function(response) {
          if (response && response.speed) {
            updateCurrentSpeedDisplay(response.speed);
          }
        });
      }
    });
  }

  // Update current speed display
  function updateCurrentSpeedDisplay(speed) {
    const speedDisplay = document.querySelector("#current-speed-display");
    const speedIndicator = document.querySelector("#speed-indicator");
    
    if (speedDisplay) {
      speedDisplay.textContent = `${speed.toFixed(1)}x`;
      speedDisplay.classList.add("changed");
      
      // Remove animation class after animation completes
      setTimeout(() => {
        speedDisplay.classList.remove("changed");
      }, 300);
    }
    
    if (speedIndicator) {
      // Calculate indicator width (0.5x = 0%, 1.0x = 50%, 2.0x = 100%)
      const minSpeed = 0.5;
      const maxSpeed = 2.0;
      const normalizedSpeed = Math.max(0, Math.min(1, (speed - minSpeed) / (maxSpeed - minSpeed)));
      const width = normalizedSpeed * 100;
      
      speedIndicator.style.width = `${width}%`;
    }
    
    // Update active preset button
    updateActivePresetButton(speed);
  }

  // Update active preset button
  function updateActivePresetButton(speed) {
    const presetButtons = document.querySelectorAll(".preset-btn");
    
    presetButtons.forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      if (Math.abs(btnSpeed - speed) < 0.01) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Add visual feedback to buttons
  function addButtonFeedback(button) {
    if (button) {
      button.classList.add("active");
      setTimeout(() => {
        button.classList.remove("active");
      }, 300);
    }
  }

  // Initialize analytics toggle functionality
  function initializeAnalyticsToggle() {
    const toggle = document.querySelector("#analytics-toggle");
    const content = document.querySelector("#analytics-content");
    const exportBtn = document.querySelector("#export-analytics");
    const clearBtn = document.querySelector("#clear-analytics");
    
    if (toggle && content) {
      toggle.addEventListener("click", function() {
        const isExpanded = content.classList.contains("expanded");
        
        if (isExpanded) {
          content.classList.remove("expanded");
          toggle.classList.remove("expanded");
        } else {
          content.classList.add("expanded");
          toggle.classList.add("expanded");
          // Refresh analytics data when opened
          loadAnalyticsData();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", exportAnalyticsData);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", clearAnalyticsData);
    }
  }

  // Load and display analytics data
  async function loadAnalyticsData() {
    try {
      // Get analytics data from storage
      const result = await chrome.storage.local.get(['vsc_analytics']);
      const analytics = result.vsc_analytics || getDefaultAnalyticsData();
      
      // Calculate insights
      const insights = calculateInsights(analytics);
      
      // Update UI
      updateAnalyticsUI(insights);
    } catch (error) {
      console.warn('Error loading analytics:', error);
      updateAnalyticsUI(getDefaultInsights());
    }
  }

  function getDefaultAnalyticsData() {
    return {
      totalSessions: 0,
      totalSpeedChanges: 0,
      totalKeyboardShortcuts: 0,
      totalTimeActive: 0,
      speedUsageStats: {},
      siteUsageStats: {},
      firstInstall: Date.now()
    };
  }

  function calculateInsights(analytics) {
    const avgSpeed = calculateAverageSpeed(analytics.speedUsageStats);
    const keyboardUsage = analytics.totalSpeedChanges > 0 
      ? (analytics.totalKeyboardShortcuts / analytics.totalSpeedChanges * 100)
      : 0;

    return {
      totalSessions: analytics.totalSessions,
      avgSpeed: avgSpeed.toFixed(1),
      keyboardUsage: keyboardUsage.toFixed(0) + '%',
      totalSites: Object.keys(analytics.siteUsageStats).length,
      daysSinceInstall: Math.floor((Date.now() - analytics.firstInstall) / (1000 * 60 * 60 * 24))
    };
  }

  function calculateAverageSpeed(speedStats) {
    const entries = Object.entries(speedStats);
    if (entries.length === 0) return 1.0;
    
    const totalWeighted = entries.reduce((sum, [speed, count]) => 
      sum + (parseFloat(speed) * count), 0);
    const totalCount = entries.reduce((sum, [, count]) => sum + count, 0);
    
    return totalCount > 0 ? (totalWeighted / totalCount) : 1.0;
  }

  function getDefaultInsights() {
    return {
      totalSessions: 0,
      avgSpeed: '1.0',
      keyboardUsage: '0%',
      totalSites: 0,
      daysSinceInstall: 0
    };
  }

  function updateAnalyticsUI(insights) {
    const elements = {
      'total-sessions': insights.totalSessions,
      'avg-speed': insights.avgSpeed + 'x',
      'keyboard-usage': insights.keyboardUsage,
      'total-sites': insights.totalSites
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.querySelector(`#${id}`);
      if (element) {
        element.textContent = value;
        
        // Add animation for value changes
        element.classList.add('stat-updated');
        setTimeout(() => {
          element.classList.remove('stat-updated');
        }, 300);
      }
    });
  }

  async function exportAnalyticsData() {
    try {
      const result = await chrome.storage.local.get(['vsc_analytics']);
      const analytics = result.vsc_analytics || getDefaultAnalyticsData();
      
      const exportData = {
        summary: calculateInsights(analytics),
        rawData: analytics,
        exportDate: new Date().toISOString(),
        version: '0.9.5'
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vsc-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('Analytics data exported successfully!');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      setStatusMessage('Error exporting analytics data');
    }
  }

  async function clearAnalyticsData() {
    if (!confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      return;
    }

    try {
      await chrome.storage.local.remove(['vsc_analytics']);
      await chrome.storage.session.remove(['vsc_session']);
      
      // Reset UI
      updateAnalyticsUI(getDefaultInsights());
      
      setStatusMessage('Analytics data cleared successfully!');
    } catch (error) {
      console.error('Error clearing analytics:', error);
      setStatusMessage('Error clearing analytics data');
    }
  }

  // Listen for speed changes from content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'VSC_SPEED_CHANGED') {
      updateCurrentSpeedDisplay(message.speed);
      
      // Track analytics event
      trackAnalyticsEvent('speedChange', { speed: message.speed });
    }
  });

  // Track analytics events
  async function trackAnalyticsEvent(type, data) {
    try {
      const result = await chrome.storage.local.get(['vsc_analytics']);
      const analytics = result.vsc_analytics || getDefaultAnalyticsData();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Update based on event type
      switch (type) {
        case 'speedChange':
          analytics.totalSpeedChanges++;
          const speedKey = data.speed.toFixed(1);
          analytics.speedUsageStats[speedKey] = (analytics.speedUsageStats[speedKey] || 0) + 1;
          break;
          
        case 'keyboardShortcut':
          analytics.totalKeyboardShortcuts++;
          break;
          
        case 'popupOpen':
          analytics.totalPopupOpens = (analytics.totalPopupOpens || 0) + 1;
          break;
      }
      
      analytics.lastActivity = Date.now();
      
      // Update daily stats
      if (!analytics.dailyStats) analytics.dailyStats = {};
      if (!analytics.dailyStats[today]) {
        analytics.dailyStats[today] = {
          speedChanges: 0,
          keyboardShortcuts: 0,
          popupOpens: 0
        };
      }
      
      if (type === 'speedChange') analytics.dailyStats[today].speedChanges++;
      if (type === 'keyboardShortcut') analytics.dailyStats[today].keyboardShortcuts++;
      if (type === 'popupOpen') analytics.dailyStats[today].popupOpens++;
      
      await chrome.storage.local.set({ vsc_analytics: analytics });
    } catch (error) {
      console.warn('Error tracking analytics event:', error);
    }
  }

  // Track popup open
  trackAnalyticsEvent('popupOpen', {});
});
