
const canvas = document.getElementById('canvas'),
      nextGen = document.getElementById('next-gen'),
      run = document.getElementById('run'),
      stop = document.getElementById('stop'),
      canvasSize = 800,
      cellSize = 5,
      amountOfCells = canvasSize / cellSize;

canvas.height = canvasSize;
canvas.width = canvasSize;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
ctx.lineWidth = 1;

let currentState;
let animation;

function setup() {

  ctx.strokeStyle = '#cccccc';

  ctx.strokeRect(0, 0, canvasSize, canvasSize);
  drawGrid();
  currentState = initializeState();

  canvas.addEventListener('click', e => {

    const cellX = Math.floor(e.layerX / cellSize);
    const cellY = Math.floor(e.layerY / cellSize);

    currentState[cellX][cellY] = !currentState[cellX][cellY];
    drawCellsFromState();

  });

  nextGen.addEventListener('click', () => {
    currentState = calculateNextState();
    drawCellsFromState();
  });

  run.addEventListener('click', onClickRun);
  stop.addEventListener('click', () => {
    window.cancelAnimationFrame(animation);
  });

}

function onClickRun() {
  animation = window.requestAnimationFrame(doStep);
}

function doStep() {
  currentState = calculateNextState();
  drawCellsFromState();
  animation = window.requestAnimationFrame(doStep);
}

function drawGrid() {

  ctx.strokeStyle = '#cccccc';

  for (i = 0; i < amountOfCells; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvasSize);
    ctx.stroke();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvasSize, i * cellSize);
    ctx.stroke();
  }

}

function drawCellsFromState() {

  currentState.forEach((row, rowIdx) => {
    row.forEach((val, colIdx) => {

      if (val) {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#ffffff';
      }

      ctx.fillRect(rowIdx * cellSize + 1, colIdx * cellSize + 1, cellSize - 2, cellSize - 2)

    });
  });

}

function initializeState() {

  const state = [];

  for (i = 0; i < amountOfCells; i++) {
    state[i] = Array.apply(null, Array(amountOfCells));
  }

  return state;

}

function calculateNextState() {

  const nextState = initializeState();

  currentState.forEach((row, rowIdx) => {
    row.forEach((val, colIdx) => {
      nextState[rowIdx][colIdx] = isCellAlive(rowIdx, colIdx, val);
    });
  });

  return nextState;

}

function isCellAlive(row, col, val) {

  const aliveCells = getAliveNeighborsForCell(row, col);

  return val
    ? aliveCells === 2 || aliveCells === 3
    : aliveCells === 3;

}

function getAliveNeighborsForCell(row, col) {

  var count = 0;

  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {

      if (!(i === 0 && j === 0) && isInsideGrid(row+i, col+j)) {

        const isAlive = currentState[row+i][col+j];

        if (isAlive) {
          count++;
        }
      }
    }
  }

  return count;

}

function isInsideGrid(row, col) {
  return row > -1 && row < amountOfCells && col > -1 && col < amountOfCells;
}

setup();
