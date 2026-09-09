/**
 * app.js - Main Application Orchestrator for NutriTrack AI
 */
(function(global) {
  const App = {
    currentView: 'home',
    chatbaseInitialized: false,

    init: function() {
      const self = this;
      if (typeof document === 'undefined') return;

      // Attach button listener for Get Started
      const getStartedBtn = document.getElementById('getStartedBtn');
      if (getStartedBtn) {
        getStartedBtn.onclick = function(e) {
          if (e && e.preventDefault) e.preventDefault();
          self.handleGetStarted();
        };
      }

      // Also support onboard-save-btn if present
      const onboardSaveBtn = document.getElementById('onboard-save-btn');
      if (onboardSaveBtn && onboardSaveBtn !== getStartedBtn) {
        onboardSaveBtn.onclick = function(e) {
          if (e && e.preventDefault) e.preventDefault();
          self.handleGetStarted();
        };
      }

      // Navigation button listeners
      const views = ['home', 'food', 'activity', 'water', 'history', 'profile'];
      views.forEach(function(v) {
        const navBtn = document.getElementById('nav-' + v);
        if (navBtn) {
          navBtn.onclick = function() {
            self.switchView(v);
          };
        }
      });

      // Food modal init
      if (global.FoodView && typeof global.FoodView.initModal === 'function') {
        global.FoodView.initModal();
      }

      // Floating AI Assistant button (bottom-right above bottom nav)
      const aiAssistantBtn = document.getElementById('ai-assistant-btn');
      if (aiAssistantBtn) {
        aiAssistantBtn.onclick = function() {
          self.openChatbot();
        };
      }

      // Top-bar AI Coach button
      const chatFab = document.getElementById('chat-fab');
      if (chatFab) {
        chatFab.onclick = function() {
          self.toggleChatbot();
        };
      }

      // Chatbot drawer close button
      const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
      if (chatbotCloseBtn) {
        chatbotCloseBtn.onclick = function() {
          self.closeChatbot();
        };
      }

      // Chatbot backdrop click to close
      const chatbotBackdrop = document.getElementById('chatbot-backdrop');
      if (chatbotBackdrop) {
        chatbotBackdrop.onclick = function() {
          self.closeChatbot();
        };
      }

      // Check if user is already onboarded
      const existingUser = global.NutriStorage ? global.NutriStorage.getUser() : null;
      if (existingUser && existingUser.name) {
        self.showMainApp();
        self.switchView('home');
      } else {
        self.showOnboarding();
      }
    },

    openChatbot: function() {
      if (typeof document === 'undefined') return;
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotBackdrop = document.getElementById('chatbot-backdrop');
      if (!chatbotContainer) return;

      this.ensureChatbaseLoaded();

      chatbotContainer.style.display = 'flex';
      if (chatbotBackdrop) {
        chatbotBackdrop.style.display = 'block';
      }

      // Smooth slide-in transition
      const doOpen = function() {
        chatbotContainer.classList.add('open');
        if (chatbotBackdrop) {
          chatbotBackdrop.classList.add('open');
        }
      };

      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(doOpen);
      } else if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(doOpen);
      } else {
        setTimeout(doOpen, 10);
      }
    },

    closeChatbot: function() {
      if (typeof document === 'undefined') return;
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotBackdrop = document.getElementById('chatbot-backdrop');
      if (!chatbotContainer) return;

      chatbotContainer.classList.remove('open');
      if (chatbotBackdrop) {
        chatbotBackdrop.classList.remove('open');
      }

      setTimeout(function() {
        if (!chatbotContainer.classList.contains('open')) {
          chatbotContainer.style.display = 'none';
          if (chatbotBackdrop) {
            chatbotBackdrop.style.display = 'none';
          }
        }
      }, 300);
    },

    toggleChatbot: function() {
      const chatbotContainer = document.getElementById('chatbot-container');
      if (chatbotContainer && chatbotContainer.classList.contains('open')) {
        this.closeChatbot();
      } else {
        this.openChatbot();
      }
    },

    showOnboarding: function() {
      if (typeof document === 'undefined') return;
      const landingPage = document.getElementById('landingPage');
      const onboardOverlay = document.getElementById('onboard-overlay');
      const mainApp = document.getElementById('mainApp');
      const appLayout = document.getElementById('app-layout');
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotBackdrop = document.getElementById('chatbot-backdrop');
      const aiAssistantBtn = document.getElementById('ai-assistant-btn');

      // 1. Show landing page
      if (landingPage) landingPage.style.display = 'flex';
      if (onboardOverlay) {
        onboardOverlay.style.display = 'flex';
        onboardOverlay.classList.remove('hidden');
      }

      // 2. Hide main app and wrapper
      if (mainApp) mainApp.style.display = 'none';
      if (appLayout) appLayout.style.display = 'none';

      // 3. Ensure chatbot container and backdrop are completely closed and hidden
      if (chatbotContainer) {
        chatbotContainer.classList.remove('open');
        chatbotContainer.style.display = 'none';
      }
      if (chatbotBackdrop) {
        chatbotBackdrop.classList.remove('open');
        chatbotBackdrop.style.display = 'none';
      }

      // 4. Ensure floating AI Assistant button is strictly hidden on onboarding/login screen
      if (aiAssistantBtn) {
        aiAssistantBtn.style.display = 'none';
      }
    },

    showMainApp: function() {
      if (typeof document === 'undefined') return;
      const landingPage = document.getElementById('landingPage');
      const onboardOverlay = document.getElementById('onboard-overlay');
      const mainApp = document.getElementById('mainApp');
      const appLayout = document.getElementById('app-layout');
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotBackdrop = document.getElementById('chatbot-backdrop');
      const aiAssistantBtn = document.getElementById('ai-assistant-btn');

      // 1. Hide landing page & overlay
      if (landingPage) landingPage.style.display = 'none';
      if (onboardOverlay) {
        onboardOverlay.style.display = 'none';
        onboardOverlay.classList.add('hidden');
      }

      // 2. Show layout and mainApp in full width
      if (appLayout) appLayout.style.display = 'block';
      if (mainApp) mainApp.style.display = 'flex';

      // 3. Chatbot is hidden by default (does NOT occupy permanent space)
      if (chatbotContainer) {
        chatbotContainer.classList.remove('open');
        chatbotContainer.style.display = 'none';
      }
      if (chatbotBackdrop) {
        chatbotBackdrop.classList.remove('open');
        chatbotBackdrop.style.display = 'none';
      }

      // 4. Show floating AI Assistant button at bottom-right corner
      if (aiAssistantBtn) {
        aiAssistantBtn.style.display = 'inline-flex';
      }

      // Update user name in top bar if present
      const user = global.NutriStorage ? global.NutriStorage.getUser() : null;
      const userNameEl = document.getElementById('top-bar-user-name');
      const userInitialEl = document.getElementById('top-bar-user-initial');
      if (user && userNameEl) userNameEl.textContent = user.name;
      if (user && userInitialEl) userInitialEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
    },

    handleGetStarted: function() {
      if (typeof document === 'undefined') return;
      const nameInput = document.getElementById('onboard-name');
      const ageInput = document.getElementById('onboard-age');
      const genderInput = document.getElementById('onboard-gender');
      const heightInput = document.getElementById('onboard-height');
      const weightInput = document.getElementById('onboard-weight');
      const activityInput = document.getElementById('onboard-activity');
      const goalInput = document.getElementById('onboard-goal');

      const name = (nameInput && nameInput.value && nameInput.value.trim()) ? nameInput.value.trim() : 'Alex';
      const age = (ageInput && Number(ageInput.value)) ? Number(ageInput.value) : 26;
      const gender = (genderInput && genderInput.value) ? genderInput.value : 'male';
      const height = (heightInput && Number(heightInput.value)) ? Number(heightInput.value) : 175;
      const weight = (weightInput && Number(weightInput.value)) ? Number(weightInput.value) : 72;
      const activity = (activityInput && activityInput.value) ? activityInput.value : 'moderate';
      const goal = (goalInput && goalInput.value) ? goalInput.value : 'maintain';

      // Calculate targets
      const bmr = global.NutriMath ? global.NutriMath.calculateBMR(weight, height, age, gender) : 1700;
      const tdee = global.NutriMath ? global.NutriMath.calculateTDEE(bmr, activity) : 2200;
      const targetCalories = global.NutriMath ? global.NutriMath.calculateTargetCalories(tdee, goal) : 2200;
      const macros = global.NutriMath ? global.NutriMath.calculateMacros(targetCalories) : { protein: 150, carbs: 220, fat: 60 };

      const userProfile = {
        name: name,
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        activity: activity,
        goal: goal,
        bmr: bmr,
        tdee: tdee,
        targetCalories: targetCalories,
        macros: macros
      };

      if (global.NutriStorage) {
        global.NutriStorage.saveUser(userProfile);
      }

      // Transition to main app: full dashboard view, floating AI button visible, chatbot closed
      this.showMainApp();
      this.switchView('home');
      this.showToast(`Welcome, ${name}! Your health plan is ready. 🥗`);
    },

    switchView: function(viewName) {
      if (typeof document === 'undefined') return;
      this.currentView = viewName;

      // 1. Hide all views
      const allViews = document.querySelectorAll('.app-view');
      allViews.forEach(function(v) {
        v.classList.remove('active');
        v.style.display = 'none';
      });

      // 2. Show target view
      const targetViewEl = document.getElementById('view-' + viewName);
      if (targetViewEl) {
        targetViewEl.classList.add('active');
        targetViewEl.style.display = 'block';

        // Render appropriate content
        if (viewName === 'home' && global.DashboardView) {
          global.DashboardView.render(targetViewEl);
        } else if (viewName === 'food' && global.FoodView) {
          global.FoodView.render(targetViewEl);
        } else if (viewName === 'activity' && global.ActivityView) {
          global.ActivityView.render(targetViewEl);
        } else if (viewName === 'water' && global.WaterView) {
          global.WaterView.render(targetViewEl);
        } else if (viewName === 'history' && global.HistoryView) {
          global.HistoryView.render(targetViewEl);
        } else if (viewName === 'profile' && global.ProfileView) {
          global.ProfileView.render(targetViewEl);
        }
      }

      // 3. Update bottom navigation active class
      const navItems = document.querySelectorAll('.bottom-nav .nav-item');
      navItems.forEach(function(item) {
        if (item.getAttribute('data-view') === viewName || item.id === 'nav-' + viewName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Floating AI Assistant button remains available on dashboard
      const aiAssistantBtn = document.getElementById('ai-assistant-btn');
      const mainApp = document.getElementById('mainApp');
      if (mainApp && mainApp.style.display !== 'none' && aiAssistantBtn) {
        aiAssistantBtn.style.display = 'inline-flex';
      }
    },

    ensureChatbaseLoaded: function() {
      if (this.chatbaseInitialized || typeof document === 'undefined') return;
      
      const iframeContainer = document.getElementById('chatbot-iframe-container');
      if (!iframeContainer) return;

      let iframe = document.getElementById('chatbase-iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'chatbase-iframe';
        iframe.src = 'https://www.chatbase.co/chatbot-iframe/Bui9cYBQHqD4js6uDhuxB';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'microphone';
        iframe.title = 'NutriTrack AI Assistant';
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframeContainer.appendChild(iframe);
      }
      this.chatbaseInitialized = true;
    },

    logout: function() {
      this.closeChatbot();
      if (global.NutriStorage) {
        global.NutriStorage.clearUser();
      }
      this.showOnboarding();
      this.showToast('Logged out. Profile reset.');
    },

    showToast: function(message) {
      if (typeof document === 'undefined') return;
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span>🥗</span><span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(function() {
        if (toast && toast.parentNode) {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s ease';
          setTimeout(function() {
            if (toast && toast.parentNode) toast.remove();
          }, 300);
        }
      }, 2500);
    }
  };

  global.App = App;

  // Auto-init on DOMContentLoaded or immediate if already loaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        App.init();
      });
    } else {
      App.init();
    }
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
