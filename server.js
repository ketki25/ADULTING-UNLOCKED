const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campus', require('./routes/campus'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/career', require('./routes/career'));
app.use('/api/gradmind', require('./routes/gradmind'));
app.use('/api/buddy', require('./routes/buddy'));
app.use('/api/search', require('./routes/search'));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Adulting Unlocked API is running! 🚀', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ─── Serve Frontend Pages ─────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🎓 Adulting Unlocked is live at http://localhost:${PORT}`);
    console.log(`📡 API health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();