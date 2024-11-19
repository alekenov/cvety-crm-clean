// Типы ошибок
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  DATABASE: 'DATABASE_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Пользовательские сообщения об ошибках
const errorMessages = {
  [ErrorTypes.NETWORK]: 'Ошибка сети. Проверьте подключение к интернету.',
  [ErrorTypes.DATABASE]: 'Ошибка базы данных. Попробуйте позже.',
  [ErrorTypes.VALIDATION]: 'Проверьте правильность введенных данных.',
  [ErrorTypes.AUTH]: 'Ошибка авторизации. Попробуйте войти заново.',
  [ErrorTypes.UNKNOWN]: 'Произошла неизвестная ошибка. Попробуйте позже.'
};

// Определяем тип ошибки
export const getErrorType = (error) => {
  if (!navigator.onLine) return ErrorTypes.NETWORK;
  if (error?.message?.includes('auth')) return ErrorTypes.AUTH;
  if (error?.message?.includes('validation')) return ErrorTypes.VALIDATION;
  if (error?.message?.includes('database')) return ErrorTypes.DATABASE;
  return ErrorTypes.UNKNOWN;
};

// Получаем понятное сообщение об ошибке
export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);
  return errorMessages[errorType] || error?.message || errorMessages[ErrorTypes.UNKNOWN];
};

// Логирование ошибок
export const logError = (error, context = {}) => {
  console.error('Error occurred:', {
    type: getErrorType(error),
    message: error?.message,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Обработчик ошибок для API запросов
export const handleApiError = async (apiCall, context = {}) => {
  try {
    const result = await apiCall();
    if (result.error) {
      throw result.error;
    }
    return result;
  } catch (error) {
    logError(error, context);
    throw {
      type: getErrorType(error),
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};
