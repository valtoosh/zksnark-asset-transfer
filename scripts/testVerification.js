import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🧪 Testing Verifier Only...\n");
  
  // Contract address
  const VERIFIER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Connect to local network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  // Load verifier contract
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const verifier = new ethers.Contract(
    VERIFIER_ADDRESS,
    VerifierArtifact.abi,
    signer
  );
  
  // Load proof data
  const proofPath = path.join(process.cwd(), "outputs", "proof.json");
  const publicPath = path.join(process.cwd(), "outputs", "public.json");

  
  const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));
  
  console.log("📊 Testing proof verification:");
  console.log("Public Signals:", publicSignals);
  
  // Format proof data
  const pA = proof.pi_a.slice(0, 2);
  const pB = [
    proof.pi_b[0].slice(0, 2),
    proof.pi_b[1].slice(0, 2)
  ];
  const pC = proof.pi_c.slice(0, 2);
  
  try {
    const isValid = await verifier.verifyProof(pA, pB, pC, publicSignals);
    console.log("\n✅ Proof verification result:", isValid);
    
    if (!isValid) {
      console.log("❌ The proof is INVALID for this verifier contract");
    } else {
      console.log("🎉 The proof is VALID! Ready for private transfer.");
    }
    
  } catch (error) {
    console.error("\n❌ Error calling verifyProof:");
    console.error(error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
