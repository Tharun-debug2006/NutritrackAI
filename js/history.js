/**
 * history.js - History & Progress View
 */
(function(global) {
  global.HistoryView = {
    render: function(container) {
      if (!container) return;
      const history = global.NutriStorage.getHistorySummary();
      const user = global.NutriStorage.getUser() || { targetCalories: 2000 };
      const target = user.targetCalories || 2000;

      // Find max calorie value for chart scaling
      const maxCal = Math.max(target * 1.2, ...history.map(h => h.calories));
      const avgCal = Math.round(history.reduce((sum, h) => sum + h.calories, 0) / history.length);
      const totalBurned = history.reduce((sum, h) => sum + h.burned, 0);
      const avgWater = Math.round(history.reduce((sum, h) => sum + h.water, 0) / history.length);

      container.innerHTML = `
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">📈</span> 7-Day Calorie Intake</span>
            <span style="font-size:12px;color:var(--text-secondary)">Target: ${target} kcal</span>
          </div>

          <!-- Bar Chart -->
          <div class="history-bar-chart">
            ${history.map(item => {
              const heightPct = Math.min(100, Math.max(10, Math.round((item.calories / maxCal) * 100)));
              const isOver = item.calories > target;
              const barColor = isOver ? 'var(--accent-amber)' : 'var(--accent-emerald)';
              return `
                <div class="history-col">
                  <span style="font-size:10px;font-weight:700;color:var(--text-secondary);margin-bottom:4px;">${item.calories}</span>
                  <div class="history-bar-wrap">
                    <div class="history-bar" style="height:${heightPct}%;background:${barColor}"></div>
                  </div>
                  <span class="history-col-label">${item.day}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex;justify-content:center;gap:20px;font-size:12px;color:var(--text-secondary);">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;border-radius:2px;background:var(--accent-emerald);display:inline-block;"></span>
              <span>On / Under Target</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;border-radius:2px;background:var(--accent-amber);display:inline-block;"></span>
              <span>Over Budget</span>
            </div>
          </div>
        </div>

        <!-- Weekly Summary Metrics -->
        <div class="quick-row">
          <div class="quick-card">
            <div class="quick-icon">📊</div>
            <div class="quick-val">${avgCal} kcal</div>
            <div class="quick-label">Avg Daily Intake</div>
          </div>
          <div class="quick-card">
            <div class="quick-icon">🔥</div>
            <div class="quick-val">${totalBurned} kcal</div>
            <div class="quick-label">7-Day Burn Total</div>
          </div>
          <div class="quick-card">
            <div class="quick-icon">💧</div>
            <div class="quick-val">${avgWater} ml</div>
            <div class="quick-label">Avg Daily Water</div>
          </div>
        </div>

        <!-- Detailed Daily Log History -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">🗓️</span> Daily History Breakdown</span>
          </div>

          <div>
            ${history.map(item => `
              <div class="profile-info-row">
                <div>
                  <strong>${item.day} (${item.date})</strong>
                </div>
                <div style="display:flex;gap:14px;">
                  <span>🍽️ <strong>${item.calories}</strong> kcal</span>
                  <span style="color:var(--accent-emerald)">🏃 <strong>+${item.burned}</strong> kcal</span>
                  <span style="color:var(--accent-blue)">💧 <strong>${item.water}</strong> ml</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
