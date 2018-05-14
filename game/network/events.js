import { accessRoom, updateNetworkedPlayers, updatePlayersFromSync } from './rooms';
import { socket } from '..';



function init() {
    console.log('socketio initialized');
    /**
     * received the room datas from the server
     */
    socket.on('room_connect', (data) => {
        console.log('logging to room...');

        accessRoom(data);
    });

    socket.on('receive_state', (data) => {
        // console.log('receive:',data);
        updateNetworkedPlayers(data);
    });

    socket.on('receive_sync_state', (data) => {
        // remove self from players
        for(let i=0; i<data.p.length; i++) {
            if(data.p[i].id == socket.id) {
                data.p.splice(i, 1);
            }
        }
        updatePlayersFromSync(data);
    });
}



export {
    init
}