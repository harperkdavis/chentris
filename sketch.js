const BOARD_WIDTH = 10, BOARD_HEIGHT = 20;
const TILE_SIZE = 32;

let keys = {};

const pieces = [
  
  {
    layout: [ // I-piece
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ], color: [127, 245, 233]
  },
  {
    layout: [ // J-piece
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], color: [127, 147, 245]
  },
  {
    layout: [ // L-piece
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ], color: [240, 158, 110]
  },
  {
    layout: [ // O-piece
      [1, 1],
      [1, 1]
    ], color: [240, 229, 110]
  },
  {
    layout: [ // T-piece
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], color: [177, 128, 237]
  },
  {
    layout: [ // Z-piece
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ], color: [240, 127, 146]
  },
  {
    layout: [ // S-piece
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ], color: [131, 237, 123]
  }
];

let pieceX = 1, pieceY = 1;

let activeIndex = 6;
let activePiece = JSON.parse(JSON.stringify(pieces[activeIndex].layout));

let nathanImage = undefined;

let board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let gameSpeed = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  nathanImage = loadImage('https://i.imgur.com/qNRBIvl.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function update() {
  if (keys[LEFT_ARROW] == 0 || (keys[LEFT_ARROW] > 4 && keys[LEFT_ARROW] % 2 == 0)) {
    moveLeft();
  }
  if (keys[RIGHT_ARROW] == 0 || (keys[RIGHT_ARROW] > 4 && keys[RIGHT_ARROW] % 2 == 0)) {
    moveRight();
  }
  if (keys[DOWN_ARROW] == 0 || keys[DOWN_ARROW] % 2 == 0) {
    moveDown();
  }
  if (keys[UP_ARROW] == 0 || (keys[UP_ARROW] > 4 && keys[UP_ARROW] % 2 == 0)) {
    activePiece = rotateRight(activePiece);
  }

  Object.keys(keys).forEach(key => {
    if (keys[key] >= 0) {
      keys[key] += 1;
    }
  });

  if (frameCount % gameSpeed === 0) {
    moveDown();
  }
}


function draw() {
  update();
  background(250);

  const boardX = width / 2 - BOARD_WIDTH * TILE_SIZE / 2;
  const boardY = height / 2 - BOARD_HEIGHT * TILE_SIZE / 2;
  const boardWidth = BOARD_WIDTH * TILE_SIZE;
  const boardHeight = BOARD_HEIGHT * TILE_SIZE;

  noStroke();
  fill(255);
  rect(boardX, boardY, boardWidth, boardHeight);

  stroke(200);
  noFill();
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      rect(boardX + TILE_SIZE * x, boardY + TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
    }
  }

  stroke(0);
  rect(boardX, boardY, boardWidth, boardHeight);
  
  fill(0);
  noStroke();
  textSize(32);
  textAlign(LEFT, BOTTOM);
  text("NathanTris", boardX, boardY);

  // Draw board
  const size = activePiece.length;
  stroke(0);
  noFill();
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (activePiece[y][x]) {
        let col = pieces[activeIndex].color;
        tint(col[0], col[1], col[2], sin(frameCount * 0.2) * 50 + 200);
        image(nathanImage, boardX + (pieceX + x) * TILE_SIZE, boardY + (pieceY + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        rect(boardX + (pieceX + x) * TILE_SIZE, boardY + (pieceY + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

}

function keyPressed() {
  keys[keyCode] = 0;
}

function keyReleased() {
  keys[keyCode] = -1;
}

function rotateRight(piece) {
  let rotated = JSON.parse(JSON.stringify(piece));
  const size = piece.length;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      rotated[x][size - 1 - y] = piece[y][x];
    }
  }
  return rotated;
}

function moveLeft() {
  pieceX -= 1;
}

function moveRight() {
  pieceX += 1;
}

function moveDown() {
  pieceY += 1;
}

function collision() {

}

function doesCollide(x, y) {
  
}