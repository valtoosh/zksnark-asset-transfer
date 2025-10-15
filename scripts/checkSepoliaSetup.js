import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🔍 Checking Sepolia Configuration...\n");
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!rpcUrl) {
    console.log("❌ SEPOLIA_RPC_URL not set in .env file");
    return;
  }
  
  if (!privateKey) {
    console.log("❌ PRIVATE_KEY not set in .env file");
    return;
  }
  
  console.log("✅ Environment variables loaded");
  
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log("📍 Wallet Address:", wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Sepolia Balance:", ethers.formatEther(balance), "ETH");
    
    const network = await provider.getNetwork();
    console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
    
    if (balance > 0n) {
      console.log("\n✅ Ready to deploy to Sepolia!");
    } else {
      console.log("\n⚠️  Warning: Balance is 0. Get test ETH from faucet.");
    }
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main();
