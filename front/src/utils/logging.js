// src/utils/logging.js

export const debugLog = (label, message) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${label}]`, message);
  }
};

export const clearLogs = () => {
  if (process.env.NODE_ENV === 'development') {
    console.clear();
  }
};
