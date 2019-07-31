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
    {x:3*CELLDIM,y:CELLDIM},
    {x:2*CELLDIM,y:CELLDIM},
    {x:2*CELLDIM,y:4*CELLDIM},
  ],
  dir:['r','r']
};

const SLEN = compSnakeLen(SNAKE);

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


/**
* SNAKE -> Number
*/
function compSnakeLen(snake) {
  return snake.body.reduce((res,point,indx,arr)=>{
    if(indx==arr.length-1) {
      return res;
    } else {
      return res+Math.sqrt(
        (point.x-arr[indx+1].x)**2+
        (point.y-arr[indx+1].y)**2);
    }
  },0); 
}

/**
* SGAME -> Void
*/
function drawSnake(game) {
  dnCTX.clearRect(0,0,game.scene.width,game.scene.height);
  dnCTX.fillStyle = '#1a1a79';
  game.snake.body.forEach((point,indx,arr)=>{
    if(indx<arr.length-1) {
      if(point.x==arr[indx+1].x) {
        dnCTX.beginPath();
        dnCTX.moveTo(point.x,point.y);
        dnCTX.lineTo(point.x,arr[indx+1].y);
        dnCTX.stroke();
      } else {
        dnCTX.beginPath();
        dnCTX.moveTo(point.x,point.y);
        dnCTX.lineTo(arr[indx+1].x,point.y);
        dnCTX.stroke();
      }
    }
    dnCTX.fillRect(
      point.x-game.cellDim/2,point.y-game.cellDim/2,
      game.cellDim,game.cellDim);
  });
}

const stepTable = {
  'r':['x',1],
  'l':['x',-1], 
  'u':['y',-1],
  'd':['y',1]
};

/*
* SGAME -> void
*/
function moveSnake(game) {
  let tail = game.snake.body[game.snake.body.length-1];
  let penult = game.snake.body[game.snake.body.length-2];
  if(game.snake.dir[0]==game.snake.dir[1]) {
    let amove = stepTable[game.snake.dir[0]];
    game.snake.body[0][amove[0]]+=amove[1];
    let tmove = stepTable[getTailDir(game.snake)];
    tail[tmove[0]]+=tmove[1];
  } else {
    jumpToJunction(game);
    game.snake.dir[0]=game.snake.dir[1];
    console.log(compSnakeLen(game.snake));
  }
  if(tail.x==penult.x&&tail.y==penult.y) {
    game.snake.body.pop();
  } 
}

/**
* Snake -> Direction
* determine the direction of snake's tail
* (it should always shrink)
*/
function getTailDir(snake) {
  let tail = snake.body[snake.body.length-1];
  let penult = snake.body[snake.body.length-2];
  if(tail.x==penult.x) {
    if(tail.y-penult.y>0) {
      return 'u';
    } else {
      return 'd';
    }
  } else {
    if(tail.x-penult.x>0) {
      return 'l';
    } else {
      return 'r';
    }
  }
}

function reduceSnake(snake,delta) {
  let tail = snake.body[snake.body.length-1];
  let penult = snake.body[snake.body.length-2];
  let dir = getTailDir(snake);
  if(dir=='r') {
    tail.x = tail.x+delta;
  } else if(dir=='l') {
    tail.x = tail.x-delta;
  } else if(dir=='u') {
    tail.y = tail.y-delta;
  } else {
    tail.y = tail.y+delta;
  }
}

/**
* SGAME -> void
* make snake jump to the closest grid intersection
*/
function jumpToJunction(game) {
  let delta;
  let spoint;
  if(game.snake.dir[0]=='r') {
    delta = game.cellDim-game.snake.body[0].x%game.cellDim;  
    spoint = {
      x:game.snake.body[0].x+delta,
      y:game.snake.body[0].y 
    }; 
  } else if(game.snake.dir[0]=='l') {
    delta = -game.snake.body[0].x%game.cellDim;  
    spoint = {
      x:game.snake.body[0].x+delta,
      y:game.snake.body[0].y 
    }; 
  } else if(game.snake.dir[0]=='d') {
    delta = game.cellDim-game.snake.body[0].y%game.cellDim;  
    spoint = {
      x:game.snake.body[0].x,
      y:game.snake.body[0].y+delta 
    }; 
  } else {
    delta = -game.snake.body[0].y%game.cellDim;  
    spoint = {
      x:game.snake.body[0].x,
      y:game.snake.body[0].y+delta 
    }; 
  }

  game.snake.body.shift();
  let npoint = Object.assign({},spoint);
  game.snake.body.unshift(spoint,npoint);
  reduceSnake(game.snake,Math.abs(delta));
}

function getJunction(coord,cellDim) {
  let coeff = (coord%cellDim)/cellDim;
  //if(coeff>.5) {
    //return Math.ceil(coord/cellDim)*cellDim;
    return (cellDim-coord%cellDim);
  //} else {
    //return Math.floor(coord/cellDim)*cellDim;
    //return -coord%cellDim;
  //}
}

function onKey(game,key) {
  let codes = {
    "ArrowDown":'d',
    "ArrowRight":'r',
    "ArrowUp":'u',
    "ArrowLeft":'l',
  };

  if(codes.hasOwnProperty(key)) {
    game.snake.dir[1] = codes[key];
  }
}

/**
* init and test
*/

setSceneDim(SCENE,bgField,dnField);
drawScene(SCENE);

var bb = BigBang(SGAME,
  {
    onTick: game => { moveSnake(game); },
    toDraw: game => { drawSnake(game); },
    onKey: onKey,
  });
//bb.start();


