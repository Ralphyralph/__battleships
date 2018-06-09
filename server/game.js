const Users = [];
const Games = [];
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

exports.startGame = function() {
    if (AwaitingGame.length === 2) {
        Games.push({
            player_1: AwaitingGame[0],
            player_2: AwaitingGame[1],
            turn: AwaitingGame[1].id,
            bombs: []
        });
        AwaitingGame = [];
        return true;
    }
    return false;
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
