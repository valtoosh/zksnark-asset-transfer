import React, { useState } from 'react';
import './TransactionForm.css';

export default function TransactionForm({ onSubmit, isLoading }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [assetId, setAssetId] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!amount || !recipient || !assetId || !balance) {
      alert('Please fill in all fields');
      return;
    }

    // Call parent function with form data
    await onSubmit({ 
      amount: parseInt(amount), 
      recipient, 
      assetId: parseInt(assetId),
      balance: parseInt(balance)
    });
  };

  return (
    <div className="transaction-form-container">
      <h2>Submit Private Transfer</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="balance">Your Balance:</label>
          <input 
            type="number" 
            id="balance"
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            placeholder="e.g., 6000"
            required 
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Transfer Amount:</label>
          <input 
            type="number" 
            id="amount"
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="e.g., 2000"
            required 
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipient">Recipient Address:</label>
          <input 
            type="text" 
            id="recipient"
            value={recipient} 
            onChange={e => setRecipient(e.target.value)} 
            placeholder="0x..."
            required 
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assetId">Asset ID:</label>
          <input 
            type="number" 
            id="assetId"
            value={assetId} 
            onChange={e => setAssetId(e.target.value)} 
            placeholder="e.g., 2000"
            required 
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Processing...' : 'Submit Transfer'}
        </button>
      </form>
    </div>
  );
}
