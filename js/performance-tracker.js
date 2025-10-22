// Performance Tracker for CodeType - Advanced analytics and progress tracking
class PerformanceTracker {
    constructor() {
        this.sessionData = [];
        this.userProfile = {
            totalSessions: 0,
            totalTimeSpent: 0,
            averageWpm: 0,
            averageAccuracy: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            problemsSolved: 0,
            streakDays: 0,
            lastSessionDate: null,
            preferredLanguage: 'python',
            skillLevel: 'beginner',
            badges: [],
            achievements: []
        };
        
        this.currentSession = null;
        this.achievements = this.initializeAchievements();
        this.badges = this.initializeBadges();
        
        // Load saved data
        this.loadData();
    }
    
    // Initialize achievement system
    initializeAchievements() {
        return [
            {
                id: 'first_session',
                title: 'First Steps',
                description: 'Complete your first typing session',
                icon: '🎯',
                unlocked: false,
                condition: (data) => data.totalSessions >= 1
            },
            {
                id: 'speed_demon_30',
                title: 'Speed Demon',
                description: 'Achieve 30+ WPM',
                icon: '⚡',
                unlocked: false,
                condition: (data) => data.bestWpm >= 30
            },
            {
                id: 'speed_demon_50',
                title: 'Lightning Fast',
                description: 'Achieve 50+ WPM',
                icon: '🏃‍♂️',
                unlocked: false,
                condition: (data) => data.bestWpm >= 50
            },
            {
                id: 'accuracy_master',
                title: 'Precision Master',
                description: 'Achieve 95%+ accuracy',
                icon: '🎯',
                unlocked: false,
                condition: (data) => data.bestAccuracy >= 95
            },
            {
                id: 'problem_solver_10',
                title: 'Problem Solver',
                description: 'Complete 10 problems',
                icon: '🧩',
                unlocked: false,
                condition: (data) => data.problemsSolved >= 10
            },
            {
                id: 'dedication_7',
                title: 'Week Warrior',
                description: 'Practice for 7 consecutive days',
                icon: '🔥',
                unlocked: false,
                condition: (data) => data.streakDays >= 7
            },
            {
                id: 'marathon_session',
                title: 'Marathon Coder',
                description: 'Complete a session over 10 minutes',
                icon: '🏃‍♀️',
                unlocked: false,
                condition: (data, sessionData) => sessionData && sessionData.some(s => s.timeElapsed > 600000) // 10 minutes
            }
        ];
    }
    
    // Initialize badge system
    initializeBadges() {
        return [
            {
                id: 'loop_legend',
                title: 'Loop Legend',
                description: 'Master loop constructs',
                icon: '🔄',
                progress: 0,
                maxProgress: 20,
                unlocked: false
            },
            {
                id: 'recursion_racer',
                title: 'Recursion Racer',
                description: 'Excel at recursive solutions',
                icon: '🌪️',
                progress: 0,
                maxProgress: 15,
                unlocked: false
            },
            {
                id: 'array_ace',
                title: 'Array Ace',
                description: 'Dominate array problems',
                icon: '📊',
                progress: 0,
                maxProgress: 25,
                unlocked: false
            }
        ];
    }
    
    // Start a new session
    startSession(problemId, language, mode) {
        this.currentSession = {
            id: Date.now().toString(),
            problemId: problemId,
            language: language,
            mode: mode,
            startTime: Date.now(),
            endTime: null,
            wpmHistory: [],
            accuracyHistory: [],
            keystrokeEvents: [],
            errors: 0,
            completed: false
        };
    }
    
    // Record keystroke event
    recordKeystroke(event) {
        if (!this.currentSession) return;
        
        this.currentSession.keystrokeEvents.push({
            timestamp: Date.now(),
            key: event.key,
            correct: event.correct,
            position: event.position,
            wpm: event.wpm,
            accuracy: event.accuracy
        });
    }
    
    // Update real-time metrics
    updateMetrics(wpm, accuracy, errors) {
        if (!this.currentSession) return;
        
        const timestamp = Date.now();
        
        this.currentSession.wpmHistory.push({
            timestamp: timestamp,
            value: wpm
        });
        
        this.currentSession.accuracyHistory.push({
            timestamp: timestamp,
            value: accuracy
        });
        
        this.currentSession.errors = errors;
    }
    
