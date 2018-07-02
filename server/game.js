const _ = require('underscore');
const shortId = require('shortid');

const Users = [];
const Games = [];
const ArchivedGames = [];
var AwaitingGame = [];
const Cols = 10; // X
const Rows = 10; // Y

exports.newUser = function(id, data) { 
    Users.push({
        id: id,
        user_name: data.userName,
        ships: data.ships
    });
}

exports.onlineUsers = function() {
    return Users.length;
}

exports.joinGame = function(id) {
    var player = findUser(id);
    AwaitingGame.push(player);
}

exports.doWeHaveAWinner = function(opponent,game) {

    var nrShipsDown = 0;
    
    _.each(opponent.ships, function(ship,i) {
        var shipDown = true;
        _.each(ship, function(square,ii) {
            if(typeof _.find(game.bombs, function(bomb) { return bomb.x === square.x && bomb.y === square.y && bomb.result === 'hit'; }) === 'undefined') {
                shipDown = false;
            }
        });
        if (shipDown === true) {
            nrShipsDown++;
        }
    });

    return nrShipsDown === opponent.ships.length;
}

exports.startGame = function() {
    if (AwaitingGame.length === 2) {
        Games.push({
            id: shortId.generate(),
            player_1: AwaitingGame[0],
            player_2: AwaitingGame[1],
            turn: AwaitingGame[1].id,
            bombs: [],
            status:'active',
            winner: null
        });
        AwaitingGame = [];
        return true;
    }
    return false;
}

exports.endGame = function(game,winner_socketId) {
    game.status = 'over';
    game.winner = winner_socketId;
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].id === game.id) {
            Games.splice(i, 1);
            break;
        }
    }
    ArchivedGames.push(game);
    console.log('Games',Games);
    console.log('ArchivedGames',ArchivedGames);
}

findUser = function(id) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === id) {
            return Users[i];
        }
    }
}

exports.findGame = function(id) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].player_1.id === id || Games[i].player_2.id === id) {
            return Games[i];
        }
    }
}

exports.changePlayerTurn = function(game) {
    if (game.turn === game.player_1.id) {
        game.turn = game.player_2.id;
    } else {
        game.turn = game.player_1.id;
    }
}

exports.findOpponent = function(id) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].player_1.id === id) {
            return Games[i].player_2;
        }
        if (Games[i].player_2.id === id) {
            return Games[i].player_1;
        }
    }
}

exports.findPlayer = function(id) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].player_1.id === id) {
            return Games[i].player_1;
        }
        if (Games[i].player_2.id === id) {
            return Games[i].player_2;
        }
    }
}

exports.leaveGame = function(player) {
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].player_1 === player || Games[i].player_2 === player) {
            Games.splice(i, 1);
        }
    }
}

exports.removeUser = function(player) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === player) {
            Users.splice(i, 1);
        }
    }
}
