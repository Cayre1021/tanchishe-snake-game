import { DIRECTION } from "./snake.js";

export class InputHandler {
  constructor(onDirection) {
    this.onDirection = onDirection;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipe = 30;

    this._handleKey = this._handleKey.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);

    document.addEventListener("keydown", this._handleKey);
    document.addEventListener("touchstart", this._handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", this._handleTouchEnd, {
      passive: true,
    });
  }

  _handleKey(e) {
    const keyMap = {
      ArrowUp: DIRECTION.UP,
      ArrowDown: DIRECTION.DOWN,
      ArrowLeft: DIRECTION.LEFT,
      ArrowRight: DIRECTION.RIGHT,
      w: DIRECTION.UP,
      s: DIRECTION.DOWN,
      a: DIRECTION.LEFT,
      d: DIRECTION.RIGHT,
      W: DIRECTION.UP,
      S: DIRECTION.DOWN,
      A: DIRECTION.LEFT,
      D: DIRECTION.RIGHT,
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      this.onDirection(keyMap[e.key]);
    }
  }

  _handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  _handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;

    if (Math.abs(dx) < this.minSwipe && Math.abs(dy) < this.minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.onDirection(dx > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT);
    } else {
      this.onDirection(dy > 0 ? DIRECTION.DOWN : DIRECTION.UP);
    }
  }
}
