function hit(ship) {
    return (ship.hits++);
}

function isSunk(ship) {
    if (ship.length === ship.hits) {
        ship.sunk = 'yes';
    }
}

function recieveAttack(target) {
    for (let ship in player) {
        for (let i = 0; i < player[ship].length; i++) {
            if ('location' in player[ship]) {
                if (player[ship].location[i] === target) {
                    hit(player[ship]);
                }
            }
        }
    }
}

function allSunk() {
    let sunkShips = 0;
    for (let ship in player) {
        if ('sunk' in player[ship]) {
            if (player[ship].sunk === 'yes') {
                sunkShips++
            }
        }
    }
    if (sunkShips === 3) {
        console.log('sunk')
    }
}

const player = {
    battleship: {length: 2, hits: 0, sunk: 'no', location: ['a2', 'a3']},
    sinkingShip: {length: 2, hits: 2, sunk: 'no', location: ['b4', 'b5']},
    submarine: {length: 2, hits: 0, sunk: 'no', location: ['c5', 'c6']}
}

test('hit function changes ship hit value', () => {
    hit(player.battleship);
    expect(player.battleship.hits).toBe(1);
});

test('sink function works', () => {
    isSunk(player.sinkingShip);
    expect(player.sinkingShip.sunk).toBe('yes');
});

test('recieveAttack hits ships on given coordinates', () => {
    recieveAttack('c5');
    expect(player.submarine.hits).toBe(1);
});

test('allSunk function works', () => {
    player.battleship.sunk = 'yes';
    player.sinkingShip.sunk = 'yes';
    player.submarine.sunk = 'yes';
});