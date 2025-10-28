// src/components/HalloweenEffects.js
import React, { useEffect } from 'react';

const HalloweenEffects = () => {
  useEffect(() => {
    // Add floating ghost animation
    const createGhost = () => {
      const ghost = document.createElement('img');
      ghost.src = '/assets/ghost.png';
      ghost.style.position = 'absolute';
      ghost.style.width = '50px';
      ghost.style.opacity = '0.5';
      ghost.style.left = `${Math.random() * window.innerWidth}px`;
      ghost.style.top = `${window.innerHeight}px`;

      document.body.appendChild(ghost);

      // Animate ghost floating upwards
      let posY = window.innerHeight;
      const animate = () => {
        posY -= 2;
        ghost.style.top = `${posY}px`;
        ghost.style.left = `${
          parseFloat(ghost.style.left) + Math.sin(posY / 50) * 5
        }px`; // Wavy motion
        if (posY < -50) {
          ghost.remove();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Spawn ghosts every 3 seconds
    const interval = setInterval(createGhost, 3000);
    return () => clearInterval(interval);
  }, []);

  return null; // No direct DOM rendering, only side effects
};

export default HalloweenEffects;