/**
 * Утилита для повторных попыток выполнения API запросов
 */

const INITIAL_RETRY_DELAY = 1000; // 1 секунда
const MAX_RETRIES = 3;

/**
 * Задержка выполнения на указанное количество миллисекунд
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Выполняет API запрос с механизмом повторных попыток
 * @param {Function} apiCall - Функция, выполняющая API запрос
 * @param {Object} options - Опции для повторных попыток
 * @returns {Promise} Результат API запроса
 */
export async function withRetry(apiCall, options = {}) {
  const {
    retries = MAX_RETRIES,
    initialDelay = INITIAL_RETRY_DELAY,
    shouldRetry = (error) => error.message.includes('rate limit exceeded')
  } = options;

  let lastError;
  let currentDelay = initialDelay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (!shouldRetry(error) || attempt === retries) {
        throw error;
      }

      console.warn(`API call failed (attempt ${attempt + 1}/${retries + 1}). Retrying in ${currentDelay}ms...`);
      await delay(currentDelay);
      
      // Увеличиваем задержку для следующей попытки
      currentDelay *= 2;
    }
  }

  throw lastError;
}

/**
 * Кэширование результатов API запросов
 */
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export function withCache(key, apiCall, ttl = CACHE_TTL) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  return apiCall().then(data => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  });
}
