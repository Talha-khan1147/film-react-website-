/**
 * Safe wrapper around LocalStorage with error handling and fallback support.
 */
const STORAGE_PREFIX = 'freeflix_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.warn(`[Storage] Failed to read ${key}:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to save ${key}:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to remove ${key}:`, err);
      return false;
    }
  },

  clear() {
    try {
      Object.keys(window.localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          window.localStorage.removeItem(k);
        }
      });
      return true;
    } catch (err) {
      console.warn('[Storage] Failed to clear items:', err);
      return false;
    }
  }
};

export default storage;
