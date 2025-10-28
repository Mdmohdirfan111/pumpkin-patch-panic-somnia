// src/pages/index.js
import React, { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import GameBoard from '../components/GameBoard';
import Leaderboard from '../components/Leaderboard';
import HalloweenEffects from '../components/HalloweenEffects';

const Home = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div
      className="home"
      style={{
        backgroundImage: 'url(/assets/spooky-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff',
        padding: '20px',
        fontFamily: 'Creepster, cursive',
      }}
    >
      <HalloweenEffects />

      {/* Intro Section */}
      {!account && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '48px', color: '#ff7518', textShadow: '0 0 10px #000' }}>
            Pumpkin Patch Panic
          </h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '20px auto', lineHeight: '1.6' }}>
            <strong>How to Play:</strong> Click on the grid to collect pumpkins (+10 points) or avoid ghosts (-5 points). 
            Your score and leaderboard are stored on-chain on <strong>Somnia Mainnet</strong>.
          </p>
          <p style={{ fontSize: '16px', color: '#ccc' }}>
            <strong>Contract Address:</strong> 
            <br />
            <code style={{ background: '#333', padding: '5px 10px', borderRadius: '5px', fontSize: '14px' }}>
              0xfdc5bFb3C7BcC224866b34af29Ac44C9565C16D7
            </code>
          </p>
        </div>
      )}

      {/* Wallet Connect */}
      <WalletConnect
        setAccount={setAccount}
        setContract={setContract}
        startGame={startGame}
        isGameStarted={isGameStarted}
        account={account}
      />

      {/* Game & Leaderboard */}
      {account && contract && isGameStarted && (
        <>
          <GameBoard account={account} contract={contract} />
          <Leaderboard contract={contract} />
        </>
      )}

      {/* Social Links */}
      <div className="social-links" style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
        <h3 style={{ color: '#ff7518', marginBottom: '15px' }}>Follow Us</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="https://x.com/0xPaulThomas" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="/assets/twitter-icon.png" alt="Twitter" style={{ width: '30px' }} /> @0xPaulThomas
          </a>
          <a href="https://x.com/Somnia_Network" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="/assets/twitter-icon.png" alt="Twitter" style={{ width: '30px' }} /> @Somnia_Network
          </a>
          <a href="https://x.com/Irrfan_eth" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="/assets/twitter-icon.png" alt="Twitter" style={{ width: '30px' }} /> @Irrfan_eth
          </a>
          <a href="https://discord.gg/jHwg3Y35" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="/assets/discord-icon.png" alt="Discord" style={{ width: '30px' }} /> Join Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;