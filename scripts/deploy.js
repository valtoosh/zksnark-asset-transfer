import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  console.log("🚀 Starting Phase 2 Deployment...\n");
  
  // Get provider and signers
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  console.log("📝 Deploying with account:", signer.address);
  
  // Read compiled contracts
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const PrivateTransferArtifact = await hre.artifacts.readArtifact("PrivateTransfer");
  
  // Deploy Verifier
  console.log("\n📝 Deploying Groth16Verifier...");
  const VerifierFactory = new ethers.ContractFactory(
    VerifierArtifact.abi,
    VerifierArtifact.bytecode,
    signer
  );
  const verifier = await VerifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✅ Verifier deployed to:", verifierAddress);
  
  // Deploy PrivateTransfer
  console.log("\n📝 Deploying PrivateTransfer...");
  const PrivateTransferFactory = new ethers.ContractFactory(
    PrivateTransferArtifact.abi,
    PrivateTransferArtifact.bytecode,
    signer
  );
  const privateTransfer = await PrivateTransferFactory.deploy(verifierAddress);
  await privateTransfer.waitForDeployment();
  const privateTransferAddress = await privateTransfer.getAddress();
  console.log("✅ PrivateTransfer deployed to:", privateTransferAddress);
  
  console.log("\n🎉 Phase 2 Deployment Complete!");
  console.log("\n📋 Contract Addresses:");
  console.log("   Verifier:", verifierAddress);
  console.log("   PrivateTransfer:", privateTransferAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
