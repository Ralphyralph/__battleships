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

// Connection
io.on('connection', socket => {
    console.log("Client connected! Socket ID:", socket.id);

    socket.on('newUser', userName => {
        Users.push({
            id: socket.id,
            userName: userName
        });
        console.log("Adding user", socket.id +" "+ userName);
        io.sockets.emit('online', Users.length);

    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);
        for (var i = 0; i < Users.length; i++) {
            if (Users[i].id === socket.id) {
                Users.splice(i, 1);
                console.log("Removing user", Users[i]);
            }
        } 
        socket.broadcast.emit('online', Users.length);

    });
});




var Users = [];
var Games = [];
const Cols = 10; // X
const Rows = 10; // Y




