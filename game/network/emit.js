import { socket } from '..';

const EMIT_STATE_FREQUENCY = 30;
const SYNC_STATE_FREQUENCY = 2000;

let emitStateLoop;
let syncStateLoop;
let inputPool = [];

/**
 * Emit bellow informations to the server.
 * The more it is called, the more precise the actions will be 
 * (and the more strain there will be on the server)
 */
function emitState() {
    if(inputPool.length > 0) {
        socket.emit('emit_state', inputPool);
        inputPool = [];
    }
}

/**
 * 
 * @param {Array} inputs 
 */
function buildEmitState(inputs) {
    if(Object.keys(inputs).length > 0) {
        // console.log('send:',inputs);
        inputPool.push(inputs);
    }
}


/**
 * create an emit state loop.
 * Will 
 */
function beginEmitStateLoop() {
    stopEmitStateLoop();
    emitStateLoop = setInterval(() => {
        emitState();
    }, EMIT_STATE_FREQUENCY);
    console.log('emittate loop launched');
}

function stopEmitStateLoop() {
    clearInterval(emitStateLoop);
}

/**
 * Should be called every few seconds, to sync everything so 
 * the server can sync everything
 */
function syncState() {
    socket.emit('sync_state', {
        // TODO add datas
    });
}

function beginSyncStateLoop() {
    stopSyncStateLoop();
    syncStateLoop = setInterval(() => {
        syncState();
    }, SYNC_STATE_FREQUENCY);
    console.log('synctate loop launched');
}

function stopSyncStateLoop() {
    clearInterval(syncStateLoop);
}


export {
    buildEmitState,
    beginEmitStateLoop,
    stopEmitStateLoop,
    beginSyncStateLoop,
    stopSyncStateLoop,
}