// Main Application Controller for CodeType (Monkeytype-style)
class CodeTypeApp {
    constructor() {
        this.typingEngine = new TypingEngine();
        this.performanceTracker = new PerformanceTracker();
        this.problemsDB = window.problemsDB;
        
        // Current settings
        this.currentMode = 'problems'; // 'problems' or 'micro'
        this.currentTopic = 'array';
        this.currentLanguage = 'python'; // Fixed to Python only (for now)
        this.currentProblem = null;
        
        // Game state
        this.gameState = {
            isActive: false,
            isComplete: false,
            canType: true
        };
        
        // DOM elements
        this.elements = {};
        
        // Timer
        this.timer = {
            startTime: null,
            interval: null,
            display: null
        };
        
        this.init();
    }
    
    // Initialize the application
    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupTypingEngine();
        this.loadNewProblem();
        this.loadUserSettings();
    }
    
    // Initialize DOM element references
    initializeElements() {
        this.elements = {
            // Settings
            settingsBar: document.getElementById('settings-bar'),
            modeButtons: document.querySelectorAll('[data-mode]'),
            topicButtons: document.querySelectorAll('[data-topic]'),
            
            // Typing interface
            problemInfo: document.getElementById('problem-info'),
            problemTitle: document.getElementById('problem-title'),
            timer: document.getElementById('timer'),
            codeDisplay: document.getElementById('code-display-text'),
            codeInput: document.getElementById('code-input'),
            
            // Metrics
            metricsDisplay: document.getElementById('metrics-display'),
            wpmDisplay: document.getElementById('wpm-display'),
            accuracyDisplay: document.getElementById('accuracy-display'),
            
            // Controls
            resetBtn: document.getElementById('reset-btn'),
            
            // Results Modal
            resultsModal: document.getElementById('results-modal'),
            resultsOverlay: document.getElementById('results-overlay'),
            finalWpm: document.getElementById('final-wpm'),
            finalAccuracy: document.getElementById('final-accuracy'),
            finalTime: document.getElementById('final-time'),
            finalErrors: document.getElementById('final-errors'),
            retryBtn: document.getElementById('retry-btn'),
            nextBtn: document.getElementById('next-btn')
        };
        
        // Initialize timer display
        this.timer.display = this.elements.timer;
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Mode selection
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMode(e.target.dataset.mode);
            });
        });
        
        // Topic selection
        this.elements.topicButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTopic(e.target.dataset.topic);
            });
        });
        
        // Reset button
        this.elements.resetBtn?.addEventListener('click', () => {
            this.resetSession();
        });
        
        // Results modal buttons
        this.elements.retryBtn?.addEventListener('click', () => {
            this.retryProblem();
        });
        
        this.elements.nextBtn?.addEventListener('click', () => {
            this.loadNewProblem();
        });
        
        
        // Click overlay to close modal
        this.elements.resultsOverlay?.addEventListener('click', () => {
            this.hideResultsModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        
        // Click to focus input
        this.elements.codeDisplay?.addEventListener('click', () => {
            if (this.gameState.canType) {
                this.elements.codeInput.focus();
            }
        });
    }
    
    // Setup typing engine
    setupTypingEngine() {
        this.typingEngine.initialize({
            codeDisplay: this.elements.codeDisplay,
            codeInput: this.elements.codeInput,
            metrics: {
                wpm: this.elements.wpmDisplay,
                accuracy: this.elements.accuracyDisplay
            }
        });
        
        // Set up callbacks
        this.typingEngine.setCallbacks({
            onProgressUpdate: this.handleProgressUpdate.bind(this),
            onCompletion: this.handleSessionCompletion.bind(this),
            onError: this.handleTypingError.bind(this),
            onWpmUpdate: this.handleWpmUpdate.bind(this)
        });
    }
    
    // Select mode (problems or micro drills)
    selectMode(mode) {
        if (this.gameState.isActive) return; // Don't change mode while typing
        
        // Check if mode is changing
        const modeChanged = this.currentMode !== mode;
        
        this.currentMode = mode;
        
        // Only update button styling if mode actually changed
        if (modeChanged) {
            this.updateActiveButton(this.elements.modeButtons, `[data-mode="${mode}"]`);
            // Show/hide topic selection for micro drills
            this.elements.settingsBar.setAttribute('data-mode', mode);
        }
        
        // Always load new problem and save settings (allows clicking same button for new problem)
        this.loadNewProblem();
        this.saveUserSettings();
    }
    
    // Select topic
    selectTopic(topic) {
        if (this.gameState.isActive || this.currentMode === 'micro') return;
        
        // Check if topic is changing
        const topicChanged = this.currentTopic !== topic;
        
        this.currentTopic = topic;
        
        // Only update button styling if topic actually changed
        if (topicChanged) {
            this.updateActiveButton(this.elements.topicButtons, `[data-topic="${topic}"]`);
        }
        
        // Always load new problem and save settings (allows clicking same button for new problem)
        this.loadNewProblem();
        this.saveUserSettings();
    }
    
    // Update active button styling
    updateActiveButton(buttons, selector) {
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(selector)?.classList.add('active');
    }
    
    // Set UI state (like Monkeytype: idle, typing, active, complete)
    setUIState(state) {
        const settingsBar = this.elements.settingsBar;
        const resetBtn = this.elements.resetBtn;
        
        switch(state) {
            case 'idle':
                // Ready to start typing
                settingsBar.style.pointerEvents = 'auto';
                settingsBar.style.opacity = '1';
                resetBtn.style.pointerEvents = 'auto';
                resetBtn.style.opacity = '1';
                break;
                
            case 'typing':
                // Just started, settings still available
                settingsBar.style.pointerEvents = 'auto';
                settingsBar.style.opacity = '1';
                resetBtn.style.pointerEvents = 'auto';
                resetBtn.style.opacity = '1';
                break;
                
            case 'active':
                // Actively typing, disable settings but keep reset button working
                settingsBar.style.pointerEvents = 'none';
                settingsBar.style.opacity = '0.5';
                resetBtn.style.pointerEvents = 'auto';
                resetBtn.style.opacity = '1';
                resetBtn.style.display = 'block';
                resetBtn.disabled = false;
                break;
                
            case 'complete':
                // Finished typing, re-enable settings
                settingsBar.style.pointerEvents = 'auto';
                settingsBar.style.opacity = '1';
                resetBtn.style.pointerEvents = 'auto';
                resetBtn.style.opacity = '1';
                break;
        }
    }
    
    // Load new problem based on current settings
    loadNewProblem() {
        // Hide results modal
        this.hideResultsModal();
        
        // Show problem description again
        this.elements.problemInfo.classList.remove('hidden-while-typing');
        
        if (this.currentMode === 'micro') {
            this.currentProblem = this.problemsDB.getRandomMicroDrill(this.currentLanguage);
            if (this.currentProblem) {
                this.elements.problemTitle.textContent = this.currentProblem.title;
                this.setupTypingSession(this.currentProblem.pattern);
            }
        } else {
            this.currentProblem = this.problemsDB.getRandomProblemByTopic(this.currentTopic, this.currentLanguage);
            if (this.currentProblem) {
                this.elements.problemTitle.textContent = `${this.currentProblem.title} - ${this.currentTopic}`;
                this.setupTypingSession(this.currentProblem.solution);
            }
        }
        
        // Reset game state
        this.gameState.isActive = false;
        this.gameState.isComplete = false;
        this.gameState.canType = true;
        
        // Set UI to idle state
        this.setUIState('idle');
        
        // Focus input for immediate typing
        setTimeout(() => {
            this.elements.codeInput.focus();
        }, 100);
    }
    
    // Setup typing session with text
    setupTypingSession(text) {
        this.typingEngine.startSession(text);
        
        // Reset metrics display (keep hidden during typing like Monkeytype)
        this.elements.wpmDisplay.textContent = '0';
        this.elements.accuracyDisplay.textContent = '100%';
        this.elements.metricsDisplay.classList.add('hidden');
        
        // Reset timer
        this.resetTimer();
        
        // Enable typing and disable settings during session
        this.elements.codeInput.disabled = false;
        this.setUIState('typing');
    }
    
    // Handle progress updates from typing engine
    handleProgressUpdate(progress) {
        if (!this.gameState.isActive) {
            this.gameState.isActive = true;
            
            // Start timer
            this.startTimer();
            
            // Hide problem description when typing starts
            this.elements.problemInfo.classList.add('hidden-while-typing');
            
            // Disable settings during typing (Monkeytype behavior)
            this.setUIState('active');
            
            // Start performance tracking
            this.performanceTracker.startSession(
                this.currentProblem.id || 'unknown',
                this.currentLanguage,
                this.currentMode
            );
        }
        
        // Update performance tracker
        const stats = this.typingEngine.getRealtimeStats();
        this.performanceTracker.updateMetrics(stats.wpm, stats.accuracy, stats.errors);
    }
    
    // Handle session completion
    handleSessionCompletion(results) {
        console.log('Session completed with results:', results); // Debug log
        
        this.gameState.isActive = false;
        this.gameState.isComplete = true;
        this.gameState.canType = false;
        
        // Disable further typing
        this.elements.codeInput.disabled = true;
        this.elements.codeInput.blur();
        
        // Stop timer
        this.stopTimer();
        
        // Set UI to complete state
        this.setUIState('complete');
        
        // Complete performance tracking
        const analysis = this.performanceTracker.completeSession(results);
        
        // Show results modal (Monkeytype-style popup)
        this.showResultsModal(results);
        
        // Check for achievements
        const newAchievements = this.performanceTracker.checkAchievements();
        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }
    }
    
    // Handle typing errors
    handleTypingError(errorCount, errorPositions) {
        // Add error flash effect
        this.elements.codeInput.classList.add('error-flash');
        setTimeout(() => {
            this.elements.codeInput.classList.remove('error-flash');
        }, 200);
    }
    
    // Handle WPM updates
    handleWpmUpdate(wpm) {
        // Real-time WPM updates are handled by the typing engine
    }
    
    // Timer functions
    startTimer() {
        this.timer.startTime = Date.now();
        this.timer.interval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.timer.startTime = null;
        if (this.timer.display) {
            this.timer.display.textContent = '0:00';
        }
    }
    
    updateTimer() {
        if (!this.timer.startTime || !this.timer.display) return;
        
        const elapsed = Math.floor((Date.now() - this.timer.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.timer.display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Show results modal
    showResultsModal(results) {
        console.log('Showing results modal with:', results); // Debug log
        
        // Update result values
        if (this.elements.finalWpm) {
            this.elements.finalWpm.textContent = results.wpm || 0;
        }
        if (this.elements.finalAccuracy) {
            this.elements.finalAccuracy.textContent = `${results.accuracy || 100}%`;
        }
        if (this.elements.finalTime) {
            this.elements.finalTime.textContent = results.timeElapsedFormatted || '0:00';
        }
        if (this.elements.finalErrors) {
            this.elements.finalErrors.textContent = results.errors || 0;
        }
        
        // Show modal
        if (this.elements.resultsModal) {
            this.elements.resultsModal.classList.remove('hidden');
            console.log('Modal should now be visible'); // Debug log
        } else {
            console.error('Results modal element not found!'); // Debug log
        }
        
        // Focus on retry button for keyboard navigation
        setTimeout(() => {
            this.elements.retryBtn?.focus();
        }, 300);
    }
    
    // Hide results modal
    hideResultsModal() {
        this.elements.resultsModal.classList.add('hidden');
    }
    
    // Retry current problem
    retryProblem() {
        this.hideResultsModal();
        
        // Reset typing session with the same problem
        if (this.currentProblem) {
            const text = this.currentMode === 'micro' ?
                this.currentProblem.pattern :
                this.currentProblem.solution;
            
            this.setupTypingSession(text);
            
            // Show problem description again
            this.elements.problemInfo.classList.remove('hidden-while-typing');
            
            // Reset game state
            this.gameState.isActive = false;
            this.gameState.isComplete = false;
            this.gameState.canType = true;
            
            // Set UI to idle state and focus input
            this.setUIState('idle');
            setTimeout(() => {
                this.elements.codeInput.focus();
            }, 100);
        }
    }
    
    // Reset current session
    resetSession() {
        // Stop timer
        this.stopTimer();
        
        // Show problem description again
        this.elements.problemInfo.classList.remove('hidden-while-typing');
        
        // Always load a new problem when reset button is clicked
        this.loadNewProblem();
    }
    
    // Handle global keyboard shortcuts
    handleGlobalKeydown(event) {
        // If modal is open, handle modal-specific shortcuts
        if (!this.elements.resultsModal.classList.contains('hidden')) {
            // Tab + Enter to restart same problem
            if (event.key === 'Tab') {
                event.preventDefault();
                // Set up listener for Enter key within 2 seconds
                const handleTabEnter = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.retryProblem(); // Restart same problem
                        document.removeEventListener('keydown', handleTabEnter);
                    }
                };
                document.addEventListener('keydown', handleTabEnter);
                
                // Remove listener after 2 seconds if Enter not pressed
                setTimeout(() => {
                    document.removeEventListener('keydown', handleTabEnter);
                }, 2000);
                return;
            }
            
            // Enter alone to get new problem
            if (event.key === 'Enter') {
                event.preventDefault();
                this.loadNewProblem();
                return;
            }
            
            // Escape to close modal
            if (event.key === 'Escape') {
                event.preventDefault();
                this.hideResultsModal();
                return;
            }
            
            // 'r' key to retry same problem
            if (event.key === 'r' || event.key === 'R') {
                event.preventDefault();
                this.retryProblem();
                return;
            }
            
            return; // Don't process other shortcuts when modal is open
        }
        
        // Tab + Enter to get new problem (Monkeytype style)
        if (event.key === 'Tab') {
            event.preventDefault();
            
            // Set up listener for Enter key within 2 seconds
            const handleTabEnter = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Tab + Enter pressed, loading new problem...'); // Debug
                    this.loadNewProblem(); // Get new problem
                    document.removeEventListener('keydown', handleTabEnter);
                }
            };
            document.addEventListener('keydown', handleTabEnter);
            
            // Remove listener after 2 seconds if Enter not pressed
            setTimeout(() => {
                document.removeEventListener('keydown', handleTabEnter);
            }, 2000);
            return;
        }
        
        // Enter alone to get new problem when session is complete
        if (event.key === 'Enter' && this.gameState.isComplete) {
            event.preventDefault();
            console.log('Enter pressed while complete, loading new problem...'); // Debug
            this.loadNewProblem();
            return;
        }
        
        // Escape to reset current session
        if (event.key === 'Escape') {
            event.preventDefault();
            this.resetSession();
        }
        
        // Prevent typing when session is complete
        if (this.gameState.isComplete && !this.gameState.canType) {
            // Only allow Tab and Enter
            if (!['Tab', 'Enter', 'Escape'].includes(event.key)) {
                event.preventDefault();
            }
        }
    }
    
    // Show achievement notifications
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification({
                    type: 'achievement',
                    title: '🏆 Achievement Unlocked!',
                    message: `${achievement.icon} ${achievement.title}`,
                    duration: 4000
                });
            }, index * 1000); // Stagger notifications
        });
    }
    
    // Show notification
    showNotification({ type, title, message, duration = 3000 }) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    // Save user settings
    saveUserSettings() {
        const settings = {
            mode: this.currentMode,
            topic: this.currentTopic,
            lastUsed: Date.now()
        };
        
        try {
            localStorage.setItem('codetype_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    // Load user settings
    loadUserSettings() {
        try {
            const saved = localStorage.getItem('codetype_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // Apply saved settings
                if (settings.mode) {
                    this.currentMode = settings.mode;
                    this.updateActiveButton(this.elements.modeButtons, `[data-mode="${settings.mode}"]`);
                }
                
                if (settings.topic) {
                    this.currentTopic = settings.topic;
                    this.updateActiveButton(this.elements.topicButtons, `[data-topic="${settings.topic}"]`);
                }
                
                // Update UI based on mode
                this.elements.settingsBar.setAttribute('data-mode', this.currentMode);
            } else {
                // No saved settings - ensure defaults are properly set
                this.updateActiveButton(this.elements.modeButtons, `[data-mode="${this.currentMode}"]`);
                this.updateActiveButton(this.elements.topicButtons, `[data-topic="${this.currentTopic}"]`);
                this.elements.settingsBar.setAttribute('data-mode', this.currentMode);
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
            // On error, ensure defaults are set
            this.updateActiveButton(this.elements.modeButtons, `[data-mode="${this.currentMode}"]`);
            this.updateActiveButton(this.elements.topicButtons, `[data-topic="${this.currentTopic}"]`);
            this.elements.settingsBar.setAttribute('data-mode', this.currentMode);
        }
    }
    
    // Get current session stats (for debugging)
    getCurrentStats() {
        return {
            mode: this.currentMode,
            topic: this.currentTopic,
            language: this.currentLanguage,
            gameState: this.gameState,
            typingStats: this.typingEngine.getRealtimeStats()
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing settings to ensure proper defaults
    localStorage.removeItem('codetype_settings');
    
    window.codeTypeApp = new CodeTypeApp();
    
    // Add helpful console messages
    console.log('🧩 CodeType loaded!');
    console.log('💡 Press Tab + Enter to get a new problem');
    console.log('💡 Press Escape to reset current session');
    console.log('💡 Click on the code area to start typing');
    console.log('💡 Defaults: problems + array are highlighted');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeTypeApp;
}