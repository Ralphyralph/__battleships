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
    var ship = createShip(4, standingOrLaying());
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

        if (standingOrLaying === 1) {
            index_1++;
        } else {
            index_2++;
        }   
    }  
    return ship;     
}

standingOrLaying = function() {
    var standingOrLaying = _.random(0, 1);
    return standingOrLaying;
}


