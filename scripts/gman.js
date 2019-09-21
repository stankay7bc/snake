const gmBox = document.querySelector("#game-manager");
const playAgain = gmBox.querySelector("result-box");

const arrowKeys = [
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft"
];

function GMan() {

  this.game = new SGame(15,20,24);
  this.bb;

  snakeHandlers.runAfter = () => {
    playAgain.removeAttribute("class");
    gmBox.removeAttribute("class");
    this.game = new SGame(15,20,24);
    this.init();
  };

  this.init = function() {
    
    setSceneDim(this.game.scene,bgField,dnField,ssField);
    drawScene(this.game.scene);
    this.game.food.setXY = {
      x:getRandomOdd(this.game.scene.cellsX)*this.game.scene.cellDim,
      y:getRandomOdd(this.game.scene.cellsY)*this.game.scene.cellDim
    };
    
    this.bb = new BigBang(this.game,snakeHandlers);

    document.addEventListener("keydown",event=>{
      if(arrowKeys.reduce((hasKey,akey)=>{
          return hasKey || event.code===akey;     
        },false)) {
          gmBox.setAttribute("class","hidden");
          this.bb.start();
        }      
    },{once:true});
  };

  this.init();

}

const gm = new GMan();


