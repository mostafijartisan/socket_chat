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

const port = process.env.PORT || 3000;
// pass Node HTTP server (with express) to Socket class
const socketIO = new Server(nodeServer, {
    cors: {
        origin: `http://localhost:${port}`, // Replace with your client origin
        credentials: true
    }
});


// file related thing
const __dirname = dirname(fileURLToPath(import.meta.url));
expressApp.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'chat.html'));
});

// connected user list
let connectedUsers = {};

socketIO.on('connection', (socket) => {
    let userId = socket.handshake.query.userId;

    // Generate a user ID if none was provided
    if (!userId) {
        const userId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
        socket.emit('assignUserId', userId); // Send the new user ID to the client
    }

    // sent to all users
    io.emit('connectedUsers', connectedUsers);
    connectedUsers[userId] = { userId, socketId: socket.id };

    // Remove user from list on disconnect
    socket.on('disconnect', () => {
        delete connectedUsers[userId];
        io.emit('connectedUsers', connectedUsers); // Update all clients with the new list
        console.log('User disconnected:', userId);
    });
});





nodeServer.listen(port, () => {
    console.log(`Server running at = http://localhost:${port}`);
});