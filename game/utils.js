let lastTickFPS;
let deltaTimeFPS;
let lastTickPTS;
let deltaTimePTS;

function getFPS() {
    if(!lastTickFPS){
        lastTickFPS = performance.now();
        return;
    }
    deltaTimeFPS = (performance.now() - lastTickFPS)/1000;
    lastTickFPS = performance.now();
    return 1/deltaTimeFPS;
}

function getPhysicTickPerSecond() {
    if(!lastTickPTS){
        lastTickPTS = performance.now();
        return;
    }
    deltaTimePTS = (performance.now() - lastTickPTS)/1000;
    lastTickPTS = performance.now();
    return 1/deltaTimePTS;
}

function getDeltaTime(targetFps, realFps) {
    return targetFps / realFps;
}

function constrain(val, min, max) {
    if(val > max) return max;
    if(val < min) return min;
    return val;
}

export {
    getFPS,
    constrain,
    getDeltaTime,
    getPhysicTickPerSecond,
}