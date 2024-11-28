// Типы ошибок
export const DatabaseErrorTypes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION',
  CONNECTION: 'CONNECTION',
  QUERY: 'QUERY',
  UNKNOWN: 'UNKNOWN'
};

// Класс для ошибок базы данных
export class DatabaseError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.name = 'DatabaseError';
  }
}

// Обработчик ошибок базы данных
export const handleDatabaseError = (error) => {
  // Ошибки Supabase
  if (error?.code === 'PGRST301') {
    return new DatabaseError(
      DatabaseErrorTypes.NOT_FOUND,
      'Запрашиваемые данные не найдены',
      error
    );
  }
  
  if (error?.code?.startsWith('PGRST')) {
    return new DatabaseError(
      DatabaseErrorTypes.QUERY,
      'Ошибка в запросе к базе данных',
      error
    );
  }

  // Ошибки соединения
  if (error?.message?.includes('network') || error?.message?.includes('connection')) {
    return new DatabaseError(
      DatabaseErrorTypes.CONNECTION,
      'Ошибка подключения к базе данных',
      error
    );
  }

  // Если тип ошибки не определен
  return new DatabaseError(
    DatabaseErrorTypes.UNKNOWN,
    'Произошла неизвестная ошибка',
    error
  );
};

// Декоратор для обработки ошибок в методах
export const withErrorHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  };
};