    // Complete current session
    completeSession(results) {
        if (!this.currentSession) return;
        
        this.currentSession.endTime = Date.now();
        this.currentSession.finalWpm = results.wpm;
        this.currentSession.finalAccuracy = results.accuracy;
        this.currentSession.timeElapsed = results.timeElapsed;
        this.currentSession.completed = results.completed;
        this.currentSession.totalKeystrokes = results.totalKeystrokes;
        this.currentSession.charactersTyped = results.charactersTyped;
        
        // Add to session history
        this.sessionData.push(this.currentSession);
        
        // Update user profile
        this.updateUserProfile(this.currentSession);
        
        // Check for achievements
        this.checkAchievements();
        
        // Save data
        this.saveData();
        
        const sessionAnalysis = this.analyzeSession(this.currentSession);
        this.currentSession = null;
        
        return sessionAnalysis;
    }
    
    // Update user profile based on session
    updateUserProfile(session) {
        this.userProfile.totalSessions++;
        this.userProfile.totalTimeSpent += session.timeElapsed;
        
        // Update averages
        const allWpms = this.sessionData.map(s => s.finalWpm).filter(w => w > 0);
        const allAccuracies = this.sessionData.map(s => s.finalAccuracy).filter(a => a > 0);
        
        this.userProfile.averageWpm = allWpms.reduce((a, b) => a + b, 0) / allWpms.length || 0;
        this.userProfile.averageAccuracy = allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length || 0;
        
        // Update bests
        if (session.finalWpm > this.userProfile.bestWpm) {
            this.userProfile.bestWpm = session.finalWpm;
        }
        
        if (session.finalAccuracy > this.userProfile.bestAccuracy) {
            this.userProfile.bestAccuracy = session.finalAccuracy;
        }
        
        // Update problems solved
        if (session.completed) {
            this.userProfile.problemsSolved++;
        }
        
        // Update streak
        this.updateStreak();
        
        // Update skill level
        this.updateSkillLevel();
    }
    
    // Update consecutive day streak
    updateStreak() {
        const today = new Date().toDateString();
        const lastSession = this.userProfile.lastSessionDate;
        
        if (lastSession) {
            const lastDate = new Date(lastSession);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Consecutive day
                this.userProfile.streakDays++;
            } else if (diffDays > 1) {
                // Streak broken
                this.userProfile.streakDays = 1;
            }
            // Same day doesn't change streak
        } else {
            // First session
            this.userProfile.streakDays = 1;
        }
        
