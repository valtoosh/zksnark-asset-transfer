// Sources flattened with hardhat v3.0.7 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/PrivateTransfer.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

interface IVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[4] calldata _pubSignals
    ) external view returns (bool);
}

contract PrivateTransfer {
    
    IVerifier public verifier;
    mapping(address => uint256) public balanceCommitments;
    mapping(uint256 => bool) public validAssets;
    
    event TransferExecuted(address indexed from, address indexed to, uint256 timestamp);
    event BalanceCommitmentUpdated(address indexed user, uint256 newCommitment);
    event AssetRegistered(uint256 indexed assetId);
    
    constructor(address _verifierAddress) {
        verifier = IVerifier(_verifierAddress);
    }
    
    function registerAsset(uint256 assetId) external {
        require(!validAssets[assetId], "Asset already registered");
        validAssets[assetId] = true;
        emit AssetRegistered(assetId);
    }
    
    function initializeBalance(uint256 commitment) external {
        require(balanceCommitments[msg.sender] == 0, "Balance already initialized");
        balanceCommitments[msg.sender] = commitment;
        emit BalanceCommitmentUpdated(msg.sender, commitment);
    }
    
    function privateTransfer(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[4] calldata pubSignals,
        address recipient
    ) external returns (bool) {
        require(verifier.verifyProof(pA, pB, pC, pubSignals), "Invalid proof");
        
        // Circuit outputs: [valid, newBalance, maxAmount, assetId]
        uint256 valid = pubSignals[0];
        uint256 senderNewBalance = pubSignals[1];
        uint256 maxAmount = pubSignals[2];
        uint256 assetId = pubSignals[3];
        
        require(valid == 1, "Transfer validation failed");
        require(validAssets[assetId], "Invalid asset");
        
        // Update sender's balance commitment
        balanceCommitments[msg.sender] = senderNewBalance;
        
        emit TransferExecuted(msg.sender, recipient, block.timestamp);
        emit BalanceCommitmentUpdated(msg.sender, senderNewBalance);
        
        return true;
    }
    
    function getBalanceCommitment(address user) external view returns (uint256) {
        return balanceCommitments[user];
    }
    
    function isValidAsset(uint256 assetId) external view returns (bool) {
        return validAssets[assetId];
    }
}

