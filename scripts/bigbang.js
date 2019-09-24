/**
* X HandlerCOllection -> void
*/
function BigBang(ws,hc,fps=false,isPaused=false,canvas) {
  
  let bb = this;

  let intervalId = null;
  
  this.paused = isPaused;
  
  const identFunc = ws => {return ws;}; 
  
  const handlers = {
    onTick: hc.onTick ? hc.onTick : identFunc,
    toDraw: hc.toDraw ? hc.toDraw : identFunc,
    onKey: hc.onKey ? hc.onKey : identFunc,
    stopWhen: hc.stopWhen ? hc.stopWhen : (ws) => {return false;},
    runAfter: hc.runAfter ? hc.runAfter : identFunc,
  };
  
  function handlePause(event) {
    if(event.code=="KeyP") {
      bb.paused = bb.paused ? false : true;
      if(!bb.paused) {
        start(ws);
      }
    }  
  }
  
  let lastCall=0; 
  let now; // DOMHighResTimeStamp 
  function handleOnKey(event) {
    if(!event.repeat) {
      if(lastCall+150<now) {
        lastCall = now;
        if(!bb.paused) handlers.onKey(ws,event.code);
      }
    }
  }

  function animate(ws) {
    
    if(canvas) canvas.addEventListener("touchstart",touchstart,{once:true});
    
    handlers.onTick(ws);
    handlers.toDraw(ws);

    if(!bb.paused) {
      start(ws);
    }
  }
  
  let start = (ws) => {
    if(handlers.stopWhen(ws)) {
      console.log('game stopped');
      window.cancelAnimationFrame(intervalId);
      document.removeEventListener("keydown",handlePause);
      document.removeEventListener("keydown",handleOnKey);
      handlers.runAfter(ws);
    } else {
      let callback = ts => {
        now = ts;
        animate(ws);
      };
      if(fps) {
        setTimeout(()=>{
          intervalId = window.requestAnimationFrame(callback);
        },1000/fps);
      } else {
        intervalId = window.requestAnimationFrame(callback);
      }
    }
  };
  
  document.addEventListener("keydown",handlePause);
  
  function touchstart(event) {
    event.preventDefault();
    let point1 = {
      x:event.touches[0].clientX,
      y:event.touches[0].clientY 
    };
    //console.log(point1,"start");
    if(canvas) canvas.addEventListener("touchmove",prepTouchmove(point1),{once:true});
  }
  
  /**
  * Point -> EventListener
  */
  function prepTouchmove(point1) {
    return function(event) {
      if(event.touches.length==1) {
        let point2 = {
          x:event.changedTouches[0].clientX,
          y:event.changedTouches[0].clientY 
        };
        handlers.onKey(ws,getVData(point1,point2));
      }
    };
  }
  
  /**
  * Point Point -> Direction
  */
  function getVData(point1,point2) {
    
    const pi4 = Math.sqrt(2)/2;
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dist = Math.sqrt(dx**2+dy**2);
    const sinA = dy/dist;
    
    if(sinA>=-1&&sinA<=-pi4) { // up
      return 'ArrowUp';
    } else if(sinA>-pi4&&sinA<pi4) { // right,left
      if(dx>0) { // right
        return 'ArrowRight';
      } else { // left
        return 'ArrowLeft';
      } 
    } else { // down
      return 'ArrowDown';
    }
    
  }
  
  this.start = () => {
    document.addEventListener("keydown",handleOnKey,{once:false});
    start(ws);
  };

}
