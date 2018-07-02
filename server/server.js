const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const _ = require('underscore');

const game = require('./game');
const bomb = require('./bomb');
const config = require('../config/config.json');
const skins = require('./skins');

const port = 4004;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port, () => console.log("Listning on port:", port));

io.on('connection', socket => {

    socket.on('newUser', data => {
        game.newUser(socket.id, data);
        io.sockets.emit('online', {config:config, skins:skins.list, usersOnline:game.onlineUsers()});
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

    socket.on('chatMessage', (message, userId) => {
        var opponent = game.findOpponent(socket.id);
        socket.to(opponent.id).emit('newChatMessage', message);
    });

    socket.on('bomb', (x, y) => {
        var result = bomb.bomb(x, y, socket.id);
        var this_game = game.findGame(socket.id);
        var opponent = game.findOpponent(socket.id);

        bomb.addBombToGame(x, y, socket.id, result, this_game);

        var doWeHaveAWinner = game.doWeHaveAWinner(opponent,this_game);
        if (doWeHaveAWinner) {
            game.endGame(this_game,socket.id);
            var winner = socket.id;
        } else {
            var winner = null;
        }
        if (result === 'miss') {
            game.changePlayerTurn(this_game);
        }
        socket.emit('bomb_result', {result:result,socketId:socket.id, game:this_game, x:x, y:y, winner: winner});
        socket.to(opponent.id).emit('bomb_result', {result:result,socketId:socket.id, game:this_game, x:x, y:y, winner: winner});
    });

    socket.on('disconnect', () => {
        game.leaveGame(socket.id);
        game.removeUser(socket.id);
        socket.broadcast.emit('online', game.onlineUsers());
    });
});

