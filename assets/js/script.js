const canvas = document.getElementById("gameCanvas");
canvas.width = 96 * 3;
canvas.height = 208 * 3;
const ctx = canvas.getContext("2d");

const canvasNext = document.getElementById("nextColumn");
canvasNext.width = 16 * 3;
canvasNext.height = 16 * 3 * 3;
const ctxNext = canvasNext.getContext("2d");
ctxNext.fillRect(0, 0, canvasNext.width, canvasNext.height);

const canvasScore = document.getElementById("score");
canvasScore.width = 16 * 3 * 3;
canvasScore.height = 16 * 3;
const ctxScore = canvasScore.getContext("2d");
ctxScore.fillRect(0, 0, canvasScore.width, canvasScore.height);

const canvasLevel = document.getElementById("level");
canvasLevel.width = 16 * 3 * 3;
canvasLevel.height = 16 * 3;
const ctxLevel = canvasLevel.getContext("2d");
ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height);

const bgBoard = new Image();
bgBoard.src = "/assets/img/table.png"; 
bgBoard.onload = () => {
  bgBoard.isReady = true;
};

function drawBoard() {
  if (bgBoard.isReady) {
    ctx.drawImage(bgBoard, 0, 0, canvas.width, canvas.height);
  }
}

function drawScore() {
  ctxScore.fillStyle = "black";
  ctxScore.fillRect(0, 0, canvasScore.width, canvasScore.height);
  ctxScore.fillStyle = 'white';
  ctxScore.font = "30px Arial"; 
  ctxScore.fillText(score, 30, 30);
}

function drawLevel() {
  ctxLevel.fillStyle = "black";
  ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height); 
  ctxLevel.fillStyle = "white";
  ctxLevel.font = "30px Arial";
  ctxLevel.fillText(level, 30, 30); 
}

