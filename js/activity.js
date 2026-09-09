/**
 * activity.js - Activity & Workout Tracker
 */
(function(global) {
  global.ActivityView = {
    selectedType: 'running',
    duration: 30,

    activitiesCatalog: [
      { id: 'running', name: 'Running', icon: '🏃', calPerMin: 10 },
      { id: 'cycling', name: 'Cycling', icon: '🚴', calPerMin: 8 },
      { id: 'gym', name: 'Weight Training', icon: '🏋️', calPerMin: 6 },
      { id: 'swimming', name: 'Swimming', icon: '🏊', calPerMin: 9 },
      { id: 'hiit', name: 'HIIT / Cardio', icon: '⚡', calPerMin: 11 },
      { id: 'walking', name: 'Brisk Walking', icon: '🚶', calPerMin: 4 },
      { id: 'yoga', name: 'Yoga / Stretch', icon: '🧘', calPerMin: 3.5 }
    ],

    render: function(container) {
      if (!container) return;
      const self = this;
      const user = global.NutriStorage.getUser() || { weight: 70 };
      const weightFactor = (Number(user.weight) || 70) / 70;

      const selected = self.activitiesCatalog.find(a => a.id === self.selectedType) || self.activitiesCatalog[0];
      const estimatedBurned = Math.round(selected.calPerMin * self.duration * weightFactor);

      const loggedActs = global.NutriStorage.getActivities();
      const totalBurned = loggedActs.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);

      container.innerHTML = `
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">🏃</span> Log Workout or Activity</span>
            <span style="font-size:12px;color:var(--accent-emerald)">Today: +${totalBurned} kcal burned</span>
          </div>

          <!-- Activity Selection Grid -->
          <div class="activity-grid">
            ${self.activitiesCatalog.map(a => `
              <div class="activity-btn ${self.selectedType === a.id ? 'selected' : ''}" data-id="${a.id}">
                <span class="activity-btn-icon">${a.icon}</span>
                <span class="activity-btn-name">${a.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- Duration Input & Burn Preview -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;margin-bottom:16px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Duration (Minutes)</label>
              <input type="number" class="form-input" id="workoutDurationInput" value="${self.duration}" min="5" max="300" step="5">
            </div>

            <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:10px 14px;display:flex;flex-direction:column;justify-content:center;">
              <span style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;">Estimated Burn</span>
              <span style="font-size:20px;font-weight:800;color:var(--accent-emerald)">🔥 ${estimatedBurned} kcal</span>
            </div>
          </div>

          <button class="btn btn-success" id="logWorkoutBtn">⚡ Log Workout (+${estimatedBurned} kcal)</button>
        </div>

        <!-- Today's Logged Workouts -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">📋</span> Today's Logged Activities</span>
            <span class="meal-badge">${loggedActs.length} sessions</span>
          </div>

          ${loggedActs.length === 0 ? `
            <div style="padding:16px 0;text-align:center;color:var(--text-muted);font-size:13px;">
              No workouts logged today. Select an activity above and log your session!
            </div>
          ` : `
            <div>
              ${loggedActs.map(act => `
                <div class="food-item-row">
                  <div class="food-item-info">
                    <span class="food-item-name">${act.name}</span>
                    <span class="food-item-macros">${act.duration} mins • ${act.time}</span>
                  </div>
                  <div class="food-item-actions">
                    <span style="font-weight:700;color:var(--accent-emerald)">+${act.caloriesBurned} kcal</span>
                    <button class="btn btn-outline btn-sm delete-act-btn" data-id="${act.id}" style="color:var(--accent-rose);border-color:rgba(244,63,94,0.3)">✕</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

      // Select activity type
      container.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          self.selectedType = btn.getAttribute('data-id');
          self.render(container);
        });
      });

      // Duration input
      const durInput = container.querySelector('#workoutDurationInput');
      if (durInput) {
        durInput.addEventListener('input', (e) => {
          self.duration = Math.max(1, Number(e.target.value) || 30);
          const sel = self.activitiesCatalog.find(a => a.id === self.selectedType) || self.activitiesCatalog[0];
          const newBurn = Math.round(sel.calPerMin * self.duration * weightFactor);
          const btn = container.querySelector('#logWorkoutBtn');
          if (btn) btn.textContent = `⚡ Log Workout (+${newBurn} kcal)`;
        });
      }

      // Log workout
      const logBtn = container.querySelector('#logWorkoutBtn');
      if (logBtn) {
        logBtn.addEventListener('click', () => {
          const actObj = self.activitiesCatalog.find(a => a.id === self.selectedType) || self.activitiesCatalog[0];
          const burn = Math.round(actObj.calPerMin * self.duration * weightFactor);
          global.NutriStorage.addActivity({
            type: actObj.id,
            name: `${actObj.icon} ${actObj.name}`,
            duration: self.duration,
            caloriesBurned: burn
          });
          global.App.showToast(`Logged ${actObj.name} for ${self.duration} mins!`);
          self.render(container);
        });
      }

      // Delete activity
      container.querySelectorAll('.delete-act-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          global.NutriStorage.deleteActivity(id);
          global.App.showToast('Workout removed');
          self.render(container);
        });
      });
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
