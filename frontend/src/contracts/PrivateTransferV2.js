export const PRIVATE_TRANSFER_V2_ADDRESS = "0xbcCCBEdC6104029f5306a1CAF5CFBf33447A7ED6";

export const PRIVATE_TRANSFER_V2_ABI = [
  "function deposit() external payable",
  "function privateTransfer(uint[2] calldata pA, uint[2][2] calldata pB, uint[2] calldata pC, uint[4] calldata pubSignals, address recipient, uint256 amount) external returns (bool)",
  "function getBalance(address user) external view returns (uint256)",
  "function withdraw(uint256 amount) external",
  "function isValidAsset(uint256 assetId) external view returns (bool)"
];
