"use strict";

class Tile {
  index = 1;
  snakeOrLadder = "none" | "snake" | "ladder";
  positionJump = 1;

  constructor(index, snakeOrLadder, positionJump, x, y, size, color) {
    this.index = index;
    this.snakeOrLadder = snakeOrLadder;
    this.positionJump = positionJump;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  getUpOrDown() {
    return this.snakeOrLadder == "snake" ? "down" : "up";
  }

  // getting the coordinate for the center of the tiles to draw the snakes
  getCenter() {
    let centerX = this.x + this.size / 2;
    let centerY = this.y + this.size / 2;
    return [centerX, centerY];
  }

  showTile(context) {
    const tileCenter = this.getCenter();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
    context.fillStyle = "#a8dadc";
    context.fillText(
      this.index.toString(),
      tileCenter[0] - this.size / 4,
      tileCenter[1] - this.size / 4
    );
    if (this.snakeOrLadder == "snake") {
      context.fillStyle = "#e76f51";
      context.fillText(
        `snake ${this.positionJump}`,
        tileCenter[0] - 20,
        tileCenter[1]
      );
    }
    if (this.snakeOrLadder == "ladder") {
      context.fillStyle = "#2a9d8f";
      context.fillText(
        `ladder ${this.positionJump}`,
        tileCenter[0] - 20,
        tileCenter[1]
      );
    }
  }
}
