
import { canvas, controller, socket } from '../index';
import { AXES, ACTIONS } from '../controls/controller';
import Character from './character';
import { constrain } from '../utils';
import { buildEmitState } from '../network/emit';


/**
 * Controllable player
 */
export default class Player extends Character {

    constructor(playerInfo = {}) {
        super(socket.id, playerInfo);
        console.log(socket.id);
        // camera coord are on its center
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,    
        };
    }

    update(zone) {
        super.update(zone);
        
        this.camera = getCamera(this, zone);
        
        /*let moveAxe = controller.getAxeState(AXES.MOVE);
        this.move(moveAxe);
        

        if(controller.getActionState(ACTIONS.JUMP)) {
            this.setIsJumping(true);
            // controller.lockAction(ACTIONS.JUMP);
        } else {
            this.setIsJumping(false);
        }*/


        buildEmitState(controller.getAllInputStates());
    }

    draw(camera) {
        super.draw(camera);

    }

    // Override : getting the controller inputs (live, no queue)
    getActiveInputStates() {
        return controller.getAllInputStates();
    }

}



/**
 * returns camera position for player player
 * @param {Player} player 
 * @returns {Object} camera
 */
function getCamera(player, zone) {
    return {
        x:constrain(player.coord.x - canvas.width/2, 0, zone.width-canvas.width),
        y:constrain(player.coord.y - canvas.height/2, 0, zone.height-canvas.height),
        width:canvas.width,
        height:canvas.height,
    };
}
