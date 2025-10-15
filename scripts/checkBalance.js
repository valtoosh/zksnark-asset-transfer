import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const PRIVATE_TRANSFER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  const PrivateTransferArtifact = await hre.artifacts.readArtifact("contracts/PrivateTransfer.sol:PrivateTransfer");
  const pt = new ethers.Contract(PRIVATE_TRANSFER_ADDRESS, PrivateTransferArtifact.abi, signer);
  
  const sender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  
  console.log("📊 Balance Commitments:");
  const senderBalance = await pt.getBalanceCommitment(sender);
  const recipientBalance = await pt.getBalanceCommitment(recipient);
  console.log("Sender:", senderBalance.toString());
  console.log("Recipient:", recipientBalance.toString());
  
  console.log("\n✅ Asset Status:");
  const isValid = await pt.isValidAsset(2000);
  console.log("Asset 2000 valid:", isValid);
}

main().catch(console.error);
