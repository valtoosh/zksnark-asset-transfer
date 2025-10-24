const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs').promises;

const ZKP_PATH = path.join(__dirname, '../../../outputs');
const WASM_PATH = path.join(ZKP_PATH, 'transfer_v2_js/transfer_v2.wasm');
const ZKEY_PATH = path.join(ZKP_PATH, 'circuit_final.zkey');
const VKEY_PATH = path.join(ZKP_PATH, 'verification_key.json');

class ProofController {
  async generateProof(req, res) {
    const startTime = Date.now();
    
    try {
      const { balance, amount, recipient, assetId } = req.body;
      
      console.log('\n=== PROOF GENERATION REQUEST ===');
      console.log('Frontend input:', { balance, amount, recipient, assetId });
      
      if (!balance || !amount || !assetId) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['balance', 'amount', 'assetId']
        });
      }

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

      const recipientId = recipient ? 
        BigInt('0x' + recipient.slice(2, 18)).toString() : 
        "123456789";

      const circuitInput = {
        senderBalance: balance.toString(),
        transferAmount: amount.toString(),
        assetId: assetId.toString(),
        recipientId: recipientId,
        maxAmount: (parseInt(balance) * 2).toString()
      };
      
      console.log('Circuit input:', circuitInput);
      
      console.log('⏳ Generating proof...');
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInput,
        WASM_PATH,
        ZKEY_PATH
      );
      
      console.log('✅ Proof generated successfully');
      console.log('Public signals:', publicSignals);

      const proofTime = ((Date.now() - startTime) / 1000).toFixed(3);
      console.log(`⏱️  Proof time: ${proofTime}s`);

      const ratio = amount / balance;
      const aiFlagged = ratio > 0.8;
      
      if (aiFlagged) {
        console.log('⚠️  AI FLAGGED: Large transfer detected');
      }

      console.log('✅ Success!\n');

      res.json({
        success: true,
        proofValid: true,
        balance,
        amount,
        recipient,
        assetId,
        aiFlagged,
        privacy: true,
        time: `${proofTime}s`,
        proof,
        publicSignals  // Send original order from circuit
      });

    } catch (error) {
      console.error('❌ Error generating proof:', error.message);
      res.status(500).json({
        success: false,
        error: 'Proof generation failed',
        message: error.message
      });
    }
  }

  async verifyProof(req, res) {
    try {
      const { proof, publicSignals } = req.body;
      
      console.log('\n=== PROOF VERIFICATION REQUEST ===');
      
      const vKey = JSON.parse(await fs.readFile(VKEY_PATH, 'utf8'));
      const res_verify = await snarkjs.groth16.verify(vKey, publicSignals, proof);
      
      console.log('Verification:', res_verify ? '✓ VALID' : '❌ INVALID');
      
      res.json({
        valid: res_verify,
        message: res_verify ? 'Proof is valid' : 'Proof verification failed'
      });
      
    } catch (error) {
      console.error('❌ Error verifying proof:', error.message);
      res.status(500).json({
        valid: false,
        error: 'Verification failed',
        message: error.message
      });
    }
  }
}

module.exports = new ProofController();