function drawNextColumn() {
  ctxNext.fillStyle = "black";
  ctxNext.fillRect(0, 0, canvasNext.width, canvasNext.height);
  for (let i = 0; i < nextColumn.length; i++) {
    ctxNext.drawImage(colors[nextColumn[i]], 0, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctxNext.strokeRect(0, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

const audioRotate = new Audio();
audioRotate.src = "/assets/audio/rotate.wav";
const audioDrop = new Audio();
audioDrop.src = "/assets/audio/drop.wav";
const audioJewels = new Audio();
audioJewels.src = "/assets/audio/jewels.wav";
const audioGameOver = new Audio();
audioGameOver.src = "/assets/audio/gameover.mp3";
const audio = new Audio();
audio.src = "/assets/audio/clotho.flac";

function playAudio() {
    audio.play();
}

audio.addEventListener("canplaythrough", () => {
  playAudio();
});

const red = new Image();
red.src = "/assets/img/red.png";
const yellow = new Image();
yellow.src = "/assets/img/yellow.png";
const orange = new Image();
orange.src = "/assets/img/orange.png";
const green = new Image();
green.src = "/assets/img/green.png";
const purple = new Image();
purple.src = "/assets/img/purple.png";
const blue = new Image();
blue.src = "/assets/img/blue.png";

const COLS = 6; 
const ROWS = 13; 
const TILE_SIZE = 16 * 3; 
const colors = [red, yellow, orange, green, purple, blue];

function generateNewColumn() {
  return [
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length)
  ];
}

let fallingColumn = generateNewColumn(); 
let nextColumn = generateNewColumn();
let columnYPosition = TILE_SIZE * -3; 
let columnXPosition = TILE_SIZE * 3; 
let isColumnFalling = true; 
let fixedTiles = [];

let currentInterval;

let originalSpeed = 500; 
let fastSpeed = 30; 
let isFallingFast = false;

let score = 0;
let level = 0;

function resetGame() {
  audio.play();
  score = 0;
  level = 0;
  originalSpeed = 500;
  fallingColumn = generateNewColumn(); 
  columnYPosition = TILE_SIZE * -3; 
  columnXPosition = TILE_SIZE * 3; 
  isColumnFalling = true; 
  fixedTiles = [];
}

function drawFallingColumnAt(yPosition, xPosition) {
  for (let i = 0; i < fallingColumn.length; i++) {
    ctx.drawImage(colors[fallingColumn[i]], xPosition, yPosition + i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeRect(xPosition, yPosition + i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function drawFixedTiles() {
  for (let i = 0; i < fixedTiles.length; i++) {
    const tile = fixedTiles[i];
    ctx.drawImage(tile.color, tile.xPosition, tile.yPosition, TILE_SIZE, TILE_SIZE); 
    ctx.strokeRect(tile.xPosition, tile.yPosition, TILE_SIZE, TILE_SIZE);
  }
}

function checkCollision() {
  for (let i = 0; i < fixedTiles.length; i++) {
    const fixedTile = fixedTiles[i];
    if (
      columnXPosition < fixedTile.xPosition + TILE_SIZE &&
      columnXPosition + TILE_SIZE > fixedTile.xPosition &&
      columnYPosition < fixedTile.yPosition + TILE_SIZE &&
      columnYPosition + TILE_SIZE * fallingColumn.length > fixedTile.yPosition
    ) {
      return {
        bottom: columnYPosition + TILE_SIZE * fallingColumn.length > fixedTile.yPosition,
        left: columnXPosition + TILE_SIZE > fixedTile.xPosition && columnXPosition < fixedTile.xPosition + TILE_SIZE,
        right: columnXPosition < fixedTile.xPosition + TILE_SIZE && columnXPosition + TILE_SIZE > fixedTile.xPosition
      };
    }
  }
  return null;
}

function checkGameOver() {
  for (let i = 0; i < fixedTiles.length; i++) {
    const row = fixedTiles[i].yPosition / TILE_SIZE;
    if (row < 3) {
      return true;
    }
  }
  return false;
}

document.addEventListener('keydown', (event) => {
  if (!isColumnFalling) return;

  switch (event.key) {
    case 'ArrowLeft':
      if (columnXPosition > 0) {
        columnXPosition -= TILE_SIZE;
        if (checkCollision()?.left) {
          columnXPosition += TILE_SIZE; 
        }
      }
      break;

    case 'ArrowRight':
      if (columnXPosition + TILE_SIZE < canvas.width) {
        columnXPosition += TILE_SIZE;
        if (checkCollision()?.right) {
          columnXPosition -= TILE_SIZE; 
        }
      }
      break;

    case 'ArrowUp':
      audioRotate.play();
      rotateColumn();
      break;

    case 'ArrowDown':
      if (!isFallingFast) {
        isFallingFast = true;
        startFalling(fastSpeed);
      }
      break;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowDown') {
    if (isFallingFast) { 
      isFallingFast = false; 
      startFalling(originalSpeed); 
    }
  }
});

function rotateColumn() { 
  const top = fallingColumn.pop(); 
  fallingColumn.unshift(top); 
}

let comboCount = 0; 
let comboDelay = 900; 
let lastLevel = 0;

function processTileCombinations() {
  let tilesToRemove = new Set();
  let hasCombinations = false;

  // Crear una matriz temporal del tablero para facilitar las búsquedas
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // Llenar la matriz con los colores y posiciones de las tiles fijas
  fixedTiles.forEach(tile => {
    const row = tile.yPosition / TILE_SIZE;
    const col = tile.xPosition / TILE_SIZE;
    board[row][col] = tile;
  });

  // Comprobar combinaciones horizontales
  for (let row = 0; row < ROWS; row++) {
    let consecutiveTiles = [];
    for (let col = 0; col < COLS; col++) {
      const currentTile = board[row][col];
      if (currentTile && (consecutiveTiles.length === 0 || currentTile.color === consecutiveTiles[0].color)) {
        consecutiveTiles.push(currentTile);
      } else {
        if (consecutiveTiles.length >= 3) {
          hasCombinations = true;
          consecutiveTiles.forEach(tile => tilesToRemove.add(tile));
        }
        consecutiveTiles = currentTile ? [currentTile] : [];
      }
    }
    // Verificar al final de la fila
    if (consecutiveTiles.length >= 3) {
      hasCombinations = true;
      consecutiveTiles.forEach(tile => tilesToRemove.add(tile));
    }
  }

  // Comprobar combinaciones verticales
  for (let col = 0; col < COLS; col++) {
    let consecutiveTiles = [];
    for (let row = 0; row < ROWS; row++) {
      const currentTile = board[row][col];
      if (currentTile && (consecutiveTiles.length === 0 || currentTile.color === consecutiveTiles[0].color)) {
        consecutiveTiles.push(currentTile);
      } else {
        if (consecutiveTiles.length >= 3) {
          hasCombinations = true;
          consecutiveTiles.forEach(tile => tilesToRemove.add(tile));
        }
        consecutiveTiles = currentTile ? [currentTile] : [];
      }
    }
    // Verificar al final de la columna
    if (consecutiveTiles.length >= 3) {
      hasCombinations = true;
      consecutiveTiles.forEach(tile => tilesToRemove.add(tile));
    }
  }

  // Comprobar combinaciones en diagonal descendente (\)
  for (let row = 0; row < ROWS - 2; row++) {
    for (let col = 0; col < COLS - 2; col++) {
      const currentTile = board[row][col];
      if (
        currentTile &&
        board[row + 1][col + 1] && board[row + 2][col + 2] &&
        currentTile.color === board[row + 1][col + 1].color &&
        currentTile.color === board[row + 2][col + 2].color
      ) {
        hasCombinations = true;
        tilesToRemove.add(currentTile);
        tilesToRemove.add(board[row + 1][col + 1]);
        tilesToRemove.add(board[row + 2][col + 2]);
      }
    }
  }

  // Comprobar combinaciones en diagonal ascendente (/)
  for (let row = 2; row < ROWS; row++) {
    for (let col = 0; col < COLS - 2; col++) {
      const currentTile = board[row][col];
      if (
        currentTile &&
        board[row - 1][col + 1] && board[row - 2][col + 2] &&
        currentTile.color === board[row - 1][col + 1].color &&
        currentTile.color === board[row - 2][col + 2].color
      ) {
        hasCombinations = true;
        tilesToRemove.add(currentTile);
        tilesToRemove.add(board[row - 1][col + 1]);
        tilesToRemove.add(board[row - 2][col + 2]);
      }
    }
  }

  // Si hay combinaciones, eliminarlas y aplicar la gravedad
  if (hasCombinations) {
    comboCount++; 
    score += tilesToRemove.size * 10;
    audioJewels.play();
    removeTilesAndApplyGravity(tilesToRemove);

    // Verifica si el score alcanzó un múltiplo de 500 para actualizar el nivel
    if (score >= 500 * (lastLevel + 1)) {
      level++; 
      lastLevel = level; 
      drawLevel(); 

      // Incrementar la velocidad al subir de nivel
      if (originalSpeed > 100) { 
        originalSpeed -= 50; 
        startFalling(originalSpeed); 
      }
    }

    // Llamar recursivamente con una pausa para eliminar el siguiente combo, si hay
    setTimeout(processTileCombinations, comboDelay); 
  } else {
    // Si no hay más combinaciones, generar una nueva columna después de una breve pausa
    if (comboCount === 0) {
      audioDrop.play(); 
    }
    comboCount = 0;
    fallingColumn = generateNewColumn();
    columnYPosition = TILE_SIZE * -3;
    columnXPosition = TILE_SIZE * 3;
    isColumnFalling = true;
  }
}

function removeTilesAndApplyGravity(tilesToRemove) {
  
  fixedTiles = fixedTiles.filter(tile => !tilesToRemove.has(tile));
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  fixedTiles.forEach(tile => {
    const row = tile.yPosition / TILE_SIZE;
    const col = tile.xPosition / TILE_SIZE;
    board[row][col] = tile;
  });

  // Aplicar gravedad: hacer que las tiles superiores caigan
  for (let col = 0; col < COLS; col++) {
    let emptyRow = ROWS - 1;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col]) {
        const tile = board[row][col];
        if (row !== emptyRow) {
          tile.yPosition = emptyRow * TILE_SIZE;
        }
        emptyRow--;
      }
    }
  }
}

function handleColumnFixed() {
  // Guardar cada tile de la columna de forma individual
  for (let i = 0; i < fallingColumn.length; i++) {
    fixedTiles.push({
      color: colors[fallingColumn[i]], 
      yPosition: columnYPosition + i * TILE_SIZE, 
      xPosition: columnXPosition 
    });
  }

  // Procesar eliminaciones y aplicar gravedad
  processTileCombinations();

  // Verificar si alguna columna fija ha llegado a la parte superior del tablero (Game Over)
  setTimeout(() => {
    if (checkGameOver()) {
      audio.pause();
      audio.currentTime = 0;
      audioGameOver.play();
      alert("Game Over!");
      resetGame(); 
    } else {
      // Primero actualizar la columna actual a la siguiente
      fallingColumn = [...nextColumn];
      
      // Generar una nueva columna para el "Next"
      nextColumn = generateNewColumn();

      // Redibujar la próxima columna en el canvas Next
      drawNextColumn(); 

      // Redibujar la nueva columna actual
      columnYPosition = TILE_SIZE * -3; 
      columnXPosition = TILE_SIZE * 3;
      isColumnFalling = true;
    }
  }, 1500);
}

function update() {
  // Borrar
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxScore.clearRect(0, 0, canvasScore.width, canvasScore.height);
  ctxLevel.clearRect(0, 0, canvasLevel.width, canvasLevel.height);
  ctxNext.clearRect(0, 0, canvasNext.width, canvasNext.height);
  // Dibujar
  drawBoard();
  drawScore();
  drawLevel();
  drawFixedTiles();
  drawNextColumn();

  // Si la columna está cayendo, actualizar su posición
  if (isColumnFalling) {
    // Dibujar la columna en su nueva posición
    drawFallingColumnAt(columnYPosition, columnXPosition);

    // Actualizar la posición Y de la columna
    columnYPosition += TILE_SIZE / 2;

    // Verificar colisiones con columnas fijas
    const collision = checkCollision();
    if (collision) {
      if (collision.bottom) {
        columnYPosition -= TILE_SIZE / 2;
        isColumnFalling = false;
        handleColumnFixed();
        return;
      }

      if (collision.right) {
        columnXPosition -= TILE_SIZE;
      } else if (collision.left) {
        columnXPosition += TILE_SIZE;
      }
    }

    // Si la columna alcanza el fondo del tablero sin colisión
    if (columnYPosition + TILE_SIZE * fallingColumn.length > canvas.height) {
      columnYPosition = canvas.height - TILE_SIZE * fallingColumn.length;
      isColumnFalling = false;
      handleColumnFixed();
    }
  }
}

function startFalling(speed) {
  clearInterval(currentInterval); 
  currentInterval = setInterval(update, speed); 
}

startFalling(originalSpeed);
