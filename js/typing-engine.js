// Core Typing Engine for CodeType
class TypingEngine {
    constructor() {
        this.currentText = '';
        this.userInput = '';
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalKeystrokes = 0;
        this.isActive = false;
        
        // Performance tracking
        this.keystrokeHistory = [];
        this.errorPositions = [];
        this.wpmHistory = [];
        
        // Event listeners
        this.onProgressUpdate = null;
        this.onCompletion = null;
        this.onError = null;
        this.onWpmUpdate = null;
        
        // DOM elements will be set when initialized
        this.codeDisplay = null;
        this.codeInput = null;
        this.metricsElements = {};
        
        this.setupEventListeners();
    }
    
    // Initialize the typing engine with DOM elements
    initialize(elements) {
        this.codeDisplay = elements.codeDisplay;
        this.codeInput = elements.codeInput;
        this.metricsElements = elements.metrics;
        
        if (this.codeInput) {
            this.codeInput.addEventListener('input', this.handleInput.bind(this));
            this.codeInput.addEventListener('keydown', this.handleKeyDown.bind(this));
            this.codeInput.addEventListener('focus', this.handleFocus.bind(this));
            this.codeInput.addEventListener('blur', this.handleBlur.bind(this));
            this.codeInput.addEventListener('paste', this.handlePaste.bind(this));
        }
    }
    
