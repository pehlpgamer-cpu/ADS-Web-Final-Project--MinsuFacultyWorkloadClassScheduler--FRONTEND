export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('⚠️ localStorage is full!');
    } else {
      console.error('Storage error:', e);
    }
  }
}

export const safeGetLocalStorage = (key, parseJSON = false) => {
  try {
    const item = localStorage.getItem(key);
    return parseJSON && item ? JSON.parse(item) : item;
  } catch (e) {
    console.error('Failed to parse stored data:', e);
    return null;
  }
}