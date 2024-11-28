// Простой кэш в памяти
const memoryCache = new Map();

// Время жизни кэша по умолчанию (в миллисекундах)
const DEFAULT_TTL = 5 * 60 * 1000; // 5 минут

export class Cache {
  static set(key, value, ttl = DEFAULT_TTL) {
    memoryCache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  static get(key) {
    const item = memoryCache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  }

  static delete(key) {
    memoryCache.delete(key);
  }

  static clear() {
    memoryCache.clear();
  }
}

// Декоратор для кэширования
export const withCache = (fn, keyPrefix, ttl = DEFAULT_TTL) => {
  return async (...args) => {
    const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
    const cachedResult = Cache.get(cacheKey);
    
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    const result = await fn(...args);
    Cache.set(cacheKey, result, ttl);
    return result;
  };
};
