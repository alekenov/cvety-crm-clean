import { v4 as uuidv4 } from 'uuid';

// Уровни логирования с приоритетами
const LOG_LEVELS = {
  DEBUG: { priority: 0, color: '\x1b[37m' },     // Белый
  INFO: { priority: 1, color: '\x1b[32m' },      // Зеленый 
  WARN: { priority: 2, color: '\x1b[33m' },      // Желтый
  ERROR: { priority: 3, color: '\x1b[31m' },     // Красный
  CRITICAL: { priority: 4, color: '\x1b[41m' }   // Красный фон
};

class LoggingService {
  constructor() {
    if (!LoggingService.instance) {
      this.logs = [];
      this.maxLogs = 5000; // Увеличил количество хранимых логов
      this.userId = null;
      this.currentUrl = null;
      this.deviceInfo = this._detectDeviceInfo();
      this.minLogLevel = LOG_LEVELS.DEBUG; // Минимальный уровень логирования
      LoggingService.instance = this;
    }

    return LoggingService.instance;
  }

  // Автоматическое определение информации об устройстве
  _detectDeviceInfo() {
    if (typeof window !== 'undefined') {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        browserName: this._getBrowserName()
      };
    }
    return {};
  }

  // Определение браузера
  _getBrowserName() {
    const agent = navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.includes('chrome'): return 'Chrome';
      case agent.includes('firefox'): return 'Firefox';
      case agent.includes('safari'): return 'Safari';
      case agent.includes('edge'): return 'Edge';
      case agent.includes('opera'): return 'Opera';
      default: return 'Unknown';
    }
  }

  // Установка минимального уровня логирования
  setLogLevel(level) {
    this.minLogLevel = level;
  }

  // Генерация UUID для пользователя
  setUserId(userId = null) {
    this.userId = userId || uuidv4();
    return this.userId;
  }

  // Обновление текущего URL
  setCurrentUrl(url) {
    this.currentUrl = url;
  }

  // Форматирование сообщения лога
  _formatMessage(level, component, message, details = {}) {
    const timestamp = new Date().toISOString();
    const componentStr = component ? `[${component}]` : '';
    
    const logContext = {
      userId: this.userId,
      currentUrl: this.currentUrl,
      deviceInfo: this.deviceInfo,
      ...details
    };

    const detailsStr = Object.keys(logContext).length > 0 
      ? `\n${JSON.stringify(logContext, null, 2)}` 
      : '';

    return {
      timestamp,
      level: level.color + `[${level.priority}:${Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level)}]` + '\x1b[0m',
      component: componentStr,
      message,
      details: detailsStr
    };
  }

  // Внутренний метод добавления лога
  _addLog(level, component, message, details = null) {
    try {
      // Проверка уровня логирования
      if (level.priority < this.minLogLevel.priority) return;

      const formattedLog = this._formatMessage(level, component, message, details);
      const fullLogMessage = `${formattedLog.timestamp} ${formattedLog.level} ${formattedLog.component} ${message}${formattedLog.details}`;
      
      // Добавление в массив логов
      this.logs.push(fullLogMessage);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift(); // Удаление старых логов
      }

      // Логирование в консоль с цветом
      console.log(fullLogMessage);

      // Персистентное хранение логов
      try {
        localStorage.setItem('app_logs', JSON.stringify(this.logs));
      } catch (e) {
        console.error('Не удалось сохранить логи в localStorage:', e);
      }

    } catch (e) {
      console.error('Ошибка при логировании:', e);
    }
  }

  // Публичные методы логирования
  log(component, message, details = null) {
    this._addLog(LOG_LEVELS.INFO, component, message, details);
  }

  debug(component, message, details = null) {
    this._addLog(LOG_LEVELS.DEBUG, component, message, details);
  }

  warn(component, message, details = null) {
    this._addLog(LOG_LEVELS.WARN, component, message, details);
  }

  error(component, message, details = null, error = null) {
    const errorDetails = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null;

    this._addLog(LOG_LEVELS.ERROR, component, message, { ...details, error: errorDetails });
  }

  critical(component, message, details = null, error = null) {
    const errorDetails = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null;

    this._addLog(LOG_LEVELS.CRITICAL, component, message, { ...details, error: errorDetails });
  }

  // Получение всех логов
  getLogs() {
    return this.logs || [];
  }

  // Очистка логов
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (e) {
      console.error('Не удалось очистить логи:', e);
    }
  }

  // Экспорт логов в файл
  exportLogsToFile() {
    const logsText = this.logs.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app_logs_${new Date().toISOString().replace(/:/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Создание синглтона
export const logger = new LoggingService();

// Глобальный перехватчик необработанных ошибок
window.addEventListener('error', (event) => {
  logger.critical('GlobalErrorHandler', 'Необработанная ошибка', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  }, event.error);
});

// Перехватчик отклоненных промисов
window.addEventListener('unhandledrejection', (event) => {
  logger.critical('GlobalPromiseRejection', 'Необработанное rejection промиса', {
    reason: event.reason
  });
});
