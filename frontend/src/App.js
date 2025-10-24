import React, { useState } from 'react';
import { ethers } from 'ethers';
import TransactionForm from './components/TransactionForm';
import TransactionResult from './components/TransactionResult';
import DepositPanel from './components/DepositPanel';
import { useWeb3 } from './contexts/Web3Context';
import { PRIVATE_TRANSFER_V2_ADDRESS, PRIVATE_TRANSFER_V2_ABI } from './contracts/PrivateTransferV2';
import './App.css';

function App() {
  const { account, connectWallet } = useWeb3();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contractBalance, setContractBalance] = useState('0');

  const formatProofForContract = (proof) => {
    return {
      pA: [proof.pi_a[0], proof.pi_a[1]],
      pB: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
      pC: [proof.pi_c[0], proof.pi_c[1]]
    };
  };

  const handleTransaction = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🚀 Starting transaction...', formData);

      const response = await fetch('http://localhost:5001/api/proof/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate proof');

      const data = await response.json();
      console.log('✅ Proof generated:', data);

      if (!data.success) {
        setResult({ ...data, onChain: false });
        setLoading(false);
        return;
      }

      console.log('⏳ Submitting to Sepolia...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PRIVATE_TRANSFER_V2_ADDRESS,
        PRIVATE_TRANSFER_V2_ABI,
        signer
      );

      const formattedProof = formatProofForContract(data.proof);
      const amountValue = formData.amount;

      const tx = await contract.privateTransfer(
        formattedProof.pA,
        formattedProof.pB,
        formattedProof.pC,
        data.publicSignals,
        formData.recipient,
        amountValue

      );

      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed!');

      setResult({
        ...data,
        onChain: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`
      });

      await loadContractBalance();

    } catch (error) {
      console.error('❌ Error:', error);
      setResult({
        success: false,
        error: error.message,
        onChain: false
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContractBalance = async () => {
    if (!account) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        PRIVATE_TRANSFER_V2_ADDRESS,
        PRIVATE_TRANSFER_V2_ABI,
        provider
      );
      
      const balance = await contract.getBalance(account);
      setContractBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  React.useEffect(() => {
    if (account) {
      loadContractBalance();
    }
  }, [account]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔐 Private Asset Transfer</h1>
        <p>Zero-Knowledge Proof Protected Transactions on Sepolia</p>
        
        {!account ? (
          <button onClick={connectWallet} className="connect-button">
            Connect MetaMask
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            <p>Contract Balance: {contractBalance} ETH</p>
          </div>
        )}
      </header>

      {account && (
        <main>
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing transaction...</p>
            </div>
          )}
          
          {!result && !loading && (
            <>
              <DepositPanel account={account} onDepositSuccess={loadContractBalance} />
              <TransactionForm onSubmit={handleTransaction} />
            </>
          )}
          {result && <TransactionResult result={result} onReset={() => setResult(null)} />}
        </main>
      )}
    </div>
  );
}

export default App;
