const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const game = require('./game');
const bomb = require('./bomb');

const port = 4004;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port, () => console.log("Listning on port:", port));

io.on('connection', socket => {

    socket.on('newUser', data => {
        game.newUser(socket.id, data);
        io.sockets.emit('online', game.onlineUsers());
    });

    socket.on('joinGame', () => {
        game.joinGame(socket.id);
        
        if (game.startGame()) {
            var player = game.findPlayer(socket.id)
            var opponent = game.findOpponent(socket.id);

            socket.emit('startGame', opponent.user_name, true);
            socket.to(opponent.id).emit('startGame', player.user_name, false);
        } else {
            console.log("Waiting for opponent..");
        }
    });

    socket.on('bomb', (x, y) => {
        var result = bomb.bomb(x, y, socket.id);
        var this_game = game.findGame(socket.id);
        var opponent = game.findOpponent(socket.id);

        bomb.addBombToGame(x, y, socket.id, result, this_game);
        game.changePlayerTurn(this_game);
        socket.emit('bomb_result', {result:result,socketId:socket.id, game:this_game, x:x, y:y});
        socket.to(opponent.id).emit('bomb_result', {result:result,socketId:socket.id, game:this_game, x:x, y:y});
    });

    socket.on('disconnect', () => {
        game.leaveGame(socket.id);
        game.removeUser(socket.id);
        socket.broadcast.emit('online', game.onlineUsers());
    });
});

