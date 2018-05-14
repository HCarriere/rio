let lastTick;
let deltaTime;

function getFPS() {
    if(!lastTick){
        lastTick = performance.now();
        return;
    }
    deltaTime = (performance.now() - lastTick)/1000;
    lastTick = performance.now();
    return 1/deltaTime;
}


function constrain(val, min, max) {
    if(val > max) return max;
    if(val < min) return min;
    return val;
}

export {
    getFPS,
    constrain,
}