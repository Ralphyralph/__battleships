const _ = require('underscore');

const Cols = 10;
const Rows = 10;

exports.generateShips = function() {
    var ships = [];
    createShip(4, standingOrLaying(), ships);
    createShip(3, standingOrLaying(), ships);
    createShip(2, standingOrLaying(), ships);
    createShip(1, standingOrLaying(), ships);
    return ships;
}

// above left   ::: ships[i].x == x-1 && ships[i].y == y-1 
// above        ::: ships[i].x == x && ships[i].y == y-1 
// above right  ::: ships[i].x == x+1 && ships[i].y == y-1 
// left         ::: ships[i].x == x-1 && ships[i].y == y 
// center       ::: ships[i].x == x && ships[i].y == y 
// right        ::: ships[i].x == x+1 && ships[i].y == y 

// below left   ::: ships[i].x == x-1 && ships[i].y == y+1 
// below        ::: ships[i].x == x && ships[i].y == y+1 
// below right  ::: ships[i].x == x+1 && ships[i].y == y+1 

isCollision = function(ships,x,y) {
    var collision = false;
    for (var i = 0; i < ships.length; i++) {
        for (var ii = 0; ii < ships[i].length; ii++) {

            if ((ships[i][ii].x == x-1 && ships[i][ii].y == y-1) ||   // above left
                (ships[i][ii].x == x && ships[i][ii].y == y-1) ||     // above
                (ships[i][ii].x == x+1 && ships[i][ii].y == y-1) ||   // above right
                (ships[i][ii].x == x-1 && ships[i][ii].y == y) ||     // left 
                (ships[i][ii].x == x && ships[i][ii].y == y) ||      // center
                (ships[i][ii].x == x+1 && ships[i][ii].y == y) ||     // right
                (ships[i][ii].x == x-1 && ships[i][ii].y == y+1) ||   // below left
                (ships[i][ii].x == x && ships[i][ii].y == y+1) ||     // below
                (ships[i][ii].x == x+1 && ships[i][ii].y == y+1)) {   // below right
                    collision = true;
                    break;
            }
        }
    }
    return collision;
}

createShip = function(shipSize, standingOrLaying, ships) {

    var ii = 0;
    var shipReady = false;

    while (ii < 2000 && shipReady === false) {

        console.log('run while');
        
        var should_ship_be_placed = true;
        var ship = [];

        if (standingOrLaying === 1) {
            var index_1 = _.random(0, (Cols-1)-shipSize);
            var index_2 = _.random(0, (Rows-1));
        } else {
            var index_1 = _.random(0, (Cols-1));
            var index_2 = _.random(0, (Rows-1)-shipSize);
        }

        for (var i = 0; i < shipSize; i++) {

            if (standingOrLaying === 1) {
                if (isCollision(ships,index_1,index_2)) {
                    console.log('is isCollision');
                    should_ship_be_placed == false;
                    continue;
                }
            } else {
                if (isCollision(ships,index_2,index_1)) {
                    console.log('is isCollision');
                    should_ship_be_placed == false;
                    continue;
                }
            }

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

        if (should_ship_be_placed === true) {
            console.log('ship Ready');
            shipReady = true;
        }

        if (ship.length !== shipSize) {
            console.log('WTF WTF');
            shipReady = false;
        }

        ii++;
    }



    ships.push(ship);   
}

standingOrLaying = function() {
    var standingOrLaying = _.random(0, 1);
    return standingOrLaying;
}
