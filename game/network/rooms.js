/**
 * Room handles:
 * -Zone
 * -The Player (with camera support)
 * -other players
 */
import Zone from '../gameobjects/zone';
import Player from '../gameobjects/player';
import { socket } from '..';
import Character from '../gameobjects/character';

let currentZone;
let player;
let networkedPlayers = [];
let networkedPlayersHashMap = {};

function requestRoom(roomID) {
    console.log('asking for room '+roomID+'...');
    socket.emit('room_connect', '0');
}

function getRooms(filter, callback) {

}

function accessRoom(data) {
    // compute datas
    // ...
    console.log(data);
    
    // setting currentZone
    currentZone = new Zone(data.name, data.properties, data.grid);

    // setting player. TODO move elsewhere?
    player = new Player({
        name: 'noname',
        coord: {
            x: currentZone.width/2,
            y: currentZone.height/2,
        }
    });
}

function drawCurrentRoom() {
    if(currentZone) {
        currentZone.draw(player.camera);
    }

    for(let p of networkedPlayers) {
        p.draw(player.camera);
    }

    if(player) {
        player.draw(player.camera);
    }
}

function updateRoom() {
    if(currentZone) {
        currentZone.update();
    }

    for(let p of networkedPlayers) {
        p.update(currentZone);
    }

    if(player) {
        player.update(currentZone);
    }
}

function addNetworkedPlayer(p) {
    console.log('new player : '+p.id);
    networkedPlayers.push(p);
    networkedPlayersHashMap[p.id] = p;
}

function removeNetworkedPlayer(p) {
    console.log('player exit : '+p.id);
    for(let i=0; i<networkedPlayers.length; i++) {
        if(networkedPlayers[i].id == p.id) {
            networkedPlayers.splice(i, 1);
        }
    }
    delete networkedPlayersHashMap[p.id];
}

function updatePlayersFromSync(data) {
    // compare players on server and players on client list
    if(data.p.length == networkedPlayers.length) {
        return;
    }
    if(data.p.length > networkedPlayers.length) {
        // add players
        for(let p of data.p) {
            if(!networkedPlayersHashMap[p.id]) {
                addNetworkedPlayer(new Character(p.id, {
                    coord: {x:currentZone.width/2, y:currentZone.height/2},
                    size: {width:30, height:50},
                }));
            }
        }
    }
    if(data.p.length < networkedPlayers.length) {
        // remove players
        let hash = {};
        for(let p of data.p) {
            hash[p.id] == true;
        }
        for(let p of networkedPlayers) {
            if(!hash[p.id]) {
                removeNetworkedPlayer(p);
            }
        }
    }
}

function updateNetworkedPlayers(inputsPool) {
    for(let inputs of inputsPool) {
        if(networkedPlayersHashMap[inputs.id]) {
            networkedPlayersHashMap[inputs.id].updateFromNetwork(inputs.d);
        }
    }
}


export {
    requestRoom,
    getRooms,
    accessRoom,
    drawCurrentRoom,
    updateRoom,
    updateNetworkedPlayers,
    updatePlayersFromSync,
}