{

  const gmBox = document.querySelector("#game-manager");
  const playAgain = gmBox.querySelector("result-box");

  const arrowKeys = [
    "ArrowDown",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft"
  ];

  let game = new SGame(15,20,24);
  let bb; // for holding BigBang instance 

  snakeHandlers.runAfter = (ws) => {
    playAgain.removeAttribute("class");
    playAgain.setAttribute("count",ws.food.eaten);
    gmBox.removeAttribute("class");
    game = new SGame(15,20,24);
    init();
  };

  let keyHandler = event => {
    if(arrowKeys.reduce((hasKey,akey)=>{
        return hasKey || event.code===akey;     
      },false)) {
        dnField.removeEventListener("touchstart",touchHandler);
        gmBox.setAttribute("class","hidden");
        bb.start();
    } else {
      document.addEventListener("keydown",keyHandler,{once:true});
    }
  }

  let touchHandler = event => {
    document.removeEventListener("keydown",keyHandler);
    gmBox.setAttribute("class","hidden");
    bb.start();  
  };

  let init = () => {
    
    setSceneDim(game.scene,bgField,dnField,ssField);
    drawScene(game.scene);
    game.food.setXY = {
      x:getRandomOdd(game.scene.cellsX)*game.scene.cellDim,
      y:getRandomOdd(game.scene.cellsY)*game.scene.cellDim
    };
    
    bb = new BigBang(
      game,snakeHandlers,false,false,dnField);

    document.addEventListener("keydown",keyHandler,{once:true});
    dnField.addEventListener("touchstart",touchHandler,{once:true});
  };

  init();

}




