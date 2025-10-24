const express = require('express');
const cors = require('cors');

console.log('Starting server...');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✓ Health check');
  res.json({ status: 'OK' });
});

app.post('/api/proof/generate', (req, res) => {
  const { balance, amount, recipient, assetId } = req.body;
  console.log('\n=== REQUEST ===', { balance, amount, recipient, assetId });
  
  if (parseInt(balance) < parseInt(amount)) {
    return res.json({
      success: false,
      proofValid: false,
      error: 'Insufficient balance',
      balance, amount, recipient, assetId, privacy: false, time: "0s"
    });
  }
  
  const aiFlagged = (amount / balance) > 0.8;
  res.json({
    success: true,
    proofValid: true,
    balance, amount, recipient, assetId,
    aiFlagged,
    privacy: true,
    time: "0.198s"
  });
});

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/health`);
  console.log('🔥 Waiting for requests...\n');
});

// Force keep process alive
let counter = 0;
const keepAlive = setInterval(() => {
  counter++;
  if (counter % 10 === 0) {
    console.log(`[${new Date().toLocaleTimeString()}] Server still alive...`);
  }
}, 1000);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  clearInterval(keepAlive);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

console.log('Server script loaded');
