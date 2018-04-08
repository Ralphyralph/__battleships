const game = require('game');

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
        game.newUser(socket.id, userName);
        io.sockets.emit('online', Users.length);
    });
    socket.on('joinGame', () => {
        game.joinGame(socket.id);
        socket.emit('opponent', game.opponent(socket.id))
    });
    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);
        game.leaveGame(socket.id);
        game.removeUser(socket.id);
        socket.broadcast.emit('online', Users.length);
    });
});





