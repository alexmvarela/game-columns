const canvas = document.getElementById("gameCanvas");
canvas.width = 96 * 3;
canvas.height = 208 * 3;
const ctx = canvas.getContext("2d");

const canvasNext = document.getElementById("nextColumn");
canvasNext.width = 16 * 3;
canvasNext.height = 16 * 3 * 3;
const ctxNext = canvasNext.getContext("2d");

const canvasScore = document.getElementById("score");
canvasScore.width = 16 * 3 * 3;
canvasScore.height = 16 * 3;
const ctxScore = canvasScore.getContext("2d");

const canvasLevel = document.getElementById("level");
canvasLevel.width = 16 * 3 * 3;
canvasLevel.height = 16 * 3;
const ctxLevel = canvasLevel.getContext("2d");

const bgBoard = new Image();
bgBoard.src = "/assets/img/table.png"; 
bgBoard.onload = () => {
  bgBoard.isReady = true;
};

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

const audioRotate = new Audio();
audioRotate.src = "/assets/audio/rotate.wav";
audioRotate.volume = 0.5;
const audioDrop = new Audio();
audioDrop.src = "/assets/audio/drop.wav";
const audioJewels = new Audio();
audioJewels.src = "/assets/audio/jewels.wav";
const audioLevelUp = new Audio();
audioLevelUp.src = "/assets/audio/levelup.mp3";
const audioGameOver = new Audio();
audioGameOver.volume = 0.5;
audioGameOver.src = "/assets/audio/gameover.mp3";
const audio = new Audio();
audio.src = "/assets/audio/clotho.flac";
audio.volume = 0.5;
audio.loop = true;

const COLS = 6; 
const ROWS = 13; 
const TILE_SIZE = 16 * 3; 
const colors = [red, yellow, orange, green, purple, blue];

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

let isGameStarted = false;
let isGamePaused = false;
let isGameOver = false; 

let comboCount = 0; 
let comboDelay = 900; 
let lastLevel = 0;

function playAudio() {
  audio.play();
}

function drawBoard() {
  if (bgBoard.isReady) {
    ctx.drawImage(bgBoard, 0, 0, canvas.width, canvas.height);
  }
}

function drawScore() {
  ctxScore.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctxScore.fillRect(0, 0, canvasScore.width, canvasScore.height);
  ctxScore.fillStyle = 'white';
  ctxScore.font = "30px Arial"; 
  ctxScore.fillText(score, 30, 30);
}

function drawLevel() {
  ctxLevel.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height); 
  ctxLevel.fillStyle = "white";
  ctxLevel.font = "30px Arial";
  ctxLevel.fillText(level, 30, 30); 
}

