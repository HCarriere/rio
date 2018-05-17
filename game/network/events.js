import { accessRoom } from './rooms';
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
        
    });

    socket.on('receive_sync_state', (data) => {
        
    });
}



export {
    init
}