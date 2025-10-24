import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './WalletConnect.css';

export default function WalletConnect() {
  const { account, balance, isConnected, error, connectWallet, disconnectWallet } = useWeb3();

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {error && <div className="wallet-error">{error}</div>}
      
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-btn">
          🦊 Connect MetaMask
        </button>
      ) : (
        <div className="wallet-info">
          <div className="account-details">
            <span className="address">{shortenAddress(account)}</span>
            <span className="balance">{parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          <button onClick={disconnectWallet} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
