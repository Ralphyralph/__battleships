const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const game = require('./game');
const ships = require('./ships');
const bomb = require('./bomb');

const port = 4004;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port, () => console.log("Listning on port:", port));

io.on('connection', socket => {
    console.log("Client connected! Socket ID:", socket.id);

    socket.on('newUser', userName => {
        game.newUser(socket.id, userName);
        io.sockets.emit('online', game.onlineUsers());
    });

    socket.emit('ships', ships.generateShips());

    socket.on('joinGame', () => {
        game.joinGame(socket.id);
        game.addGame(); // if 2 opponents join, add a game 

        if (game.isPlayerWaiting() === false) {
            var opponent = game.findOpponent(socket.id)
            var opponent_2 = game.findOpponent(opponent.id);
            socket.emit('startGame', opponent.user_name, true);
            socket.to(opponent.id).emit('startGame', opponent_2.user_name, false);
        } else {
            console.log("Waiting for opponant..");
        }
    });

    socket.on('bomb', (x, y) => {
        var result = bomb.bomb(x, y, socket.id);
        bomb.addBombToGame(x, y, socket.id, result);

        

        socket.emit('bomb_result', result);

        //bomb.bomb(x, y, socket.id);
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected! Socket ID:", socket.id);

        game.leaveGame(socket.id);
        game.removeUser(socket.id);
        socket.broadcast.emit('online', game.onlineUsers());
    });
});





