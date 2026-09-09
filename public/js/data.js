/**
 * data.js - Health & Nutrition Formulas (BMR, TDEE, BMI, Macros)
 */
(function(global) {
  global.NutriMath = {
    // Mifflin-St Jeor Equation
    calculateBMR: function(weightKg, heightCm, age, gender) {
      const w = Number(weightKg) || 70;
      const h = Number(heightCm) || 170;
      const a = Number(age) || 25;
      const isMale = (gender || 'male').toLowerCase() === 'male';

      if (isMale) {
        return Math.round(10 * w + 6.25 * h - 5 * a + 5);
      } else {
        return Math.round(10 * w + 6.25 * h - 5 * a - 161);
      }
    },

    // Total Daily Energy Expenditure
    calculateTDEE: function(bmr, activityLevel) {
      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      const mult = multipliers[activityLevel] || 1.55;
      return Math.round(bmr * mult);
    },

    // Calorie target based on goal
    calculateTargetCalories: function(tdee, goal) {
      if (goal === 'lose') {
        return Math.max(1200, Math.round(tdee - 500));
      } else if (goal === 'gain') {
        return Math.round(tdee + 300);
      }
      return Math.round(tdee);
    },

    // Recommended macros distribution based on calorie target
    calculateMacros: function(targetCalories) {
      // 30% Protein (4 kcal/g), 45% Carbs (4 kcal/g), 25% Fat (9 kcal/g)
      const proteinGrams = Math.round((targetCalories * 0.30) / 4);
      const carbsGrams = Math.round((targetCalories * 0.45) / 4);
      const fatGrams = Math.round((targetCalories * 0.25) / 9);

      return {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams
      };
    },

    // Body Mass Index
    calculateBMI: function(weightKg, heightCm) {
      const w = Number(weightKg) || 70;
      const hMeters = (Number(heightCm) || 170) / 100;
      const bmi = w / (hMeters * hMeters);
      let category = 'Normal';
      let color = 'var(--accent-emerald)';

      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'var(--accent-amber)';
      } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'var(--accent-emerald)';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = 'var(--accent-amber)';
      } else {
        category = 'Obese';
        color = 'var(--accent-rose)';
      }

      return {
        value: Number(bmi.toFixed(1)),
        category: category,
        color: color
      };
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
