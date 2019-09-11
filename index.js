
const canvas = document.getElementById('canvas'),
      nextGen = document.getElementById('next-gen'),
      run = document.getElementById('run'),
      stop = document.getElementById('stop'),
      seed = document.getElementById('seed'),
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
  registerEventListeners();

}

function registerEventListeners() {

  canvas.onclick = e => {

    const cellX = Math.floor(e.layerX / cellSize);
    const cellY = Math.floor(e.layerY / cellSize);

    currentState[cellX][cellY] = !currentState[cellX][cellY];
    drawCellsFromState();

  };

  nextGen.onclick = () => {
    currentState = calculateNextState();
    drawCellsFromState();
  };

  run.onclick = () => {
    animation = window.requestAnimationFrame(doStep);
  };

  stop.onclick = () => {
    window.cancelAnimationFrame(animation);
  };

  reset.onclick = () => {
    window.cancelAnimationFrame(animation);
    currentState = initializeState();
    drawCellsFromState();
  };

  seed.onclick = () => {
    window.cancelAnimationFrame(animation);
    currentState = initializeState();
    drawAcorn();
    drawCellsFromState();
  }

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

function drawAcorn() {

  const hStart = amountOfCells / 2 + 10;
  const vStart = amountOfCells / 2;

  [
    [hStart, vStart],
    [hStart + 1, vStart],
    [hStart + 1, vStart - 2],
    [hStart + 3, vStart - 1],
    [hStart + 4, vStart],
    [hStart + 5, vStart],
    [hStart + 6, vStart]
  ].forEach(pos => {
    currentState[pos[0]][pos[1]] = true;
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
      nextState[rowIdx][colIdx] = shouldCellLive(rowIdx, colIdx, val);
    });
  });

  return nextState;

}

function shouldCellLive(row, col, isCurrentlyAlive) {

  const aliveCells = getAliveNeighborsForCell(row, col);

  return isCurrentlyAlive
    ? aliveCells === 2 || aliveCells === 3
    : aliveCells === 3;

}

function getAliveNeighborsForCell(row, col) {

  var count = 0;
  const possibleNeighbors = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1]
  ];

  return possibleNeighbors.reduce((acc, next) => {

    acc = isInsideGrid(next[0], next[1]) && currentState[next[0]][next[1]]
      ? acc += 1
      : acc;

    return acc;

  }, 0);

}

function isInsideGrid(row, col) {
  return row > -1 && row < amountOfCells && col > -1 && col < amountOfCells;
}

setup();
