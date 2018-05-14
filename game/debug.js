import * as graphic from  './graphics/base'

let debugOn = true;
let stepByStepOn = false;
const pointDistance = 3;
const pointAmount = 350;

let lastFPSs = [];
let fluctuations = [];

function drawDebug(fps, canvas) {
    if(!debugEnabled()) {
        return;
    }

    showFPS(fps);

    if(canvas) {
        graphic.fillStyle('white');
        graphic.textAlign('left', 'top');
        graphic.textStyle('10px monospace');
        graphic.text('descr:', 10, 100);
        graphic.text('width:'+canvas.width+' - height:'+canvas.height, 15, 115);

        // edges
        graphic.fillStyle('#FFF');
        graphic.rect(5, 5, 5, 5);
        graphic.rect(canvas.width-10, 5, 5, 5);
        graphic.rect(canvas.width-10, canvas.height-10, 5, 5);
        graphic.rect(5, canvas.height-10, 5, 5);
    }
}

function showFPS(frameRate) {
    if(frameRate) {
        lastFPSs.push(frameRate);
        fluctuations.push(getFluctuation(lastFPSs));
    }
    if(lastFPSs.length > pointAmount) {
        lastFPSs.shift();
        fluctuations.shift();
    }
    
    // FPS
    for(let i=0; i<lastFPSs.length-1; i++) {
        if(lastFPSs[i+1] < 56) {
            graphic.strokeStyle('white');
        } else {
            graphic.strokeStyle('green');
        }
        graphic.stroke(10+i*pointDistance, 85-lastFPSs[i],
                10+i*pointDistance+pointDistance, 85-lastFPSs[i+1]);
    }
    // fluctuation
    /*for(let i=0; i<fluctuations.length-1; i++) {
        if(Math.abs(fluctuations[i+1]) < 15) {
            graphic.strokeStyle('green');
        } else {
            graphic.strokeStyle('blue');
        }
        graphic.stroke(10+i*pointDistance, 100-fluctuations[i],
                10+i*pointDistance+pointDistance, 100-fluctuations[i+1]);
    }
    graphic.strokeStyle('grey');
    graphic.stroke(10, 100, 10+pointAmount*pointDistance, 100);*/
    
    // Text
    graphic.fillStyle('white');
    graphic.textAlign('left', 'top');
    graphic.textStyle('10px monospace');
    graphic.text('FPS : '+ Math.round(lastFPSs[lastFPSs.length-1]), 10, 10);
    // graphic.text('Fluctuation : '+ Math.round(fluctuations[fluctuations.length-1]), 10, 50);
}

function getFluctuation(array) {
    let fluc = 0;
    for(let a of array) {
        fluc += 60-a;
    }
    return fluc;
}

function debugEnabled() {
    return debugOn;
}

function switchDebug() {
    debugOn = !debugOn;
}

function switchStepByStep() {
    stepByStepOn = !stepByStepOn;
}

function stepByStepEnabled() {
    return stepByStepOn;
}

export {
    drawDebug,
    switchDebug,
    debugEnabled,
    switchStepByStep,
    stepByStepEnabled,
}


