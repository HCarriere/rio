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

function updateRoomFromSync(data) {
   
}

function updateNetworkedPlayers(inputsPool) {
    //networkedPlayersHashMap[inputs.id].updateFromNetwork(inputs.d);
}


export {
    requestRoom,
    getRooms,
    accessRoom,
    drawCurrentRoom,
    updateRoom,
    updateNetworkedPlayers,
    updateRoomFromSync,
}