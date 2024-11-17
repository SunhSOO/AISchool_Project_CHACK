// src/utils/logging.js
const loggedMessages = new Set();

export const debugLog = (key, message, data) => {
  if (process.env.NODE_ENV === 'development') {
    // 고유 키를 생성 (메시지와 데이터를 조합)
    const logKey = `${key}-${JSON.stringify(data)}`;

    if (!loggedMessages.has(logKey)) {
      console.log(message, data);
      loggedMessages.add(logKey);
    }
  }
};

export const clearLogs = () => {
  loggedMessages.clear();
};
