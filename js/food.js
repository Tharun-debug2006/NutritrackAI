/**
 * food.js - Food Logging View
 */
(function(global) {
  global.FoodView = {
    selectedCategory: 'all',
    searchQuery: '',
    targetMeal: 'lunch',

    render: function(container) {
      if (!container) return;
      const self = this;
      const foods = global.NutriStorage.getFoodLog();
      const dbFoods = global.SearchUtils.filterFoods(this.searchQuery, this.selectedCategory);

      // Group foods by meal
      const meals = {
        breakfast: foods.filter(f => f.meal === 'breakfast'),
        lunch: foods.filter(f => f.meal === 'lunch'),
        dinner: foods.filter(f => f.meal === 'dinner'),
        snacks: foods.filter(f => f.meal === 'snacks')
      };

      const mealCals = {
        breakfast: meals.breakfast.reduce((sum, f) => sum + f.calories, 0),
        lunch: meals.lunch.reduce((sum, f) => sum + f.calories, 0),
        dinner: meals.dinner.reduce((sum, f) => sum + f.calories, 0),
        snacks: meals.snacks.reduce((sum, f) => sum + f.calories, 0)
      };

      container.innerHTML = `
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">🍎</span> Log Food & Nutrition</span>
            <button class="btn btn-outline btn-sm" id="openManualFoodModalBtn">+ Custom Food</button>
          </div>

          <!-- Food Search & Filters -->
          <div class="food-search-bar">
            <input type="text" class="form-input" id="foodSearchInput" placeholder="Search foods (e.g. Avocado, Chicken, Rice)..." value="${self.searchQuery}">
            <select class="form-input" id="mealSelect" style="width:140px;">
              <option value="breakfast" ${self.targetMeal === 'breakfast' ? 'selected' : ''}>Breakfast</option>
              <option value="lunch" ${self.targetMeal === 'lunch' ? 'selected' : ''}>Lunch</option>
              <option value="dinner" ${self.targetMeal === 'dinner' ? 'selected' : ''}>Dinner</option>
              <option value="snacks" ${self.targetMeal === 'snacks' ? 'selected' : ''}>Snacks</option>
            </select>
          </div>

          <!-- Quick Food Database Items -->
          <div style="max-height:220px;overflow-y:auto;border:1px solid var(--border-color);border-radius:var(--radius-sm);margin-bottom:16px;">
            ${dbFoods.length === 0 ? `
              <div style="padding:16px;text-align:center;color:var(--text-muted);">No foods match your search. Try adding a custom food!</div>
            ` : dbFoods.map(f => `
              <div class="food-item-row">
                <div class="food-item-info">
                  <span class="food-item-name">${f.icon} ${f.name} <small style="color:var(--text-muted)">(${f.serving})</small></span>
                  <span class="food-item-macros">${f.calories} kcal • P: ${f.protein}g • C: ${f.carbs}g • F: ${f.fat}g</span>
                </div>
                <div class="food-item-actions">
                  <button class="btn btn-success btn-sm add-db-food-btn" data-id="${f.id}">+ Add</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Meal Category Lists -->
        ${['breakfast', 'lunch', 'dinner', 'snacks'].map(mealKey => `
          <div class="card">
            <div class="card-title">
              <span>
                <span class="card-title-icon">${mealKey === 'breakfast' ? '🍳' : mealKey === 'lunch' ? '🥗' : mealKey === 'dinner' ? '🍲' : '🍎'}</span>
                ${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}
              </span>
              <span class="meal-badge">${mealCals[mealKey]} kcal</span>
            </div>

            ${meals[mealKey].length === 0 ? `
              <div style="padding:8px 0;color:var(--text-muted);font-size:13px;">No items logged for ${mealKey}.</div>
            ` : `
              <div>
                ${meals[mealKey].map(item => `
                  <div class="food-item-row">
                    <div class="food-item-info">
                      <span class="food-item-name">${item.name}</span>
                      <span class="food-item-macros">${item.calories} kcal • P: ${item.protein}g • C: ${item.carbs}g • F: ${item.fat}g • ${item.time}</span>
                    </div>
                    <div class="food-item-actions">
                      <button class="btn btn-outline btn-sm delete-food-btn" data-id="${item.id}" style="color:var(--accent-rose);border-color:rgba(244,63,94,0.3)">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        `).join('')}
      `;

      // Attach event listeners
      const searchInput = container.querySelector('#foodSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', global.SearchUtils.debounce((e) => {
          self.searchQuery = e.target.value;
          self.render(container);
        }, 200));
      }

      const mealSelect = container.querySelector('#mealSelect');
      if (mealSelect) {
        mealSelect.addEventListener('change', (e) => {
          self.targetMeal = e.target.value;
        });
      }

      const modalBtn = container.querySelector('#openManualFoodModalBtn');
      if (modalBtn) {
        modalBtn.addEventListener('click', () => {
          const modal = document.getElementById('foodModal');
          if (modal) modal.style.display = 'flex';
        });
      }

      container.querySelectorAll('.add-db-food-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = global.NutriFoodDB.find(f => f.id === id);
          if (item) {
            global.NutriStorage.addFoodLog({
              name: item.name,
              meal: self.targetMeal,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat
            });
            global.App.showToast(`Added ${item.name} to ${self.targetMeal}!`);
            self.render(container);
          }
        });
      });

      container.querySelectorAll('.delete-food-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          global.NutriStorage.deleteFoodLog(id);
          global.App.showToast('Item deleted');
          self.render(container);
        });
      });
    },

    initModal: function() {
      const saveBtn = document.getElementById('saveFoodBtn');
      const modal = document.getElementById('foodModal');
      if (!saveBtn || !modal) return;

      saveBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('foodName');
        const calInput = document.getElementById('foodCalories');
        const pInput = document.getElementById('foodProtein');
        const cInput = document.getElementById('foodCarbs');
        const fInput = document.getElementById('foodFat');

        const name = nameInput ? nameInput.value.trim() : '';
        if (!name) {
          alert('Please enter a food name');
          return;
        }

        global.NutriStorage.addFoodLog({
          name: name,
          meal: global.FoodView.targetMeal || 'lunch',
          calories: Number(calInput?.value) || 0,
          protein: Number(pInput?.value) || 0,
          carbs: Number(cInput?.value) || 0,
          fat: Number(fInput?.value) || 0
        });

        // Reset inputs
        if (nameInput) nameInput.value = '';
        if (calInput) calInput.value = '';
        if (pInput) pInput.value = '';
        if (cInput) cInput.value = '';
        if (fInput) fInput.value = '';

        modal.style.display = 'none';
        global.App.showToast(`Logged ${name}!`);

        const container = document.getElementById('view-food');
        if (container) global.FoodView.render(container);
      });
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
