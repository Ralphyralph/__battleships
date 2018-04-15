const game = require('./game');
const ships = require('./ships');

exports.bomb = function(x, y, id) {

    var opponent = game.findOpponent(id);

    for (var i = 0; i < opponent.ships.length; i++) {
        for (var j = 0; j < opponent.ships[i].length; j++) {
            if (opponent.ships[i][j].x === x && opponent.ships[i][j].y === y) {
                return "hit";
            } else {
                return "miss";
            }
        }
    }
}

exports.addBombToGame = function(x, y, id, result) {
    var _game = game.findGame(id);
    _game.bombs.push({
        x: x,
        y: y,
        player_id: id,
        result: result
    });
}
