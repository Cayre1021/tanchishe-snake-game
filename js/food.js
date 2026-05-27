export class Food {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.position = { x: 0, y: 0 };
  }

  spawn(snake) {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
    } while (snake.occupies(x, y));
    this.position = { x, y };
  }

  getPosition() {
    return this.position;
  }
}
