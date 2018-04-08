const uniqid = require('uniqid');

// Global Game variables
var Users = [];
var AwaitingGame = [];
var Games = [];
const Cols = 10; // X
const Rows = 10; // Y


function newUser(id, userName) {
    Users.push({
        id: id,
        user_name: userName
    });
    console.log("Adding user", id +" "+ userName);
}

function joinGame(player) {
    console.log(player, "is joining game...");
    AwaitingGame.push(player);
    if (AwaitingGame.length === 2) {
        Games.push({
            id: uniqid(),
            player_1: AwaitingGame[0],
            player_2: AwaitingGame[1],
        });
        AwaitingGame = []; // reset
    }
}

function opponent(player) {
    var opponentName;
    return opponentName;
}

function removeUser(user) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === user) {
            console.log("Removing user", Users[i]);
            Users.splice(i, 1);
        }
    }
}

function leaveGame(player) {
    console.log(player, "left game.");
}
