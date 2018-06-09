const game = require('./game');

exports.bomb = function(x, y, id) {

    if (isPlayersTurn(id) === false) { return false; }

    var opponent = game.findOpponent(id);
    var hit = false;

    for (var i = 0; i < opponent.ships.length; i++) {
        for (var j = 0; j < opponent.ships[i].length; j++) {
            console.log(opponent.ships[i][j].x +'='+ x, opponent.ships[i][j].y +'='+ y);
            if (opponent.ships[i][j].x == x && opponent.ships[i][j].y == y) {
                console.log('WE ARE HIT');
                return 'hit';
            }
        }
    }
    return 'miss';
}

exports.addBombToGame = function(x, y, id, result, _game) {
    _game.bombs.push({
        x: x,
        y: y,
        player_id: id,
        result: result
    });
}

function isPlayersTurn(id) {
    var _game = game.findGame(id);
    return _game.turn === id;
}