    // Set up global event listeners
    setupEventListeners() {
        // Prevent common shortcuts that might interfere
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                // Prevent Ctrl+A, Ctrl+C, Ctrl+V, etc. during typing challenges
                if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // Start a new typing session
    startSession(text) {
        this.currentText = text;
        this.userInput = '';
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalKeystrokes = 0;
        this.isActive = false;
        
        // Clear tracking arrays
        this.keystrokeHistory = [];
        this.errorPositions = [];
        this.wpmHistory = [];
        
        // Update display
        this.updateDisplay();
        this.updateMetrics();
        
        // Focus the input
        if (this.codeInput) {
            this.codeInput.value = '';
            this.codeInput.focus();
        }
    }
    
    // Handle input events
    handleInput(event) {
        const input = event.target.value;
        
        // Prevent input beyond expected length
        if (input.length > this.currentText.length) {
            event.target.value = input.substring(0, this.currentText.length);
            return;
        }
        
        // Start timing on first keystroke
        if (!this.startTime && input.length === 1) {
            this.startTime = Date.now();
            this.isActive = true;
        }
        
        this.userInput = input;
        this.totalKeystrokes++;
        
        // Record keystroke timing
        this.keystrokeHistory.push({
            timestamp: Date.now(),
            character: input[input.length - 1] || '',
            position: input.length - 1
        });
        
        // Check for errors
        this.checkForErrors();
        
        // Update display and metrics
        this.updateDisplay();
        this.updateMetrics();
        
        // Ensure textarea content matches user input exactly
        // The cursor will naturally appear at the end, which is left of the yellow highlight
        if (event.target.value !== this.userInput) {
            event.target.value = this.userInput;
        }
        
        // Position cursor at the end of typed text (left of yellow highlight)
        requestAnimationFrame(() => {
            if (event.target === document.activeElement) {
                const cursorPosition = this.userInput.length;
                event.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
        
        // Check completion
        if (this.userInput.length === this.currentText.length) {
            this.completeSession();
        }
        
        // Trigger progress callback
        if (this.onProgressUpdate) {
            this.onProgressUpdate(this.getProgress());
        }
    }
    
    // Handle paste events
    handlePaste(event) {
        event.preventDefault(); // Prevent pasting to maintain typing practice integrity
    }
    
    // Handle special keydown events
    handleKeyDown(event) {
        // Prevent arrow keys, home, end from moving cursor
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            // Keep cursor positioned at current character (left side of yellow highlight)
            requestAnimationFrame(() => {
                const cursorPosition = this.userInput.length;
                event.target.setSelectionRange(cursorPosition, cursorPosition);
            });
            return;
        }
        
        // Prevent Ctrl+A, Ctrl+C, etc. from interfering
        if (event.ctrlKey && ['a', 'c', 'v', 'x', 'z', 'y'].includes(event.key.toLowerCase())) {
            event.preventDefault();
            return;
        }
        
        // Handle backspace to prevent going beyond current position
        if (event.key === 'Backspace') {
            const input = event.target;
            const currentLength = input.value.length;
            
            // Don't allow backspace if we're at the beginning
            if (currentLength === 0) {
                event.preventDefault();
                return;
            }
        }
        
        // Handle special keys like Tab, Enter, etc.
        if (event.key === 'Tab') {
            event.preventDefault();
            
            // Insert tab character or spaces
            const tabChar = '    '; // 4 spaces for tab
            const currentPos = event.target.selectionStart;
            const value = event.target.value;
            
            event.target.value = value.substring(0, currentPos) + tabChar + value.substring(currentPos);
            event.target.selectionStart = event.target.selectionEnd = currentPos + tabChar.length;
            
            // Trigger input event manually
            this.handleInput(event);
        }
    }
    
    // Handle focus events
    handleFocus() {
        if (this.currentText && !this.isActive && this.userInput.length === 0) {
            // Ready to start
        }
        // Ensure cursor is positioned at current character when focusing
        requestAnimationFrame(() => {
            if (this.codeInput === document.activeElement) {
                const cursorPosition = this.userInput.length;
                this.codeInput.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    }
    
    // Handle blur events
    handleBlur() {
        // Optionally pause the session or show warning
    }
    
    // Check for typing errors
    checkForErrors() {
        let errorCount = 0;
        const errorPositions = [];
        
        for (let i = 0; i < this.userInput.length; i++) {
            if (i >= this.currentText.length || this.userInput[i] !== this.currentText[i]) {
                errorCount++;
                errorPositions.push(i);
            }
        }
        
        // Only count new errors
        if (errorCount > this.errors) {
            const newErrors = errorCount - this.errors;
            if (this.onError) {
                this.onError(newErrors, errorPositions);
            }
        }
        
        this.errors = errorCount;
        this.errorPositions = errorPositions;
    }
    
    // Update the visual display
    updateDisplay() {
        if (!this.codeDisplay) return;
        
        let displayHtml = '';
        const textLength = this.currentText.length;
        const inputLength = this.userInput.length;
        
        for (let i = 0; i < textLength; i++) {
            const char = this.currentText[i];
            let className = '';
            
            if (i < inputLength) {
                // Character has been typed
                if (this.userInput[i] === char) {
                    className = 'correct';
                } else {
                    className = 'incorrect';
                }
            } else if (i === inputLength) {
                // Current position
                className = 'current';
            }
            
            // Handle special characters
            let displayChar = char;
            if (char === '\n') {
                displayChar = '\\n<br>';
            } else if (char === '\t') {
                displayChar = '    '; // Show tabs as spaces
            } else if (char === ' ') {
                displayChar = '&nbsp;';
            }
            
            if (className) {
                displayHtml += `<span class="${className}">${displayChar}</span>`;
            } else {
                displayHtml += displayChar;
            }
        }
        
        this.codeDisplay.innerHTML = displayHtml;
    }
    
    // Update performance metrics
    updateMetrics() {
        if (!this.metricsElements) return;
        
        const progress = this.getProgress();
        const wpm = this.calculateWPM();
        const accuracy = this.calculateAccuracy();
        
        // Update WPM
        if (this.metricsElements.wpm) {
            this.metricsElements.wpm.textContent = Math.round(wpm);
        }
        
        // Update accuracy
        if (this.metricsElements.accuracy) {
            this.metricsElements.accuracy.textContent = `${Math.round(accuracy)}%`;
        }
        
        // Update progress
        if (this.metricsElements.progress) {
            this.metricsElements.progress.textContent = `${Math.round(progress)}%`;
        }
        
        // Update errors
        if (this.metricsElements.errors) {
            this.metricsElements.errors.textContent = this.errors;
        }
        
        // Update progress bar
        if (this.metricsElements.progressBar) {
            this.metricsElements.progressBar.style.width = `${progress}%`;
        }
        
        // Track WPM history for graphs
        if (wpm > 0) {
            this.wpmHistory.push({
                timestamp: Date.now(),
                wpm: wpm
            });
            
            if (this.onWpmUpdate) {
                this.onWpmUpdate(wpm);
            }
        }
    }
    
    // Calculate current WPM
    calculateWPM() {
        if (!this.startTime || this.userInput.length === 0) return 0;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
        const charactersTyped = this.userInput.length;
        const wordsTyped = charactersTyped / 5; // Standard: 5 characters per word
        
        return timeElapsed > 0 ? wordsTyped / timeElapsed : 0;
    }
    
    // Calculate typing accuracy
    calculateAccuracy() {
        if (this.userInput.length === 0) return 100;
        
        let correctCharacters = 0;
        for (let i = 0; i < this.userInput.length; i++) {
            if (i < this.currentText.length && this.userInput[i] === this.currentText[i]) {
                correctCharacters++;
            }
        }
        
        return (correctCharacters / this.userInput.length) * 100;
    }
    
    // Get current progress percentage
    getProgress() {
        if (this.currentText.length === 0) return 0;
        return (this.userInput.length / this.currentText.length) * 100;
    }
    
    // Complete the typing session
    completeSession() {
        console.log('TypingEngine: Completing session...'); // Debug log
        
        this.endTime = Date.now();
        this.isActive = false;
        
        const results = this.getSessionResults();
        console.log('TypingEngine: Session results:', results); // Debug log
        
        if (this.onCompletion) {
            console.log('TypingEngine: Calling completion callback'); // Debug log
            this.onCompletion(results);
        } else {
            console.warn('TypingEngine: No completion callback set!'); // Debug log
        }
    }
    
    // Get comprehensive session results
    getSessionResults() {
        const timeElapsed = this.endTime - this.startTime; // milliseconds
        const finalWpm = this.calculateWPM();
        const finalAccuracy = this.calculateAccuracy();
        
        return {
            timeElapsed: timeElapsed,
            timeElapsedFormatted: this.formatTime(timeElapsed),
            wpm: Math.round(finalWpm),
            accuracy: Math.round(finalAccuracy),
            errors: this.errors,
            totalKeystrokes: this.totalKeystrokes,
            charactersTyped: this.userInput.length,
            targetLength: this.currentText.length,
            keystrokeHistory: this.keystrokeHistory,
            wpmHistory: this.wpmHistory,
            errorPositions: this.errorPositions,
            completed: this.userInput.length === this.currentText.length
        };
    }
    
    // Format time in MM:SS
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Reset the typing engine
    reset() {
        this.currentText = '';
        this.userInput = '';
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalKeystrokes = 0;
        this.isActive = false;
        
        this.keystrokeHistory = [];
        this.errorPositions = [];
        this.wpmHistory = [];
        
        if (this.codeInput) {
            this.codeInput.value = '';
            
            // Position cursor at the beginning (left of first yellow character)
            requestAnimationFrame(() => {
                this.codeInput.focus();
                this.codeInput.setSelectionRange(0, 0);
            });
        }
        
        this.updateDisplay();
        this.updateMetrics();
    }
    
    // Get real-time statistics
    getRealtimeStats() {
        return {
            wpm: Math.round(this.calculateWPM()),
            accuracy: Math.round(this.calculateAccuracy()),
            progress: Math.round(this.getProgress()),
            errors: this.errors,
            timeElapsed: this.startTime ? Date.now() - this.startTime : 0,
            isActive: this.isActive
        };
    }
    
    // Set event callbacks
    setCallbacks({ onProgressUpdate, onCompletion, onError, onWpmUpdate }) {
        if (onProgressUpdate) this.onProgressUpdate = onProgressUpdate;
        if (onCompletion) this.onCompletion = onCompletion;
        if (onError) this.onError = onError;
        if (onWpmUpdate) this.onWpmUpdate = onWpmUpdate;
    }
}

// Export for global use
window.TypingEngine = TypingEngine;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypingEngine;
}