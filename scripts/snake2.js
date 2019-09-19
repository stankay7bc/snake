/**
* GAME DATA
*/

function SGame(cellDim,cellsX,cellsY) {
  
  this.scene = {
    cellDim:cellDim,
    cellsX: cellsX,
    cellsY: cellsY,
    get width() {
      return this.cellDim*this.cellsX;
    },
    get height() {
      return this.cellDim*this.cellsY;
    },
  };
  
  this.snake = {
    body:[
      {x:8*cellDim,y:cellDim},
      {x:1*cellDim,y:cellDim},
    ],
    dir:['r','r']
  };

  this.food = {
    set setXY(posn) {
      this.x = posn.x;  
      this.y = posn.y;
      drawFood(this,cellDim);
    },
    x:null,
    y:null,
    eaten:0,
  };
  
  this.counter = 0;
  
}

/**
* FUNCTIONS and UTILITIES
*/

/**
* Number -> Number
* generate random odd number up to 
* and not including limit
*/
function getRandomOdd(limit) {
  return 2*Math.floor(
    Math.random()*Math.floor(limit/2))+1;
}

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
        scene.cellDim*2*numColumn,
        scene.cellDim*2*numRow,
        scene.cellDim*2,
        scene.cellDim*2);
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

  } while (xline<scene.height);
  bgCTX.save();
}

const ssField = document // semi-static field
  .querySelector("#semi-static");
const ssCTX = ssField.getContext('2d');

function drawFood(food,cellDim) {
  ssCTX.clearRect(0,0,ssField.width,ssField.height);
  //let pad = 0.9;
  ssCTX.fillStyle = '#e0b200';
  ssCTX.fillRect(
    food.x-cellDim/2,
    food.y-cellDim/2,
    cellDim,cellDim);
}

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

const dnField = document // dynamic field
  .querySelector("#dynamic-field");
const dnCTX = dnField.getContext('2d');

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
    /*dnCTX.fillRect(
      point.x-game.cellDim/2,point.y-game.cellDim/2,
      game.cellDim,game.cellDim);*/
  });
}

const stepTable = {
  'r':['x',1],
  'l':['x',-1], 
  'u':['y',-1],
  'd':['y',1]
};

/**
* sPoint Array cellDim -> sPoint
* create a new sPoint based on @point direction
* which is determined @stepData: [axis,offset], see stepTable
*/
function createPointAhead(point,stepData,cellDim) {
  let npoint;
  let newXY;
  if(stepData[1]==1) {
    newXY=Math.ceil(point[stepData[0]]/cellDim);
  } else {
    newXY=Math.floor(point[stepData[0]]/cellDim);
  }
  npoint = {};
  npoint[stepData[0]] = newXY*cellDim; 
  let theOtherAxis = (stepData[0]=='x') ? 'y' : 'x';
  npoint[theOtherAxis] = point[theOtherAxis];
  return npoint;
}

let snakelen;
/*
* SGAME -> void
*/
function moveSnake(game) {

  let tail = game.snake.body[game.snake.body.length-1];
  let penult = game.snake.body[game.snake.body.length-2];
  let hm = stepTable[game.snake.dir[0]];
  
  if(game.snake.dir[0]!=game.snake.dir[1]) {
    
    let tm = stepTable[getTailDir(tail,penult)]

    let npoint = createPointAhead(game.snake.body[0],hm,game.scene.cellDim); 
    game.snake.body.shift();
    game.snake.body.unshift(npoint,Object.assign({},npoint));

    let npoint2 = createPointAhead(tail,tm,game.scene.cellDim); 
    game.snake.body.pop();
    game.snake.body.push(npoint2);

    game.snake.dir[0]=game.snake.dir[1];
    
  } else { // ?
    
    if(tail.x==penult.x&&tail.y==penult.y) {
      game.snake.body.pop();
      tail = penult;
      penult = game.snake.body[game.snake.body.length-2];
    }
 
    let tm = stepTable[getTailDir(tail,penult)];
    if(game.counter==0) {
      tail[tm[0]]+=tm[1];
    } else { 
      game.counter--
    }
    game.snake.body[0][hm[0]]+=hm[1];
  }
  
  let newsnakelen = compSnakeLen(game.snake);
  if(snakelen!=newsnakelen) {
    console.log(newsnakelen,game);
    snakelen=newsnakelen;
  }
}

/**
* SnakeGame -> Bool
*/
function foundFood(game) {
  return game.snake.body[0].x==game.food.x &&
         game.snake.body[0].y==game.food.y;
}

/**
* Point Point -> Direction
* determine the direction of snake's tail
* (it should always shrink)
*/
function getTailDir(tail,penult) {
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

function onKey(game,key) {
  let oppo = {
    'r':'l',
    'l':'r',
    'd':'u',
    'u':'d'
  };
  let codes = {
    "ArrowDown":'d',
    "ArrowRight":'r',
    "ArrowUp":'u',
    "ArrowLeft":'l',
  };

  if(codes.hasOwnProperty(key) &&
     codes[key]!=oppo[game.snake.dir[0]] &&
     codes[key]!=game.snake.dir[0]) {
    game.snake.dir[1] = codes[key];
  }
}

/**
* SnakeGame -> Boolean
*/
function snakeHitBorder(game) {
  return game.snake.body[0].x==0 ||
  game.snake.body[0].y==0 ||
  game.snake.body[0].x==game.scene.width ||
  game.snake.body[0].y==game.scene.height;
}

/**
* sPoint sPoint sPoint -> Boolean
*/
function insidePoints(p1,p2,middle) {
  return (axis) => {
    return (middle[axis]>p1[axis] && middle[axis]<p2[axis]) ||
           (middle[axis]>p2[axis] && middle[axis]<p1[axis]);
  };
}

/**
* SnakeGame -> Boolean
*/
function snakeHitSelf(game) {
  if(game.snake.body.length>4) {
    let hitSelfOn = insidePoints(game.snake.body[3],game.snake.body[4],game.snake.body[0]);
    if(game.snake.dir[0]=='r'||game.snake.dir[0]=='l') {
      return hitSelfOn('y') && game.snake.body[4].x==game.snake.body[0].x;
    } else {
      return hitSelfOn('x') && game.snake.body[4].y==game.snake.body[0].y;
    }
  }
  return false;
}

/**
* init and test
*/

function makeGame(paused) {

  const sg1 = new SGame(15,20,24);

  setSceneDim(sg1.scene,bgField,dnField,ssField);
  drawScene(sg1.scene);
  sg1.food.setXY = {
    x:getRandomOdd(sg1.scene.cellsX)*sg1.scene.cellDim,
    y:getRandomOdd(sg1.scene.cellsY)*sg1.scene.cellDim
  };

  return BigBang(sg1,
    {
      onTick: game => { 
        moveSnake(game); 
        if(foundFood(game)) {
          game.counter = game.scene.cellDim;
          game.food.setXY = {
            x:getRandomOdd(game.scene.cellsX)*game.scene.cellDim,
            y:getRandomOdd(game.scene.cellsY)*game.scene.cellDim
          };
        }
      },
      toDraw: game => { 
        drawSnake(game);
      },
      onKey: onKey,
      stopWhen: game => {
        return snakeHitBorder(game)||snakeHitSelf(game);
      }
    },false,paused);
}
