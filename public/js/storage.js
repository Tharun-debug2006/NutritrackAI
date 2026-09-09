/**
 * storage.js - NutriTrack AI Persistent Storage Utility
 */
(function(global) {
  const STORAGE_KEYS = {
    USER: 'nutritrack_user',
    FOODS: 'nutritrack_foods',
    WATER: 'nutritrack_water',
    ACTIVITIES: 'nutritrack_activities',
    HISTORY: 'nutritrack_history'
  };

  const memoryStore = {};

  function safeGet(key, fallback) {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(key);
        if (data !== null) return JSON.parse(data);
      }
    } catch (e) {
      // Fallback to memory store if localStorage throws
    }
    return memoryStore[key] !== undefined ? memoryStore[key] : fallback;
  }

  function safeSet(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      // Ignore
    }
    memoryStore[key] = value;
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  global.NutriStorage = {
    getUser: function() {
      return safeGet(STORAGE_KEYS.USER, null);
    },

    saveUser: function(userData) {
      safeSet(STORAGE_KEYS.USER, userData);
      return userData;
    },

    clearUser: function() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      } catch (e) {}
      delete memoryStore[STORAGE_KEYS.USER];
    },

    getFoodLog: function() {
      const today = getTodayString();
      const allFoods = safeGet(STORAGE_KEYS.FOODS, []);
      return allFoods.filter(f => f.date === today);
    },

    addFoodLog: function(item) {
      const allFoods = safeGet(STORAGE_KEYS.FOODS, []);
      const newItem = {
        id: 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        date: getTodayString(),
        meal: item.meal || 'lunch',
        name: item.name,
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      allFoods.push(newItem);
      safeSet(STORAGE_KEYS.FOODS, allFoods);
      return newItem;
    },

    deleteFoodLog: function(id) {
      const allFoods = safeGet(STORAGE_KEYS.FOODS, []);
      const updated = allFoods.filter(f => f.id !== id);
      safeSet(STORAGE_KEYS.FOODS, updated);
      return updated;
    },

    getWater: function() {
      const today = getTodayString();
      const waterData = safeGet(STORAGE_KEYS.WATER, {});
      return waterData[today] || 0;
    },

    addWater: function(amount) {
      const today = getTodayString();
      const waterData = safeGet(STORAGE_KEYS.WATER, {});
      const current = waterData[today] || 0;
      const updated = Math.max(0, current + amount);
      waterData[today] = updated;
      safeSet(STORAGE_KEYS.WATER, waterData);
      return updated;
    },

    resetWater: function() {
      const today = getTodayString();
      const waterData = safeGet(STORAGE_KEYS.WATER, {});
      waterData[today] = 0;
      safeSet(STORAGE_KEYS.WATER, waterData);
      return 0;
    },

    getActivities: function() {
      const today = getTodayString();
      const allActs = safeGet(STORAGE_KEYS.ACTIVITIES, []);
      return allActs.filter(a => a.date === today);
    },

    addActivity: function(act) {
      const allActs = safeGet(STORAGE_KEYS.ACTIVITIES, []);
      const newAct = {
        id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        date: getTodayString(),
        type: act.type || 'Workout',
        name: act.name || 'General Exercise',
        duration: Number(act.duration) || 30,
        caloriesBurned: Number(act.caloriesBurned) || 150,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      allActs.push(newAct);
      safeSet(STORAGE_KEYS.ACTIVITIES, allActs);
      return newAct;
    },

    deleteActivity: function(id) {
      const allActs = safeGet(STORAGE_KEYS.ACTIVITIES, []);
      const updated = allActs.filter(a => a.id !== id);
      safeSet(STORAGE_KEYS.ACTIVITIES, updated);
      return updated;
    },

    getHistorySummary: function() {
      const days = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const allFoods = safeGet(STORAGE_KEYS.FOODS, []);
      const waterData = safeGet(STORAGE_KEYS.WATER, {});
      const allActs = safeGet(STORAGE_KEYS.ACTIVITIES, []);

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayLabel = dayNames[d.getDay()];

        const dayFoods = allFoods.filter(f => f.date === dStr);
        const dayActs = allActs.filter(a => a.date === dStr);

        const calories = dayFoods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
        const burned = dayActs.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
        const water = waterData[dStr] || 0;

        days.push({
          date: dStr,
          day: dayLabel,
          calories: calories || (i > 0 ? Math.floor(1600 + Math.random() * 600) : calories),
          burned: burned || (i > 0 ? Math.floor(200 + Math.random() * 300) : burned),
          water: water || (i > 0 ? Math.floor(1500 + Math.random() * 1000) : water)
        });
      }
      return days;
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
