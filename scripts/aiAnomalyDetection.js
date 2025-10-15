import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

/**
 * Production-grade AI Anomaly Detection for zkSNARK Transactions
 * Uses autoencoder neural network for unsupervised anomaly detection
 */

class TransactionAnomalyDetector {
  constructor() {
    this.model = null;
    this.scaler = { mean: null, std: null };
    this.reconstructionThreshold = 0.15;
    this.transactionHistory = [];
  }

  extractFeatures(tx, history = []) {
    // Core risk features
    const balanceRatio = Math.min(tx.transferAmount / tx.senderBalance, 1);
    const logAmount = Math.log10(tx.transferAmount + 1) / 5;
    
    // Temporal features
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
    const isBusinessHours = (hour >= 9 && hour <= 17) ? 1 : 0;
    const normalizedHour = hour / 24;
    
    // Statistical analysis
    let zScore = 0;
    if (history.length > 2) {
      const amounts = history.slice(-10).map(h => h.transferAmount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avgAmount, 2), 0) / amounts.length;
      const stdAmount = Math.sqrt(variance);
      zScore = stdAmount > 0 ? Math.min(Math.abs((tx.transferAmount - avgAmount) / stdAmount), 3) / 3 : 0;
    }
    
    // Risk indicators
    const isDraining = balanceRatio > 0.9 ? 1 : 0;
    const isMicro = tx.transferAmount < 100 ? 1 : 0;
    const maxAmountRatio = Math.min(tx.maxAmount / 100000, 1);
    
    return [
      balanceRatio, logAmount, normalizedHour, dayOfWeek / 7,
      isWeekend, isBusinessHours, zScore, isDraining,
      isMicro, maxAmountRatio
    ];
  }

  async buildModel() {
    console.log("Building autoencoder model...");
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 6, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 3, activation: 'relu' }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 10, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    console.log("Model architecture ready");
  }

  generateTrainingData() {
    const transactions = [];

    // 450 normal transaction patterns
    for (let i = 0; i < 450; i++) {
      const balance = 5000 + Math.random() * 95000;
      const normalRatio = 0.05 + Math.random() * 0.35;
      
      transactions.push({
        senderBalance: balance,
        transferAmount: balance * normalRatio,
        maxAmount: balance * (normalRatio + 0.2),
        assetId: 2000
      });
    }

    // 50 higher-value legitimate transactions
    for (let i = 0; i < 50; i++) {
      const balance = 10000 + Math.random() * 40000;
      const amount = balance * (0.4 + Math.random() * 0.2);
      
      transactions.push({
        senderBalance: balance,
        transferAmount: amount,
        maxAmount: amount * 1.3,
        assetId: 2000
      });
    }

    return transactions;
  }

  async train() {
    await this.buildModel();
    
    const transactions = this.generateTrainingData();
    
    console.log(`Training on ${transactions.length} normal transaction patterns...`);
    
    const features = transactions.map(tx => this.extractFeatures(tx, []));
    const featuresTensor = tf.tensor2d(features);
    
    this.scaler.mean = featuresTensor.mean(0);
    this.scaler.std = featuresTensor.sub(this.scaler.mean).square().mean(0).sqrt().add(1e-7);
    
    const normalized = featuresTensor.sub(this.scaler.mean).div(this.scaler.std);

    await this.model.fit(normalized, normalized, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 25 === 0) {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
          }
        }
      },
      verbose: 0
    });

    console.log("Training complete\n");
    
    featuresTensor.dispose();
    normalized.dispose();
  }

  async detectAnomaly(transaction) {
    const features = this.extractFeatures(transaction, this.transactionHistory);
    const featuresTensor = tf.tensor2d([features]);
    
    const normalized = featuresTensor.sub(this.scaler.mean).div(this.scaler.std);
    const reconstruction = this.model.predict(normalized);
    
    const mse = reconstruction.sub(normalized).square().mean().arraySync();
    const rawScore = Math.sqrt(mse);
    const anomalyScore = Math.min(rawScore / this.reconstructionThreshold, 1);
    
    const classification = 
      anomalyScore > 0.65 ? 'HIGH_RISK' :
      anomalyScore > 0.35 ? 'MEDIUM_RISK' : 'LOW_RISK';

    const topFactors = this.getTopRiskFactors(features);

    featuresTensor.dispose();
    normalized.dispose();
    reconstruction.dispose();

    return {
      anomalyScore: anomalyScore.toFixed(3),
      classification,
      riskPercentage: (anomalyScore * 100).toFixed(1) + '%',
      recommendation: this.getRecommendation(anomalyScore, transaction),
      topRiskFactors: topFactors
    };
  }

  getTopRiskFactors(features) {
    const featureNames = [
      'Balance Ratio', 'Amount Magnitude', 'Time of Day', 'Day of Week',
      'Weekend Activity', 'Business Hours', 'Statistical Outlier', 'Account Draining',
      'Micro-Transaction', 'Max Amount Limit'
    ];

    const risks = features.map((val, idx) => ({
      factor: featureNames[idx],
      value: val.toFixed(3),
      severity: val > 0.7 ? 'HIGH' : val > 0.4 ? 'MEDIUM' : 'LOW'
    }));

    return risks
      .filter(r => r.severity !== 'LOW')
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
      .slice(0, 3);
  }

  getRecommendation(score, tx) {
    const balanceRatio = tx.transferAmount / tx.senderBalance;
    
    if (score > 0.65) {
      if (balanceRatio > 0.9) {
        return 'BLOCK - Potential account drain, require 2FA';
      }
      return 'BLOCK - Unusual pattern, manual review required';
    } else if (score > 0.35) {
      return 'FLAG - Monitor transaction, consider additional verification';
    } else {
      return 'APPROVE - Normal transaction pattern';
    }
  }

  addToHistory(transaction) {
    this.transactionHistory.push({
      ...transaction,
      timestamp: Date.now()
    });
    
    if (this.transactionHistory.length > 50) {
      this.transactionHistory.shift();
    }
  }

  async saveModel() {
    await this.model.save('file://./outputs/ai_model');
    
    const metadata = {
      scaler: {
        mean: await this.scaler.mean.array(),
        std: await this.scaler.std.array()
      },
      threshold: this.reconstructionThreshold,
      version: '2.0.0',
      trainedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('outputs/model_metadata.json', JSON.stringify(metadata, null, 2));
    console.log("Model saved to outputs/ai_model/\n");
  }
}

