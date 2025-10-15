import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Testing Complete Private Transfer System...\n");
  
  // Contract addresses from deployment
  const VERIFIER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const PRIVATE_TRANSFER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  // Connect to local network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  console.log("Using account:", await signer.getAddress());
  
  // Load contract artifacts
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const PrivateTransferArtifact = await hre.artifacts.readArtifact("contracts/PrivateTransfer.sol:PrivateTransfer");
  
  // Connect to contracts
  const verifier = new ethers.Contract(VERIFIER_ADDRESS, VerifierArtifact.abi, signer);
  const privateTransfer = new ethers.Contract(PRIVATE_TRANSFER_ADDRESS, PrivateTransferArtifact.abi, signer);
  
  console.log("📋 Contract Addresses:");
  console.log("  Verifier:", VERIFIER_ADDRESS);
  console.log("  PrivateTransfer:", PRIVATE_TRANSFER_ADDRESS);
  console.log();
  
  // Load proof data
  const proofPath = path.join(process.cwd(), "outputs", "proof.json");
  const publicPath = path.join(process.cwd(), "outputs", "public.json");
  
  const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));
  
  console.log("📊 Public Signals (Circuit Outputs):");
  console.log("  valid:", publicSignals[0]);
  console.log("  newBalance:", publicSignals[1]);
  console.log("  maxAmount:", publicSignals[2]);
  console.log("  assetId:", publicSignals[3]);
  console.log();
  
  // Format proof data as hex strings (matching soliditycalldata format)
  const pA = [
    "0x" + BigInt(proof.pi_a[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proof.pi_a[1]).toString(16).padStart(64, '0')
  ];
  
  const pB = [
    [
      "0x" + BigInt(proof.pi_b[0][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proof.pi_b[0][0]).toString(16).padStart(64, '0')
    ],
    [
      "0x" + BigInt(proof.pi_b[1][1]).toString(16).padStart(64, '0'),
      "0x" + BigInt(proof.pi_b[1][0]).toString(16).padStart(64, '0')
    ]
  ];
  
  const pC = [
    "0x" + BigInt(proof.pi_c[0]).toString(16).padStart(64, '0'),
    "0x" + BigInt(proof.pi_c[1]).toString(16).padStart(64, '0')
  ];
  
  const pubSignals = publicSignals.map(s => 
    "0x" + BigInt(s).toString(16).padStart(64, '0')
  );
  
  // Step 1: Test verifier directly
  console.log("Step 1: Testing Verifier Contract...");
  try {
    const isValid = await verifier.verifyProof(pA, pB, pC, pubSignals);
    console.log("✅ Verifier result:", isValid);
    
    if (!isValid) {
      console.log("❌ Proof is invalid! Cannot proceed with transfer.");
      return;
    }
  } catch (error) {
    console.error("❌ Verifier error:", error.message);
    return;
  }
  console.log();
  
  // Step 1.5: Setup (register asset and initialize balance)
  console.log("Step 1.5: Setting up asset and balance...");
  try {
    const assetId = pubSignals[3]; // assetId from public signals (already hex formatted)
    
    // Register asset
    const registerTx = await privateTransfer.registerAsset(assetId);
    await registerTx.wait();
    console.log("✅ Asset registered:", assetId);
    
    // Initialize balance with a commitment (hash of initial balance)
    const initialCommitment = ethers.keccak256(ethers.toUtf8Bytes("6000")); // Initial balance: 6000
    const initTx = await privateTransfer.initializeBalance(initialCommitment);
    await initTx.wait();
    console.log("✅ Balance initialized with commitment");
  } catch (error) {
    console.log("⚠️ Setup error (might already be initialized):", error.message);
  }
  console.log();
  
  // Step 2: Execute private transfer
  console.log("Step 2: Executing Private Transfer...");
  try {
    // Get recipient address (using account 1 for this demo)
    const recipientAddress = await provider.getSigner(1).then(s => s.getAddress());
    console.log("Recipient address:", recipientAddress);
    
    // Convert hex strings back to BigInt for the contract call
    const pA_uint = pA.map(x => BigInt(x));
    const pB_uint = pB.map(arr => arr.map(x => BigInt(x)));
    const pC_uint = pC.map(x => BigInt(x));
    const pubSignals_uint = pubSignals.map(x => BigInt(x));
    
    const tx = await privateTransfer.privateTransfer(
      pA_uint,
      pB_uint,
      pC_uint,
      pubSignals_uint,
      recipientAddress
    );
    
    console.log("📝 Transaction hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
    console.log("⛽ Gas used:", receipt.gasUsed.toString());
    console.log();
    
    // Parse events
    console.log("📢 Events:");
    for (const log of receipt.logs) {
      try {
        const parsedLog = privateTransfer.interface.parseLog(log);
        if (parsedLog.name === "TransferExecuted") {
          console.log("  ✅ TransferExecuted Event:");
          console.log("    valid:", parsedLog.args.valid);
          console.log("    newBalance:", parsedLog.args.newBalance.toString());
          console.log("    maxAmount:", parsedLog.args.maxAmount.toString());
          console.log("    assetId:", parsedLog.args.assetId.toString());
        }
      } catch (e) {
        // Skip logs that aren't from our contract
      }
    }
    
    console.log("\n🎉 SUCCESS! Private transfer completed!");
    console.log("The zkSNARK proof was verified on-chain without revealing:");
    console.log("  • Sender balance (private input: 6000)");
    console.log("  • Transfer amount (private input: 2000)");
    console.log("  • Recipient ID (private input: 123)");
    console.log("\nOnly the proof validity and new balance commitment were revealed!");
    
  } catch (error) {
    console.error("❌ Transfer failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
