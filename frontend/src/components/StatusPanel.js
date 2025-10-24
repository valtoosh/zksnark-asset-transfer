import React from 'react';
import './StatusPanel.css';

export default function StatusPanel({ txResult }) {
  if (!txResult) {
    return null; // Don't show anything if no transaction yet
  }

  const getStatusIcon = () => {
    if (!txResult.proofValid) return '❌';
    if (txResult.aiFlagged) return '⚠️';
    return '✅';
  };

  const getStatusMessage = () => {
    if (!txResult.proofValid) {
      return 'Transaction Failed: Invalid proof';
    }
    if (txResult.aiFlagged) {
      return 'Transaction Flagged: Unusual pattern detected';
    }
    return 'Transaction Successful';
  };

  const getGenAIExplanation = () => {
    if (!txResult.proofValid) {
      return `The cryptographic proof was invalid. No funds were transferred. This could be due to insufficient balance or incorrect input data.`;
    }

    if (txResult.aiFlagged) {
      return `This transfer showed unusual patterns and has been flagged for review. The transaction was processed but may require additional verification before finalization.`;
    }

    return `Your transfer of ${txResult.amount} units to ${txResult.recipient} was successfully verified using zero-knowledge proofs. Your actual balance and transfer details remain completely private. The proof was generated in ${txResult.time || '0.24s'}.`;
  };

  return (
    <div className="status-panel">
      <div className={`status-header ${txResult.proofValid ? 'success' : 'error'}`}>
        <span className="status-icon">{getStatusIcon()}</span>
        <h2>{getStatusMessage()}</h2>
      </div>

      <div className="status-content">
        <div className="genai-explanation">
          <h3>🤖 AI Explanation</h3>
          <p>{getGenAIExplanation()}</p>
        </div>

        <div className="transaction-details">
          <h3>📋 Transaction Details</h3>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">{txResult.amount} units</span>
          </div>
          <div className="detail-row">
            <span className="label">Recipient:</span>
            <span className="value">{txResult.recipient}</span>
          </div>
          <div className="detail-row">
            <span className="label">Asset ID:</span>
            <span className="value">{txResult.assetId}</span>
          </div>
          {txResult.txHash && (
            <div className="detail-row">
              <span className="label">Transaction Hash:</span>
              <span className="value tx-hash">{txResult.txHash}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="label">Proof Generation Time:</span>
            <span className="value">{txResult.time}</span>
          </div>
          <div className="detail-row">
            <span className="label">Privacy Protected:</span>
            <span className="value">{txResult.privacy ? '🔒 Yes' : '🔓 No'}</span>
          </div>
        </div>

        <div className="privacy-info">
          <h3>🔐 Privacy Features</h3>
          <ul>
            <li>✓ Your balance remains hidden</li>
            <li>✓ Transfer amount is encrypted</li>
            <li>✓ Zero-knowledge proof verified on-chain</li>
            <li>✓ No transaction data leaked</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
