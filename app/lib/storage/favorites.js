/**
 * Favorites Management Service
 * Handles local storage of favorite items (scenarios, resources, issues)
 */

const STORAGE_KEY = 'defiendete-mx-favorites';

/**
 * Get all favorites from localStorage
 * @returns {Object} Favorites object with categorized items
 */
export const getFavorites = () => {
  if (typeof window === 'undefined') return { scenarios: [], resources: [], issues: [] };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { scenarios: [], resources: [], issues: [] };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return { scenarios: [], resources: [], issues: [] };
  }
};

/**
 * Save favorites to localStorage
 * @param {Object} favorites - Favorites object
 */
const saveFavorites = (favorites) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

/**
 * Add item to favorites
 * @param {string} type - Type of item (scenarios, resources, issues)
 * @param {Object} item - Item to add
 * @returns {boolean} Success status
 */
export const addFavorite = (type, item) => {
  try {
    const favorites = getFavorites();

    if (!favorites[type]) {
      favorites[type] = [];
    }

    // Check if already exists
    const exists = favorites[type].some(fav => fav.id === item.id);
    if (exists) {
      return false;
    }

    // Add timestamp
    const favoriteItem = {
      ...item,
      favoritedAt: new Date().toISOString()
    };

    favorites[type].push(favoriteItem);
    saveFavorites(favorites);

    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

/**
 * Remove item from favorites
 * @param {string} type - Type of item
 * @param {string|number} itemId - ID of item to remove
 * @returns {boolean} Success status
 */
export const removeFavorite = (type, itemId) => {
  try {
    const favorites = getFavorites();

    if (!favorites[type]) {
      return false;
    }

    favorites[type] = favorites[type].filter(fav => fav.id !== itemId);
    saveFavorites(favorites);

    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

/**
 * Check if item is favorited
 * @param {string} type - Type of item
 * @param {string|number} itemId - ID of item
 * @returns {boolean} Whether item is favorited
 */
export const isFavorite = (type, itemId) => {
  try {
    const favorites = getFavorites();
    return favorites[type]?.some(fav => fav.id === itemId) || false;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Toggle favorite status
 * @param {string} type - Type of item
 * @param {Object} item - Item to toggle
 * @returns {boolean} New favorite status
 */
export const toggleFavorite = (type, item) => {
  const isCurrentlyFavorite = isFavorite(type, item.id);

  if (isCurrentlyFavorite) {
    removeFavorite(type, item.id);
    return false;
  } else {
    addFavorite(type, item);
    return true;
  }
};

/**
 * Get favorites by type
 * @param {string} type - Type of favorites to get
 * @returns {Array} Array of favorite items
 */
export const getFavoritesByType = (type) => {
  const favorites = getFavorites();
  return favorites[type] || [];
};

/**
 * Get total count of favorites
 * @returns {number} Total number of favorites
 */
export const getFavoritesCount = () => {
  const favorites = getFavorites();
  return (
    (favorites.scenarios?.length || 0) +
    (favorites.resources?.length || 0) +
    (favorites.issues?.length || 0)
  );
};

/**
 * Clear all favorites
 * @param {string} type - Optional: specific type to clear, or all if not provided
 */
export const clearFavorites = (type = null) => {
  try {
    if (type) {
      const favorites = getFavorites();
      favorites[type] = [];
      saveFavorites(favorites);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

/**
 * Export favorites as JSON
 * @returns {string} JSON string of favorites
 */
export const exportFavorites = () => {
  const favorites = getFavorites();
  return JSON.stringify(favorites, null, 2);
};

/**
 * Import favorites from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} Success status
 */
export const importFavorites = (jsonString) => {
  try {
    const imported = JSON.parse(jsonString);
    saveFavorites(imported);
    return true;
  } catch (error) {
    console.error('Error importing favorites:', error);
    return false;
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  getFavoritesByType,
  getFavoritesCount,
  clearFavorites,
  exportFavorites,
  importFavorites
};
