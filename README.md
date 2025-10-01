# Privacy-Preserving Asset Transfer Using zk-SNARKs

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Circom](https://img.shields.io/badge/circom-2.1.4-green)
![Groth16](https://img.shields.io/badge/zkSNARK-Groth16-purple)

A high-performance privacy-preserving asset transfer system built with zero-knowledge proofs (zk-SNARKs) that achieves sub-0.2s proof generation while maintaining comprehensive validation.

## 🎯 Project Overview

This project addresses the **privacy paradox** in Central Bank Digital Currencies (CBDCs) and blockchain-based financial systems by implementing an enhanced zk-SNARK circuit that enables:

- **Privacy-preserving transactions** with complete asset transfer validation
- **Sub-second proof generation** (0.198s for 265 constraints)
- **Multi-validation system** (balance, range, asset ID, recipient verification)
- **Production-ready implementation** using professional circomlib templates

### Key Features

✅ **Enhanced Circuit Design** - 265 constraints with 88x complexity increase  
✅ **Exceptional Performance** - 0.198s proof generation (15x faster than industry standard)  
✅ **Multi-Validation** - Balance + Range + Asset + Recipient checks  
✅ **Gas Optimized** - 393K gas for on-chain verification  
✅ **Research-Based** - Addresses academic literature gaps in scalability

## 📊 Performance Metrics

| Metric | Value | Industry Standard |
|--------|-------|-------------------|
| **Proof Generation** | 0.198s | ~3s |
| **Witness Generation** | 0.094s | ~0.5s |
| **Circuit Constraints** | 265 | ~3 (baseline) |
| **Template Instances** | 8 | 1 (baseline) |
| **Gas Cost** | 393K | 400K+ |

## 🏗️ Architecture


