// Настройки кэша
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

class Cache {
  constructor() {
    this.cache = new Map();
  }

  // Получить данные из кэша
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Проверяем, не истек ли срок действия кэша
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Сохранить данные в кэш
  set(key, data, duration = CACHE_DURATION) {
    const expiry = Date.now() + duration;
    this.cache.set(key, { data, expiry });
  }

  // Очистить кэш
  clear() {
    this.cache.clear();
  }

  // Удалить конкретный ключ из кэша
  remove(key) {
    this.cache.delete(key);
  }
}

// Создаем экземпляр кэша
export const cache = new Cache();

// Декоратор для кэширования API запросов
export const withCache = (apiCall, key, duration) => async (...args) => {
  // Проверяем кэш
  const cachedData = cache.get(key);
  if (cachedData) {
    return { data: cachedData, error: null };
  }

  // Если данных нет в кэше, делаем запрос
  const result = await apiCall(...args);
  
  // Если запрос успешен, сохраняем в кэш
  if (!result.error) {
    cache.set(key, result.data, duration);
  }

  return result;
};
