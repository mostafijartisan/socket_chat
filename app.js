import 'dotenv/config';

// import express
import express from 'express';


// import core module of node 
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// import socket
import { Server } from 'socket.io';

// init express framework
const expressApp = express();

// serve images, CSS files, and JavaScript files in a directory named
expressApp.use(express.static('public'))

// then pass express instance into node HTTP server metod
const nodeServer = createServer(expressApp);

// pass Node HTTP server (with express) to Socket class
const socketIO = new Server(nodeServer);


// file related thing
const __dirname = dirname(fileURLToPath(import.meta.url));
expressApp.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'chat.html'));
});

// connected user list
const userLists = [];
const userData = [];

// socket server side will try detect when a user connected with this server
socketIO.on('connection', (socket) => {

    // Generate a unique key with timestamp and random number
    const userId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    userLists.push(userId);

    userData.userLists = userLists;
    userData.myUserId = userId;
    socket.emit('userData', userData);

    // console.log(userData);

    // Emit the unique key to the connected user
    // socket.emit('userData', userData);
    // console.log('A user connected:', userId);

    // when user disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// emit event from server
// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//     });
// });

// emit event from server, and 
socketIO.on('connection', (socket) => {
    socket.on('chat message', (msg) => {

        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


const port = process.env.PORT || 3000;
nodeServer.listen(port, () => {
    console.log(`Server running at = http://localhost:${port}`);
});