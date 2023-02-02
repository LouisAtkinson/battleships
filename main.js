const playerBoard = document.getElementById('playerboard');
const computerBoard = document.getElementById('computerboard');
const menuBoard = document.getElementById('menuboard');
const shipName = document.getElementById('shipname');
let player;
let computer;
let playerName;
let shipLength;
let startSquares = [];
let compStartSquares = [];

const startBtn = document.getElementById('startbtn');
startbtn.addEventListener('click', playerNameMenu);

const submitNameBtn = document.getElementById("submitname");
submitNameBtn.addEventListener('click', submitName);

const ship = (length, hits, sunk, location) => {
    const hit = ship => {
        ship.hits++;
        console.log(ship.hits);
        console.log(ship)
    }
    const isSunk = ship => {
        if (ship.length === ship.hits) {
            ship.sunk = 'yes';
        } else {
        }
    }
    return {hit, isSunk, length, hits, sunk, location};
}

const gameboard = (one, two, three, four, five) => {
    const carrier = ship(5, 0, 'no', [one]);
    const battleship = ship(4, 0, 'no', [two]);
    const destroyer = ship(3, 0, 'no', [three]);
    const submarine = ship(3, 0, 'no', [four]);
    const patrolBoat = ship(2, 0, 'no', [five]);

    const placeShip = (ship) => {
        for (let i = 1; i < ship.length; i++) {
            ship.location.push(ship.location[0] + i)
        }
    }

    placeShip(carrier);
    placeShip(battleship);
    placeShip(destroyer);
    placeShip(submarine);
    placeShip(patrolBoat);

    const recieveAttack = (target) => {
        for (let ship in player) {
            for (let i = 0; i < player[ship].length; i++) {
                if ('location' in player[ship]) {
                    if (player[ship].location[i] === target) {
                        player[ship].hit(player[ship]);
                        return;
                    }
                }
            }
        }
    }

    const allSunk = () => {
        let sunkShips = 0;
        for (let ship in player) {
            if ('sunk' in player[ship]) {
                if (player[ship].sunk === 'yes') {
                    sunkShips++
                }
            }
        }
        if (sunkShips === 5) {
            console.log('sunk')
        }
    }
    return {carrier, battleship, destroyer, submarine, patrolBoat, recieveAttack, allSunk};
}

function playerNameMenu() {
/*     clear();
    display.style.display = "none"; */
    startBtn.style.display = "none";
/*     replay.style.display = "none";
    changeNames.style.display = "none"; */
    document.getElementById("form-popup").style.display = "block";
}

function submitName() {
    playerName = capitalise(document.getElementById("name").value);
    document.getElementById("form-popup").style.display = "none";
    placeShipMenu();
}

function placeShipMenu() {
    document.getElementById("placeshipmenu").style.display = "block";
    createBoard(menuBoard, 'menuSquare');
    shipLength = 5;
    placeShipDisplay('Carrier', 5);
}

function placeShipDisplay(ship, length) {
    shipName.innerText = ship;
    let menuSquares = document.querySelectorAll('.menuSquare');
    let menuSquareArray = Array.prototype.slice.call(menuSquares);
    for (let i = 0; i < 100; i++) {
        menuSquareArray[i].outerHTML
        menuSquareArray[i].innerHTML = i + 1;
        menuSquareArray[i].classList.remove('legal');
        menuSquareArray[i].classList.remove('illegal');
        if ((i < (11 - length) || (i % 10) < (11 - length)) && !menuSquareArray[i].classList.contains('occupied') && !menuSquareArray[i + shipLength - 1].classList.contains('occupied')) {
            menuSquareArray[i].classList.add('legal');
            menuSquareArray[i].addEventListener('click', function showShip(event) {;
                let targetSquare = event.target;
                if (!startSquares.includes(targetSquare.innerHTML) && !menuSquareArray[i].classList.contains('occupied') && !menuSquareArray[i + shipLength - 1].classList.contains('occupied')) {
                    startSquares.push(targetSquare.innerHTML);
                    console.log(startSquares.length)
                    targetSquare.classList.add('occupied');
                    for (let i = 1; i < shipLength; i++) {
                        targetSquare = targetSquare.nextSibling;
                        console.log(startSquares.length)
                        targetSquare.classList.add('occupied');
                    }
                    for (let i = 0; i < 100; i++) {
                        menuSquareArray[i].removeEventListener('click', showShip);
                    }
                    nextShip();
                }
            })
        } else {
            menuSquareArray[i].classList.add('illegal');
            menuSquareArray[i].addEventListener('click', function (event) {
                console.log('no' + event.target.innerHTML);
            })
        }
    }
}

function nextShip() {
    if (startSquares.length === 1) {
        shipLength = 4;
        placeShipDisplay('Battleship', 4);
    } else if (startSquares.length === 2) {
        shipLength = 3;
        placeShipDisplay('Destroyer', 3);
    } else if (startSquares.length === 3) {
        placeShipDisplay('Submarine', 3);
    } else if (startSquares.length === 4) {
        shipLength = 2;
        placeShipDisplay('Patrol boat', 2);
    } else {
        document.getElementById("placeshipmenu").style.display = "none";
        menuBoard.innerHTML = '';
        startGame();
    }
}

function startGame() {
    player = gameboard(startSquares[0], startSquares[1], startSquares[2], startSquares[3], startSquares[4]);

}

function computerLocation() {
    let carrierLocation = Math
}
function createBoard(board, typeSquare) {
    for (let i = 1; i < 101; i++) {
        let square = document.createElement('div');
        square.classList.add(i);
        square.classList.add('square');
        square.classList.add(typeSquare);
        board.appendChild(square);
    }
}

function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

createBoard(playerBoard, 'p');
createBoard(computerBoard, 'c');