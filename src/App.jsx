import React, { useEffect, useRef, useState } from 'react';
    import './App.css';

    const FlappyBird = () => {
      const canvasRef = useRef(null);
      const [gameOver, setGameOver] = useState(false);
      const [isFullScreen, setIsFullScreen] = useState(false);
      const animationFrameRef = useRef(null);

      useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const bird = {
          x: 50,
          y: canvas.height / 2,
          width: 40,
          height: 30,
          gravity: 0.8,
          lift: -12,
          velocity: 0,
          color: '#FFD700'
        };

        const pipes = [];
        const pipeWidth = 80;
        const pipeGap = 180;
        const pipeSpeed = 6;
        let frame = 0;

        const drawBird = () => {
          ctx.save();
          ctx.translate(bird.x, bird.y);
          ctx.rotate(bird.velocity * 0.05);

          // Draw bird body
          ctx.beginPath();
          ctx.ellipse(20, 15, 20, 15, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
          ctx.strokeStyle = '#DAA520';
          ctx.stroke();

          // Draw bird beak
          ctx.beginPath();
          ctx.moveTo(40, 15);
          ctx.lineTo(50, 10);
          ctx.lineTo(50, 20);
          ctx.closePath();
          ctx.fillStyle = '#FFA500';
          ctx.fill();

          // Draw bird eye
          ctx.beginPath();
          ctx.arc(30, 10, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#000';
          ctx.fill();

          ctx.restore();
        };

        const updateBird = () => {
          bird.velocity += bird.gravity;
          bird.y += bird.velocity;

          // Allow the bird to go above the ceiling or below the ground
          if (bird.y + bird.height > canvas.height) {
            bird.y = canvas.height - bird.height; // Prevent going below the ground
          }
          if (bird.y < 0) {
            bird.y = 0; // Prevent going above the ceiling
          }
        };

        const drawPipes = () => {
          ctx.fillStyle = '#008000';
          ctx.strokeStyle = '#006400';
          ctx.lineWidth = 5;

          pipes.forEach(pipe => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);

            // Bottom pipe
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
            ctx.strokeRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
          });
        };

        const updatePipes = () => {
          if (frame % 50 === 0) {
            const top = Math.random() * (canvas.height - pipeGap - 100) + 50;
            const bottom = canvas.height - top - pipeGap;
            pipes.push({ x: canvas.width, top, bottom });
          }

          pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;

            if (pipe.x + pipeWidth < 0) {
              pipes.shift();
            }

            // Collision detection (only with pipes)
            if (
              bird.x < pipe.x + pipeWidth &&
              bird.x + bird.width > pipe.x &&
              (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
            ) {
              setGameOver(true);
            }
          });
        };

        const drawGameOver = () => {
          ctx.fillStyle = '#000';
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        };

        const gameLoop = () => {
          if (gameOver) {
            cancelAnimationFrame(animationFrameRef.current);
            return;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          drawBird();
          updateBird();

          drawPipes();
          updatePipes();

          frame++;
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        const handleKeyDown = () => {
          if (!gameOver) {
            bird.velocity = bird.lift;
          }
        };

        const handleTouch = () => {
          if (!gameOver) {
            bird.velocity = bird.lift;
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('touchstart', handleTouch);

        gameLoop();

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('touchstart', handleTouch);
          cancelAnimationFrame(animationFrameRef.current);
          window.removeEventListener('resize', resizeCanvas);
        };
      }, [gameOver]);

      const resetGame = () => {
        setGameOver(false);
        animationFrameRef.current = requestAnimationFrame(() => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      };

      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) { // Safari
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
          }
          setIsFullScreen(true);
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
          }
          setIsFullScreen(false);
        }
      };

      return (
        <div>
          <canvas ref={canvasRef}></canvas>
          {gameOver && (
            <div className="game-over">
              <button className="retry-button" onClick={resetGame}>
                Retry
              </button>
            </div>
          )}
          <button className="full-screen-button" onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
        </div>
      );
    };

    export default FlappyBird;
