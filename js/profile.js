/**
 * profile.js - Profile & Health Metrics View
 */
(function(global) {
  global.ProfileView = {
    render: function(container) {
      if (!container) return;
      const user = global.NutriStorage.getUser() || {
        name: 'User',
        age: 25,
        gender: 'male',
        height: 170,
        weight: 70,
        activity: 'moderate',
        goal: 'maintain',
        targetCalories: 2000
      };

      const bmi = global.NutriMath.calculateBMI(user.weight, user.height);
      const bmr = global.NutriMath.calculateBMR(user.weight, user.height, user.age, user.gender);
      const tdee = global.NutriMath.calculateTDEE(bmr, user.activity);

      const activityNames = {
        sedentary: 'Sedentary (desk job / little exercise)',
        light: 'Light (exercise 1-3 days/week)',
        moderate: 'Moderate (exercise 3-5 days/week)',
        active: 'Active (exercise 6-7 days/week)',
        veryActive: 'Very Active (athlete / physical job)'
      };

      const goalNames = {
        lose: 'Weight Loss (-500 kcal deficit)',
        maintain: 'Weight Maintenance',
        gain: 'Muscle Gain (+300 kcal surplus)'
      };

      container.innerHTML = `
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">👤</span> Your Health Profile</span>
            <span class="meal-badge" style="color:var(--accent-emerald)">Active User</span>
          </div>

          <!-- Calculated Metrics -->
          <div class="profile-stat-grid">
            <div class="stat-pill" style="flex-direction:column;align-items:flex-start;gap:4px;">
              <span class="stat-pill-label">Body Mass Index (BMI)</span>
              <div style="display:flex;align-items:baseline;gap:8px;">
                <span style="font-size:22px;font-weight:900;color:${bmi.color}">${bmi.value}</span>
                <span style="font-size:12px;font-weight:600;color:${bmi.color}">(${bmi.category})</span>
              </div>
            </div>

            <div class="stat-pill" style="flex-direction:column;align-items:flex-start;gap:4px;">
              <span class="stat-pill-label">Basal Metabolic Rate (BMR)</span>
              <span style="font-size:22px;font-weight:900;color:var(--text-primary)">${bmr} <small style="font-size:12px;color:var(--text-secondary)">kcal</small></span>
            </div>

            <div class="stat-pill" style="flex-direction:column;align-items:flex-start;gap:4px;">
              <span class="stat-pill-label">Daily Maintenance (TDEE)</span>
              <span style="font-size:22px;font-weight:900;color:var(--accent-blue)">${tdee} <small style="font-size:12px;color:var(--text-secondary)">kcal</small></span>
            </div>

            <div class="stat-pill" style="flex-direction:column;align-items:flex-start;gap:4px;">
              <span class="stat-pill-label">Daily Calorie Target</span>
              <span style="font-size:22px;font-weight:900;color:var(--accent-emerald)">${user.targetCalories || 2000} <small style="font-size:12px;color:var(--text-secondary)">kcal</small></span>
            </div>
          </div>

          <!-- Profile Details -->
          <div style="margin-top:16px;">
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Name</span>
              <strong>${user.name}</strong>
            </div>
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Age</span>
              <strong>${user.age} years</strong>
            </div>
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Gender</span>
              <strong>${user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Male'}</strong>
            </div>
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Height & Weight</span>
              <strong>${user.height} cm • ${user.weight} kg</strong>
            </div>
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Activity Level</span>
              <strong>${activityNames[user.activity] || user.activity}</strong>
            </div>
            <div class="profile-info-row">
              <span style="color:var(--text-secondary)">Goal</span>
              <strong style="color:var(--accent-emerald)">${goalNames[user.goal] || user.goal}</strong>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">⚙️</span> Account & Session</span>
          </div>
          <div style="display:flex;gap:12px;">
            <button class="btn btn-outline" id="editProfileBtn">✏️ Edit Profile</button>
            <button class="btn btn-danger" id="logoutBtn" style="background:rgba(244,63,94,0.15);color:var(--accent-rose);border:1px solid var(--accent-rose);">
              🚪 Log Out / Reset Profile
            </button>
          </div>
        </div>
      `;

      // Event listeners
      const logoutBtn = container.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (confirm('Log out and return to the onboarding screen?')) {
            global.App.logout();
          }
        });
      }

      const editBtn = container.querySelector('#editProfileBtn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          // Prepopulate onboarding form
          document.getElementById('onboard-name').value = user.name || '';
          document.getElementById('onboard-age').value = user.age || '';
          document.getElementById('onboard-gender').value = user.gender || 'male';
          document.getElementById('onboard-height').value = user.height || '';
          document.getElementById('onboard-weight').value = user.weight || '';
          document.getElementById('onboard-activity').value = user.activity || 'moderate';
          document.getElementById('onboard-goal').value = user.goal || 'maintain';

          global.App.showOnboarding();
        });
      }
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
