import Controller, { ACTIONS, AXES } from './controller';

const DEGREES = {
    LEFT: 270,
    RIGHT: 90,
}

export default class Keyboard extends Controller {
    
    constructor() {
        super();

        this.mappingActions = {
            ' ': ACTIONS.JUMP,
            'ARROWUP': ACTIONS.JUMP,
            'Z': ACTIONS.JUMP,
        };
        
        this.actionsOn = {};
        this.keyPressed = {};
        this.locked = {};
    }

    /**
     * Override
     * @param {*} buttonID 
     */
    getActionState(actionID) {
        if(this.locked[actionID]) {
            return false;
        }
        return this.actionsOn[actionID];
    }

    /**
     * Override
     * @param {*} actionID 
     */
    lockAction(actionID) {
        this.locked[actionID] = true;
    }

    /**
     * Override
     * @param {*} axeID 
     */
    getAxeState(axeID) {
        if(axeID == AXES.MOVE) {
            return keysToAxe(
                this.keyPressed['Z'] || this.keyPressed['ARROWUP'], 
                this.keyPressed['D'] || this.keyPressed['ARROWRIGHT'], 
                this.keyPressed['S'] || this.keyPressed['ARROWBOTTOM'], 
                this.keyPressed['Q'] || this.keyPressed['ARROWLEFT']);
        }
    }


    onKeyPressed(e) {
        let id = this.mappingActions[e.key.toUpperCase()];
        this.actionsOn[id] = true;
        this.keyPressed[e.key.toUpperCase()] = true;
    }


    onKeyReleased(e) {
        let id = this.mappingActions[e.key.toUpperCase()];
        this.actionsOn[id] = false;
        this.keyPressed[e.key.toUpperCase()] = false;
        this.locked[id] = false;
    }

}

/**
* @param {boolean} top 
* @param {boolean} right 
* @param {boolean} down 
* @param {boolean} left 
*/
function keysToAxe(top, right, down, left) {
   let axeState = {
       angle: 0,
       intensity: 0,
   }
   if(left) {
       axeState.intensity = 1;
       axeState.angle = DEGREES.LEFT;
   }
   if(right) {
       axeState.intensity = 1;
       axeState.angle = DEGREES.RIGHT;
   }
   return axeState;
}