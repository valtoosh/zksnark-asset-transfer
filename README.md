# zkSNARK Privacy-Preserving Transaction System

Zero-knowledge proof system for confidential blockchain transactions with AI-powered fraud detection.

## 🚀 Live Deployment (Ethereum Sepolia Testnet)

**✅ Production Contracts Deployed:**
- **Verifier:** [0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87](https://sepolia.etherscan.io/address/0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87)
- **PrivateTransfer:** [0x971715a1d9a51d71cF804B5100424D01250420F2](https://sepolia.etherscan.io/address/0x971715a1d9a51d71cF804B5100424D01250420F2)

**Deployment Date:** October 13, 2025  
**Network:** Ethereum Sepolia (Chain ID: 11155111)

## 📊 Performance Achievements

| Metric | Value | Status |
|--------|-------|--------|
| **Proof Generation** | **0.242s** | ✅ 12.4x faster than 3s target |
| **Circuit Constraints** | 265 | ✅ Production-optimized |
| **Gas Cost** | ~250k | ✅ Efficient on-chain validation |
| **Variance** | ±0.001s | ✅ Highly stable |

## 🏗️ System Architecture

Transaction Request
↓
[AI Pre-Screening] ← Neural network anomaly detection (prototype)
↓
[zkSNARK Proof Generation] ← 265-constraint circuit (0.242s)
↓
[Groth16 Verifier] ← Cryptographic validation
↓
[Smart Contract] ← On-chain enforcement
↓
Ethereum Blockchain

text

## 🔒 Privacy & Security Features

### Privacy Layer (zkSNARK)
- **Hidden Balances:** Sender balance kept confidential
- **Hidden Amounts:** Transfer amount not revealed
- **Hidden Recipient:** Recipient identity private
- **Public Validation:** Only validity flag and new balance public

### Security Validation
- Balance sufficiency check (sender has enough funds)
- Transfer amount validation (within allowed range)
- Maximum amount enforcement
- Recipient verification
- Complete arithmetic integrity

### AI Integration (Prototype)
- Behavioral anomaly detection using neural networks
- 10-factor risk assessment model
- Explainable predictions (feature importance)
- Pre-screening to save gas costs

## 🛠️ Technology Stack

**Blockchain:**
- Circom 2.x - Circuit design language
- SnarkJS - Proof generation
- Groth16 - Zero-knowledge proof system
- Solidity 0.8.28 - Smart contracts
- Hardhat - Development framework
- Ethereum Sepolia - Testnet deployment

**AI/ML:**
- TensorFlow.js (Node) - Neural network implementation
- Autoencoder architecture - Unsupervised anomaly detection
- Real-time risk scoring

**Tools:**
- Node.js 22+
- TypeScript
- Ethers.js v6

## 📁 Project Structure

zkptesting/
├── circuits/
│ └── transfer_v2.circom # Main circuit (265 constraints)
├── contracts/
│ ├── Verifier.sol # zkSNARK verifier (deployed)
│ └── PrivateTransfer.sol # Main contract (deployed)
├── scripts/
│ ├── deployToSepolia.js # Testnet deployment
│ ├── benchmarkProofGeneration.js # Performance testing
│ ├── testInvalidProof.js # Security validation
│ ├── aiAnomalyDetection.js # AI fraud detection
│ └── integratedAiZksnark.js # Full system integration
├── inputs/
│ ├── input_v2.json # Valid test case
│ └── test_cases/ # Additional scenarios
├── outputs/
│ ├── benchmark_results.json # Performance data
│ ├── circuit_final.zkey # Proving key
│ └── verification_key.json # Verification key
└── SEPOLIA_DEPLOYMENT.md # Deployment documentation

text

## 🧪 Test Results

### Valid Proofs ✅
- Normal transfer (2000 from 6000 balance)
- Minimum transfer (1 from 5000 balance)
- Maximum transfer (5000 from 10000 balance)
- Large balance transfer (5000 from 1M balance)

**Result:** 4/4 tests passing

### Invalid Proofs ✅
- Overdraft attempt (2000 from 1000 balance) → Correctly rejected
- Max amount violation (100 with max 50) → Correctly rejected

**Result:** 2/2 correctly blocked

### Performance Testing ✅
- Average: 0.242s
- Standard deviation: ±0.001s
- Consistency: 100% across multiple runs

## 🚀 Quick Start

### Prerequisites
Required
Node.js v22+
npm or yarn

For deployment
Alchemy/Infura RPC endpoint
MetaMask with Sepolia ETH

text

### Installation
Clone repository
git clone https://github.com/valtoosh/zksnark-asset-transfer.git
cd zksnark-asset-transfer

Install dependencies
npm install

Create .env file
echo "SEPOLIA_RPC_URL=your_rpc_url" > .env
echo "PRIVATE_KEY=your_private_key" >> .env

text

### Run Tests
Generate proof
npx hardhat run scripts/testPrivateTransfer.js --network localhost

Test invalid proofs
npx hardhat run scripts/testInvalidProof.js --network localhost

Performance benchmark
npx hardhat run scripts/benchmarkProofGeneration.js

AI demonstration
node scripts/aiAnomalyDetection.js

text

## 📈 Key Achievements

1. **✅ Production Deployment** - Live smart contracts on Ethereum Sepolia
2. **✅ Sub-Second Performance** - 0.242s proof generation (12.4x faster)
3. **✅ Complete Testing** - Valid and invalid proof coverage
4. **✅ AI Integration** - Prototype fraud detection layer
5. **✅ Public Verifiability** - Contracts viewable on Etherscan

## 💡 Use Cases

### Financial Privacy
- Confidential corporate transactions
- Private wealth management
- Anonymous high-value transfers

### DeFi Applications
- Privacy-preserving DEX trades
- Hidden liquidity provision
- Confidential lending/borrowing

### Enterprise Solutions
- B2B payment privacy
- Supply chain finance
- Cross-border settlements

### Regulatory Compliance
- Zero-knowledge audit trails
- Selective disclosure for compliance
- Privacy-preserving KYC

## 🔗 Important Links

- **Verifier Contract:** https://sepolia.etherscan.io/address/0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87
- **PrivateTransfer Contract:** https://sepolia.etherscan.io/address/0x971715a1d9a51d71cF804B5100424D01250420F2
- **Circom Documentation:** https://docs.circom.io/
- **SnarkJS Guide:** https://github.com/iden3/snarkjs

## 📝 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| zkSNARK Circuit | ✅ Production | Deployed and tested |
| Smart Contracts | ✅ Production | Live on Sepolia |
| Performance | ✅ Production | 0.242s proof generation |
| Security Testing | ✅ Complete | All tests passing |
| AI Integration | 🚧 Prototype | Architecture complete, needs calibration |

## 🎯 Future Roadmap

1. Smart contract audit and formal verification
2. AI model calibration with production data
3. Frontend web interface development
4. Mainnet deployment preparation
5. Cross-chain integration (HTLC)
6. Academic paper publication

## 👨‍💻 Author

**Raj Singh**
- BITS Pilani Dubai Campus
- Computer Science Engineering
- GitHub: [@valtoosh](https://github.com/valtoosh)

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Circom and SnarkJS teams for exceptional ZK tooling
- iden3 for circomlib templates
- BITS Pilani Dubai for research support
- The zero-knowledge research community

---

**⭐ If you find this project useful, please star it!**

**Last Updated:** October 13, 2025
