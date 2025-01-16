import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

// Variables to track paddle positions
let paddle1X = 350;
let paddle2X = 350;

// Ball state
let ballX = 400;
let ballY = 300;
let ballDX = 3;
let ballDY = 3;

// Broadcast the game state
function broadcastGameState() {
  io.emit('gameState', {
    paddle1X,
    paddle2X,
    ballX,
    ballY
  });
}

// Game loop to update the ball position
setInterval(() => {
  ballX += ballDX;
  ballY += ballDY;

  // Ball collision with walls
  if (ballX <= 0 || ballX >= 800) ballDX = -ballDX;

  // Ball collision with paddles
  if (ballY <= 20 && ballX >= paddle1X && ballX <= paddle1X + 100) ballDY = -ballDY; // Player 1 paddle
  if (ballY >= 580 && ballX >= paddle2X && ballX <= paddle2X + 100) ballDY = -ballDY; // Player 2 paddle

  // Reset ball if it goes out of bounds
  if (ballY <= 0 || ballY >= 600) {
    ballX = 400;
    ballY = 300;
    ballDX = 3;
    ballDY = ballDY > 0 ? -3 : 3;
  }

  broadcastGameState();
}, 1000 / 60);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Handle paddle movement
  socket.on('paddleMove', ({ player, paddleX }) => {
    if (player === 1) paddle1X = paddleX;
    if (player === 2) paddle2X = paddleX;
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
