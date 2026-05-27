import { Snake, GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from "./snake.js";
import { Food } from "./food.js";
import { InputHandler } from "./input.js";

const STATE = {
  MENU: "menu",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.scoreEl = document.getElementById("score");
    this.finalScoreEl = document.getElementById("finalScore");
    this.highScoreEl = document.getElementById("highScore");
    this.menuScreen = document.getElementById("menuScreen");
    this.gameOverScreen = document.getElementById("gameOverScreen");
    this.gameUI = document.getElementById("gameUI");

    this.highScore = parseInt(localStorage.getItem("snakeHighScore") || "0", 10);
    this.highScoreEl.textContent = this.highScore;

    this.state = STATE.MENU;
    this.input = new InputHandler((dir) => this._onDirection(dir));

    document.getElementById("startBtn").addEventListener("click", () => this.start());
    document.getElementById("restartBtn").addEventListener("click", () => this.start());

    this._resize();
    window.addEventListener("resize", () => this._resize());

    this._showScreen(STATE.MENU);
  }

  _resize() {
    const container = document.getElementById("gameContainer");
    const maxW = Math.min(container.clientWidth - 20, 500);
    const maxH = Math.min(window.innerHeight - 200, 500);
    const size = Math.min(maxW, maxH);
    const snapped = Math.floor(size / GRID_SIZE) * GRID_SIZE;

    this.canvas.width = snapped;
    this.canvas.height = snapped;
    this.cols = snapped / GRID_SIZE;
    this.rows = snapped / GRID_SIZE;
    this.cellSize = GRID_SIZE;
  }

  start() {
    this._resize();
    this.snake = new Snake(this.cols, this.rows);
    this.food = new Food(this.cols, this.rows);
    this.food.spawn(this.snake);
    this.score = 0;
    this.speed = INITIAL_SPEED;
    this.scoreEl.textContent = "0";
    this.state = STATE.PLAYING;
    this._showScreen(STATE.PLAYING);
    this._lastTick = 0;
    requestAnimationFrame((t) => this._loop(t));
  }

  _onDirection(dir) {
    if (this.state === STATE.PLAYING) {
      this.snake.setDirection(dir);
    }
  }

  _loop(timestamp) {
    if (this.state !== STATE.PLAYING) return;

    if (timestamp - this._lastTick >= this.speed) {
      this._lastTick = timestamp;
      this._tick();
    }

    if (this.state === STATE.PLAYING) {
      this._render();
      requestAnimationFrame((t) => this._loop(t));
    }
  }

  _tick() {
    this.snake.update();

    if (!this.snake.alive) {
      this._gameOver();
      return;
    }

    const head = this.snake.getHead();
    const foodPos = this.food.getPosition();

    if (head.x === foodPos.x && head.y === foodPos.y) {
      this.snake.grow();
      this.score++;
      this.scoreEl.textContent = this.score;
      this.speed = Math.max(MIN_SPEED, this.speed - SPEED_INCREMENT);
      this.food.spawn(this.snake);
    }
  }

  _render() {
    const ctx = this.ctx;
    const cs = this.cellSize;

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= this.cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cs, 0);
      ctx.lineTo(x * cs, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= this.rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cs);
      ctx.lineTo(this.canvas.width, y * cs);
      ctx.stroke();
    }

    const fp = this.food.getPosition();
    ctx.fillStyle = "#e94560";
    ctx.shadowColor = "#e94560";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(fp.x * cs + cs / 2, fp.y * cs + cs / 2, cs / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    this.snake.body.forEach((seg, i) => {
      const ratio = 1 - i / (this.snake.body.length + 5);
      const g = Math.floor(200 * ratio + 55);
      ctx.fillStyle = i === 0 ? "#0f3460" : `rgb(15, ${g}, 96)`;
      ctx.fillRect(seg.x * cs + 1, seg.y * cs + 1, cs - 2, cs - 2);
    });
  }

  _gameOver() {
    this.state = STATE.GAMEOVER;
    this.finalScoreEl.textContent = this.score;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("snakeHighScore", String(this.highScore));
      this.highScoreEl.textContent = this.highScore;
    }

    this._showScreen(STATE.GAMEOVER);
  }

  _showScreen(state) {
    this.menuScreen.classList.toggle("hidden", state !== STATE.MENU);
    this.gameOverScreen.classList.toggle("hidden", state !== STATE.GAMEOVER);
    this.gameUI.classList.toggle("hidden", state === STATE.MENU);
  }
}

new Game();
