// Простой логгер с поддержкой разных уровней логирования
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Конфигурация для разных окружений
const config = {
  development: {
    level: LOG_LEVELS.DEBUG,
    console: true,
    remote: false
  },
  production: {
    level: LOG_LEVELS.ERROR,
    console: false,
    remote: true
  }
};

// Получаем текущее окружение
const ENV = process.env.NODE_ENV || 'development';
const currentConfig = config[ENV];

class Logger {
  constructor() {
    this.queue = [];
    this.flushInterval = 5000; // 5 seconds
    
    if (currentConfig.remote) {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (currentConfig.console) {
      console[level](message, data);
    }

    if (currentConfig.remote) {
      this.queue.push(logEntry);
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    try {
      // Здесь будет отправка логов на сервер
      const logs = [...this.queue];
      this.queue = [];
      
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs })
      });
    } catch (error) {
      console.error('Failed to send logs:', error);
      // Возвращаем логи обратно в очередь
      this.queue = [...this.queue, ...logs];
    }
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }
}

export const logger = new Logger();
