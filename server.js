// Simple Express server for CodeType development
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Main route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for problem data (future enhancement)
app.get('/api/problems/:language', (req, res) => {
    const language = req.params.language;
    // In a real app, this would query a database
    res.json({
        message: `Problems for ${language}`,
        language: language
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🧩 CodeType Server Started!');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`🌐 Open your browser and navigate to the URL above`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 CodeType server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 CodeType server shutting down gracefully...');
    process.exit(0);
});