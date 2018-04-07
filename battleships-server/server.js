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
        console.log(Users);
        io.sockets.emit('online', Users.length);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);
        Users.pop();
        console.log(Users);
        socket.broadcast.emit('online', Users.length);

    });
});




var Users = [];
var Games = [];
const Cols = 10; // X
const Rows = 10; // Y

function createGrid() {
    var grid = Array(rows);

}




