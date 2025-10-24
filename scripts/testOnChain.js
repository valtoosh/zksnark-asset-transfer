import { ethers } from "ethers";
import hre from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
  console.log("Testing on-chain proof verification...\n");
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("📝 From address:", deployer.address);
  
  // Contract addresses
  const privateTransferAddress = "0x971715a1d9a51d71cF804B5100424D01250420F2";
  // Use deployer's address as recipient for testing
  const recipientAddress = deployer.address;
  
  // Load proof data
  const proof = JSON.parse(fs.readFileSync("outputs/proof.json", "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync("outputs/public.json", "utf8"));
  
  // Connect to contract
  const PrivateTransfer = await hre.artifacts.readArtifact("contracts/PrivateTransfer.sol:PrivateTransfer");
  const contract = new ethers.Contract(privateTransferAddress, PrivateTransfer.abi, deployer);
  
  console.log("📝 Sending proof verification transaction to:", privateTransferAddress);
  console.log("📝 Recipient:", recipientAddress);
  
  // Send transaction using privateTransfer function with recipient
  const tx = await contract.privateTransfer(
    [proof.pi_a[0], proof.pi_a[1]],
    [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
    [proof.pi_c[0], proof.pi_c[1]],
    publicSignals,
    recipientAddress
  );
  
  console.log("\n⏳ Transaction sent:", tx.hash);
  console.log("🔗 https://sepolia.etherscan.io/tx/" + tx.hash);
  
  console.log("\n⏳ Waiting for confirmation...");
  const receipt = await tx.wait();
  
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
  console.log("⛽ Gas used:", receipt.gasUsed.toString());
  
  console.log("\n🎉 Proof verified on-chain!");
  console.log("🔗 View contract: https://sepolia.etherscan.io/address/" + privateTransferAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
