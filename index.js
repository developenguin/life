
const canvas = document.getElementById('canvas'),
      canvasSize = 200,
      cellSize = 10;

canvas.height = canvasSize;
canvas.width = canvasSize;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
ctx.lineWidth = 1;

canvas.strokeStyle = '#000000';
canvas.fillStyle = '#000000';

function setup() {
  ctx.strokeRect(0, 0, canvasSize, canvasSize);
  drawGrid();
}

function drawGrid() {

  const dividers = canvasSize / cellSize;

  for (i = 0; i < dividers; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvasSize);
    ctx.stroke();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvasSize, i * cellSize);
    ctx.stroke();
  }

}

setup();
