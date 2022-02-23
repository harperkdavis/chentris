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

let longTime = -1;
let shortTime = -1;

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
];

let gameSpeed = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);

  nathanImage = loadImage('https://i.imgur.com/Bx6Eeih.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function update() {

  if (longTime > 0 || shortTime > 0) {
    longTime -= 1;
    shortTime -= keys[DOWN_ARROW] > 0 ? 10 : 1;

    if (longTime < 0 || shortTime < 0) {

      const size = activePiece.length;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          if (activePiece[y][x]) {
            board[pieceY + y][pieceX + x] = activeIndex + 1;
          }
        }
      }

      activeIndex = floor(random(0, pieces.length));
      activePiece = pieces[activeIndex].layout;
      
      pieceX = 1;
      pieceY = 1;

      longTime = -1;
      shortTime = -1;
    }
  }

  if (keys[LEFT_ARROW] == 0 || (keys[LEFT_ARROW] > 4 && keys[LEFT_ARROW] % 4 == 0)) {
    moveLeft();
    if (shortTime > 0) {
      shortTime = gameSpeed * 2;
    }
  }
  if (keys[RIGHT_ARROW] == 0 || (keys[RIGHT_ARROW] > 4 && keys[RIGHT_ARROW] % 4 == 0)) {
    moveRight();
    if (shortTime > 0) {
      shortTime = gameSpeed * 2;
    }
  }
  if (keys[UP_ARROW] == 0 || (keys[UP_ARROW] > 4 && keys[UP_ARROW] % 4 == 0)) {
    rotateRight();
    if (shortTime > 0) {
      shortTime = gameSpeed * 2;
    }
  }

  if (keys[DOWN_ARROW] > 0) {
    if (keys[DOWN_ARROW] % 4 == 0) {
      moveDown();
    }
  } else if (frameCount % gameSpeed === 0) {
    moveDown();
  }

  if (collision(activePiece, pieceX, pieceY + 1)) {
    if (longTime < 0) {
      longTime = gameSpeed * 6;
      shortTime = gameSpeed * 2;
    }
  } else {
    longTime = -1;
    shortTime = -1;
  }

  Object.keys(keys).forEach(key => {
    if (keys[key] >= 0) {
      keys[key] += 1;
    }
  });

}


function draw() {
  update();
  background(250);

  const boardX = width / 2 - BOARD_WIDTH * TILE_SIZE / 2;
  const boardY = height / 2 - BOARD_HEIGHT * TILE_SIZE / 2;
  const boardWidth = BOARD_WIDTH * TILE_SIZE;
  const boardHeight = BOARD_HEIGHT * TILE_SIZE;

  push();
  translate(boardX, boardY);

  noStroke();
  fill(255);
  rect(0, 0, boardWidth, boardHeight);

  
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      
      let tile = board[y][x];
      if (tile > 0) {
        let col = pieces[tile - 1].color;
        tint(col[0], col[1], col[2]);
        image(nathanImage, TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);

        stroke(0);
        noFill();
        rect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
      } else {
        stroke(200);
        noFill();
        rect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  stroke(0);
  rect(0, 0, boardWidth, boardHeight);
  
  fill(0);
  noStroke();
  textSize(32);
  textAlign(LEFT, BOTTOM);
  text("NathanTris ", 0, 0);

  // Draw board
  const size = activePiece.length;
  stroke(0);
  noFill();
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (activePiece[y][x]) {
        let col = pieces[activeIndex].color;
        tint(col[0], col[1], col[2], (longTime > 0) ? sin(frameCount * 0.2) * 50 + 200 : 255);
        image(nathanImage, (pieceX + x) * TILE_SIZE, (pieceY + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        rect((pieceX + x) * TILE_SIZE, (pieceY + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  pop();
}

function keyPressed() {
  keys[keyCode] = 0;
}

function keyReleased() {
  keys[keyCode] = -1;
}

function rotateRight() {
  activePiece = rotateArrayRight(activePiece);
}

function rotateArrayRight(piece) {
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
  if (!collision(activePiece, pieceX - 1, pieceY)) {
    pieceX -= 1;
  }
}

function moveRight() {
  if (!collision(activePiece, pieceX + 1, pieceY)) {
    pieceX += 1;
  }
}

function moveDown() {
  if (!collision(activePiece, pieceX, pieceY + 1)) {
    pieceY += 1;
  }
}

function collision(piece, x1, y1) {
  const size = piece.length;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (piece[y][x]) {
        if (doesCollide(x + x1, y + y1)) {
          return true;
        }
      }
    }
  }
  return false;
}

function doesCollide(x, y) {
  return (x < 0 || x > 9 || y >= 20) || (board[y][x] > 0);
}