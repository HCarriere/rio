'use strict';

import { switchDebug, switchStepByStep } from './debug';

function addEvents(keyboard, canvas) {

    canvas.element = document.getElementById('game');
    canvas.ctx = canvas.element.getContext('2d');

    // window events
   /* window.addEventListener('keypress', function(e) {
        e.preventDefault();
        keyboard.onKeyPressed(e);
    });*/
    window.addEventListener('keydown', function(e) {
        e.preventDefault();
        keyboard.onKeyPressed(e);
    });
    window.addEventListener('keyup', function(e) {
        e.preventDefault();
        if(e.key == 'F3') {
            switchDebug();
        }
        if(e.key == 'F2') {
            switchStepByStep();
        }
        keyboard.onKeyReleased(e);
    });
    window.onresize = function() {
        resizeCanvas(canvas);
    };

    // canvas size
    canvas.width = canvas.element.width = (window.innerWidth);
    canvas.height = canvas.element.height = (window.innerHeight);

}

function resizeCanvas(canvas) {
    canvas.width = canvas.element.width = (window.innerWidth);
    setTimeout(function() {
        canvas.height = canvas.element.height = (window.innerHeight);
    }, 0);
}


export {
    addEvents,
}