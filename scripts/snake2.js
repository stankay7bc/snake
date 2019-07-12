/**
* GAME DATA
*/
const SCENE = {
  width:320,
  height:320,
  cellDim:16,
  get cellsX() {
    return this.width/this.cellDim;
  },
  get cellsY() {
    return this.height/this.cellDim;
  }
};

const SNAKE = {
  body:[
    {x:SCENE.cellDim,y:SCENE.cellDim},
  ],
  dir:'r'
};

const SGAME = {
  scene:SCENE,
  snake:SNAKE,
};

/**
* FUNCTIONS and UTILITIES
*/

const bgCTX = document
  .querySelector("#background-grid")
  .getContext('2d'); // background context

function drawScene(scene) {

  // draw field 
  for(let numRow=0;numRow<scene.cellsY;numRow++) {
    for(let numColumn=0;numColumn<scene.cellsX;numColumn++) {
      bgCTX.fillStyle = 
        (numColumn%2 == (numRow%2==0 ? 0 : 1) 
          ? '#3cc73c' : '#3ca03c');
      bgCTX.fillRect(
        SCENE.cellDim*2*numColumn,
        SCENE.cellDim*2*numRow,
        SCENE.cellDim*2,
        SCENE.cellDim*2);
    }
  }

  // draw snake axis
  let xline = scene.cellDim;
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

    xline+=scene.cellDim;

  } while (xline<scene.width);
  bgCTX.save();
}

const dnCTX = document
  .querySelector("#dynamic-field")
  .getContext('2d'); // dynamic context

function drawSnake(game) {
  dnCTX.clearRect(0,0,game.scene.width,game.scene.height);
  dnCTX.fillStyle = '#1a1a79';
  game.snake.body.forEach(point=>{
    dnCTX.fillRect(
      point.x-game.scene.cellDim/2,point.y-game.scene.cellDim/2,
      game.scene.cellDim,game.scene.cellDim);
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
      getJunction(game.snake.body[0].x,game.scene.cellDim);  
    game.snake.dir = codes[key];
  } else if(codes[key]=='r'||codes[key]=='l') {
    game.snake.body[0].y = 
      getJunction(game.snake.body[0].y,game.scene.cellDim);  
    game.snake.dir = codes[key];
  }
}

/**
* init and test
*/

drawScene(SCENE);

var bb = BigBang(SGAME,
  {
    onTick: game => { moveSnake(game.snake); },
    toDraw: game => { drawSnake(game); },
    onKey: onKey,
  });
//bb.start();


