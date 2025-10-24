const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - must be before routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✓ Health check');
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Import proof routes
const proofRoutes = require('./src/routes/proof.routes');
app.use('/api/proof', proofRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const server = app.listen(PORT, () => {
  console.log('\n🚀 ============================================');
  console.log(`✅ ZKP Backend Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Proof API: http://localhost:${PORT}/api/proof/generate`);
  console.log('🔥 Real ZK-SNARK proof generation enabled');
  console.log('✅ CORS enabled for localhost:3000 and localhost:3001');
  console.log('============================================\n');
});

// Force keep alive
let counter = 0;
const keepAlive = setInterval(() => {
  counter++;
  if (counter % 30 === 0) {
    console.log(`[${new Date().toLocaleTimeString()}] Server alive - waiting for requests...`);
  }
}, 1000);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  clearInterval(keepAlive);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  clearInterval(keepAlive);
  server.close(() => process.exit(0));
});

console.log('Server script loaded, starting Express...');
