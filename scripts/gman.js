const GManager = {
  game:null,
};


const gmBox = document.querySelector("#game-manager");
const playAgain = gmBox.querySelector("section");

const arrowKeys = [
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft"
];

const bb = BigBang(GManager,
  {
    onTick: gm => {
      if(gm.game instanceof Object) {
        if(gm.game.isOver()) {          
          gm.game = null;
          gmBox.setAttribute("class","");
          playAgain.setAttribute("class","");
        }
      }
    },
    onKey: (gm,key) => {
      if(gm.game===null) {
        if(arrowKeys.reduce((hasKey,akey)=>{
          return hasKey || key===akey;     
        },false)) {
          gm.game = makeGame(false);
          gm.game.start();
          gmBox.setAttribute("class","hidden");
        }
      }
    },
  });

bb.start();