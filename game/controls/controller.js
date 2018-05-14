
const ACTIONS = {
    SHOW_DEBUG: 1,
    JUMP: 2,
}

const AXES = {
    MOVE: 101,
};

export default class Controller {

    /**
     * An action is ponctual, or kept pressed
     * @param {number} actionID 
     */
    getActionState(actionID) {
        throw new Error('Must be implemented');
    }
    
    /**
     * Action is locked until button released
     * @param {number} actionID 
     */
    lockAction(actionID) {
        throw new Error('Must be implemented');
    }

    /**
     * Axes got properties:
     * - intensity
     * - angle
     * Note: id begin at 100 (to not mess with actions)
     * @param {number} axeID 
     */
    getAxeState(axeID) {
        throw new Error('Must be implemented');
    }

    /**
     * Returns an array containing the input states (actions & axes)
     * @returns {Array} array of input states and axes
     */
    getAllInputStates() {
        let actions = {};
        if(this.getActionState(ACTIONS.JUMP)) 
            actions[ACTIONS.JUMP] = true;

        if(this.getAxeState(AXES.MOVE).intensity > 0) 
            actions.m = this.getAxeState(AXES.MOVE);

        return actions;
    }
}

export {
    ACTIONS,
    AXES,
}
