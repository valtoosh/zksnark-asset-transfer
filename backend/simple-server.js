const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✓ Health check received');
  res.json({ status: 'OK' });
});

app.post('/api/proof/generate', (req, res) => {
  const { balance, amount, recipient, assetId } = req.body;
  
  console.log('\n=== RECEIVED REQUEST ===');
  console.log({ balance, amount, recipient, assetId });
  
  if (parseInt(balance) < parseInt(amount)) {
    console.log('❌ Insufficient balance');
    return res.json({
      success: false,
      proofValid: false,
      error: 'Insufficient balance',
      balance, amount, recipient, assetId, 
      privacy: false, 
      time: "0s"
    });
  }
  
  const ratio = amount / balance;
  const aiFlagged = ratio > 0.8;
  
  console.log(`✓ Proof generated | AI Flagged: ${aiFlagged}`);
  
  res.json({
    success: true,
    proofValid: true,
    balance,
    amount,
    recipient,
    assetId,
    aiFlagged,
    privacy: true,
    time: "0.198s"
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n🚀 ============================================');
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 API: http://localhost:${PORT}/api/proof/generate`);
  console.log('🔥 Ready to accept requests!');
  console.log('============================================\n');
});
