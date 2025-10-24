const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

const ZKP_PATH = path.join(__dirname, '../outputs');

async function testProof() {
  try {
    console.log('Testing proof generation...\n');
    
    // CORRECT INPUT FORMAT
    const input = {
      senderBalance: "6000",
      transferAmount: "2000",
      assetId: "2000",
      recipientId: "123456789",
      maxAmount: "10000"
    };
    
    console.log('Input:', input);
    
    // Generate proof
    console.log('\n⏳ Generating proof...');
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      path.join(ZKP_PATH, 'transfer_v2_js/transfer_v2.wasm'),
      path.join(ZKP_PATH, 'circuit_final.zkey')
    );
    
    console.log('✅ Proof generated!');
    console.log('Public signals:', publicSignals);
    
    // Verify
    console.log('\n⏳ Verifying proof...');
    const vKey = JSON.parse(fs.readFileSync(
      path.join(ZKP_PATH, 'verification_key.json')
    ));
    
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    
    console.log(res ? '✅ VALID PROOF!' : '❌ INVALID PROOF');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProof();
