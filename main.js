const boards = document.getElementById('boards');
const playerBoard = document.getElementById('playerboard');
const computerBoard = document.getElementById('computerboard');
const menuBoard = document.getElementById('menuboard');
const shipName = document.getElementById('shipname');
const turnText = document.getElementById('turn');
const result = document.getElementById('result');
let player;
let computer;
let playerName;
let shipLength;
let legalNumber;
let turn;
let isHit = 0;
let sunkMessage = 0;
let sunkShip = 0;
let gameOver = 0;
let startSquares = [];
let compStartSquares = [];

const startBtn = document.getElementById('startbtn');
startbtn.addEventListener('click', function() {
    startBtn.style.display = "none";
    document.getElementById("form-popup").style.display = "block"; 
});

const submitNameBtn = document.getElementById("submitname");
submitNameBtn.addEventListener('click', function() {
    playerName = capitalise(document.getElementById("name").value);
    document.getElementById("form-popup").style.display = "none";
    placeShipMenu();
});


const ship = (name, length, hits, sunk, location) => {
    const getName = () => name;

    const hit = ship => {
        ship.hits++;
        console.log(ship.getName + 'is hit');
        isHit = 1;
    }
    const isSunk = ship => {
        if (ship.length === ship.hits) {
            ship.sunk = 'yes';
            sunkShip = 1;
            sunkMessage = ship.getName() + ' has sunk!';
        } else {
        }
    }
    return {name, hit, isSunk, length, hits, sunk, location, getName};
}

const gameboard = (one, two, three, four, five) => {
    const carrier = ship('carrier', 5, 0, 'no', [parseInt(one)]);
    const battleship = ship('battleship', 4, 0, 'no', [parseInt(two)]);
    const destroyer = ship('destroyer', 3, 0, 'no', [parseInt(three)]);
    const submarine = ship('submarine', 3, 0, 'no', [parseInt(four)]);
    const patrolBoat = ship('patrol boat', 2, 0, 'no', [parseInt(five)]);

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

    const recieveAttack = (who, target) => {
        for (let ship in who) {
            for (let i = 0; i < who[ship].length; i++) {
                if ('location' in who[ship]) {
                    if (who[ship].location[i] === target) {
                        who[ship].hit(who[ship]);
                        who[ship].isSunk(who[ship]);
                        console.log(sunkShip);
                        return;
                    }
                }
            }
        }
    }

    const allSunk = (who) => {
        let sunkShips = 0;
        for (let ship in who) {
            if ('sunk' in who[ship]) {
                if (who[ship].sunk === 'yes') {
                    sunkShips++
                }
            }
        }
        if (sunkShips === 5) {
            gameOver = 1;
            endGame(who);
        }
    }
    return {carrier, battleship, destroyer, submarine, patrolBoat, recieveAttack, allSunk};
}

function placeShipMenu() {
    document.getElementById("placeshipmenu").style.display = "flex";
    createBoard(menuBoard, 'playerSquare');
    shipLength = 5;
    placeShipDisplay('carrier', 5);
}

function placeShipDisplay(ship, length) {
    shipName.innerText = 'Place your ' + ship;
    let playerSquares = document.querySelectorAll('.playerSquare');
    let playerSquareArray = Array.prototype.slice.call(playerSquares);
    for (let i = 0; i < 100; i++) {
        playerSquareArray[i].innerHTML = i + 1;
        playerSquareArray[i].classList.remove('legal');
        if ((i < (11 - length) || (i % 10) < (11 - length)) && !playerSquareArray[i].classList.contains('occupied') && !playerSquareArray[i + shipLength - 1].classList.contains('occupied')) {
            playerSquareArray[i].classList.add('legal');
            playerSquareArray[i].addEventListener('click', function showShip(event) {;
                let targetSquare = event.target;
                if (!startSquares.includes(targetSquare.innerHTML) && !playerSquareArray[i].classList.contains('occupied') && !playerSquareArray[i + shipLength - 1].classList.contains('occupied')) {
                    startSquares.push(targetSquare.innerHTML);
                    targetSquare.classList.add('occupied')
                    targetSquare.classList.add('illegal');
                    for (let i = 1; i < shipLength; i++) {
                        targetSquare = targetSquare.nextSibling;
                        targetSquare.classList.add('occupied')
                        targetSquare.classList.add('illegal');
                    }
                    for (let i = 0; i < 100; i++) {
                        playerSquareArray[i].removeEventListener('click', showShip);
                    }
                    if (startSquares.length === 5) {
                        for (let i = 0; i <100 ; i++) {
                            playerSquareArray[i].classList.remove('legal');
                            playerSquareArray[i].classList.remove('illegal');
                        }
                    }
                    nextShip();
                }
            })
        } else {
            playerSquareArray[i].classList.add('illegal');
            playerSquareArray[i].addEventListener('click', function (event) {
                console.log('no' + event.target.innerHTML);
            })
        }
    }
}

function nextShip() {
    if (startSquares.length === 1) {
        shipLength = 4;
        placeShipDisplay('battleship', 4);
    } else if (startSquares.length === 2) {
        shipLength = 3;
        placeShipDisplay('destroyer', 3);
    } else if (startSquares.length === 3) {
        placeShipDisplay('submarine', 3);
    } else if (startSquares.length === 4) {
        shipLength = 2;
        placeShipDisplay('patrol boat', 2);
    } else {
        playerBoardReady = menuBoard.cloneNode(true);
        playerBoard.appendChild(playerBoardReady);
        document.getElementById("placeshipmenu").style.display = "none";
        menuBoard.innerHTML = '';
        createBoard(computerBoard, 'compSquare');
        shipLength = 5;
        computerLocation(5);
    }
}

