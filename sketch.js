const BOARD_WIDTH = 10, BOARD_HEIGHT = 20;
const TILE_SIZE = 32;

let keys = {};

let inMenu = true;

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

const wallKick = {
  0: {
    3: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
    1: [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
  },
  1: {
    0: [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    2: [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
  },
  2: {
    1: [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    3: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
  },
  3: {
    2: [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    0: [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
  }
}

const wallKickI = {
  0: {
    3: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [-1, 2],
      [2, -1],
    ],
    1: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [1, 2],
      [-2, -1],
    ],
  },
  1: {
    0: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    2: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
  },
  2: {
    1: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, 1],
      [1, -1],
    ],
    3: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -1],
    ],
  },
  3: {
    2: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, 2],
      [-2, -1],
    ],
    0: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, 1],
      [1, -2],
    ],
  }
}

let pieceX = 3, pieceY = -2;
let dropX = 1, dropY = 1;

let activeRot = 0;
let activeIndex = 3;
let activePiece = JSON.parse(JSON.stringify(pieces[activeIndex].layout));

let longTime = -1;
let shortTime = -1;

let nathanImage = undefined;

let board = [];

let gameSpeed = 40;

let position = {x: 0, y: 0};
let rotation = 0;
let scalar = 1;

let score = 0;
let lines = 0;

let hold = 0;
let holdDisabled = false;

let bag = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  nathanImage = loadImage('https://i.imgur.com/Bx6Eeih.png');

  if (localStorage.getItem("tetrisHighScore") == null) {
    localStorage.setItem("tetrisHighScore", 0);
  }
  reset();
}

function reset() {
  board = [];
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    let line = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
      line.push(0);
    }
    board.push(line);
  }

  bag = [];

  let newTiles = [0, 1, 2, 3, 4, 5, 6];
  newTiles = shuffle(newTiles);
    
  newTiles.forEach(tile => {
    bag.push(tile);
  });

  let newTile = bag.shift();
  activeIndex = newTile;
  activePiece = pieces[activeIndex].layout;
  activeRot = 0;

  gameSpeed = 40;

  hold = 0;
  holdDisabled = false;

  score = 0;
  lines = 0;

  pieceX = 3;
  pieceY = -2;
  dropX = 1;
  dropY = 1;

  longTime = -1;
  shortTime = -1;

  position = {x: 0, y: 0};
  rotation = 0;
  scalar = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function shiftHold() {
  if (holdDisabled) {
    return;
  }
  let temp = hold;
  hold = activeIndex;

  activeIndex = temp;
  activePiece = pieces[activeIndex].layout;
  activeRot = 0;

  pieceX = 3;
  pieceY = -2;

  longTime = -1;
  shortTime = -1;

  holdDisabled = true;
}

