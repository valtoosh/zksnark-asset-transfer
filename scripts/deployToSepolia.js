import { ethers } from "ethers";
import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Deploying to Sepolia Testnet...\n");
  console.log("=".repeat(70));
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  // Read compiled contracts
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const PrivateTransferArtifact = await hre.artifacts.readArtifact("contracts/PrivateTransfer.sol:PrivateTransfer");
  
  // Deploy Verifier
  console.log("📝 Deploying Groth16Verifier...");
  const VerifierFactory = new ethers.ContractFactory(
    VerifierArtifact.abi,
    VerifierArtifact.bytecode,
    deployer
  );
  const verifier = await VerifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✅ Verifier deployed to:", verifierAddress);
  console.log("📝 Transaction hash:", verifier.deploymentTransaction().hash);
  
  // Wait for confirmations
  console.log("⏳ Waiting for 2 confirmations...");
  await verifier.deploymentTransaction().wait(2);
  console.log("✅ Confirmed!");
  
  // Deploy PrivateTransfer
  console.log("\n📝 Deploying PrivateTransfer...");
  const PrivateTransferFactory = new ethers.ContractFactory(
    PrivateTransferArtifact.abi,
    PrivateTransferArtifact.bytecode,
    deployer
  );
  const privateTransfer = await PrivateTransferFactory.deploy(verifierAddress);
  await privateTransfer.waitForDeployment();
  const privateTransferAddress = await privateTransfer.getAddress();
  console.log("✅ PrivateTransfer deployed to:", privateTransferAddress);
  console.log("📝 Transaction hash:", privateTransfer.deploymentTransaction().hash);
  
  // Wait for confirmations
  console.log("⏳ Waiting for 2 confirmations...");
  await privateTransfer.deploymentTransaction().wait(2);
  console.log("✅ Confirmed!");
  
  console.log("\n" + "=".repeat(70));
  console.log("🎉 Sepolia Deployment Complete!\n");
  console.log("📋 Contract Addresses:");
  console.log("   Verifier:", verifierAddress);
  console.log("   PrivateTransfer:", privateTransferAddress);
  console.log("\n🔗 View on Etherscan:");
  console.log("   Verifier: https://sepolia.etherscan.io/address/" + verifierAddress);
  console.log("   PrivateTransfer: https://sepolia.etherscan.io/address/" + privateTransferAddress);
  console.log("\n💾 Save these addresses for testing!");
  console.log("=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
