const BOARD_WIDTH = 10, BOARD_HEIGHT = 22;
const TILE_SIZE = 32;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  background(250);

  noStroke();
  fill(255);
  rect(width / 2 - BOARD_WIDTH * TILE_SIZE / 2, height / 2 - BOARD_HEIGHT * TILE_SIZE / 2, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE);

  stroke(200);
  noFill();
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      rect(width / 2 - BOARD_WIDTH * TILE_SIZE / 2 + TILE_SIZE * x, height / 2 - BOARD_HEIGHT * TILE_SIZE / 2 + TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
    }
  }

  stroke(0);
  rect(width / 2 - BOARD_WIDTH * TILE_SIZE / 2, height / 2 - BOARD_HEIGHT * TILE_SIZE / 2, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE);

}