function drawNextColumn() {
  ctxNext.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctxNext.fillRect(0, 0, canvasNext.width, canvasNext.height);
  for (let i = 0; i < nextColumn.length; i++) {
    ctxNext.drawImage(colors[nextColumn[i]], 0, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctxNext.strokeRect(0, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function drawInitialScreen() {
  const font = new FontFaceObserver('Press Start 2P');

  font.load().then(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.font = "32px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("COLUMNS", canvas.width / 2, canvas.height / 2 -200); 
    ctx.font = "17px Roboto";
    ctx.fillStyle = "white";
    ctx.fillText("Similar to Tetris, the objective is", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText("to align falling blocks and match", canvas.width / 2, canvas.height / 2 - 75);
    ctx.fillText("3 or more gems of the same color,", canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText("either vertically, horizontally or", canvas.width / 2, canvas.height / 2 - 25); 
    ctx.fillText("diagonally.", canvas.width / 2, canvas.height / 2);
    ctx.font = "18px 'Press Start 2P'";
    ctx.fillStyle = "yellow";
    ctx.fillText("PRESS [Space]", canvas.width / 2, canvas.height - 100); 
    ctx.fillText("TO START", canvas.width / 2, canvas.height - 70);
  });
}

function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "yellow"
  ctx.font = "32px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("COLUMNS", canvas.width / 2, canvas.height / 2 -200); 
  ctx.font = "25px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
  ctx.font = "18px 'Press Start 2P'";
  ctx.fillStyle = "yellow";
  ctx.fillText("PRESS [Space]", canvas.width / 2, canvas.height - 100);
  ctx.fillText("TO RESUME", canvas.width / 2, canvas.height - 70);
}

function drawGameOverScreen() {
  ctx.fillStyle = "yellow";
  ctx.font = "32px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("COLUMNS", canvas.width / 2, canvas.height / 2 -200); 
  ctx.font = "25px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "18px 'Press Start 2P'";
  ctx.fillStyle = "yellow";
  ctx.fillText("PRESS [Space]", canvas.width / 2, canvas.height - 100);
  ctx.fillText("TO RESTART", canvas.width / 2, canvas.height - 70);  
}

function generateNewColumn() {
  return [
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length),
    Math.floor(Math.random() * colors.length)
  ];
}

function resetGame() {
  score = 0;
  level = 0;
  originalSpeed = 500;
  fallingColumn = generateNewColumn(); 
  nextColumn = generateNewColumn();
  columnYPosition = TILE_SIZE * -3; 
  columnXPosition = TILE_SIZE * 3; 
  fixedTiles = [];
  isGameStarted = false;
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
    const tile = fixedTiles[i];
    if (tile.yPosition < 0) {
      return true;
    }
  }
  return false;
}

function rotateColumn() { 
  audioRotate.play();
  const top = fallingColumn.pop(); 
  fallingColumn.unshift(top); 
} 

document.addEventListener('keydown', (event) => {
  
  if (isGameOver && event.key === ' ') {
    isGameOver = false;
    audioGameOver.pause();
    audioGameOver.currentTime = 0;
    return;
  }

  if (!isGameStarted && event.key === ' ') {
    isGameStarted = true;
    playAudio();
    isColumnFalling = true;
    startFalling(originalSpeed);
    return;
  }

  if (!isColumnFalling) return;

  switch (event.key) {
    case 'ArrowLeft':
      if (columnXPosition > 0 && !isGamePaused) {
        columnXPosition -= TILE_SIZE;
        if (checkCollision()?.left) {
          columnXPosition += TILE_SIZE; 
        }
      }
      break;

    case 'ArrowRight':
      if (columnXPosition + TILE_SIZE < canvas.width && !isGamePaused) {
        columnXPosition += TILE_SIZE;
        if (checkCollision()?.right) {
          columnXPosition -= TILE_SIZE; 
        }
      }
      break;

    case 'ArrowUp':
      if (isGameStarted && !isGamePaused) rotateColumn();
      break;

    case 'ArrowDown':
      if (!isFallingFast && !isGamePaused) {
        isFallingFast = true;
        startFalling(fastSpeed);
      }
      break;

    case ' ':
      if (isGameStarted) {
        isGamePaused = !isGamePaused;
        if (isGamePaused) audio.pause();
        if (!isGamePaused) audio.play();
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

function processTileCombinations() {
  let tilesToRemove = new Set();
  let hasCombinations = false;

  // Crear una matriz temporal del tablero para facilitar las búsquedas
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // Llenar la matriz con los colores y posiciones de las tiles fijas
  fixedTiles.forEach(tile => {
    const row = Math.floor(tile.yPosition / TILE_SIZE);
    const col = Math.floor(tile.xPosition / TILE_SIZE);
    if (row >= 0 && row < board.length && col >= 0 && col < board[row].length) {
        board[row][col] = tile;
    }
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
      audioLevelUp.play();
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
  if (checkGameOver()) {
    isGameOver = true;
    isGameStarted = false;
    audio.pause();
    audio.currentTime = 0;
    audioGameOver.play();
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
}

function startFalling(speed) {
  clearInterval(currentInterval); 
  currentInterval = setInterval(update, speed); 
}

function update() {
  if (isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawGameOverScreen();
    return;
  }
  
  if (!isGameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInitialScreen();
    ctxScore.clearRect(0, 0, canvasScore.width, canvasScore.height);
    ctxLevel.clearRect(0, 0, canvasLevel.width, canvasLevel.height);
    ctxNext.clearRect(0, 0, canvasNext.width, canvasNext.height);
    ctxNext.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctxNext.fillRect(0, 0, canvasNext.width, canvasNext.height);
    ctxScore.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctxScore.fillRect(0, 0, canvasScore.width, canvasScore.height);
    ctxLevel.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height); 
    return;
  }

  if (isGamePaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawFixedTiles();
    drawFallingColumnAt(columnYPosition, columnXPosition);
    drawPauseScreen();
    return;
  }
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

update();