function computerLocation(length) {
    let compSquares = document.querySelectorAll('.compSquare');
    let compSquareArray = Array.prototype.slice.call(compSquares);
    for (let i = 0; i < 100; i++) {
        compSquareArray[i].innerHTML = i + 1;
        compSquareArray[i].classList.remove('legal');
        if ((i < (11 - length) || (i % 10) < (11 - length)) && !compSquareArray[i].classList.contains('occupied') && !compSquareArray[i + shipLength - 1].classList.contains('occupied')) {
            compSquareArray[i].classList.add('legal');
            compSquareArray[i].addEventListener('click', function showShip(event) {;
               
            })
        } else {
            compSquareArray[i].classList.add('illegal');
        }
    }
    computerRandom();
    let targetSquare = compSquareArray[legalNumber];
    if (!compStartSquares.includes(targetSquare.innerHTML)) {
        compStartSquares.push(targetSquare.innerHTML);
        targetSquare.classList.add('occupied')
        targetSquare.classList.add('illegal');
        for (let i = 1; i < shipLength; i++) {
            targetSquare = targetSquare.nextSibling;
            targetSquare.classList.add('occupied')
            targetSquare.classList.add('illegal');
        }
        if (compStartSquares.length === 5) {
            for (let i = 0; i <100 ; i++) {
                compSquareArray[i].classList.remove('legal');
                compSquareArray[i].classList.remove('illegal');
            }
        }
        compNextShip();
    }
}

function computerRandom() {
    let randomNumber = getRandomIntInclusive(0, 99);
    let compSquares = document.querySelectorAll('.compSquare');
    let compSquareArray = Array.prototype.slice.call(compSquares);
    if (compSquareArray[randomNumber].classList.contains('illegal')) {
        computerRandom();
    } else {
        legalNumber = randomNumber;
    }
}

function computerRandomAttack() {
    let randomNumber = getRandomIntInclusive(0, 99);
    let playerSquares = document.querySelectorAll('.playerSquare');
    let playerSquareArray = Array.prototype.slice.call(playerSquares);
    if (playerSquareArray[randomNumber].classList.contains('hit') || playerSquareArray[randomNumber].classList.contains('missed')) {
        computerRandomAttack();
    } else {
        legalNumber = randomNumber;
    }
}

function compNextShip() {
    if (compStartSquares.length === 1) {
        shipLength = 4;
        computerLocation(4);
    } else if (compStartSquares.length === 2) {
        shipLength = 3;
        computerLocation(3);
    } else if (compStartSquares.length === 3) {
        computerLocation(3);
    } else if (compStartSquares.length === 4) {
        shipLength = 2;
        computerLocation(5);
    } else {
        boards.style.display = 'flex';
        startGame(startSquares, compStartSquares);
    }
}

function startGame(startSquares, compStartSquares) {
    player = gameboard(startSquares[0], startSquares[1], startSquares[2], startSquares[3], startSquares[4]);
    computer = gameboard(compStartSquares[0], compStartSquares[1], compStartSquares[2], compStartSquares[3], compStartSquares[4]);
    turn = 'player';
    turnText.innerHTML = "It is your turn"
    if (playerName === '') {
        document.getElementById('playername').innerHTML = 'Player';
    } else {
        document.getElementById('playername').innerHTML = capitalise(playerName);
    } playGame();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playGame() {
    let compSquares = document.querySelectorAll('.compSquare');
    let compSquareArray = Array.prototype.slice.call(compSquares);
    for (let i = 0; i < 100; i++) {
        compSquareArray[i].addEventListener('click', function() {
            if (turn === 'player' && !compSquareArray[i].classList.contains('hit') && !compSquareArray[i].classList.contains('missed')) {
                let targetSquare = compSquareArray[i].innerHTML;
                computer.recieveAttack(computer, parseInt(targetSquare));
                if (isHit === 1) {
                    compSquareArray[i].classList.add('hit');
                    result.innerHTML = 'You got a hit!';
                    isHit = 0;
                    if (sunkShip === 1) {
                        result.innerHTML = "The computer's " + sunkMessage;
                        sunkShip = 0;
                        computer.allSunk(computer);
                        if (gameOver === 1) {
                            return;
                        }                   
                    }
                } else {
                    compSquareArray[i].classList.add('missed');
                    result.innerHTML = 'You missed'
                } turn = 'computer';
                turnText.innerHTML = "It is the computer's turn";
                sleep(2000).then(() => { 
                    let playerSquares = document.querySelectorAll('.playerSquare');
                let playerSquareArray = Array.prototype.slice.call(playerSquares);
                computerRandomAttack();
                targetSquare = playerSquareArray[legalNumber].innerHTML;
                player.recieveAttack(player, parseInt(targetSquare));
                    if (isHit === 1) {
                        playerSquareArray[legalNumber].classList.add('hit');
                        result.innerHTML = 'The computer hit!';
                        isHit = 0
                        if (sunkShip === 1) {
                            result.innerHTML = "Your " + sunkMessage;
                            sunkShip = 0;
                            player.allSunk(player);
                            if (gameOver === 1) {
                                return;
                            }
                        }
                    } else {
                        playerSquareArray[legalNumber].classList.add('missed');
                        result.innerHTML = 'The computer missed'
                    }
                turn = 'player';
                turnText.innerHTML = "It is your turn";
                });
                
            }
        })
    }
}

function endGame(loser) {
    turn = '';
    turnText.innerHTML = '';
    if (loser === player) {
        result.innerHTML = 'Oh no, you lost!';
    } else {
        result.innerHTML = 'Congratulations! You won.'
    }
}