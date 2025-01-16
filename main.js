const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle and ball positions
let paddle1X = 350; // Top player
let paddle2X = 350; // Bottom player
let ballX = 400;
let ballY = 300;

const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;

const player = prompt('Are you Player 1 or Player 2? Enter 1 or 2:');

// Handle game state updates
socket.on('gameState', (gameState) => {
  paddle1X = gameState.paddle1X;
  paddle2X = gameState.paddle2X;
  ballX = gameState.ballX;
  ballY = gameState.ballY;
});

function drawPaddle(x, y) {
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(paddle1X, 10); // Player 1 paddle
  drawPaddle(paddle2X, canvas.height - 20); // Player 2 paddle
  drawBall();
}

// Movement for player paddle
document.addEventListener('keydown', (e) => {
  if (player == 1) {
    if (e.key === 'a' && paddle1X > 0) paddle1X -= 20;
    if (e.key === 'd' && paddle1X < canvas.width - paddleWidth) paddle1X += 20;
    socket.emit('paddleMove', { player: 1, paddleX: paddle1X });
  } else if (player == 2) {
    if (e.key === 'ArrowLeft' && paddle2X > 0) paddle2X -= 20;
    if (e.key === 'ArrowRight' && paddle2X < canvas.width - paddleWidth) paddle2X += 20;
    socket.emit('paddleMove', { player: 2, paddleX: paddle2X });
  }
});

// Game loop
setInterval(draw, 1000 / 60);