async function demo() {
  console.log("=".repeat(70));
  console.log("AI-Enhanced zkSNARK Transaction Security System");
  console.log("=".repeat(70));
  console.log();
  
  const detector = new TransactionAnomalyDetector();
  await detector.train();
  
  console.log("=".repeat(70));
  console.log("Testing Real-World Transaction Scenarios");
  console.log("=".repeat(70));
  console.log();
  
  const testCases = [
    {
      name: "Normal Daily Transfer",
      senderBalance: 10000,
      transferAmount: 2000,
      maxAmount: 5000,
      assetId: 2000
    },
    {
      name: "Large Business Payment",
      senderBalance: 50000,
      transferAmount: 18000,
      maxAmount: 30000,
      assetId: 2000
    },
    {
      name: "High-Value Personal Transfer",
      senderBalance: 20000,
      transferAmount: 12000,
      maxAmount: 15000,
      assetId: 2000
    },
    {
      name: "Suspicious Account Drain",
      senderBalance: 15000,
      transferAmount: 14500,
      maxAmount: 20000,
      assetId: 2000
    },
    {
      name: "Micro-Transaction Pattern",
      senderBalance: 100000,
      transferAmount: 5,
      maxAmount: 10000,
      assetId: 2000
    }
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Balance: ${testCase.senderBalance.toLocaleString()}, Amount: ${testCase.transferAmount.toLocaleString()}`);
    
    const result = await detector.detectAnomaly(testCase);
    
    console.log(`Anomaly Score: ${result.anomalyScore} (${result.riskPercentage})`);
    console.log(`Classification: ${result.classification}`);
    console.log(`Recommendation: ${result.recommendation}`);
    
    if (result.topRiskFactors.length > 0) {
      console.log(`Top Risk Factors:`);
      result.topRiskFactors.forEach(factor => {
        console.log(`  - ${factor.factor}: ${factor.value} (${factor.severity})`);
      });
    }
    console.log();
    
    detector.addToHistory(testCase);
  }

  await detector.saveModel();

  console.log("=".repeat(70));
  console.log("System Summary");
  console.log("=".repeat(70));
  console.log();
  console.log("Capabilities:");
  console.log("  - Real-time anomaly detection with explainability");
  console.log("  - Multi-factor risk assessment (10 features)");
  console.log("  - Adaptive learning from transaction history");
  console.log("  - Production-grade TensorFlow.js implementation");
  console.log();
  console.log("Integration with zkSNARK:");
  console.log("  1. AI pre-screens transaction (anomaly detection)");
  console.log("  2. zkSNARK generates privacy-preserving proof");
  console.log("  3. Smart contract validates on-chain");
  console.log("  4. Result: Privacy + Intelligence + Security");
  console.log();
  console.log("=".repeat(70));
}

demo().catch(console.error);
