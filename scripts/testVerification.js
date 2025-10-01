module.exports = async function(callback) {
  try {
    const Groth16Verifier = artifacts.require("Groth16Verifier");
    
    // Deploy or use existing contract
    let instance;
    try {
      instance = await Groth16Verifier.deployed();
    } catch (error) {
      console.log("Deploying new verifier contract...");
      instance = await Groth16Verifier.new();
    }

    // EXACT proof data from soliditycalldata export
    const pA = [
      "0x26518b59c5b466cd625d4f5324017c4570e725bdb08b6b2256ba453a9ba92457",
      "0x115795e12f73297d9aa389213753128530ac6c10210e5456b9f847f29317d892"
    ];

    const pB = [
      [
        "0x1d8580b25633821be5fc1eb1bb034b8003c92366eee39cc1a44f2939868dad3a",
        "0x1c210c82f8c9133a962ef8bb3eca21e5ef6648bbafc981293b33d22d97f33115"
      ],
      [
        "0x21f70c8ddbe1f7282bbf13cc0b01ad8eb45d5acbe2c83cf38c6373955cdb0183",
        "0x0a54a24abe3b81873a99f2a93f02dfe30f8b98fd97c98137c92ce90f39babc39"
      ]
    ];

    const pC = [
      "0x0d2f0b6f4346289c12d5951cd96b5967f4e0fffea782a8736f81c98b6513b3ac",
      "0x1b5e7538a24d282a2debe497eba8b145afded2dbf5e0a8abbc54ce6c52e2cb8c"
    ];

    // Public signals - EXACT format from soliditycalldata
    const pubSignals = [
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x00000000000000000000000000000000000000000000000000000000000003e8"
    ];

    console.log("Calling verifyProof with:");
    console.log("- Contract address:", instance.address);
    console.log("- Public signals:", pubSignals);

    // Call the verification function
    const result = await instance.verifyProof.call(pA, pB, pC, pubSignals);

    console.log("\n=== VERIFICATION RESULT ===");
    console.log("Result:", result);
    
    if (result === true) {
      console.log("✅ PROOF VERIFICATION SUCCESSFUL!");
      console.log("Your zkSNARK proof is valid on-chain!");
    } else {
      console.log("❌ Proof verification failed");
    }

  } catch (error) {
    console.error("Error during verification:", error);
  }
  
  callback();
};
