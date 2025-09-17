/**
 * Privacy-focused analytics system for Video Speed Controller
 * Tracks usage patterns locally without sending data to external servers
 */

window.VSC = window.VSC || {};

class VSCAnalytics {
  constructor() {
    this.storageKey = 'vsc_analytics';
    this.sessionKey = 'vsc_session';
    this.maxHistoryDays = 30;
    this.currentSession = null;
    
    this.initializeSession();
    this.setupEventListeners();
  }

  async initializeSession() {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    
    this.currentSession = {
      id: sessionId,
      startTime: now,
      lastActivity: now,
      speedChanges: 0,
      keyboardShortcuts: 0,
      popupOpens: 0,
      totalTimeActive: 0,
      mostUsedSpeeds: {},
      mostUsedShortcuts: {},
      sitesUsed: new Set()
    };

    // Store session data
    await this.saveSessionData();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAnalyticsData() {
    try {
      const result = await chrome.storage.local.get([this.storageKey]);
      return result[this.storageKey] || {
        totalSessions: 0,
        totalSpeedChanges: 0,
        totalKeyboardShortcuts: 0,
        totalPopupOpens: 0,
        totalTimeActive: 0,
        dailyStats: {},
        speedUsageStats: {},
        shortcutUsageStats: {},
        siteUsageStats: {},
        firstInstall: Date.now(),
        lastActivity: Date.now()
      };
    } catch (error) {
      console.warn('VSC Analytics: Error loading data:', error);
      return this.getDefaultAnalyticsData();
    }
  }

  getDefaultAnalyticsData() {
    return {
      totalSessions: 0,
      totalSpeedChanges: 0,
      totalKeyboardShortcuts: 0,
      totalPopupOpens: 0,
      totalTimeActive: 0,
      dailyStats: {},
      speedUsageStats: {},
      shortcutUsageStats: {},
      siteUsageStats: {},
      firstInstall: Date.now(),
      lastActivity: Date.now()
    };
  }

  async saveAnalyticsData(data) {
    try {
      await chrome.storage.local.set({
        [this.storageKey]: data
      });
    } catch (error) {
      console.warn('VSC Analytics: Error saving data:', error);
    }
  }

  async saveSessionData() {
    try {
      await chrome.storage.session.set({
        [this.sessionKey]: this.currentSession
      });
    } catch (error) {
      console.warn('VSC Analytics: Error saving session:', error);
    }
  }

  setupEventListeners() {
    // Listen for speed changes
    document.addEventListener('vsc:speedChange', (event) => {
      this.trackSpeedChange(event.detail.speed, event.detail.action);
    });

    // Listen for keyboard shortcuts
    document.addEventListener('vsc:keyboardShortcut', (event) => {
      this.trackKeyboardShortcut(event.detail.key, event.detail.action);
    });

    // Listen for popup opens
    document.addEventListener('vsc:popupOpen', () => {
      this.trackPopupOpen();
    });

    // Track page visibility for active time calculation
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Save session data periodically
    setInterval(() => {
      this.updateSessionActivity();
    }, 30000); // Every 30 seconds

    // Save data when page unloads
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  async trackSpeedChange(speed, action = 'manual') {
    if (!this.currentSession) return;

    this.currentSession.speedChanges++;
    this.currentSession.lastActivity = Date.now();

    // Track speed usage
    const speedKey = speed.toFixed(1);
    this.currentSession.mostUsedSpeeds[speedKey] = 
      (this.currentSession.mostUsedSpeeds[speedKey] || 0) + 1;

    // Track current site
    const hostname = window.location.hostname;
    this.currentSession.sitesUsed.add(hostname);

    await this.saveSessionData();
    
    // Emit custom event for other components
    this.emitAnalyticsEvent('speedChange', { speed, action, hostname });
  }

  async trackKeyboardShortcut(key, action) {
    if (!this.currentSession) return;

    this.currentSession.keyboardShortcuts++;
    this.currentSession.lastActivity = Date.now();

    // Track shortcut usage
    const shortcutKey = `${key}_${action}`;
    this.currentSession.mostUsedShortcuts[shortcutKey] = 
      (this.currentSession.mostUsedShortcuts[shortcutKey] || 0) + 1;

    await this.saveSessionData();
    
    this.emitAnalyticsEvent('keyboardShortcut', { key, action });
  }

  async trackPopupOpen() {
    if (!this.currentSession) return;

    this.currentSession.popupOpens++;
    this.currentSession.lastActivity = Date.now();

    await this.saveSessionData();
    
    this.emitAnalyticsEvent('popupOpen', {});
  }

  handleVisibilityChange() {
    if (!this.currentSession) return;

    if (document.hidden) {
      // Page became hidden, pause activity tracking
      this.pauseActivityTracking();
    } else {
      // Page became visible, resume activity tracking
      this.resumeActivityTracking();
    }
  }

  pauseActivityTracking() {
    if (this.activityStartTime) {
      const activeTime = Date.now() - this.activityStartTime;
      this.currentSession.totalTimeActive += activeTime;
      this.activityStartTime = null;
    }
  }

  resumeActivityTracking() {
    this.activityStartTime = Date.now();
  }

  async updateSessionActivity() {
    if (!this.currentSession) return;

    // Update active time if currently tracking
    if (this.activityStartTime && !document.hidden) {
      const activeTime = Date.now() - this.activityStartTime;
      this.currentSession.totalTimeActive += activeTime;
      this.activityStartTime = Date.now(); // Reset start time
    }

    this.currentSession.lastActivity = Date.now();
    await this.saveSessionData();
  }

  async endSession() {
    if (!this.currentSession) return;

    // Final activity update
    await this.updateSessionActivity();

    // Merge session data into analytics
    await this.mergeSessionIntoAnalytics();
  }

  async mergeSessionIntoAnalytics() {
    const analytics = await this.getAnalyticsData();
    const session = this.currentSession;
    const today = this.getDateKey(new Date());

    // Update totals
    analytics.totalSessions++;
    analytics.totalSpeedChanges += session.speedChanges;
    analytics.totalKeyboardShortcuts += session.keyboardShortcuts;
    analytics.totalPopupOpens += session.popupOpens;
    analytics.totalTimeActive += session.totalTimeActive;
    analytics.lastActivity = session.lastActivity;

    // Update daily stats
    if (!analytics.dailyStats[today]) {
      analytics.dailyStats[today] = {
        sessions: 0,
        speedChanges: 0,
        keyboardShortcuts: 0,
        popupOpens: 0,
        timeActive: 0,
        uniqueSites: new Set()
      };
    }

    const dailyStats = analytics.dailyStats[today];
    dailyStats.sessions++;
    dailyStats.speedChanges += session.speedChanges;
    dailyStats.keyboardShortcuts += session.keyboardShortcuts;
    dailyStats.popupOpens += session.popupOpens;
    dailyStats.timeActive += session.totalTimeActive;

    // Merge site usage
    session.sitesUsed.forEach(site => {
      dailyStats.uniqueSites.add(site);
      analytics.siteUsageStats[site] = (analytics.siteUsageStats[site] || 0) + 1;
    });

    // Convert Set to Array for storage
    dailyStats.uniqueSites = Array.from(dailyStats.uniqueSites);

    // Merge speed usage stats
    Object.entries(session.mostUsedSpeeds).forEach(([speed, count]) => {
      analytics.speedUsageStats[speed] = (analytics.speedUsageStats[speed] || 0) + count;
    });

    // Merge shortcut usage stats
    Object.entries(session.mostUsedShortcuts).forEach(([shortcut, count]) => {
      analytics.shortcutUsageStats[shortcut] = (analytics.shortcutUsageStats[shortcut] || 0) + count;
    });

    // Clean up old daily stats (keep only last 30 days)
    this.cleanupOldStats(analytics);

    await this.saveAnalyticsData(analytics);
  }

  cleanupOldStats(analytics) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.maxHistoryDays);
    const cutoffKey = this.getDateKey(cutoffDate);

    Object.keys(analytics.dailyStats).forEach(dateKey => {
      if (dateKey < cutoffKey) {
        delete analytics.dailyStats[dateKey];
      }
    });
  }

