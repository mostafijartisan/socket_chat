import express from 'express'; // import express package
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io'; // import socket package

// init express framework
const app = express();

// then pass express instance into node HTTP server metod
const server = createServer(app);

// pass Node HTTP server (with express) to Socket class
const io = new Server(server);


// just sent a html to client side
// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
// });

// file related thing
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// socket server side will try detect when a user connected with this server
io.on('connection', (socket) => {

    // when user connect
    console.log('a user connected');

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
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {

        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


// when Node HTTP server active on port 3000 / or we start Node HTTP server
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});