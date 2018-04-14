const game = require('./game');
const ships = require('./ships');

exports.bomb = function(x, y, id) {

    console.log("YALLA", game.findOpponent(id));

    // for (var i = 0; i < opponent.ships.lenght; i++) {
    //     for (var j = 0; j < opponent.ships[i].lenght; j++) {
    //         if (opponent.ships[i][j].x === x && opponent.ships[i][j].y === y) {
    //             console.log("TRÄFF");
    //         } else {
    //             console.log("MISS");
    //         }
    //     }
    // }
}