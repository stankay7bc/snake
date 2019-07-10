const WRAPPER = document.querySelector("#playground");
const CANVAS = WRAPPER.querySelector("#dynamic-field");
const GRID_IMG = WRAPPER.querySelector("#background-grid");
const SEMI_STAT = WRAPPER.querySelector("#semi-static");
const FOOD_COUNT = document.body.querySelector("#stat > span:nth-of-type(2)");
const CTX = CANVAS.getContext('2d');
const GRID_IMG_CTX = GRID_IMG.getContext('2d');
const SEMI_STAT_CTX = SEMI_STAT.getContext('2d');
const MESSAGE_BOX = WRAPPER.querySelector("#start");
const RESULT = WRAPPER.querySelector("result-box");

//var SCENE.c; // length of side of a cell in a grid, set in main
var NEXT_DIR = 'r';
var GROW_COUNTER = 0;
var RECIEVED_DIR_KEY = false;

/**
 * Integer Integer -> Integer
 * produce random integer within range [min,max]
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

/**
* in what box on a grid a cell is 
*/
function getCellPosn(cell) {
  return {
    x:Math.floor(cell.x/SCENE.c),
    y:Math.floor(cell.y/SCENE.c),
  };
}

function preDraw(gw) {
  // draw grid field
  (() => {
    let num_cells = SCENE.w/(2*SCENE.c);
    let num_cellsH = SCENE.h/(2*SCENE.c);
    for(let numRow=0;numRow<num_cellsH;numRow++) {
      for(let numColumn=0;numColumn<num_cells;numColumn++) {
        GRID_IMG_CTX.fillStyle = numColumn%2 == (numRow%2==0 ? 0 : 1) ? '#3cc73c' : '#3ca03c';
        GRID_IMG_CTX.fillRect(2*SCENE.c*numColumn,2*SCENE.c*numRow,2*SCENE.c,2*SCENE.c);
      }  
    }
  })();

  // draw grid
  /*
  (() => {
    let xline = SCENE.c;
    GRID_IMG_CTX.lineWidth = 0.15;  
    do {

      GRID_IMG_CTX.beginPath();
      GRID_IMG_CTX.moveTo(xline,0);
      GRID_IMG_CTX.lineTo(xline,GRID_IMG.height);
      GRID_IMG_CTX.closePath();
      GRID_IMG_CTX.stroke();

      GRID_IMG_CTX.beginPath();
      GRID_IMG_CTX.moveTo(0,xline);
      GRID_IMG_CTX.lineTo(GRID_IMG.width,xline);
      GRID_IMG_CTX.closePath();
      GRID_IMG_CTX.stroke();

      xline+=SCENE.c;

    } while (xline<GRID_IMG.width);
    GRID_IMG_CTX.save();
  })();
  */
  
  drawFood(gw.food,gw.foodCount);
  drawBody2(gw.body);
}

function drawFood(afood) {
  SEMI_STAT_CTX.clearRect(0,0,SEMI_STAT.width,SEMI_STAT.height);
  let pad = 0.9;
  SEMI_STAT_CTX.fillStyle = '#e0b200';
  SEMI_STAT_CTX.fillRect(
    SCENE.c*(afood.x-.5*pad),SCENE.c*(afood.y-.5*pad),SCENE.c*pad,SCENE.c*pad);
  FOOD_COUNT.textContent = afood.total;
}

CTX.lineWidth = 6;

/* development version of snake: lines and circles */
function drawBody(body) {
  CTX.beginPath();
  CTX.moveTo(body[0].x,body[0].y);
  body.slice(1).forEach((cell,ndx)=>{
    CTX.lineTo(cell.x,cell.y);
  });
  CTX.stroke();
  body.forEach(cell=>{
    CTX.beginPath();
    CTX.lineWidth = 1;
    CTX.arc(cell.x,cell.y,3,0,Math.PI*2);
    CTX.stroke();
  });
}

function drawBody2(body) {
  let bodyHW = SCENE.c/3.5;
  CTX.fillStyle = '#1a1a79';
  body.slice(1).forEach((cell,index)=>{
    // smooth connections between rectangles
    CTX.fillRect(cell.x-bodyHW,cell.y-bodyHW,bodyHW*2,bodyHW*2);
    if(cell.x==body[index].x) {
      CTX.fillRect(cell.x-bodyHW,cell.y,bodyHW*2,body[index].y-cell.y);
    } else {
      CTX.fillRect(cell.x,cell.y-bodyHW,(body[index].x-cell.x),bodyHW*2);
    }
  });
}

function drawCircle(posn) {
  CTX.beginPath();
  CTX.arc(posn.x,posn.y,SCENE.c/3,0,Math.PI*2);
  CTX.stroke();
}

// cell is an object with x,y,d properties
// why 1.5 works on preset large SCENE
function moveCell(cell) {
  switch(cell.d) {
  	case 'r':
      cell.x+=1; break;
    case 'l':
      cell.x-=1; break;
    case 'u':
      cell.y-=1; break;
    case 'd':
      cell.y+=1; break;
  }
}

function bodyToDirection(body) {
  // !!! OPTIMIZE and REFACTOR
  if(body[body.length-1].x/SCENE.c%2==1&&
      body[body.length-1].y/SCENE.c%2==1&&
      NEXT_DIR!=body[body.length-1].d) { 
    body[body.length-1].d = NEXT_DIR;
    body.push({x:body[body.length-1].x,y:body[body.length-1].y,d:NEXT_DIR});
    RECIEVED_DIR_KEY = false;
  }
}

