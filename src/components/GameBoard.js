// src/components/GameBoard.js
import React, { useState, useEffect } from 'react';

const GameBoard = ({ account, contract }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [pumpkinCount, setPumpkinCount] = useState(0);

  // Reset game on account change (re-connect)
  useEffect(() => {
    const initialGrid = Array(5)
      .fill()
      .map(() => Array(5).fill(null));
    setGrid(initialGrid);
    setScore(0);
    setPumpkinCount(0);
    if (account && contract) {
      fetchPlayerData();
    }
  }, [account, contract]);

  const fetchPlayerData = async () => {
    try {
      const data = await contract.getPlayerData(account);
      setScore(data.score.toString());
      setPumpkinCount(data.pumpkinCount.toString());
    } catch (err) {
      console.error('Error fetching player data:', err);
    }
  };

  const handleCellClick = async (row, col) => {
    if (!account || !contract) {
      alert('Please connect your wallet!');
      return;
    }

    const isPumpkin = Math.random() < 0.7;
    const newGrid = [...grid];
    newGrid[row][col] = isPumpkin ? 'pumpkin' : 'ghost';
    setGrid(newGrid);

    try {
      if (isPumpkin) {
        const pumpkinId = Date.now();
        const tx = await contract.collectPumpkin(pumpkinId);
        await tx.wait();
      } else {
        const deduction = 5;
        const tx = await contract.encounterGhost(deduction);
        await tx.wait();
      }
      await fetchPlayerData();
    } catch (err) {
      console.error('Error interacting with contract:', err);
    }

    setTimeout(() => {
      newGrid[row][col] = null;
      setGrid([...newGrid]);
    }, 1000);
  };

  return (
    <div className="game-board" style={{ textAlign: 'center', margin: '20px' }}>
      <h2 style={{ fontFamily: 'Creepster, cursive', color: '#ff7518' }}>
        Pumpkin Patch Panic
      </h2>
      <p style={{ color: '#fff' }}>
        Score: {score} | Pumpkins: {pumpkinCount}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 60px)',
          gap: '5px',
          justifyContent: 'center',
          backgroundColor: '#111',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0 0 10px #ff7518',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#222',
                border: '2px solid #ff7518',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              className="grid-cell"
            >
              {cell === 'pumpkin' && (
                <img src="/assets/pumpkin.png" alt="Pumpkin" style={{ width: '50px' }} />
              )}
              {cell === 'ghost' && (
                <img src="/assets/ghost.png" alt="Ghost" style={{ width: '50px' }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;