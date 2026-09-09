/**
 * dashboard.js - Home / Dashboard View
 */
(function(global) {
  global.DashboardView = {
    render: function(container) {
      if (!container) return;
      const user = global.NutriStorage.getUser() || {
        name: 'Health Seeker',
        goal: 'maintain',
        targetCalories: 2000,
        macros: { protein: 150, carbs: 225, fat: 55 }
      };

      const foods = global.NutriStorage.getFoodLog();
      const activities = global.NutriStorage.getActivities();
      const waterMl = global.NutriStorage.getWater();

      const totalConsumed = foods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
      const totalBurned = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
      const targetCalories = user.targetCalories || 2000;
      const remaining = targetCalories - totalConsumed + totalBurned;

      // Macros consumed
      const consumedProtein = foods.reduce((sum, f) => sum + (Number(f.protein) || 0), 0);
      const consumedCarbs = foods.reduce((sum, f) => sum + (Number(f.carbs) || 0), 0);
      const consumedFat = foods.reduce((sum, f) => sum + (Number(f.fat) || 0), 0);

      const targetProtein = user.macros?.protein || 140;
      const targetCarbs = user.macros?.carbs || 220;
      const targetFat = user.macros?.fat || 60;

      const pPct = Math.min(100, Math.round((consumedProtein / targetProtein) * 100)) || 0;
      const cPct = Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100)) || 0;
      const fPct = Math.min(100, Math.round((consumedFat / targetFat) * 100)) || 0;

      const goalLabels = {
        lose: 'Weight Loss (-500 kcal)',
        maintain: 'Weight Maintenance',
        gain: 'Muscle Gain (+300 kcal)'
      };

      container.innerHTML = `
        <div class="welcome-header">
          <div class="welcome-title">Good Day, ${user.name} 👋</div>
          <div class="welcome-subtitle">Your Goal: <strong style="color:var(--accent-emerald)">${goalLabels[user.goal] || 'Healthy Nutrition'}</strong></div>
        </div>

        <!-- Calorie Hero Card -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">🔥</span> Daily Calorie Budget</span>
            <span style="font-size:12px;color:var(--text-secondary)">Target: ${targetCalories} kcal</span>
          </div>

          <div class="calorie-hero-grid">
            <div class="calorie-main-stat">
              <div class="calorie-number">${Math.max(0, remaining)}</div>
              <div class="calorie-label">${remaining >= 0 ? 'Calories Remaining' : 'Calories Over Target'}</div>
            </div>

            <div class="calorie-stats-column">
              <div class="stat-pill">
                <span class="stat-pill-label">🍽️ Consumed</span>
                <span class="stat-pill-value">${totalConsumed} kcal</span>
              </div>
              <div class="stat-pill">
                <span class="stat-pill-label">🏃 Burned</span>
                <span class="stat-pill-value" style="color:var(--accent-emerald)">+${totalBurned} kcal</span>
              </div>
              <div class="stat-pill">
                <span class="stat-pill-label">🎯 Goal Target</span>
                <span class="stat-pill-value">${targetCalories} kcal</span>
              </div>
            </div>
          </div>

          <!-- Macros Bars -->
          <div class="macro-grid">
            <div class="macro-box">
              <div class="macro-header">
                <span class="macro-name">Protein</span>
                <span class="macro-val">${consumedProtein} / ${targetProtein}g</span>
              </div>
              <div class="macro-progress-bg">
                <div class="macro-progress-fill fill-protein" style="width:${pPct}%"></div>
              </div>
            </div>

            <div class="macro-box">
              <div class="macro-header">
                <span class="macro-name">Carbs</span>
                <span class="macro-val">${consumedCarbs} / ${targetCarbs}g</span>
              </div>
              <div class="macro-progress-bg">
                <div class="macro-progress-fill fill-carbs" style="width:${cPct}%"></div>
              </div>
            </div>

            <div class="macro-box">
              <div class="macro-header">
                <span class="macro-name">Fat</span>
                <span class="macro-val">${consumedFat} / ${targetFat}g</span>
              </div>
              <div class="macro-progress-bg">
                <div class="macro-progress-fill fill-fat" style="width:${fPct}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Summary Cards -->
        <div class="quick-row">
          <div class="quick-card" onclick="window.App.switchView('water')">
            <div class="quick-icon">💧</div>
            <div class="quick-val">${waterMl} ml</div>
            <div class="quick-label">Hydration (Goal: 2500ml)</div>
          </div>

          <div class="quick-card" onclick="window.App.switchView('activity')">
            <div class="quick-icon">🏃</div>
            <div class="quick-val">${totalBurned} kcal</div>
            <div class="quick-label">${activities.length} Workouts Today</div>
          </div>

          <div class="quick-card" onclick="window.App.switchView('food')">
            <div class="quick-icon">🥗</div>
            <div class="quick-val">${foods.length} Items</div>
            <div class="quick-label">Meals Logged</div>
          </div>
        </div>

        <!-- Today's Food Summary -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">📝</span> Today's Meals</span>
            <button class="btn btn-outline btn-sm" onclick="window.App.switchView('food')">+ Log Meal</button>
          </div>

          ${foods.length === 0 ? `
            <div style="text-align:center;padding:24px 0;color:var(--text-muted)">
              No meals logged today yet. Click <strong>+ Log Meal</strong> to track your food!
            </div>
          ` : `
            <div>
              ${foods.slice(-4).reverse().map(f => `
                <div class="food-item-row">
                  <div class="food-item-info">
                    <span class="food-item-name">${f.name}</span>
                    <span class="food-item-macros">${f.meal.toUpperCase()} • ${f.protein}g P • ${f.carbs}g C • ${f.fat}g F</span>
                  </div>
                  <div class="food-item-actions">
                    <span style="font-weight:700;color:var(--accent-emerald)">${f.calories} kcal</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
