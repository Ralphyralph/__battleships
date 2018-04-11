const uniqid = require('uniqid');


const Users = [];
const Games = [];
var AwaitingGame = [];
const Cols = 10; // X
const Rows = 10; // Y


exports.newUser = function(id, userName) {
    Users.push({
        id: id,
        user_name: userName
    });
    console.log("Adding user. id:", id,"name:", userName);
}

exports.onlineUsers = function() {
    return Users.length;
}

exports.joinGame = function(id) {
    var player = findUser(id);
    AwaitingGame.push(player);
    console.log(player, "is joining game...");
}

findUser = function(id) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === id) {
            return Users[i];
        }
    }
}

exports.isPlayerWaiting = function() {
    if (AwaitingGame.length === 1) {
        return true;
    } else {
        return false;
    }
}

exports.addGame = function() {
    if (AwaitingGame.length === 2) {
        Games.push({
            id: uniqid(),
            player_1: AwaitingGame[0],
            player_2: AwaitingGame[1],
        });
        AwaitingGame = []; // reset
        console.log("Game added");
        console.log(Games);
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

exports.leaveGame = function(player) {
    console.log(player, "left game.");
    for (var i = 0; i < Games.length; i++) {
        if (Games[i].player_1 === player || Games[i].player_2 === player) {
            console.log("Removing game", Games[i]);
            Games.splice(i, 1);
        }
    }
}

exports.removeUser = function(player) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === player) {
            console.log("Removing player", Users[i]);
            Users.splice(i, 1);
        }
    }
}