        this.userProfile.lastSessionDate = today;
    }
    
    // Update skill level based on performance
    updateSkillLevel() {
        const avgWpm = this.userProfile.averageWpm;
        const avgAccuracy = this.userProfile.averageAccuracy;
        const problemsSolved = this.userProfile.problemsSolved;
        
        if (avgWpm >= 50 && avgAccuracy >= 90 && problemsSolved >= 50) {
            this.userProfile.skillLevel = 'expert';
        } else if (avgWpm >= 35 && avgAccuracy >= 80 && problemsSolved >= 25) {
            this.userProfile.skillLevel = 'advanced';
        } else if (avgWpm >= 20 && avgAccuracy >= 70 && problemsSolved >= 10) {
            this.userProfile.skillLevel = 'intermediate';
        } else {
            this.userProfile.skillLevel = 'beginner';
        }
    }
    
    // Check and unlock achievements
    checkAchievements() {
        const newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(this.userProfile, this.sessionData)) {
                achievement.unlocked = true;
                achievement.unlockedDate = Date.now();
                newAchievements.push(achievement);
                
                if (!this.userProfile.achievements.includes(achievement.id)) {
                    this.userProfile.achievements.push(achievement.id);
                }
            }
        });
        
        return newAchievements;
    }
    
    // Analyze completed session
    analyzeSession(session) {
        const analysis = {
            performance: this.analyzePerformance(session),
            patterns: this.analyzeTypingPatterns(session),
            recommendations: this.generateRecommendations(session),
            comparison: this.compareToHistory(session)
        };
        
        return analysis;
    }
    
    // Analyze typing performance
    analyzePerformance(session) {
        const wpmData = session.wpmHistory;
        const accuracyData = session.accuracyHistory;
        
        return {
            consistency: this.calculateConsistency(wpmData),
            improvement: this.calculateImprovement(wpmData),
            accuracyTrend: this.calculateAccuracyTrend(accuracyData),
            peakPerformance: Math.max(...wpmData.map(d => d.value)),
            averagePerformance: wpmData.reduce((a, b) => a + b.value, 0) / wpmData.length
        };
    }
    
    // Analyze typing patterns
    analyzeTypingPatterns(session) {
        const keystrokes = session.keystrokeEvents;
        const errorPatterns = keystrokes.filter(k => !k.correct);
        
        return {
            commonErrors: this.findCommonErrors(errorPatterns),
            slowestKeys: this.findSlowestKeys(keystrokes),
            rythmPatterns: this.analyzeRythm(keystrokes)
        };
    }
    
    // Generate personalized recommendations
    generateRecommendations(session) {
        const recommendations = [];
        
        // Speed recommendations
        if (session.finalWpm < 25) {
            recommendations.push({
                type: 'speed',
                title: 'Focus on Speed',
                description: 'Try micro drills to build muscle memory for common patterns',
                action: 'practice_micro_drills'
            });
        }
        
        // Accuracy recommendations
        if (session.finalAccuracy < 85) {
            recommendations.push({
                type: 'accuracy',
                title: 'Improve Accuracy',
                description: 'Slow down and focus on typing correctly before building speed',
                action: 'accuracy_practice'
            });
        }
        
        // Pattern-specific recommendations
        const errorPatterns = this.analyzeTypingPatterns(session).commonErrors;
        if (errorPatterns.length > 0) {
            recommendations.push({
                type: 'pattern',
                title: 'Practice Problem Areas',
                description: `Focus on: ${errorPatterns.slice(0, 3).join(', ')}`,
                action: 'targeted_practice'
            });
        }
        
        return recommendations;
    }
    
    // Compare session to historical performance
    compareToHistory(session) {
        if (this.sessionData.length < 2) {
            return { message: 'Complete more sessions to see comparisons' };
        }
        
        const recentSessions = this.sessionData.slice(-5);
        const avgRecentWpm = recentSessions.reduce((a, s) => a + s.finalWpm, 0) / recentSessions.length;
        const avgRecentAccuracy = recentSessions.reduce((a, s) => a + s.finalAccuracy, 0) / recentSessions.length;
        
        return {
            wpmChange: session.finalWpm - avgRecentWpm,
            accuracyChange: session.finalAccuracy - avgRecentAccuracy,
            trend: this.calculateTrend(),
            personalBest: {
                wpm: session.finalWpm === this.userProfile.bestWpm,
                accuracy: session.finalAccuracy === this.userProfile.bestAccuracy
            }
        };
    }
    
    // Calculate performance consistency
    calculateConsistency(wpmData) {
        if (wpmData.length < 2) return 100;
        
        const values = wpmData.map(d => d.value);
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // Return consistency as percentage (lower std dev = higher consistency)
        return Math.max(0, 100 - (stdDev / mean) * 100);
    }
    
    // Calculate improvement during session
    calculateImprovement(wpmData) {
        if (wpmData.length < 2) return 0;
        
        const firstHalf = wpmData.slice(0, Math.floor(wpmData.length / 2));
        const secondHalf = wpmData.slice(Math.floor(wpmData.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b.value, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b.value, 0) / secondHalf.length;
        
        return ((secondAvg - firstAvg) / firstAvg) * 100;
    }
    
    // Calculate accuracy trend
    calculateAccuracyTrend(accuracyData) {
        if (accuracyData.length < 2) return 'stable';
        
        const trend = accuracyData[accuracyData.length - 1].value - accuracyData[0].value;
        
        if (trend > 5) return 'improving';
        if (trend < -5) return 'declining';
        return 'stable';
    }
    
    // Find common error patterns
    findCommonErrors(errorEvents) {
        const errorMap = {};
        
        errorEvents.forEach(event => {
            const key = event.key;
            errorMap[key] = (errorMap[key] || 0) + 1;
        });
        
        return Object.entries(errorMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([key]) => key);
    }
    
    // Find slowest typing keys
    findSlowestKeys(keystrokes) {
        const keyTimes = {};
        
        for (let i = 1; i < keystrokes.length; i++) {
            const current = keystrokes[i];
            const previous = keystrokes[i - 1];
            const timeDiff = current.timestamp - previous.timestamp;
            
            if (!keyTimes[current.key]) {
                keyTimes[current.key] = [];
            }
            keyTimes[current.key].push(timeDiff);
        }
        
        const avgTimes = Object.entries(keyTimes).map(([key, times]) => ({
            key,
            avgTime: times.reduce((a, b) => a + b) / times.length
        }));
        
        return avgTimes.sort((a, b) => b.avgTime - a.avgTime).slice(0, 5);
    }
    
    // Analyze typing rhythm
    analyzeRythm(keystrokes) {
        const intervals = [];
        
        for (let i = 1; i < keystrokes.length; i++) {
            intervals.push(keystrokes[i].timestamp - keystrokes[i - 1].timestamp);
        }
        
        if (intervals.length === 0) {
            return {
                steady: true,
                avgInterval: 0,
                variance: 0
            };
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
        
        return {
            steady: variance < avgInterval * 0.5,
            avgInterval: avgInterval,
            variance: variance
        };
    }
    
    // Calculate overall performance trend
    calculateTrend() {
        if (this.sessionData.length < 3) return 'insufficient_data';
        
        const recentSessions = this.sessionData.slice(-10);
        const wpmTrend = this.calculateLinearTrend(recentSessions.map(s => s.finalWpm));
        
        if (wpmTrend > 1) return 'improving';
        if (wpmTrend < -1) return 'declining';
        return 'stable';
    }
    
    // Calculate linear trend
    calculateLinearTrend(values) {
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((a, b) => a + b);
        const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
        const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
    
    // Get dashboard data
    getDashboardData() {
        return {
            profile: this.userProfile,
            recentSessions: this.sessionData.slice(-10),
            achievements: this.achievements.filter(a => a.unlocked),
            badges: this.badges,
            statistics: this.calculateStatistics()
        };
    }
    
    // Calculate comprehensive statistics
    calculateStatistics() {
        if (this.sessionData.length === 0) {
            return { message: 'No sessions completed yet' };
        }
        
        const sessions = this.sessionData;
        const completedSessions = sessions.filter(s => s.completed);
        
        return {
            totalSessions: sessions.length,
            completedSessions: completedSessions.length,
            completionRate: (completedSessions.length / sessions.length) * 100,
            totalTimeSpent: sessions.reduce((a, s) => a + s.timeElapsed, 0),
            averageSessionTime: sessions.reduce((a, s) => a + s.timeElapsed, 0) / sessions.length,
            bestStreak: this.userProfile.streakDays,
            improvementRate: this.calculateImprovementRate(),
            languageDistribution: this.calculateLanguageDistribution()
        };
    }
    
    // Calculate improvement rate over time
    calculateImprovementRate() {
        if (this.sessionData.length < 5) return 0;
        
        const firstFive = this.sessionData.slice(0, 5);
        const lastFive = this.sessionData.slice(-5);
        
        const firstAvg = firstFive.reduce((a, s) => a + s.finalWpm, 0) / firstFive.length;
        const lastAvg = lastFive.reduce((a, s) => a + s.finalWpm, 0) / lastFive.length;
        
        return ((lastAvg - firstAvg) / firstAvg) * 100;
    }
    
    // Calculate language usage distribution
    calculateLanguageDistribution() {
        const distribution = {};
        
        this.sessionData.forEach(session => {
            distribution[session.language] = (distribution[session.language] || 0) + 1;
        });
        
        return distribution;
    }
    
    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('codetype_profile', JSON.stringify(this.userProfile));
            localStorage.setItem('codetype_sessions', JSON.stringify(this.sessionData.slice(-100))); // Keep last 100 sessions
            localStorage.setItem('codetype_achievements', JSON.stringify(this.achievements));
        } catch (error) {
            console.warn('Failed to save performance data:', error);
        }
    }
    
    // Load data from localStorage
    loadData() {
        try {
            const savedProfile = localStorage.getItem('codetype_profile');
            if (savedProfile) {
                this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
            }
            
            const savedSessions = localStorage.getItem('codetype_sessions');
            if (savedSessions) {
                this.sessionData = JSON.parse(savedSessions);
            }
            
            const savedAchievements = localStorage.getItem('codetype_achievements');
            if (savedAchievements) {
                const saved = JSON.parse(savedAchievements);
                this.achievements.forEach(achievement => {
                    const savedAchievement = saved.find(s => s.id === achievement.id);
                    if (savedAchievement) {
                        achievement.unlocked = savedAchievement.unlocked;
                        achievement.unlockedDate = savedAchievement.unlockedDate;
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load performance data:', error);
        }
    }
    
    // Export data for backup
    exportData() {
        return {
            profile: this.userProfile,
            sessions: this.sessionData,
            achievements: this.achievements,
            exportDate: Date.now()
        };
    }
    
    // Import data from backup
    importData(data) {
        try {
            if (data.profile) this.userProfile = data.profile;
            if (data.sessions) this.sessionData = data.sessions;
            if (data.achievements) this.achievements = data.achievements;
            this.saveData();
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// Export for global use
window.PerformanceTracker = PerformanceTracker;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTracker;
}