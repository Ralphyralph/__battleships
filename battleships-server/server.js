const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// (localhost:) Port 
const port = 4004;
// Express app
const app = express();
// Server using express app
const server = http.createServer(app);
// Socket using the server
const io = socketIO(server);
// Listen to port
server.listen(port, () => console.log("Listning on port:", port));


var count = 0;

// Connect and Disconnect
io.on('connection', socket => {
    console.log("Client connected! Socket ID:", socket.id);

    count++;
    io.sockets.emit('online', count);

    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);

        count--;
        socket.broadcast.emit('online', count);
    });
});







