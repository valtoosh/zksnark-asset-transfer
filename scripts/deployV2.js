import { ethers } from "ethers";
import hre from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
  console.log("🚀 Deploying PrivateTransferV2 to Sepolia...\n");
  console.log("=".repeat(70));
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  // Use existing Verifier
  const VERIFIER_ADDRESS = "0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87";
  console.log("✅ Using existing Verifier at:", VERIFIER_ADDRESS);
  
  // Read compiled PrivateTransferV2 contract
  const PrivateTransferV2Artifact = await hre.artifacts.readArtifact(
    "contracts/PrivateTransferV2.sol:PrivateTransferV2"
  );
  
  // Deploy PrivateTransferV2
  console.log("\n📝 Deploying PrivateTransferV2...");
  const PrivateTransferV2Factory = new ethers.ContractFactory(
    PrivateTransferV2Artifact.abi,
    PrivateTransferV2Artifact.bytecode,
    deployer
  );
  
  const contract = await PrivateTransferV2Factory.deploy(VERIFIER_ADDRESS);
  console.log("⏳ Waiting for deployment...");
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log("\n✅ PrivateTransferV2 deployed to:", address);
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${address}`);
  
  // Wait for confirmations
  console.log("\n⏳ Waiting for 2 confirmations...");
  await contract.deploymentTransaction().wait(2);
  console.log("✅ Confirmed!");
  
  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    verifier: VERIFIER_ADDRESS,
    privateTransferV2: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    etherscan: `https://sepolia.etherscan.io/address/${address}`
  };
  
  fs.writeFileSync(
    'deployment-v2.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📄 Deployment info saved to deployment-v2.json");
  console.log("\n" + "=".repeat(70));
  console.log("🎉 Deployment complete!");
  console.log("=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
