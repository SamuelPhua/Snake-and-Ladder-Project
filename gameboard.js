"use strict";

class Gameboard {
  board = [];
  players = [];
  constructor(board, players) {
    this.board = board;
    this.players = players;
  }

  displayBoard(context) {
    return this.board.forEach((tile) => tile.showTile(context));
  }

  displayPlayers() {
    this.players.forEach((player) => player.showPlayer(this.board));
  }

  displaySnakeAndLadders(context) {
    this.board.forEach((tile) => {
      if (tile.snakeOrLadder != "none") {
        let myCenter = tile.getCenter();
        let nextCenter;
        if (tile.snakeOrLadder == "ladder") {
          nextCenter =
            this.board[tile.index + tile.positionJump - 1].getCenter(); // The -1 is there is to align the index of board to be the same as index of the tile
          context.strokeStyle = "#2a9d8f";
        } else {
          nextCenter =
            this.board[tile.index - tile.positionJump - 1].getCenter();
          context.strokeStyle = "#e76f51";
        }
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(myCenter[0], myCenter[1]);
        context.lineTo(nextCenter[0], nextCenter[1]);
        context.stroke();
      }
    });
  }

  resetGame(newBoard) {
    this.players.forEach((player) => player.reset());
    this.board = newBoard;
  }
}