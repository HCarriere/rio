import io from 'socket.io-client';

import { addEvents } from './events';

import { getFPS } from './utils';
import * as debug from './debug';

import Keyboard from './controls/keyboard';

import * as networkEvent from './network/events';
import { drawCurrentRoom, requestRoom, updateRoom } from './network/rooms';
import { beginEmitStateLoop, beginSyncStateLoop } from './network/emit';


// controllers
let keyboardController = new Keyboard();
let controller = keyboardController; // default: keyboard

// stats
let fps = 0;

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

    // update room
    updateRoom();

    // clean screen
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw room
    drawCurrentRoom();

    // draw UI
    
    // draw debug
    debug.drawDebug(fps, canvas);

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
}
