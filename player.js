"use strict";

class Player {
  id = "";
  position = 1;
  color = "";

  constructor(id, color) {
    this.id = id;
    this.color = color;
  }

  getCurrentTile(tiles) {
    return tiles.find((tile) => tile.index == this.position);
  }

  getCurrentPosition() {
    return this.position;
  }

  movePlayer(numberOfPosition, upOrDown) {
    if (upOrDown == "up") {
      this.position += numberOfPosition;
    } else if (upOrDown == "down") {
      this.position -= numberOfPosition;
    } else {
      return this.position;
    }
  }

  reset() {
    this.position = 1;
  }

  showPlayer(tiles) {
    const currentTile = this.getCurrentTile(tiles);
    if (!currentTile) {
      return;
    }
    let center = currentTile.getCenter();
    context.fillStyle = this.color;
    context.strokeStyle = "#000";
    context.beginPath();
    context.arc(center[0], center[1], 8, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.stroke();
  }
}