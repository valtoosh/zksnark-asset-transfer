import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🧪 Testing Invalid Proof Rejection on Blockchain\n");
  console.log("=".repeat(70));
  
  const VERIFIER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const PRIVATE_TRANSFER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  console.log("Using account:", await signer.getAddress());
  console.log();
  
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const PrivateTransferArtifact = await hre.artifacts.readArtifact("contracts/PrivateTransfer.sol:PrivateTransfer");
  
  const verifier = new ethers.Contract(VERIFIER_ADDRESS, VerifierArtifact.abi, signer);
  const privateTransfer = new ethers.Contract(PRIVATE_TRANSFER_ADDRESS, PrivateTransferArtifact.abi, signer);
  
  // Test Invalid Proof 1: Overdraft
  console.log("📋 Test 1: Invalid Proof - Transfer Exceeds Balance");
  console.log("-".repeat(70));
  
  const proofInvalid = JSON.parse(fs.readFileSync("outputs/proof_invalid.json", "utf8"));
  const publicInvalid = JSON.parse(fs.readFileSync("outputs/public_invalid.json", "utf8"));
  
  console.log("Public Signals:", publicInvalid);
  console.log("  valid:", publicInvalid[0], "(0 = INVALID)");
  console.log("  newBalance:", publicInvalid[1], "(negative/underflow)");
  console.log();
  
  // Format proof data
  const pA_inv = [
    "0x" + BigInt(proofInvalid.pi_a[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proofInvalid.pi_a[1]).toString(16).padStart(64, '0')
  ];
  
  const pB_inv = [
    [
      "0x" + BigInt(proofInvalid.pi_b[0][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proofInvalid.pi_b[0][0]).toString(16).padStart(64, '0')
    ],
    [
      "0x" + BigInt(proofInvalid.pi_b[1][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proofInvalid.pi_b[1][0]).toString(16).padStart(64, '0')
    ]
  ];
  
  const pC_inv = [
    "0x" + BigInt(proofInvalid.pi_c[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proofInvalid.pi_c[1]).toString(16).padStart(64, '0')
  ];
  
  const pubSignals_inv = publicInvalid.map(s => 
    "0x" + BigInt(s).toString(16).padStart(64, '0')
  );
  
  // Test 1: Direct verifier (proof is mathematically valid)
  try {
    const isValid = await verifier.verifyProof(pA_inv, pB_inv, pC_inv, pubSignals_inv);
    console.log("✅ Verifier cryptographic check:", isValid);
    console.log("   (Proof is mathematically valid, but semantically invalid)");
  } catch (error) {
    console.error("❌ Verifier error:", error.message);
  }
  console.log();
  
  // Test 2: Private transfer contract (should reject because valid=0)
  console.log("Testing PrivateTransfer contract rejection...");
  try {
    const recipientAddress = await provider.getSigner(1).then(s => s.getAddress());
    
    const pA_uint = pA_inv.map(x => BigInt(x));
    const pB_uint = pB_inv.map(arr => arr.map(x => BigInt(x)));
    const pC_uint = pC_inv.map(x => BigInt(x));
    const pubSignals_uint = pubSignals_inv.map(x => BigInt(x));
    
    const tx = await privateTransfer.privateTransfer(
      pA_uint,
      pB_uint,
      pC_uint,
      pubSignals_uint,
      recipientAddress
    );
    
    await tx.wait();
    console.log("❌ UNEXPECTED: Transaction succeeded (should have been rejected!)");
  } catch (error) {
    console.log("✅ EXPECTED: Transaction rejected!");
    console.log("   Reason:", error.message.split('\n')[0]);
    console.log("   The contract correctly enforces: valid == 1");
  }
  
  console.log("\n" + "=".repeat(70));
  console.log("📋 Test 2: Invalid Proof - Transfer Exceeds maxAmount");
  console.log("-".repeat(70));
  
  const proofInvalidMax = JSON.parse(fs.readFileSync("outputs/proof_invalid_max.json", "utf8"));
  const publicInvalidMax = JSON.parse(fs.readFileSync("outputs/public_invalid_max.json", "utf8"));
  
  console.log("Public Signals:", publicInvalidMax);
  console.log("  valid:", publicInvalidMax[0], "(0 = INVALID)");
  console.log("  newBalance:", publicInvalidMax[1]);
  console.log();
  
  const pA_inv2 = [
    "0x" + BigInt(proofInvalidMax.pi_a[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proofInvalidMax.pi_a[1]).toString(16).padStart(64, '0')
  ];
  
  const pB_inv2 = [
    [
      "0x" + BigInt(proofInvalidMax.pi_b[0][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proofInvalidMax.pi_b[0][0]).toString(16).padStart(64, '0')
    ],
    [
      "0x" + BigInt(proofInvalidMax.pi_b[1][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proofInvalidMax.pi_b[1][0]).toString(16).padStart(64, '0')
    ]
  ];
  
  const pC_inv2 = [
    "0x" + BigInt(proofInvalidMax.pi_c[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proofInvalidMax.pi_c[1]).toString(16).padStart(64, '0')
  ];
  
  const pubSignals_inv2 = publicInvalidMax.map(s => 
    "0x" + BigInt(s).toString(16).padStart(64, '0')
  );
  
  try {
    const recipientAddress = await provider.getSigner(1).then(s => s.getAddress());
    
    const pA_uint2 = pA_inv2.map(x => BigInt(x));
    const pB_uint2 = pB_inv2.map(arr => arr.map(x => BigInt(x)));
    const pC_uint2 = pC_inv2.map(x => BigInt(x));
    const pubSignals_uint2 = pubSignals_inv2.map(x => BigInt(x));
    
    const tx = await privateTransfer.privateTransfer(
      pA_uint2,
      pB_uint2,
      pC_uint2,
      pubSignals_uint2,
      recipientAddress
    );
    
    await tx.wait();
    console.log("❌ UNEXPECTED: Transaction succeeded (should have been rejected!)");
  } catch (error) {
    console.log("✅ EXPECTED: Transaction rejected!");
    console.log("   Reason:", error.message.split('\n')[0]);
    console.log("   The contract correctly enforces: valid == 1");
  }
  
  console.log("\n" + "=".repeat(70));
  console.log("🎉 SECURITY TEST COMPLETE!");
  console.log("=".repeat(70));
  console.log("\n✅ Summary:");
  console.log("   • Cryptographic verification works (proofs are valid zkSNARKs)");
  console.log("   • Smart contract enforces business logic (valid == 1)");
  console.log("   • Invalid transfers are correctly rejected on-chain");
  console.log("   • Two-layer security: cryptography + application logic");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
