/**
 * searchUtils.js - Search and filter utilities
 */
(function(global) {
  global.SearchUtils = {
    filterFoods: function(query, category) {
      if (!global.NutriFoodDB) return [];
      let results = global.NutriFoodDB;
      
      if (category && category !== 'all') {
        results = results.filter(item => item.category === category);
      }
      
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        results = results.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.category.toLowerCase().includes(q)
        );
      }
      
      return results;
    },

    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
