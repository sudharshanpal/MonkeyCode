// Stats Page Controller - Monkeytype-style analytics
class StatsController {
    constructor() {
        this.performanceTracker = new PerformanceTracker();
        this.charts = {};
        
        this.init();
    }
    
    init() {
        this.loadStatsData();
        this.setupEventListeners();
        this.renderCharts();
        this.renderRecentTests();
        this.renderAchievements();
    }
    
    setupEventListeners() {
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportData();
        });
    }
    
    loadStatsData() {
        const dashboardData = this.performanceTracker.getDashboardData();
        const profile = dashboardData.profile;
        const stats = dashboardData.statistics;
        
        // Update summary cards
        document.getElementById('total-tests').textContent = profile.totalSessions;
        document.getElementById('best-wpm').textContent = Math.round(profile.bestWpm);
        document.getElementById('avg-wpm').textContent = Math.round(profile.averageWpm);
        document.getElementById('best-accuracy').textContent = `${Math.round(profile.bestAccuracy)}%`;
        document.getElementById('avg-accuracy').textContent = `${Math.round(profile.averageAccuracy)}%`;
        
        // Convert milliseconds to hours
        const hours = Math.round(profile.totalTimeSpent / (1000 * 60 * 60) * 10) / 10;
        document.getElementById('time-typing').textContent = `${hours}h`;
        
        // Update personal bests
        document.getElementById('best-wpm-detailed').textContent = Math.round(profile.bestWpm);
        document.getElementById('best-accuracy-detailed').textContent = `${Math.round(profile.bestAccuracy)}%`;
        document.getElementById('longest-streak').textContent = profile.streakDays;
        document.getElementById('total-problems').textContent = profile.problemsSolved;
        
        // Add details for personal bests
        const bestWpmSession = this.findBestWpmSession();
        const bestAccuracySession = this.findBestAccuracySession();
        
        if (bestWpmSession) {
            document.getElementById('best-wpm-details').textContent = 
                `${bestWpmSession.mode} • ${new Date(bestWpmSession.endTime).toLocaleDateString()}`;
        }
        
        if (bestAccuracySession) {
            document.getElementById('best-accuracy-details').textContent = 
                `${bestAccuracySession.mode} • ${new Date(bestAccuracySession.endTime).toLocaleDateString()}`;
        }
    }
    
    findBestWpmSession() {
        const sessions = this.performanceTracker.sessionData;
        return sessions.reduce((best, session) => {
            return (!best || session.finalWpm > best.finalWpm) ? session : best;
        }, null);
    }
    
    findBestAccuracySession() {
        const sessions = this.performanceTracker.sessionData;
        return sessions.reduce((best, session) => {
            return (!best || session.finalAccuracy > best.finalAccuracy) ? session : best;
        }, null);
    }
    
    renderCharts() {
        this.renderWpmChart();
        this.renderAccuracyChart();
        this.renderSpeedDistributionChart();
        this.renderLanguageChart();
    }
    
    renderWpmChart() {
        const ctx = document.getElementById('wpm-chart').getContext('2d');
        const sessions = this.performanceTracker.sessionData.slice(-20); // Last 20 sessions
        
        const data = {
            labels: sessions.map((_, index) => `Test ${index + 1}`),
            datasets: [{
                label: 'WPM',
                data: sessions.map(session => session.finalWpm),
                borderColor: '#e2b714',
                backgroundColor: 'rgba(226, 183, 20, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e2b714',
                pointBorderColor: '#323437',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#e2b714',
                        hoverBorderColor: '#d1d0c5'
                    }
                }
            }
        };
        
        this.charts.wpm = new Chart(ctx, config);
    }
    
    renderAccuracyChart() {
        const ctx = document.getElementById('accuracy-chart').getContext('2d');
        const sessions = this.performanceTracker.sessionData.slice(-20); // Last 20 sessions
        
        const data = {
            labels: sessions.map((_, index) => `Test ${index + 1}`),
            datasets: [{
                label: 'Accuracy',
                data: sessions.map(session => session.finalAccuracy),
                borderColor: '#646669',
                backgroundColor: 'rgba(100, 102, 105, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#646669',
                pointBorderColor: '#323437',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669'
                        }
                    }
                }
            }
        };
        
        this.charts.accuracy = new Chart(ctx, config);
    }
    
    renderSpeedDistributionChart() {
        const ctx = document.getElementById('speed-distribution-chart').getContext('2d');
        const sessions = this.performanceTracker.sessionData;
        
        // Create WPM ranges
        const ranges = ['0-20', '21-40', '41-60', '61-80', '81+'];
        const distribution = [0, 0, 0, 0, 0];
        
        sessions.forEach(session => {
            const wpm = session.finalWpm;
            if (wpm <= 20) distribution[0]++;
            else if (wpm <= 40) distribution[1]++;
            else if (wpm <= 60) distribution[2]++;
            else if (wpm <= 80) distribution[3]++;
            else distribution[4]++;
        });
        
        const data = {
            labels: ranges,
            datasets: [{
                label: 'Tests',
                data: distribution,
                backgroundColor: [
                    'rgba(226, 183, 20, 0.2)',
                    'rgba(226, 183, 20, 0.4)',
                    'rgba(226, 183, 20, 0.6)',
                    'rgba(226, 183, 20, 0.8)',
                    'rgba(226, 183, 20, 1.0)'
                ],
                borderColor: '#e2b714',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(100, 102, 105, 0.2)'
                        },
                        ticks: {
                            color: '#646669'
                        }
                    }
                }
            }
        };
        
        this.charts.speedDistribution = new Chart(ctx, config);
    }
    
    renderLanguageChart() {
        const ctx = document.getElementById('language-chart').getContext('2d');
        const languageDistribution = this.performanceTracker.calculateLanguageDistribution();
        
        const data = {
            labels: Object.keys(languageDistribution),
            datasets: [{
                data: Object.values(languageDistribution),
                backgroundColor: [
                    '#e2b714',
                    '#646669',
                    '#ca4754',
                    '#2c2e31'
                ],
                borderColor: '#323437',
                borderWidth: 2
            }]
        };
        
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#d1d0c5',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        };
        
        this.charts.language = new Chart(ctx, config);
    }
    
    renderRecentTests() {
        const tbody = document.getElementById('recent-tests-body');
        const sessions = this.performanceTracker.sessionData.slice(-10).reverse(); // Last 10, newest first
        
        if (sessions.length === 0) {
            tbody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No tests completed yet</div>
                    <div class="empty-state-description">Start typing to see your progress here!</div>
                </div>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        
        sessions.forEach(session => {
            const row = document.createElement('div');
            row.className = 'test-row';
            
            const date = new Date(session.endTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            row.innerHTML = `
                <div class="test-cell wpm">${Math.round(session.finalWpm)}</div>
                <div class="test-cell accuracy">${Math.round(session.finalAccuracy)}%</div>
                <div class="test-cell mode">${session.mode}</div>
                <div class="test-cell topic">${this.getTopicFromProblemId(session.problemId)}</div>
                <div class="test-cell date">${date}</div>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    getTopicFromProblemId(problemId) {
        // Extract topic from problem ID or return default
        if (problemId.includes('array')) return 'array';
        if (problemId.includes('string')) return 'string';
        if (problemId.includes('tree')) return 'tree';
        if (problemId.includes('graph')) return 'graph';
        if (problemId.includes('dp')) return 'dp';
        return 'misc';
    }
    
    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        const achievements = this.performanceTracker.achievements;
        
        if (achievements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏆</div>
                    <div class="empty-state-title">No achievements yet</div>
                    <div class="empty-state-description">Keep practicing to unlock achievements!</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            
            container.appendChild(card);
        });
    }
    
    exportData() {
        const data = this.performanceTracker.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `codetype-stats-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    // Utility method to format time
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Refresh data and charts
    refresh() {
        this.loadStatsData();
        
        // Destroy existing charts and recreate
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
        
        this.renderCharts();
        this.renderRecentTests();
        this.renderAchievements();
    }
}

// Initialize stats page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the stats page
    if (document.getElementById('wpm-chart')) {
        window.statsController = new StatsController();
        console.log('📊 Stats page loaded!');
    }
});

// Export for global use
window.StatsController = StatsController;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsController;
}