function throwTail(body) {
  if(body[0].x==body[1].x&&body[0].y==body[1].y) {
    body.shift();
  }
}
/**
* Array -> Bool
* checks if body intersects with itself
*/
function pointOnLines(body) {
  let point = body[body.length-1];
  return body.slice(0,-1).reduce((out,cell,ndx)=>{
    if(ndx==body[body.length-1]) {
      return out;
    } else {
      let interval;
      // use >= ? for corners
      if(cell.d=='r') {
        interval = (point.x > cell.x && point.x < body[ndx+1].x && cell.y == point.y);
      } else if(cell.d=='l') {
        interval = (point.x < cell.x && point.x > body[ndx+1].x && cell.y == point.y); 
      } else if(cell.d=='u') {
        interval = (point.y < cell.y && point.y > body[ndx+1].y && cell.x == point.x);
      } else {
        interval = (point.y > cell.y && point.y < body[ndx+1].y && cell.x == point.x);
      }
      return out || interval;
    }
  },false); 
}

function getRandomOdd(top) {
  let p = getRandomIntInclusive(1,top);
  if(p%2==1) {
    return p;
  }
  return getRandomOdd(top);
}

function createNewFoodXY(body) {
  let newFood = {x:getRandomOdd(SCENE.w/(SCENE.c)-1),y:getRandomOdd(SCENE.h/(SCENE.c)-1)};
  if(pointOnLines(body.concat({x:newFood.x*SCENE.c,y:newFood.y*SCENE.c}))) {
    return createNewFoodXY(body);
  }
  return newFood;
}

function onTick(gs) {
  bodyToDirection(gs.body);
  throwTail(gs.body);
  if(GROW_COUNTER>0) {
    GROW_COUNTER--;  
  } else {
    moveCell(gs.body[0]); // tail
  }
  if(gs.body[gs.body.length-1].x==gs.food.x*SCENE.c&&
     gs.body[gs.body.length-1].y==gs.food.y*SCENE.c) {
    GROW_COUNTER = SCENE.c/2;
    gs.food.total++;
    gs.food.setXY = createNewFoodXY(gs.body); 
  }
  moveCell(gs.body[gs.body.length-1]); // head
}

function toDraw(gs) {
  CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
  //drawBody();
  drawBody2(gs.body);
}

function onKey(ws,key) {
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
  if(codes.hasOwnProperty(key)) {
    if(NEXT_DIR!=codes[key]&&
       !RECIEVED_DIR_KEY&&
       NEXT_DIR!=oppo[codes[key]]) {
      RECIEVED_DIR_KEY = true;
      NEXT_DIR = codes[key]; 
    }
  }
}

function hitSelf(body) {
  if(body[body.length-1].x/SCENE.c%2==1&&
      body[body.length-1].y/SCENE.c%2==1) {
    return pointOnLines(body);  
  } 
  return false;
}

/**
* ?SnakeBody -> Bool
* return true if snake reached canvas border
*/
function hitWall(body) {
  return (body[body.length-1].x > CANVAS.width) ||
         (body[body.length-1].y > CANVAS.height) ||
         (body[body.length-1].x < 0) ||
         (body[body.length-1].y < 0);
  }

// init

function makeScene() {
  let width, height, cell_d; 
  if(window.innerWidth < 440) {
    width = Math.floor(window.innerWidth*.90);
    cell_d = Math.floor(width/24); 
    width = width-width%(2*cell_d);
  } else {
    cell_d = 18; 
    width = 432;
  }
  //height = Math.floor(window.innerHeight*.85);
  return {w:width,h:30*cell_d,c:cell_d};
}

const SCENE = makeScene();

function makeGameWorld() {
  return {
    body:[
      {x:SCENE.c*1,y:SCENE.c*1,d:'r'},
      {x:SCENE.c*4,y:SCENE.c*1,d:'r'},
    ],
    food: {
      set setXY(posn) {
        this.x = posn.x;  
        this.y = posn.y;  
        drawFood(this);
      },
      x:7,
      y:5,
      total:0,
    },
  }
}

function main() {
  
  WRAPPER.style.setProperty("width",`${SCENE.w}px`);
  WRAPPER.style.setProperty("height",`${SCENE.h}px`);
  [CANVAS,GRID_IMG,SEMI_STAT].forEach(elem=>{
    elem.setAttribute("width",SCENE.w);
    elem.setAttribute("height",SCENE.h);
  });
  
  let GameWorld = makeGameWorld();
  preDraw(GameWorld);
  startGame(GameWorld,onTick,toDraw,onKey);
}

function startGame(ws,onTick,toDraw,onKey) {
  MESSAGE_BOX.style.setProperty("visibility","unset");
  function aux1() {  // set up the game loop and the scene
    preDraw(ws);
    MESSAGE_BOX.style.setProperty("visibility","hidden");
    BigBang(ws,
      {onTick:onTick,
       toDraw:toDraw,
       onKey:onKey,
       stopWhen: ws => {
         return  hitWall(ws.body) || hitSelf(ws.body);
       },
       runAfter: (ws) => {
         RESULT.style.setProperty("display","block");
         RESULT.setAttribute('count',ws.food.total);
         startGame(makeGameWorld(),onTick,toDraw,onKey);
       }
      },false,false,CANVAS).start();
  }
  document.addEventListener("keydown",event=>{
    if(event.code=="ArrowUp") {
      aux1();
    } 
  },{once:true});
  CANVAS.addEventListener("touchstart",event=>{
    aux1();
  },{once:true});
}

main();
