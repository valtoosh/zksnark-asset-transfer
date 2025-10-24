import React from 'react';
import './TransactionResult.css';

function TransactionResult({ result, onReset }) {
  const isSuccess = result.success && result.proofValid;

  return (
    <div className={`result-container ${isSuccess ? 'success' : 'error'}`}>
      <div className="result-header">
        <span className="result-icon">{isSuccess ? '✅' : '❌'}</span>
        <h2>{isSuccess ? 'Transaction Successful' : 'Transaction Failed'}</h2>
      </div>

      {isSuccess && (
        <>
          <div className="ai-explanation">
            <h3>🤖 AI Explanation</h3>
            <p>
              Your transfer of {result.amount} units to {result.recipient.slice(0, 10)}... was
              successfully verified using zero-knowledge proofs. Your actual balance and transfer
              details remain completely private. The proof was generated in {result.time}.
            </p>
            {result.onChain && (
              <p className="blockchain-success">
                ⛓️ Transaction has been confirmed on Sepolia blockchain!
              </p>
            )}
          </div>

          <div className="details-section">
            <h3>📋 Transaction Details</h3>
            <div className="detail-row">
              <span>Amount:</span>
              <span>{result.amount} units</span>
            </div>
            <div className="detail-row">
              <span>Recipient:</span>
              <span className="address">{result.recipient}</span>
            </div>
            <div className="detail-row">
              <span>Asset ID:</span>
              <span>{result.assetId}</span>
            </div>
            
            {result.onChain && (
              <>
                <div className="detail-row highlight">
                  <span>Transaction Hash:</span>
                  <span className="address">{result.txHash?.slice(0, 20)}...</span>
                </div>
                <div className="detail-row">
                  <span>Block Number:</span>
                  <span>{result.blockNumber}</span>
                </div>
                <div className="detail-row">
                  <span>Etherscan:</span>
                  <a href={result.etherscanUrl} target="_blank" rel="noopener noreferrer">
                    View on Explorer →
                  </a>
                </div>
              </>
            )}
            
            <div className="detail-row">
              <span>Proof Generation Time:</span>
              <span>{result.time}</span>
            </div>
            <div className="detail-row">
              <span>Privacy Protected:</span>
              <span>🔒 {result.privacy ? 'Yes' : 'No'}</span>
            </div>
            {result.aiFlagged && (
              <div className="detail-row warning">
                <span>⚠️ AI Alert:</span>
                <span>Large transfer detected</span>
              </div>
            )}
          </div>
        </>
      )}

      {!isSuccess && (
        <div className="error-message">
          <p>{result.error || 'Transaction failed'}</p>
        </div>
      )}

      <button onClick={onReset} className="reset-button">
        New Transaction
      </button>
    </div>
  );
}

export default TransactionResult;
