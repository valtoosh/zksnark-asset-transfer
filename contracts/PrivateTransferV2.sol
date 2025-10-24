// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[4] calldata _pubSignals
    ) external view returns (bool);
}

contract PrivateTransferV2 {
    
    IVerifier public verifier;
    
    mapping(address => uint256) public balances;
    mapping(address => uint256) public balanceCommitments;
    mapping(uint256 => bool) public validAssets;
    
    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
        uint256 assetId;
    }
    
    TransferRecord[] public transfers;
    uint256 public transferCount;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event TransferExecuted(address indexed from, address indexed to, uint256 timestamp, uint256 assetId);
    event BalanceCommitmentUpdated(address indexed user, uint256 newCommitment);
    event AssetRegistered(uint256 indexed assetId);
    
    constructor(address _verifierAddress) {
        verifier = IVerifier(_verifierAddress);
        validAssets[1998] = true;
        validAssets[2000] = true;
        emit AssetRegistered(1998);
        emit AssetRegistered(2000);
    }
    
    function deposit() external payable {
        require(msg.value > 0, "Must deposit something");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    function privateTransfer(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[4] calldata pubSignals,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        require(verifier.verifyProof(pA, pB, pC, pubSignals), "Invalid ZK proof");
        
        // Circuit outputs: [valid, newBalance, assetId, maxAmount]
        uint256 valid = pubSignals[0];
        uint256 senderNewBalance = pubSignals[1];
        uint256 assetId = pubSignals[2];  // FIXED: position 2
        uint256 maxAmount = pubSignals[3]; // FIXED: position 3
        
        require(valid == 1, "Transfer validation failed");
        require(validAssets[assetId], "Invalid asset");
        require(balances[msg.sender] >= amount, "Insufficient ETH balance");
        require(amount <= maxAmount, "Amount exceeds max");
        
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        balanceCommitments[msg.sender] = senderNewBalance;
        
        transfers.push(TransferRecord({
            from: msg.sender,
            to: recipient,
            timestamp: block.timestamp,
            assetId: assetId
        }));
        
        transferCount++;
        emit TransferExecuted(msg.sender, recipient, block.timestamp, assetId);
        emit BalanceCommitmentUpdated(msg.sender, senderNewBalance);
        
        return true;
    }
    
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    function registerAsset(uint256 assetId) external {
        validAssets[assetId] = true;
        emit AssetRegistered(assetId);
    }
    
    function isValidAsset(uint256 assetId) external view returns (bool) {
        return validAssets[assetId];
    }
    
    function getTransferCount() external view returns (uint256) {
        return transferCount;
    }
}
