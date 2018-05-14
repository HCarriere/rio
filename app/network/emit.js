const EMIT_INPUT_STATES_FREQUENCY = 25;
const EMIT_SYNC_STATE_FREQUENCY = 2000;

let emitInputStateLoop;
let emitSyncLoop;
let inputStates = [];
let players = [];

function sendInputStates(io) {
    if(inputStates.length > 0) {
        io.emit('receive_state', inputStates);
        inputStates = [];
    }
}

function sendSyncState(io) {
    io.emit('receive_sync_state', {
        p: players,
    });
}

function beginInputStatesLoop(io) {
    emitInputStateLoop = setInterval(() => {
        sendInputStates(io);
    }, EMIT_INPUT_STATES_FREQUENCY);
}

function beginSyncStateLoop(io) {
    emitSyncLoop = setInterval(() => {
        sendSyncState(io);
    }, EMIT_SYNC_STATE_FREQUENCY);
}

function buildInputStates(socket, inputs) {
    inputStates.push({
        id: socket.id,
        d: inputs,
    });
}


function stopSyncStateLoop() {
    clearInterval(emitInputStateLoop);
}

function stopInputStatesLoop() {
    clearInterval(emitSyncLoop);
}

function addPlayer(id) {
    players.push({
        id: id,
    });
}

function removePlayer(id) {
    for(let i=0; i<players.length; i++) {
        if(players[i].id == id) {
            players.splice(i, 1);
        }
    }
}

function editPlayer(id, data) {

}

module.exports = {
    buildInputStates,
    beginInputStatesLoop,
    beginSyncStateLoop,
    addPlayer,
    removePlayer,
    editPlayer,
}