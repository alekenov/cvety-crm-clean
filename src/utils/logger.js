const logger = {
  log: (context, message, data = null) => {
    console.log(`[${context}] ${message}`, {
      data,
      timestamp: new Date().toISOString()
    });
  },

  error: (context, message, data = null, error = null) => {
    console.error(`[${context}] ${message}`, {
      data,
      error: error ? error.toString() : null,
      timestamp: new Date().toISOString()
    });
  },
  
  info: (context, message, data = null) => {
    console.log(`[${context}] ${message}`, {
      data,
      timestamp: new Date().toISOString()
    });
  },

  warn: (context, message, data = null) => {
    console.warn(`[${context}] ${message}`, {
      data,
      timestamp: new Date().toISOString()
    });
  }
};

export default logger;
