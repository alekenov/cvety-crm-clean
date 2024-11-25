// Logging levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

class LoggingService {
  constructor() {
    if (!LoggingService.instance) {
      this.logs = [];
      this.maxLogs = 1000; // Keep last 1000 logs in memory
      LoggingService.instance = this;
    }

    return LoggingService.instance;
  }

  _formatMessage(level, component, message, details) {
    const timestamp = new Date().toISOString();
    const componentStr = component ? `[${component}]` : '';
    const detailsStr = details ? `\n${JSON.stringify(details, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${componentStr} ${message}${detailsStr}`;
  }

  _addLog(level, component, message, details) {
    try {
      const formattedLog = this._formatMessage(level, component, message, details);
      
      // Add to in-memory logs
      this.logs.push(formattedLog);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift(); // Remove oldest log
      }

      // Log to console with appropriate level
      switch (level) {
        case LOG_LEVELS.DEBUG:
          console.debug(formattedLog);
          break;
        case LOG_LEVELS.INFO:
          console.info(formattedLog);
          break;
        case LOG_LEVELS.WARN:
          console.warn(formattedLog);
          break;
        case LOG_LEVELS.ERROR:
          console.error(formattedLog);
          break;
        default:
          console.log(formattedLog);
      }

      // Store in localStorage for persistence
      try {
        localStorage.setItem('app_logs', JSON.stringify(this.logs));
      } catch (e) {
        console.error('Failed to store logs in localStorage:', e);
      }
    } catch (e) {
      console.error('Error in logging:', e);
    }
  }

  // Public logging methods
  log(component, message, details = null) {
    if (!component || !message) return;
    this._addLog(LOG_LEVELS.INFO, component, message, details);
  }

  error(component, message, details = null) {
    if (!component || !message) return;
    this._addLog(LOG_LEVELS.ERROR, component, message, details);
  }

  warn(component, message, details = null) {
    if (!component || !message) return;
    this._addLog(LOG_LEVELS.WARN, component, message, details);
  }

  debug(component, message, details = null) {
    if (!component || !message) return;
    this._addLog(LOG_LEVELS.DEBUG, component, message, details);
  }

  // Get all logs
  getLogs() {
    return this.logs || [];
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (e) {
      console.error('Failed to clear logs from localStorage:', e);
    }
  }
}

// Create a singleton instance
export const logger = new LoggingService();
