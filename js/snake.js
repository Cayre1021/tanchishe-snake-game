const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export class Snake {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.reset();
  }

  reset() {
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);
    this.body = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    this.direction = DIRECTION.RIGHT;
    this.nextDirection = DIRECTION.RIGHT;
    this.growing = false;
    this.alive = true;
  }

  setDirection(dir) {
    const isOpposite =
      dir.x + this.direction.x === 0 && dir.y + this.direction.y === 0;
    if (!isOpposite) {
      this.nextDirection = dir;
    }
  }

  update() {
    this.direction = this.nextDirection;
    const head = this.body[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    if (
      newHead.x < 0 ||
      newHead.x >= this.cols ||
      newHead.y < 0 ||
      newHead.y >= this.rows
    ) {
      this.alive = false;
      return;
    }

    for (const segment of this.body) {
      if (segment.x === newHead.x && segment.y === newHead.y) {
        this.alive = false;
        return;
      }
    }

    this.body.unshift(newHead);
    if (!this.growing) {
      this.body.pop();
    }
    this.growing = false;
  }

  grow() {
    this.growing = true;
  }

  getHead() {
    return this.body[0];
  }

  occupies(x, y) {
    return this.body.some((s) => s.x === x && s.y === y);
  }
}
