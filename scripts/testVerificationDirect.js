import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("🧪 Testing Verifier with Exact Solidity Call Data...\n");
  
  const VERIFIER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  const VerifierArtifact = await hre.artifacts.readArtifact("contracts/Verifier.sol:Groth16Verifier");
  const verifier = new ethers.Contract(VERIFIER_ADDRESS, VerifierArtifact.abi, signer);
  
  // Exact data from soliditycalldata export
  const pA = ["0x1d503a9d72487afd71e7d26116e91261df4a5abe3034f02166532a6dc63029a7", "0x1af188710ac0cec48013e41f1e24b65c269fcdd086af5bd5cde1b129c2315838"];
  
  const pB = [["0x2084b6ad311f587bbaaf30df95cfe5f8c158bde39b345d9561ab18dcd2fb3ae4", "0x0d51a4d5f53a72e7725d344e8d959ca93340af6e29816cbb5c5eb931410b52b2"],["0x2226baef4757f6c72833302f15f0902d99d08d17f648fd023fb59721511053a5", "0x2c98d51c704771e7622b02daba004ae0d9768268149e7c5494c5d21ed463344c"]];
  
  const pC = ["0x2882c10a47ece549574f74bdc53db67efabe19db53dd14236cb49676715c3c10", "0x2e520499ab5872c1b4d7d187143a5e299f5899907c9b8569553a8b729106caf3"];
  
  const pubSignals = ["0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000000000000000fa0","0x000000000000000000000000000000000000000000000000000000000000002a","0x00000000000000000000000000000000000000000000000000000000000007d0"];
  
  console.log("Calling verifyProof with soliditycalldata format...");
  
  try {
    const result = await verifier.verifyProof(pA, pB, pC, pubSignals);
    console.log("\n✅ Proof verification result:", result);
    
    if (result) {
      console.log("🎉 SUCCESS! The proof is VALID!");
    } else {
      console.log("❌ The proof is INVALID");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
