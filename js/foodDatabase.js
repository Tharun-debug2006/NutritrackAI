/**
 * foodDatabase.js - Preloaded food nutritional items
 */
(function(global) {
  global.NutriFoodDB = [
    { id: 'f1', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', icon: '🍗', category: 'protein' },
    { id: 'f2', name: 'Fresh Salmon Fillet', calories: 206, protein: 22, carbs: 0, fat: 13, serving: '100g', icon: '🐟', category: 'protein' },
    { id: 'f3', name: 'Eggs (2 Whole)', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '2 eggs (100g)', icon: '🥚', category: 'protein' },
    { id: 'f4', name: 'Egg Whites (3 whites)', calories: 51, protein: 11, carbs: 0.7, fat: 0.2, serving: '100g', icon: '🍳', category: 'protein' },
    { id: 'f5', name: 'Cooked Brown Rice', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, serving: '100g', icon: '🍚', category: 'carbs' },
    { id: 'f6', name: 'Rolled Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '40g dry', icon: '🥣', category: 'carbs' },
    { id: 'f7', name: 'Sweet Potato (Baked)', calories: 90, protein: 2, carbs: 21, fat: 0.2, serving: '1 medium (100g)', icon: '🍠', category: 'carbs' },
    { id: 'f8', name: 'Greek Yogurt (Non-fat)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: '100g', icon: '🥛', category: 'dairy' },
    { id: 'f9', name: 'Fresh Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: 'Half medium (100g)', icon: '🥑', category: 'fats' },
    { id: 'f10', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 medium (100g)', icon: '🍌', category: 'fruit' },
    { id: 'f11', name: 'Fresh Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 medium (100g)', icon: '🍎', category: 'fruit' },
    { id: 'f12', name: 'Peanut Butter', calories: 95, protein: 3.5, carbs: 3, fat: 8, serving: '1 tbsp (16g)', icon: '🥜', category: 'fats' },
    { id: 'f13', name: 'Steamed Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '100g', icon: '🥦', category: 'veggies' },
    { id: 'f14', name: 'Raw Almonds', calories: 160, protein: 6, carbs: 6, fat: 14, serving: '28g (about 23 nuts)', icon: '🌰', category: 'fats' },
    { id: 'f15', name: 'Whole Wheat Bread', calories: 79, protein: 4, carbs: 13, fat: 1, serving: '1 slice (32g)', icon: '🍞', category: 'carbs' },
    { id: 'f16', name: 'Whey Protein Shake', calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: '1 scoop (30g)', icon: '🥤', category: 'supplements' },
    { id: 'f17', name: 'Extra Virgin Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 tbsp (14ml)', icon: '🫒', category: 'fats' },
    { id: 'f18', name: 'Firm Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, serving: '100g', icon: '🧊', category: 'protein' },
    { id: 'f19', name: 'Tuna (In Water)', calories: 116, protein: 26, carbs: 0, fat: 1, serving: '1 can drained (110g)', icon: '🐟', category: 'protein' },
    { id: 'f20', name: 'Mixed Berries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, serving: '100g', icon: '🍓', category: 'fruit' }
  ];
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
