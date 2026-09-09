/**
 * water.js - Hydration Tracker View
 */
(function(global) {
  global.WaterView = {
    render: function(container) {
      if (!container) return;
      const currentWater = global.NutriStorage.getWater();
      const goalWater = 2500; // ml
      const pct = Math.min(100, Math.round((currentWater / goalWater) * 100));

      container.innerHTML = `
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">💧</span> Daily Hydration Tracker</span>
            <span style="font-size:12px;color:var(--accent-blue)">Goal: ${goalWater} ml</span>
          </div>

          <div class="water-gauge-container">
            <div class="water-bottle-visual">
              <div class="water-bottle-fill" style="height: ${pct}%;"></div>
            </div>

            <div style="font-size:36px;font-weight:900;color:var(--accent-blue);line-height:1;margin-bottom:4px;">
              ${currentWater} <span style="font-size:18px;font-weight:600;color:var(--text-secondary)">/ ${goalWater} ml</span>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
              ${pct}% of daily hydration target completed
            </div>

            <!-- Quick Add Water Buttons -->
            <div class="water-controls-grid">
              <button class="btn btn-outline quick-water-btn" data-amt="250">🥤 +250 ml (Glass)</button>
              <button class="btn btn-outline quick-water-btn" data-amt="500">🍶 +500 ml (Bottle)</button>
              <button class="btn btn-outline quick-water-btn" data-amt="750">💧 +750 ml (Sports)</button>
              <button class="btn btn-outline" id="resetWaterBtn" style="color:var(--accent-rose);border-color:rgba(244,63,94,0.3)">🔄 Reset Water</button>
            </div>
          </div>
        </div>

        <!-- Hydration Insights Card -->
        <div class="card">
          <div class="card-title">
            <span><span class="card-title-icon">💡</span> Hydration Benefits</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--text-secondary);">
            <div style="display:flex;gap:8px;">
              <span>⚡</span>
              <span><strong>Boosts Energy & Focus:</strong> Even mild dehydration (1-2%) can impair brain performance and memory.</span>
            </div>
            <div style="display:flex;gap:8px;">
              <span>🔥</span>
              <span><strong>Aids Fat Loss:</strong> Drinking 500ml of water can temporarily boost resting metabolism by 24-30%.</span>
            </div>
            <div style="display:flex;gap:8px;">
              <span>🏃</span>
              <span><strong>Prevents Muscle Cramps:</strong> Keeps electrolytes balanced during intense workouts.</span>
            </div>
          </div>
        </div>
      `;

      // Event listeners
      container.querySelectorAll('.quick-water-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const amt = Number(btn.getAttribute('data-amt')) || 250;
          global.NutriStorage.addWater(amt);
          global.App.showToast(`Logged +${amt}ml water! 💧`);
          global.WaterView.render(container);
        });
      });

      const resetBtn = container.querySelector('#resetWaterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Reset today\'s water intake to 0?')) {
            global.NutriStorage.resetWater();
            global.App.showToast('Water reset');
            global.WaterView.render(container);
          }
        });
      }
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