function update() {

  if (inMenu) {
    if (keys[80] == 0) {
      inMenu = false;
      reset();
    }
    return;
  }

  while(bag.length < 7) {
    let newTiles = [0, 1, 2, 3, 4, 5, 6];
    newTiles = shuffle(newTiles);
    
    newTiles.forEach(tile => {
      bag.push(tile);
    });
  }

  position = {x: lerp(position.x, 0, 0.1), y: lerp(position.y, 0, 0.1)};
  rotation = lerp(rotation, 0, 0.1);
  scalar = lerp(scalar, 1, 0.1);

  if (longTime >= 0 || shortTime >= 0) {
    longTime -= 1;
    shortTime -= 1;

    if (longTime < 0 || shortTime < 0) {

      const size = activePiece.length;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          if (activePiece[y][x]) {
            if (pieceY + y < 0) {
              inMenu = true;

              position = {x: 0, y: 0};
              rotation = 0;
              scalar = 1;
              
              if (score > localStorage.getItem("tetrisHighScore")) {
                localStorage.setItem("tetrisHighScore", score);
              }
              return;
            }
            board[pieceY + y][pieceX + x] = activeIndex + 1;
          }
        }
      }

      // clear lines
      let linesRemoved = 0;
      board = board.filter(line => {
        for (let i = 0; i < BOARD_WIDTH; i++) {
          if (line[i] == 0) {
            return true;
          }
        }
        linesRemoved += 1;
        return false;
      });
      for (let i = 0; i < linesRemoved; i++) {
        board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      lines += linesRemoved;
      score += linesRemoved * linesRemoved * 1000;

      position.y += linesRemoved * linesRemoved * 4;
      scalar += linesRemoved * 0.2;
      rotation += linesRemoved * 0.2;
      

      let newTile = bag.shift();
      activeIndex = newTile;
      activePiece = pieces[activeIndex].layout;
      activeRot = 0;
      
      pieceX = 3;
      pieceY = -2;

      longTime = -1;
      shortTime = -1;

      holdDisabled = false;
    }
  }

  if (keys[LEFT_ARROW] == 0 || (keys[LEFT_ARROW] > 4 && keys[LEFT_ARROW] % 4 == 0)) {
    moveLeft();
  }
  if (keys[RIGHT_ARROW] == 0 || (keys[RIGHT_ARROW] > 4 && keys[RIGHT_ARROW] % 4 == 0)) {
    moveRight();
  }
  if (keys[UP_ARROW] == 0) {
    rotatePiece(false);
  }
  if (keys[90] == 0) {
    rotatePiece(true);
  }
  if (keys[67] == 0) {
    shiftHold();
  }

  if (keys[DOWN_ARROW] > 0) {
    if (keys[DOWN_ARROW] % 4 == 0) {
      moveDown();
      position.y += 4;
    }
  } else if (frameCount % gameSpeed === 0) {
    moveDown();
  }

  dropX = pieceX;
  dropY = pieceY;

  while(!collision(activePiece, dropX, dropY)) {
    dropY += 1;
  }

  dropY -= 1;

  if (keys[32] == 0) {
    position.y -= (pieceY - dropY) * 2;
    rotation += random(-1, 1) > 0 ? 0.04 : -0.04;

    score += (dropY - pieceY) * 5;

    pieceX = dropX;
    pieceY = dropY;

    longTime = 0;
    shortTime = 0;
  }

  if (collision(activePiece, pieceX, pieceY + 1)) {
    if (longTime < 0) {
      longTime = gameSpeed * 6;
      shortTime = floor(gameSpeed * 1.5);
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
  translate(width / 2 + position.x, height / 2 + position.y);
  scale(scalar);
  rotate(rotation);
  

  noStroke();
  fill(255);
  rect(-boardWidth / 2, -boardHeight / 2, boardWidth, boardHeight);

  
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      
      stroke(200);
      noFill();
      rect(TILE_SIZE * x - boardWidth / 2, TILE_SIZE * y - boardHeight / 2, TILE_SIZE, TILE_SIZE);
    }
  }

  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      
      let tile = board[y][x];
      if (tile > 0) {
        let col = pieces[tile - 1].color;
        fill(col[0], col[1], col[2]);
        // image(nathanImage, TILE_SIZE * x - boardWidth / 2, TILE_SIZE * y - boardHeight / 2, TILE_SIZE, TILE_SIZE);

        stroke(0);
        rect(TILE_SIZE * x - boardWidth / 2, TILE_SIZE * y - boardHeight / 2, TILE_SIZE, TILE_SIZE);
      }

    }
  }
  

  stroke(0);
  noFill(0);
  rect(-boardWidth / 2, - boardHeight / 2, boardWidth, boardHeight);

  if (inMenu) {
    fill(255);
    stroke(0);
    rect(-boardWidth / 2 + TILE_SIZE, -boardHeight / 2 + TILE_SIZE, boardWidth - TILE_SIZE * 2, boardHeight - TILE_SIZE * 2);

    fill(0);
    noStroke();
    textSize(32);
    textAlign(LEFT, BOTTOM);
    textStyle(BOLD);
    text("Chentris", -boardWidth / 2, -boardHeight / 2);

    textAlign(CENTER, BOTTOM);
    textSize(24);
    text("High Score", 0, -boardHeight / 4);

    textAlign(CENTER, TOP);
    textStyle(NORMAL);
    textSize(32);
    text(localStorage.getItem("tetrisHighScore"), 0, -boardHeight / 4 + 4);

    textSize(16);
    text("Press [P] to play", 0, 0);

    textStyle(BOLD);
    text("Controls", 0, 40);

    textStyle(NORMAL);
    text("[ARROW KEYS] to move piece", 0, 60);
    text("[ARROW UP] to rotate left", 0, 80);
    text("[Z] to rotate right", 0, 100);
    text("[SPACE] to drop", 0, 120);
    text("[C] to use hold", 0, 140);
    return;
  }

  const size = activePiece.length;
  // Target
  noStroke();
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (activePiece[y][x]) {
        let col = pieces[activeIndex].color;
        fill(col[0], col[1], col[2], 110);
        rect((dropX + x) * TILE_SIZE - boardWidth / 2, (dropY + y) * TILE_SIZE - boardHeight / 2, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Nontarget
  stroke(0);
  noFill();
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (activePiece[y][x]) {
        let col = pieces[activeIndex].color;
        tint(col[0], col[1], col[2], (longTime > 0) ? sin(frameCount * 0.2) * 50 + 200 : 255);
        image(nathanImage, (pieceX + x) * TILE_SIZE - boardWidth / 2, (pieceY + y) * TILE_SIZE - boardHeight / 2, TILE_SIZE, TILE_SIZE);
        rect((pieceX + x) * TILE_SIZE - boardWidth / 2, (pieceY + y) * TILE_SIZE - boardHeight / 2, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let bagPiece = pieces[bag[i]];
    const bagSize = bagPiece.layout.length;

    for (let x = 0; x < bagSize; x++) {
      for (let y = 0; y < bagSize; y++) {
        if (bagPiece.layout[y][x]) {
          let col = bagPiece.color;
          fill(col[0], col[1], col[2]);
          stroke(0);
          rect(TILE_SIZE * x + boardWidth / 2 + TILE_SIZE, TILE_SIZE * y - boardHeight / 2 + i * (boardHeight / 5), TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  let holdPiece = pieces[hold];
  const holdSize = holdPiece.layout.length;

  for (let x = 0; x < holdSize; x++) {
    for (let y = 0; y < holdSize; y++) {
      if (holdPiece.layout[y][x]) {
        if (!holdDisabled) {
          let col = holdPiece.color;
          fill(col[0], col[1], col[2]);
        } else {
          fill(200);
        }
        stroke(0);
        rect(TILE_SIZE * x - boardWidth / 2 - TILE_SIZE * 5, TILE_SIZE * y - boardHeight / 2 + TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  fill(0);
  noStroke();
  textSize(32);
  textAlign(LEFT, BOTTOM);
  textStyle(BOLD);
  text("Chentris", -boardWidth / 2, -boardHeight / 2);

  
  textStyle(BOLD);
  textAlign(RIGHT, BOTTOM);
  textSize(16);
  text("Score", -boardWidth / 2 - 4, 0);

  textStyle(NORMAL);
  textAlign(RIGHT, TOP);
  textSize(32);
  text(score, -boardWidth / 2 - 4, 0);

  textStyle(BOLD);
  textAlign(RIGHT, BOTTOM);
  textSize(16);
  text("Lines", -boardWidth / 2 - 4, 64);

  textStyle(NORMAL);
  textAlign(RIGHT, TOP);
  textSize(32);
  text(lines, -boardWidth / 2 - 4, 64);
  
  pop();
}

function keyPressed() {
  keys[keyCode] = 0;
}

function keyReleased() {
  keys[keyCode] = -1;
}

function rotatePiece(left) {
  let newPiece = left ? rotateArrayLeft(activePiece) : rotateArrayRight(activePiece);
  let newRot = ((activeRot + 1) % 4);

  let wk;
  if (activeIndex === 0) {
    wk = wallKickI[activeRot][newRot];
  } else {
    wk = wallKick[activeRot][newRot];
  }
  
  if (activeIndex !== 3) {
    for (let i = 0; i < 5; i++) {
      let test = wk[i];
      if (!collision(newPiece, pieceX + test[0], pieceY + test[1])) {
        activePiece = newPiece;
        activeRot = newRot;
        pieceX += test[0];
        pieceY += test[1];
        break;
      }
    }
  }
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

function rotateArrayLeft(piece) {
  let rotated = JSON.parse(JSON.stringify(piece));
  const size = piece.length;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      rotated[size - 1 - x][y] = piece[y][x];
    }
  }
  return rotated;
}

function moveLeft() {
  if (!collision(activePiece, pieceX - 1, pieceY)) {
    pieceX -= 1;
    position.x -= 4;
    rotation -= 0.004;
    if (shortTime > 0) {
      shortTime = floor(gameSpeed * 1.5);
    }
  }
}

function moveRight() {
  if (!collision(activePiece, pieceX + 1, pieceY)) {
    pieceX += 1;
    position.x += 4;
    rotation += 0.004;
    if (shortTime > 0) {
      shortTime = floor(gameSpeed * 1.5);
    }
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
  return (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) || (y >= 0 && board[y][x] > 0);
}