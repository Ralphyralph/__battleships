const _ = require('underscore');

const Cols = 10; // X
const Rows = 10; // Y


exports.generateShips = function() {
    var ships = [];
    // ships.push([
    //     {x: 0, y: 1},
    //     {x: 0, y: 2},
    //     {x: 0, y: 3},
    // ]);
    var ship = createShip(5, standingOrLaying());
    ships.push(ship);
    //ships.push(ship_4);
    console.log("Ships:", ships);
    return ships;

}

createShip = function(shipSize, standingOrLaying) {
    var index_1 = _.random(0, 9);
    var index_2 = _.random(0, 9);
    var ship = [];
    for (var i = 0; i < shipSize; i++) {
        ship.push({
            x: index_1,
            y: index_2 
        });
        if (index_2 <= 9 - shipSize) {
            index_2++;
        } else {
            index_2--;
        }

        
    }
    console.log("ship befor turn:", ship);

    if (standingOrLaying = 1) {
        for (var i = 0; i < shipSize; i++) {
            var tmp_a;
            var tmp_b;
            tmp_a = ship[i].x;
            tmp_b = ship[i].y;
            ship[i].x = tmp_b;
            ship[i].y = tmp_a;
        }
    } 

    console.log("ship:", ship);
    return ship;
}

standingOrLaying = function() {
    var standingOrLaying = _.random(0, 1);
    return standingOrLaying;
}


