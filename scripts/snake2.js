/**
* GAME DATA
*/
const CELLDIM = 14;

const SCENE = {
  width:CELLDIM*26,
  height:CELLDIM*30,
  get cellsX() {
    return this.width/CELLDIM;
  },
  get cellsY() {
    return this.height/CELLDIM;
  }
};

const SNAKE = {
  body:[
    {x:CELLDIM,y:CELLDIM},
  ],
  dir:'r'
};

const SGAME = {
  cellDim:CELLDIM,
  scene:SCENE,
  snake:SNAKE,
};

/**
* FUNCTIONS and UTILITIES
*/

/**
* SCENE HTMLCanvasElement... -> Void
*/
function setSceneDim(scene) {
  for(let i=1;i<arguments.length;i++) {
    arguments[i].setAttribute("width",scene.width);
    arguments[i].setAttribute("height",scene.height);
  }
}

const bgField = document // static field
  .querySelector("#background-grid");
const bgCTX = bgField.getContext('2d');

function drawScene(scene) {

  // draw field 
  for(let numRow=0;numRow<scene.cellsY;numRow++) {
    for(let numColumn=0;numColumn<scene.cellsX;numColumn++) {
      bgCTX.fillStyle = 
        (numColumn%2 == (numRow%2==0 ? 0 : 1) 
          ? '#3cc73c' : '#3ca03c');
      bgCTX.fillRect(
        CELLDIM*2*numColumn,
        CELLDIM*2*numRow,
        CELLDIM*2,
        CELLDIM*2);
    }
  }

  // draw snake axis
  let xline = CELLDIM;
  bgCTX.lineWidth = 0.15;  
  do {

    bgCTX.beginPath();
    bgCTX.moveTo(xline,0);
    bgCTX.lineTo(xline,scene.height);
    bgCTX.closePath();
    bgCTX.stroke();

    bgCTX.beginPath();
    bgCTX.moveTo(0,xline);
    bgCTX.lineTo(scene.width,xline);
    bgCTX.closePath();
    bgCTX.stroke();

    xline+=CELLDIM;

  } while (xline<scene.height);
  bgCTX.save();
}

const dnField = document // dynamic field
  .querySelector("#dynamic-field");
const dnCTX = dnField.getContext('2d');

function drawSnake(game) {
  dnCTX.clearRect(0,0,game.scene.width,game.scene.height);
  dnCTX.fillStyle = '#1a1a79';
  game.snake.body.forEach(point=>{
    dnCTX.fillRect(
      point.x-game.cellDim/2,point.y-game.cellDim/2,
      game.cellDim,game.cellDim);
  });
}

function moveSnake(snake) {
  let stepTable = {
    'r':['x',1],
    'l':['x',-1], 
    'u':['y',-1],
    'd':['y',1]
  };
  let amove = stepTable[snake.dir];
  snake.body[0][amove[0]]+=amove[1];
}


function getJunction(coord,cellDim) {
  let coeff = (coord%cellDim)/cellDim;
  if(coeff>.5) {
    return Math.ceil(coord/cellDim)*cellDim;
  } else {
    return Math.floor(coord/cellDim)*cellDim;
  }
}


function onKey(game,key) {
  let codes = {
    "ArrowDown":'d',
    "ArrowRight":'r',
    "ArrowUp":'u',
    "ArrowLeft":'l',
  };

  if(codes[key]=='d'||codes[key]=='u') {
    game.snake.body[0].x = 
      getJunction(game.snake.body[0].x,game.cellDim);  
    game.snake.dir = codes[key];
  } else if(codes[key]=='r'||codes[key]=='l') {
    game.snake.body[0].y = 
      getJunction(game.snake.body[0].y,game.cellDim);  
    game.snake.dir = codes[key];
  }
}

/**
* init and test
*/

setSceneDim(SCENE,bgField,dnField);
drawScene(SCENE);

var bb = BigBang(SGAME,
  {
    onTick: game => { moveSnake(game.snake); },
    toDraw: game => { drawSnake(game); },
    onKey: onKey,
  });
//bb.start();