  getDateKey(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  emitAnalyticsEvent(type, data) {
    const event = new CustomEvent(`vsc:analytics:${type}`, {
      detail: { ...data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  // Public methods for getting analytics insights
  async getUsageInsights() {
    const analytics = await this.getAnalyticsData();
    const insights = {
      overview: this.getOverviewInsights(analytics),
      speedPreferences: this.getSpeedInsights(analytics),
      keyboardUsage: this.getKeyboardInsights(analytics),
      siteUsage: this.getSiteInsights(analytics),
      trends: this.getTrendInsights(analytics)
    };

    return insights;
  }

  getOverviewInsights(analytics) {
    const avgSpeedChangesPerSession = analytics.totalSessions > 0 
      ? (analytics.totalSpeedChanges / analytics.totalSessions).toFixed(1)
      : 0;

    const avgTimePerSession = analytics.totalSessions > 0
      ? Math.round(analytics.totalTimeActive / analytics.totalSessions / 1000 / 60) // minutes
      : 0;

    const keyboardUsageRate = analytics.totalSpeedChanges > 0
      ? ((analytics.totalKeyboardShortcuts / analytics.totalSpeedChanges) * 100).toFixed(1)
      : 0;

    return {
      totalSessions: analytics.totalSessions,
      totalSpeedChanges: analytics.totalSpeedChanges,
      avgSpeedChangesPerSession: parseFloat(avgSpeedChangesPerSession),
      avgTimePerSession: avgTimePerSession,
      keyboardUsageRate: parseFloat(keyboardUsageRate),
      totalSitesUsed: Object.keys(analytics.siteUsageStats).length,
      daysSinceInstall: Math.floor((Date.now() - analytics.firstInstall) / (1000 * 60 * 60 * 24))
    };
  }

  getSpeedInsights(analytics) {
    const speedEntries = Object.entries(analytics.speedUsageStats)
      .map(([speed, count]) => ({ speed: parseFloat(speed), count }))
      .sort((a, b) => b.count - a.count);

    const mostUsedSpeed = speedEntries[0]?.speed || 1.0;
    const speedRange = speedEntries.length > 0 
      ? {
          min: Math.min(...speedEntries.map(s => s.speed)),
          max: Math.max(...speedEntries.map(s => s.speed))
        }
      : { min: 1.0, max: 1.0 };

    return {
      mostUsedSpeed,
      speedRange,
      speedDistribution: speedEntries.slice(0, 10), // Top 10 speeds
      averageSpeed: this.calculateAverageSpeed(speedEntries)
    };
  }

  calculateAverageSpeed(speedEntries) {
    if (speedEntries.length === 0) return 1.0;
    
    const totalWeightedSpeed = speedEntries.reduce((sum, entry) => 
      sum + (entry.speed * entry.count), 0);
    const totalCount = speedEntries.reduce((sum, entry) => sum + entry.count, 0);
    
    return totalCount > 0 ? (totalWeightedSpeed / totalCount) : 1.0;
  }

  getKeyboardInsights(analytics) {
    const shortcutEntries = Object.entries(analytics.shortcutUsageStats)
      .map(([shortcut, count]) => {
        const [key, action] = shortcut.split('_');
        return { key, action, count };
      })
      .sort((a, b) => b.count - a.count);

    const totalShortcuts = analytics.totalKeyboardShortcuts;
    const keyboardEfficiency = analytics.totalSpeedChanges > 0
      ? (totalShortcuts / analytics.totalSpeedChanges * 100)
      : 0;

    return {
      totalShortcuts,
      keyboardEfficiency: parseFloat(keyboardEfficiency.toFixed(1)),
      mostUsedShortcuts: shortcutEntries.slice(0, 5),
      shortcutDistribution: this.getShortcutDistribution(shortcutEntries)
    };
  }

  getShortcutDistribution(shortcutEntries) {
    const distribution = {};
    shortcutEntries.forEach(entry => {
      if (!distribution[entry.action]) {
        distribution[entry.action] = 0;
      }
      distribution[entry.action] += entry.count;
    });
    return distribution;
  }

  getSiteInsights(analytics) {
    const siteEntries = Object.entries(analytics.siteUsageStats)
      .map(([site, count]) => ({ site, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSites: siteEntries.length,
      mostUsedSites: siteEntries.slice(0, 10),
      siteCategories: this.categorizeSites(siteEntries)
    };
  }

  categorizeSites(siteEntries) {
    const categories = {
      video: ['youtube.com', 'netflix.com', 'vimeo.com', 'twitch.tv', 'dailymotion.com'],
      education: ['coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org', 'pluralsight.com'],
      social: ['facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'linkedin.com'],
      news: ['cnn.com', 'bbc.com', 'reuters.com', 'npr.org', 'bloomberg.com'],
      other: []
    };

    const categorized = {
      video: 0,
      education: 0,
      social: 0,
      news: 0,
      other: 0
    };

    siteEntries.forEach(({ site, count }) => {
      let categorized_site = false;
      
      Object.entries(categories).forEach(([category, sites]) => {
        if (category !== 'other' && sites.some(s => site.includes(s))) {
          categorized[category] += count;
          categorized_site = true;
        }
      });

      if (!categorized_site) {
        categorized.other += count;
      }
    });

    return categorized;
  }

  getTrendInsights(analytics) {
    const dailyStats = analytics.dailyStats;
    const dates = Object.keys(dailyStats).sort();
    const last7Days = dates.slice(-7);
    const last30Days = dates.slice(-30);

    const trends = {
      last7Days: this.calculatePeriodStats(dailyStats, last7Days),
      last30Days: this.calculatePeriodStats(dailyStats, last30Days),
      weeklyTrend: this.calculateTrend(dailyStats, last7Days),
      monthlyTrend: this.calculateTrend(dailyStats, last30Days)
    };

    return trends;
  }

  calculatePeriodStats(dailyStats, dates) {
    return dates.reduce((acc, date) => {
      const day = dailyStats[date];
      if (day) {
        acc.sessions += day.sessions;
        acc.speedChanges += day.speedChanges;
        acc.keyboardShortcuts += day.keyboardShortcuts;
        acc.timeActive += day.timeActive;
        acc.uniqueSites += day.uniqueSites.length;
      }
      return acc;
    }, {
      sessions: 0,
      speedChanges: 0,
      keyboardShortcuts: 0,
      timeActive: 0,
      uniqueSites: 0
    });
  }

  calculateTrend(dailyStats, dates) {
    if (dates.length < 2) return 0;

    const firstHalf = dates.slice(0, Math.floor(dates.length / 2));
    const secondHalf = dates.slice(Math.floor(dates.length / 2));

    const firstHalfAvg = this.calculatePeriodAverage(dailyStats, firstHalf);
    const secondHalfAvg = this.calculatePeriodAverage(dailyStats, secondHalf);

    return secondHalfAvg > 0 
      ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100)
      : 0;
  }

  calculatePeriodAverage(dailyStats, dates) {
    if (dates.length === 0) return 0;
    
    const total = dates.reduce((sum, date) => {
      return sum + (dailyStats[date]?.speedChanges || 0);
    }, 0);
    
    return total / dates.length;
  }

  emitAnalyticsEvent(type, data) {
    const event = new CustomEvent(`vsc:analytics`, {
      detail: { type, data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  // Export analytics data for user
  async exportAnalytics() {
    const analytics = await this.getAnalyticsData();
    const insights = await this.getUsageInsights();
    
    const exportData = {
      summary: insights.overview,
      speedPreferences: insights.speedPreferences,
      keyboardUsage: insights.keyboardUsage,
      siteUsage: insights.siteUsage,
      trends: insights.trends,
      rawData: {
        ...analytics,
        // Convert Sets to Arrays for JSON serialization
        dailyStats: Object.fromEntries(
          Object.entries(analytics.dailyStats).map(([date, stats]) => [
            date,
            {
              ...stats,
              uniqueSites: Array.isArray(stats.uniqueSites) 
                ? stats.uniqueSites 
                : Array.from(stats.uniqueSites || [])
            }
          ])
        )
      },
      exportDate: new Date().toISOString(),
      version: '0.9.5'
    };

    return exportData;
  }

  // Clear analytics data (for privacy)
  async clearAnalytics() {
    try {
      await chrome.storage.local.remove([this.storageKey]);
      await chrome.storage.session.remove([this.sessionKey]);
      
      // Reinitialize
      await this.initializeSession();
      
      this.emitAnalyticsEvent('cleared', {});
      return true;
    } catch (error) {
      console.warn('VSC Analytics: Error clearing data:', error);
      return false;
    }
  }

  // Get quick stats for popup display
  async getQuickStats() {
    const analytics = await this.getAnalyticsData();
    const insights = await this.getUsageInsights();
    
    return {
      totalSessions: analytics.totalSessions,
      avgSpeed: insights.speedPreferences.averageSpeed.toFixed(1),
      mostUsedSpeed: insights.speedPreferences.mostUsedSpeed.toFixed(1),
      keyboardUsage: insights.keyboardUsage.keyboardEfficiency,
      totalSites: insights.siteUsage.totalSites,
      daysSinceInstall: insights.overview.daysSinceInstall
    };
  }
}

// Create global instance
window.VSC.analytics = new VSCAnalytics();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VSCAnalytics;
}