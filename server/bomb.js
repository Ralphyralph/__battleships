const game = require('./game');
const ships = require('./ships');


const boms = [];
const hits = [];

exports.bomb = function(x, y, id) {

    var opponent = game.findOpponent(id);

    for (var i = 0; i < opponent.ships.length; i++) {
        console.log("HALLÅÅ")
        for (var j = 0; j < opponent.ships[i].length; j++) {
            if (opponent.ships[i][j].x === x && opponent.ships[i][j].y === y) {
                return "hit";
            } else {
                return "miss";
            }
        }
    }
}