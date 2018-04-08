const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4004; // (localhost:) Port
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port, () => console.log("Listning on port:", port));

io.on('connection', socket => {
    console.log("Client connected! Socket ID:", socket.id);
    socket.on('newUser', userName => {
        Users.push({
            id: socket.id,
            userName: userName
        });
        console.log("Adding user", socket.id +" "+ userName);
        console.log(Users); 
        io.sockets.emit('online', Users.length);
    });
    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);
        for (var i = 0; i < Users.length; i++) {
            if (Users[i].id === socket.id) {
                console.log("Removing user", Users[i]);
                Users.splice(i, 1);
            }
        }
        console.log("Users:", Users); 
        socket.broadcast.emit('online', Users.length);
    });
});

var Users = [];
var Games = [];
const Cols = 10; // X
const Rows = 10; // Y




