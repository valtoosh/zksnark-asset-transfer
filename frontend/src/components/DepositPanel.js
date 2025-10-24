import React, { useState } from 'react';
import { ethers } from 'ethers';
import './DepositPanel.css';

const CONTRACT_ADDRESS = "0xbcCCBEdC6104029f5306a1CAF5CFBf33447A7ED6";

function DepositPanel({ account, onDepositSuccess }) {
  const [amount, setAmount] = useState('0.001');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeposit = async () => {
    if (!account) {
      setMessage('❌ Please connect wallet first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function deposit() external payable"],
        signer
      );

      console.log(`Depositing ${amount} ETH...`);
      const tx = await contract.deposit({ 
        value: ethers.parseEther(amount) 
      });

      setMessage('⏳ Transaction submitted... Waiting for confirmation');
      console.log('TX Hash:', tx.hash);

      await tx.wait();
      
      setMessage('✅ Deposit successful!');
      console.log('✅ Deposit confirmed!');
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }

      setTimeout(() => setMessage(''), 5000);

    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ ${error.message || 'Deposit failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-panel">
      <h3>💰 Deposit ETH to Contract</h3>
      <p className="deposit-info">Contract: {CONTRACT_ADDRESS.slice(0,10)}...</p>
      
      <div className="deposit-controls">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.001"
          min="0.001"
          placeholder="Amount in ETH"
          disabled={loading}
        />
        <button 
          onClick={handleDeposit}
          disabled={loading || !account}
          className="deposit-button"
        >
          {loading ? 'Processing...' : 'Deposit ETH'}
        </button>
      </div>

      {message && (
        <div className={`deposit-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default DepositPanel;
