let socketio = require('socket.io');
let randomSeed = require('random-seed');
let emit = require('./emit');


function init(server) {
    let io = socketio(server, {
        serveClient: false
    });

    emit.beginInputStatesLoop(io);

    emit.beginSyncStateLoop(io);

    console.log('socket.io connected');

    io.on('connection', socket => {
        
        onClientConnect(socket);

        /*
        socket.use((packet, next) => {
            return next();
        });
        */
       
        /**
         * client is asking for a room to connect
         */
        socket.on('room_connect', data => {
            onReceiveRoomQuery(socket, data);
        });

        socket.on('emit_state', data => {
            onReceiveInputs(socket, data);
        });

        socket.on('sync_state', data => {
            onReceiveSync(socket, data);
        });

        socket.on('disconnect', () => {
            onClientDisconnect(socket);
        })

    });
}

function onClientConnect(socket) {
    emit.addPlayer(socket.id);
    console.log('player ',socket.id,' connected');
}

function onClientDisconnect(socket) {
    emit.removePlayer(socket.id);
    console.log('player '+socket.id+' disconnected');
}

function onReceiveRoomQuery(socket, data) {
    socket.emit('room_connect', {
        name: 'zone_1',
        properties: {
            tileSize: 32,
        },
        grid: getRandomGrid(),
    });
}

function onReceiveInputs(socket, data) {
    
}

function onReceiveSync(socket, data) {

}

module.exports = {
    init
}

function getRandomGrid() {
    let sRand = randomSeed.create('seed');
    sRand.initState();
    const width = 80;
    const height = 80;
    
    let grid = [];

    for(let i=0; i<height; i++) {
        grid[i] = [];
        for(let j=0; j<width; j++) {
            if(i>=height-2 || j<=1 || j==width-1) {
                grid[i][j] = 1;    
            } else {
                grid[i][j] = 0;
            }
        }
    }

    for(let i=0; i<height; i++) {
        for(let j=0; j<width; j++) {
            if(i>4 && i<height-6 && j>4 && j<width-6)
            if(sRand(100) < 2) {
                let shapeX = 1+Math.floor(sRand(4));
                let shapeY = 2+Math.floor(sRand(4));
                for(let a=0; a<=shapeY; a++) {
                    for(let b=0; b<=shapeX; b++) {
                        grid[i+a][j+b] = 1;
                    }
                }
            }
        }
    }
    
    return grid;
}