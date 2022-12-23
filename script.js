"use strict";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const BOARD_SIZE = 10;
const TILE_SIZE = 68;
const TILE_COLORS = ["#264653", "#e9c46a"];


function generateBoard() {
  // Generate the game board
  const tiles = [];
  let index = 1;
  const specialTiles = getSpecialTiles();
  let direction = 1;
  /*Below enters a for loop that iterates over the rows of the board. For each row, it initializes variables x and y which are used to determine the position of the tile on the canvas element.
  **It then enters a second for loop that iterates over the columns of the board.
  */
  for (let rows = 0; rows < BOARD_SIZE; rows++) {
    let x = 0;
    let y = rows * TILE_SIZE;
    for (let columns = 0; columns < BOARD_SIZE; columns++) {
      let snakeOrLadder = "none";
      let positionJump = 0;
      // get snake and ladder
      const isTileSpecial = specialTiles.find(
        (specialTile) => specialTile.index == index //uses the find method to check if the current index is a special tile by searching the specialTiles array for an object with a matching index.
      );
      if (isTileSpecial) {
        // special tile
        snakeOrLadder = isTileSpecial.type;
        positionJump = Number(isTileSpecial.jump); //If a matching object is found, the function sets the values of snakeOrLadder and positionJump based on the type and jump value of the special tile.
      }
      const tile = new Tile(
        index,
        snakeOrLadder,
        positionJump,
        x,
        y,
        TILE_SIZE,
        TILE_COLORS[(rows + columns) % TILE_COLORS.length]
      );
      tiles.push(tile);
      index++;
      // increase x and y axis
      /* It uses a variable called direction to switch between positive and negative increments in the x axis as the tiles move across the rows.
      /**If the x coordinate exceeds the width of the canvas or falls below the size of a tile, the direction variable is multiplied by -1 and the x coordinate is adjusted accordingly. 
      /**The y coordinate is also adjusted by subtracting the size of a tile as the tiles move down the rows.
      */
      x = x + TILE_SIZE * direction;
      if (x >= canvas.width || x <= -TILE_SIZE) {
        direction *= -1;
        x += TILE_SIZE * direction;
        y -= TILE_SIZE;
      }
    }
  }
  return tiles;
}

// randomise snake and ladder
function getSpecialTiles(
  maxNumberOfJump = 9, // The maximum jump for the ladder and the snake
  numberOfSpecialTiles = 10,
  maxTileSize = BOARD_SIZE * BOARD_SIZE
) {
  let specialTilesIndex = []; // array of object

  while (specialTilesIndex.length < numberOfSpecialTiles) {
    let type = specialTilesIndex.length % 2 == 0 ? "snake" : "ladder";
    // Rule: special tiles cannot start on 1 and 100
    let randomNumber = getRandomNumber(2, maxTileSize - 1);

    // Rule: randomNumber cannot duplicate inside specialTilesIndex
    if (!specialTilesIndex.find((tiles) => tiles.index == randomNumber)) {
      // finding if randomNumber already exists in array of object with the property index
      let jump = getRandomNumber(1, maxNumberOfJump);
      // Rule: jump cannot overshot max tile size
      if (type == "ladder" && randomNumber + jump > maxTileSize) {
        jump = maxTileSize - randomNumber;
      }
      // Rule: jump cannot overshot min tile size
      if (type == "snake" && randomNumber - jump < 0) {
        jump = randomNumber + 1;
      }
      // if array dont have index
      specialTilesIndex.push({
        index: randomNumber,
        type: type,
        jump,
      });
    }
  }
  return specialTilesIndex;
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// This roll function is to change the orientation of the dices
function roll() {
  return new Promise(async (resolve, reject) => {
    let diceNum = Math.floor(Math.random() * 6) + 1;
    let values = [
      [0, -360],
      [-180, -360],
      [-180, 270],
      [0, -90],
      [270, 180],
      [90, 90],
    ];

    document.querySelector(
      "#cube-inner"
    ).style.transform = `rotateX(360deg) rotateY(360deg)`;
    await new Promise((resolve) => setTimeout(resolve, 750));
    document.querySelector("#cube-inner").style.transform = `rotateX(${
      values[diceNum - 1][0]
    }deg) rotateY(${values[diceNum - 1][1]}deg)`;
    await new Promise((resolve) => setTimeout(resolve, 750));
    resolve(diceNum);
  });
}

async function moveOnRollDice(player, board) {
  const diceRoll = await roll();
  // move player based on dice first
  player.movePlayer(diceRoll, "up");

  // move player if falls on special tile
  const playerPos = player.getCurrentPosition();
  const newTile = board.find((tile) => tile.index == playerPos);

  if (newTile.snakeOrLadder == "snake") {
    window.alert(
      `Player ${player.id} has landed on a snake -${newTile.positionJump} tiles`
    );
    player.movePlayer(newTile.positionJump, "down");
  }
  if (newTile.snakeOrLadder == "ladder") {
    window.alert(
      `Player ${player.id} has landed on a ladder +${newTile.positionJump} tiles`
    );
    player.movePlayer(newTile.positionJump, "up");
  }
}

function refreshBoard(gameBoard) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.displayBoard(context);
  gameBoard.displayPlayers();
  gameBoard.displaySnakeAndLadders(context);
}

function didPlayerWin(player, maxBoardSize = BOARD_SIZE * BOARD_SIZE) {
  if (player.getCurrentPosition() == maxBoardSize) {
    window.alert(`Congratulations Player ${player.id} has won!`);
    // show restart button
    const restartBtn = document.getElementById("restart-game-btn");
    restartBtn.style.display = "block";
    // hide roll dice button
    const rollP1Dice = document.getElementById("roll-dice-button-p1");
    rollP1Dice.style.display = "none";
    const rollP2Dice = document.getElementById("roll-dice-button-p2");
    rollP2Dice.style.display = "none";
  }
}

// Game function
async function main() {
  // Initialise the board and players
  let board = generateBoard();
  let player1 = new Player(1, "blue");
  let player2 = new Player(2, "red");
  let gameBoard = new Gameboard(board, [player1, player2]);

  // Display board and players
  refreshBoard(gameBoard);

  // Add a turn variable to keep track on whose turn it is
  let turn = 1;

  const rollP1Dice = document.getElementById("roll-dice-button-p1");
  rollP1Dice.addEventListener("click", async () => {
    if (turn === 1) {
      await moveOnRollDice(player1, board);
      refreshBoard(gameBoard);
      didPlayerWin(player1);
      turn = 2;
      rollP1Dice.style.display = "none";
      rollP2Dice.style.display = "inline-block";
    }
  });

  const rollP2Dice = document.getElementById("roll-dice-button-p2");
  rollP2Dice.addEventListener("click", async () => {
    if (turn === 2) {
      await moveOnRollDice(player2, board);
      refreshBoard(gameBoard);
      didPlayerWin(player2);
      turn = 1;
      rollP1Dice.style.display = "inline-block";
      rollP2Dice.style.display = "none";
    }
  });

  const restartBtn = document.getElementById("restart-game-btn");
  restartBtn.addEventListener("click", () => {
    gameBoard.resetGame(generateBoard());
    refreshBoard(gameBoard);
    // hide restart button
    const restartBtn = document.getElementById("restart-game-btn");
    restartBtn.style.display = "none";
    // show roll dice button
    const rollP1Dice = document.getElementById("roll-dice-button-p1");
    rollP1Dice.style.display = "inline-block";
    const rollP2Dice = document.getElementById("roll-dice-button-p2");
    rollP2Dice.style.display = "inline-block";
    turn = 1;
  });
}

main();