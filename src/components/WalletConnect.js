// src/components/WalletConnect.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../config';

const WalletConnect = ({ setAccount, setContract, startGame, account }) => {
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = accounts[0];
      setAccount(userAccount);

      // Switch to Somnia Mainnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x13A7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13A7' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13A7',
                chainName: 'Somnia Mainnet',
                rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
                blockExplorerUrls: ['https://explorer.somnia.network/'],
                nativeCurrency: { name: 'SOMI', symbol: 'SOMI', decimals: 18 },
              }],
            });
          } else {
            setError('Please switch to Somnia Mainnet');
            return;
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contract);

      try {
        const tx = await contract.registerPlayer();
        await tx.wait();
      } catch (err) {
        // Player already registered
      }

      setError('');
      startGame();
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setError('');
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      {account ? (
        <div>
          <p style={{ color: '#ff7518', fontSize: '18px', marginBottom: '10px' }}>
            Connected: <strong>{account.slice(0, 6)}...{account.slice(-4)}</strong>
          </p>
          <button
            onClick={disconnectWallet}
            style={{
              backgroundColor: '#ff0000',
              color: '#fff',
              padding: '12px 24px',
              border: '2px solid #000',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Creepster, cursive',
            }}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '32px', color: '#ff7518', marginBottom: '15px' }}>
            Connect Your Wallet & Start Game
          </h2>
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: '#ff7518',
              color: '#000',
              padding: '15px 30px',
              border: '2px solid #000',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Creepster, cursive',
            }}
          >
            Connect MetaMask & Start Game
          </button>
        </div>
      )}
      {error && <p style={{ color: '#ff0000', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;