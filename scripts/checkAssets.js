import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(
    "0x48a4F84E3975a3AfeB2f7cC06B0C11B0E51CfC87",
    ["function isValidAsset(uint256) external view returns (bool)"],
    provider
  );
  
  const valid1998 = await contract.isValidAsset(1998);
  const valid2000 = await contract.isValidAsset(2000);
  
  console.log("Asset 1998 valid:", valid1998);
  console.log("Asset 2000 valid:", valid2000);
  
  if (!valid1998 || !valid2000) {
    console.log("\n❌ Assets not registered! Need to register them.");
  } else {
    console.log("\n✅ Assets are registered!");
  }
}

main();
