import io from 'socket.io-client';

import { addEvents } from './events';

import { getFPS, getPhysicTickPerSecond, getDeltaTime } from './utils';
import * as debug from './debug';

import Keyboard from './controls/keyboard';

import * as networkEvent from './network/events';
import { drawCurrentRoom, requestRoom, updateRoom } from './network/rooms';
import { beginEmitStateLoop, beginSyncStateLoop } from './network/emit';


// controllers
let keyboardController = new Keyboard();
let controller = keyboardController; // default: keyboard

// stats
let fps = 0; // frames per second
let pts = 0; // physic tick per seconds
let deltaTime = 1; // to scale animations

// canvas initialisation
let canvas = {};
addEvents(keyboardController, canvas);

// websocket connection
let socket = io();
networkEvent.init();

// test purposes: go to room 0
requestRoom('room_0');

/**
 * Main loop.
 * About 60 times per seconds.
 */
function loop() {

    // compute FPS
    fps = getFPS();

    // compute deltaTime
    deltaTime = getDeltaTime(60, fps);

    // update room
    updateRoom();
    pts = getPhysicTickPerSecond();
    
    // clean screen
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw room
    drawCurrentRoom();

    // draw UI
    
    // draw debug
    debug.drawDebug(fps, pts, canvas);

    if(debug.stepByStepEnabled()) {
        debugger;
    }

    // carry on
    requestAnimationFrame(loop);
}



// starting animation loop
loop();

// starting high freq emit inputs loop
beginEmitStateLoop();

// starting low freq sync state loop
// beginSyncStateLoop();


export {
    canvas,
    controller,
    socket,
    deltaTime,
}

