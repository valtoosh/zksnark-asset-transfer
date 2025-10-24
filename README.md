# 🔐 zkSNARK Private Asset Transfer System

<div align="center">

![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-e6e6e6?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js)

**Complete full-stack privacy-preserving blockchain transaction system using Zero-Knowledge Proofs**

[Live Demo](#-live-demo) • [Documentation](#-documentation) • [Installation](#-installation) • [Architecture](#-architecture)

</div>

---

## 🎉 Project Highlights

- ✅ **Production Deployment** - Live on Ethereum Sepolia Testnet
- ⚡ **Lightning Fast** - 0.049s proof generation (20x faster than initial target)
- 🔐 **Privacy First** - Zero-knowledge proofs hide transaction details
- 🎨 **Modern UI** - MetaMask-inspired dark theme interface
- 📱 **Full Stack** - Complete React + Express + Solidity implementation
- 🏆 **Battle Tested** - Working on-chain transaction verified

## 🚀 Live Demo

### Working Transaction
- **Block:** `9479320`
- **Network:** Ethereum Sepolia
- **Status:** ✅ Successfully Verified
- **View:** [Etherscan](https://sepolia.etherscan.io/tx/0x61c0702115ae0d76c9...)

### Deployed Contracts
| Contract | Address | Purpose |
|----------|---------|---------|
| **Groth16 Verifier** | `0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87` | ZK Proof Verification |
| **PrivateTransferV2** | `0xbcCCBEdC6104029f5306a1CAF5CFBf33447A7ED6` | Privacy-Preserving Transfers |

## 📊 Performance Metrics

┌─────────────────────┬──────────┬────────────┐
│ Metric │ Value │ Status │
├─────────────────────┼──────────┼────────────┤
│ Proof Generation │ 0.049s │ ✅ 20x faster │
│ Circuit Constraints │ 265 │ ✅ Optimized │
│ Gas Cost │ ~250k │ ✅ Efficient │
│ Success Rate │ 100% │ ✅ Working │
└─────────────────────┴──────────┴────────────┘

text

## 🏗️ Architecture

┌─────────────────────────────────────────────────────┐
│ React Frontend │
│ (MetaMask Dark Theme UI) │
│ localhost:3000 │
└──────────────────┬──────────────────────────────────┘
│
↓
┌─────────────────────────────────────────────────────┐
│ Express Backend │
│ (Proof Generation Server) │
│ localhost:5001 │
└──────────────────┬──────────────────────────────────┘
│
↓
┌─────────────────────────────────────────────────────┐
│ Circom Circuit │
│ (transfer_v2.circom) │
│ 265 constraints │
└──────────────────┬──────────────────────────────────┘
│
↓
┌─────────────────────────────────────────────────────┐
│ Groth16 ZK-SNARK │
│ (0.049s proof time) │
└──────────────────┬──────────────────────────────────┘
│
↓
┌─────────────────────────────────────────────────────┐
│ Smart Contract Verifier │
│ (Ethereum Sepolia Testnet) │
└─────────────────────────────────────────────────────┘

text

## ✨ Features

### 🔒 Privacy Layer
- **Hidden Transfer Amounts** - Actual amount never revealed on-chain
- **Hidden Balances** - User balance kept confidential
- **Hidden Recipients** - Recipient identity stored privately
- **Zero-Knowledge Proofs** - Proves validity without exposing data

### 💻 Frontend (React)
- MetaMask-inspired dark theme
- Real-time transaction tracking
- Form validation & error handling
- Responsive design
- Smooth animations

### 🔧 Backend (Express)
- Fast proof generation (<100ms)
- Secure witness calculation
- RESTful API architecture
- CORS enabled
- Request logging

### 📜 Smart Contracts (Solidity)
- Groth16 proof verification
- Asset whitelisting
- Balance tracking
- Event emission
- Security validations

## 📁 Project Structure

zksnark-asset-transfer/
├── frontend/ # React Application
│ ├── src/
│ │ ├── App.js # Main component
│ │ ├── components/
│ │ │ ├── TransactionForm.js
│ │ │ ├── DepositPanel.js
│ │ │ └── TransactionResult.js
│ │ ├── contracts/ # ABIs & Addresses
│ │ └── contexts/ # React Context
│ └── package.json
│
├── backend/ # Express Server
│ ├── src/
│ │ ├── server.js
│ │ ├── controllers/
│ │ │ └── proof.controller.js
│ │ └── routes/
│ │ └── proof.routes.js
│ └── package.json
│
├── contracts/ # Solidity Contracts
│ ├── PrivateTransferV2.sol
│ └── Verifier.sol
│
├── circuit/ # Circom Circuits
│ └── transfer_v2.circom
│
├── scripts/ # Deployment Scripts
│ ├── deployV2.js
│ └── checkAssets.js
│
└── outputs/ # Circuit Artifacts
├── transfer_v2.r1cs
├── circuit_final.zkey
└── verification_key.json

text

## 🚀 Installation

### Prerequisites
Node.js v18+
npm or yarn
MetaMask browser extension
Sepolia testnet ETH

text

### Quick Start

1. **Clone Repository**
git clone https://github.com/valtoosh/zksnark-asset-transfer.git
cd zksnark-asset-transfer

text

2. **Install Dependencies**
Root dependencies
npm install

Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

text

3. **Environment Setup**

Create `.env` in project root:
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x

text

4. **Run Application**

**Terminal 1 - Backend:**
cd backend
npm start

Runs on http://localhost:5001
text

**Terminal 2 - Frontend:**
cd frontend
npm start

Runs on http://localhost:3000
text

5. **Open Browser**
Navigate to `http://localhost:3000` and connect MetaMask!

## 🎯 How to Use

1. **Connect Wallet** → Click "Connect MetaMask"
2. **Deposit ETH** → Deposit 0.001 ETH to contract
3. **Fill Transfer Form:**
   - Balance: `6000`
   - Amount: `95` (must be < balance and < 12000)
   - Recipient: Valid Ethereum address
   - Asset ID: `1998` or `2000`
4. **Submit** → Click "Submit Transfer"
5. **Confirm** → Approve in MetaMask
6. **Success!** → View transaction on Etherscan 🎉

## 🔬 How It Works

### Zero-Knowledge Proof Flow

1. **User Input** → User fills transfer form with balance, amount, recipient, asset ID
2. **Backend Request** → Frontend sends data to Express proof server
3. **Witness Calculation** → Backend computes circuit witness using Circom
4. **Proof Generation** → Groth16 proof generated via snarkjs (~50ms)
5. **On-Chain Submission** → Frontend submits proof + public signals to contract
6. **Verification** → Smart contract verifies proof using elliptic curve pairings
7. **Execution** → If valid, transfer executes; otherwise reverts
8. **Confirmation** → Success message with Etherscan link displayed

### Public vs Private Data

#### ❌ Hidden (Zero-Knowledge)
- Actual transfer amount
- Sender's real balance  
- Recipient identity
- Asset details

#### ✅ Public (On-Chain)
- Transaction occurred
- Proof is cryptographically valid
- Sender address (to contract)
- Block timestamp

### What Appears on Etherscan

From: 0xA109...008D (your wallet)
To: 0xbcCC...7ED6 (privacy contract)
Function: privateTransfer()
Input Data: [cryptographic proof blob - unreadable]

text

**Nobody can decode the actual transfer details!** 🔒

## 🧪 Test Cases

### Valid Transfers ✅
- [x] Normal transfer (95 from 6000)
- [x] Minimum transfer (1 from 5000)  
- [x] Maximum transfer (5000 from 10000)
- [x] Large balance (5000 from 1,000,000)

### Security Tests ✅
- [x] Overdraft rejection (2000 from 1000) → **Blocked**
- [x] Invalid asset rejection (asset 1996) → **Blocked**
- [x] Max amount violation (5000 with max 50) → **Blocked**
- [x] Insufficient contract balance → **Blocked**

## 💡 Use Cases

| Sector | Application |
|--------|-------------|
| 🏦 **DeFi** | Private trades, lending, liquidity provision |
| 💼 **Corporate** | Confidential B2B payments, payroll privacy |
| 🌐 **Cross-Border** | Anonymous remittances, international transfers |
| 🎮 **Gaming** | Private in-game asset trading |
| 🏥 **Healthcare** | Confidential medical payments |

## 🛡️ Security Features

- **Groth16 Trusted Setup** - Industry-standard ZK-SNARK system
- **Elliptic Curve Cryptography** - BN254 curve for pairing operations
- **Asset Whitelisting** - Only approved assets can be transferred
- **Balance Validation** - Cryptographic proof of sufficient funds
- **Overflow Protection** - Safe arithmetic operations
- **Reentrancy Guards** - Protected against common attacks

## 📚 Documentation

### Key Contracts

**PrivateTransferV2.sol**
- Main transfer logic
- ZK proof verification
- Balance management
- Event emission

**Verifier.sol**
- Auto-generated from Circom circuit
- Implements Groth16 verification
- Uses elliptic curve pairings
- Verifies public signals

### Circuit Design

**transfer_v2.circom**
// Public signals: [valid, newBalance, assetId, maxAmount]
// Private inputs: [senderBalance, transferAmount, recipientId]

Validates: senderBalance >= transferAmount

Validates: transferAmount <= maxAmount

Validates: assetId is valid

Computes: newBalance = senderBalance - transferAmount

text

## 🔗 Important Links

- **Repository:** https://github.com/valtoosh/zksnark-asset-transfer
- **Verifier Contract:** [Etherscan](https://sepolia.etherscan.io/address/0x9FfB4F8E3d4e8f0daA1Bba985Af56E6fe1734F87)
- **Transfer Contract:** [Etherscan](https://sepolia.etherscan.io/address/0xbcCCBEdC6104029f5306a1CAF5CFBf33447A7ED6)
- **Live Transaction:** [Etherscan](https://sepolia.etherscan.io/tx/0x61c0702115ae0d76c9...)
- **Circom Docs:** https://docs.circom.io
- **SnarkJS:** https://github.com/iden3/snarkjs

## 🎓 Academic Context

This project demonstrates:
- **Zero-Knowledge Cryptography** - Groth16 proof system implementation
- **Privacy-Preserving Protocols** - Confidential transaction mechanisms  
- **Full-Stack Blockchain Development** - End-to-end dApp architecture
- **Cryptographic Engineering** - Practical ZK-SNARK applications
- **Distributed Systems** - Blockchain integration patterns

**Research Areas:**
- Zero-knowledge proof systems
- Privacy-enhancing technologies
- Blockchain scalability
- Cryptographic protocol design
- Decentralized application architecture

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raj Singh**
- Institution: BITS Pilani Dubai Campus
- Program: Computer Science Engineering
- GitHub: [@valtoosh](https://github.com/valtoosh)
- LinkedIn: [Connect](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- **Circom & SnarkJS Teams** - Exceptional zero-knowledge tooling
- **iden3** - circomlib circuit templates
- **BITS Pilani Dubai** - Research support and guidance
- **Zero-Knowledge Community** - Invaluable resources and discussions
- **Ethereum Foundation** - Testnet infrastructure

## ⚠️ Disclaimer

This is a **research prototype** for educational and demonstration purposes. The system has **not been audited** for production use. Do not use with real funds on mainnet without proper security audits.

---

<div align="center">

**⭐ Star this repo if you found it useful! ⭐**

**Last Updated:** October 24, 2025

Made with ❤️ using Zero-Knowledge Proofs

</div>
This README includes:

Professional badges and formatting

Clear architecture diagrams

Complete installation instructions

Live demo links

Performance metrics

Security features

Test cases

Use cases

Academic context

Contributing guidelines

Beautiful visual presentation
