// Типы логов
export const LogLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
  QUERY: 'QUERY'
};

// Категории логов
export const LogCategory = {
  DATABASE: 'DATABASE',
  CACHE: 'CACHE',
  VALIDATION: 'VALIDATION',
  PERFORMANCE: 'PERFORMANCE',
  SECURITY: 'SECURITY'
};

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Максимальное количество логов в памяти
  }

  log(level, category, message, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      trace: new Error().stack
    };

    // Добавляем лог в память
    this.logs.unshift(logEntry);
    
    // Ограничиваем количество логов в памяти
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Форматируем лог для консоли
    const formattedMessage = `[${logEntry.timestamp}] ${level} [${category}]: ${message}`;
    
    // Выводим в консоль с соответствующим стилем
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, details);
        break;
      case LogLevel.WARNING:
        console.warn(formattedMessage, details);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, details);
        break;
      default:
        console.log(formattedMessage, details);
    }

    return logEntry;
  }

  // Методы для разных типов логов
  info(category, message, details) {
    return this.log(LogLevel.INFO, category, message, details);
  }

  warn(category, message, details) {
    return this.log(LogLevel.WARNING, category, message, details);
  }

  error(category, message, details) {
    return this.log(LogLevel.ERROR, category, message, details);
  }

  debug(category, message, details) {
    return this.log(LogLevel.DEBUG, category, message, details);
  }

  query(sql, params, duration) {
    return this.log(LogLevel.QUERY, LogCategory.DATABASE, 'SQL Query', {
      sql,
      params,
      duration
    });
  }

  // Методы для получения логов
  getLogs(options = {}) {
    let filteredLogs = [...this.logs];

    // Фильтрация по уровню
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    // Фильтрация по категории
    if (options.category) {
      filteredLogs = filteredLogs.filter(log => log.category === options.category);
    }

    // Фильтрация по временному диапазону
    if (options.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(options.startDate)
      );
    }

    if (options.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(options.endDate)
      );
    }

    return filteredLogs;
  }

  // Очистка логов
  clearLogs() {
    this.logs = [];
  }
}

// Создаем единственный экземпляр логгера
export const logger = new Logger();
