const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const retryButton = document.getElementById('retry');

    canvas.width = 320;
    canvas.height = 480;

    let bird = {
      x: 50,
      y: canvas.height / 2,
      width: 40,
      height: 30,
      gravity: 0.6,
      lift: -10,
      velocity: 0,
      color: '#FFD700'
    };

    let pipes = [];
    const pipeWidth = 50;
    const pipeGap = 120;
    let frame = 0;
    let score = 0;
    let gameOver = false;

    function resetGame() {
      bird = {
        x: 50,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        gravity: 0.6,
        lift: -10,
        velocity: 0,
        color: '#FFD700'
      };
      pipes = [];
      frame = 0;
      score = 0;
      gameOver = false;
      retryButton.style.display = 'none';
      gameLoop();
    }

    function drawBird() {
      ctx.fillStyle = bird.color;
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function updateBird() {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
      }
    }

    function drawPipes() {
      ctx.fillStyle = '#008000';
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
      });
    }

    function updatePipes() {
      if (frame % 90 === 0) {
        const top = Math.random() * (canvas.height - pipeGap - 100) + 50;
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
      }

      pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
          pipes.shift();
          score++;
        }

        if (
          bird.x < pipe.x + pipeWidth &&
          bird.x + bird.width > pipe.x &&
          (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
          gameOver = true;
        }
      });
    }

    function drawScore() {
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function drawGameOver() {
      ctx.fillStyle = '#000';
      ctx.font = '30px Arial';
      ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
      retryButton.style.display = 'block';
    }

    function gameLoop() {
      if (gameOver) {
        drawGameOver();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBird();
      updateBird();

      drawPipes();
      updatePipes();

      drawScore();

      frame++;
      requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', () => {
      if (!gameOver) {
        bird.velocity = bird.lift;
      }
    });

    retryButton.addEventListener('click', resetGame);

    gameLoop();
