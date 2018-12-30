const aStarFinder = new AStarFinder();

// html elements:
const boardHTMLElement = document.querySelector('#board');
const boardSizeInput = document.querySelector('#boardSizeInput');
const restartGameButton = document.querySelector('#restartGameButton');
const numberOfColorsInput = document.querySelector('#numberOfColorsInput');
const currentScoreOutput = document.querySelector('#currentScoreOutput');
const nextBallColorHTMLElements = document.querySelectorAll('.nextBallColor');
let tileNodes; // two dimensional array of tiles

// game variables:
let boardSize;
let currentScore = 0;
let ballColors = [];
let isGameOver = false;
let board = []; // two-dimensional array of colors
let nextBallColors = [];
let selectedTile; // tile with selected ball (first click to select, second click to move)
// let numberOfBusyTiles = 0;
let numberOfColors;
let hoveredTile = { x: 0, y: 0, isPath: false } // only for moving active ball

restartGameButton.addEventListener('click', () => {
    restartGame();
});

function addNext3Balls() {

    const newlyAdded = [];

    for (let i = 0; i < 3; i++) {
        if (isBoardFull()) {
            return false; // loss
        }

        while (true) { // try to find next free tile in board
            const posX = randomInt(0, 8);
            const posY = randomInt(0, 8);

            if (board[posX][posY] == null) {
                const color = nextBallColors[i];
                const ballNode = document.createElement('div');
                ballNode.classList.add('ball', 'color' + nextBallColors[i]);
                tileNodes[posX][posY].appendChild(ballNode);
                board[posX][posY] = color;
                newlyAdded.push({ posX, posY, color });
                break;
            }
        }
    }

    // for every nextBall: check for 5 in a row after adding it
    newlyAdded.forEach((ball) => {
        checkFor5({ x: ball.posX, y: ball.posY }, board, ball.color, boardSize);
    });

    if (isBoardFull()) {
        return false; // loss
    }

    return true;
}

function addNewBall(x, y) {
    const ballElement = document.createElement('div');
    const ballColor = randomInt(1, numberOfColors);
    ballElement.classList.add('ball');
    ballElement.classList.add('color' + ballColor);
    const tile = boardHTMLElement.querySelectorAll(':scope >*')[y].childNodes[x];
    if (tile.childNodes.length > 0) {
        return false;   // if tile is busy stop function, return false
    }
    tile.appendChild(ballElement);
    // numberOfBusyTiles++;
    board[x][y] = ballColor;
    return true;
}

function checkFor5(movedPos, board, movedColor, boardSize) { // todo: fix, not always working 
    // todo: fix vertical, horizontal
    function checkInDirection(dirX, dirY) {

        let line = [movedPos];
        let iDir = 1; // go in specified by dirX and dirY or direction (1) or go backwards (-1)
        let i = 1;

        for (; true; i += iDir) { // keep checking for the same color in that direction
            let x = i * dirX + movedPos.x; // posX
            let y = i * dirY + movedPos.y; // posY
            // 1. if position is not inside the board:
            if ((x >= 0 && y >= 0 && x < boardSize && y < boardSize) == false) {
                if (iDir == 1) {
                    i = 0; // will be -1 after iteration
                    iDir = -1;
                    continue;
                } else {
                    if (line.length >= 5) {
                        return line;
                    } else {
                        return [];
                    }
                }
            }

            // 2. if next color is the same, add it to line
            if (board[x][y] == movedColor) {
                line.push({ x, y });
            } else { // no more balls of the same color in this direction, change direction
                if (iDir == 1) {
                    i = 0; // will be -1 after iteration
                    iDir = -1;
                } else {
                    if (line.length >= 5) {
                        return line;
                    } else {
                        return [];
                    }
                }
            }
        }
    }

    let diagonal1 = checkInDirection(-1, 1);
    let vertical = checkInDirection(0, 1);
    let diagonal2 = checkInDirection(1, 1);
    let horizontal = checkInDirection(1, 0);

    let ballsToRemove = diagonal1.concat(vertical).concat(diagonal2).concat(horizontal);

    if (ballsToRemove.length > 0) {
        let removedCount = 0;
        ballsToRemove.forEach((ball) => {
            if (board[ball.x][ball.y] == null) {
                return; // skip, it's a duplicate
            }
            board[ball.x][ball.y] = null;
            tileNodes[ball.x][ball.y].innerHTML = '';
            removedCount++;
        });
        setGameScore(currentScore + removedCount * removedCount);
        return true; // next turn
    } else {
        return false; // no next turn
    }
}

function clearPaths() {
    tileNodes.forEach(row => {
        row.forEach(tile => {
            tile.classList.remove('openList');
            tile.classList.remove('closedList');
            tile.classList.remove('finalPath');
        });
    });
}

function drawBoard() {
    // Clear board:
    while (boardHTMLElement.firstChild) {
        boardHTMLElement.removeChild(boardHTMLElement.firstChild);
    }
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board.push([]);
    }

    // Draw new rows and tiles:
    for (let i = 0; i < boardSize; i++) {
        const row = document.createElement('div');
        row.classList.add('board__row');
        for (let j = 0; j < boardSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('board__row__tile');
            tile.addEventListener('click', onTileClick);
            tile.addEventListener('mouseover', onTileHover);
            row.appendChild(tile);
        }
        boardHTMLElement.appendChild(row);
    }
    tileNodes = boardToTileNodeArray(boardHTMLElement, boardSize);
}

function drawPath(from, to) {
    let path = aStarFinder.findPath(board, from, to, { x: boardSize, y: boardSize });
    // uncomment if you want to visualize a-star seraching algorithm:
    // paintPath(path);

    hoveredTile = { x: to.x, y: to.y, isPath: path.success };
}

function gameOver() {
    alert('Game over. Your score: ' + currentScore);
}

function isBoardFull() {
    return board.every((row) => {
        return row.every((tile) => {
            return tile != null
        })
    });
}

function onTileClick(event) {
    if (isGameOver) {
        return;
    }

    const tile = getTileFromEventTarget(event.target);

    let clickedPos = getTilePosition(tile);

    if (board[clickedPos.x][clickedPos.y]) {  // if there is ball on clicked tile: change selection
        // remove selection from all balls:
        document.querySelectorAll('.ball').forEach((el) => {
            el.classList.remove('selected');
        });
        // change selected tile, add css class
        selectedTile = { x: clickedPos.x, y: clickedPos.y, htmlElement: tile };
        selectedTile.htmlElement.children[0].classList.add('selected');
    } else { // if there is no ball on clicked tile
        if (selectedTile && hoveredTile.isPath) { // move, check if 5 in line
            const clickedTileNode = tileNodes[clickedPos.x][clickedPos.y];
            const selectedTileNode = tileNodes[selectedTile.x][selectedTile.y];
            const selectedBallColor = board[selectedTile.x][selectedTile.y];

            clickedTileNode.appendChild(selectedTileNode.children[0]);
            clickedTileNode.children[0].classList.remove('selected');
            board[clickedPos.x][clickedPos.y] = selectedBallColor;
            board[selectedTile.x][selectedTile.y] = null;
            selectedTile = null;

            clearPaths();
            if (!checkFor5(clickedPos, board, selectedBallColor, boardSize) && !addNext3Balls()) {
                gameOver();
            }
            randomNext3Colors();
        }
    }
}

function onTileHover(event) {
    // if there is selected tile and target has no child(tile with no ball) and target is not ball:
    if (selectedTile && event.target.childNodes.length == 0 && !event.target.classList.contains('ball')) {
        const tile = getTileFromEventTarget(event.target);
        drawPath(selectedTile, getTilePosition(tile));
    }
}

function randomNext3Colors() {
    nextBallColors = [
        randomInt(1, numberOfColors),
        randomInt(1, numberOfColors),
        randomInt(1, numberOfColors),
    ];

    nextBallColorHTMLElements[0].className = '';
    nextBallColorHTMLElements[1].className = '';
    nextBallColorHTMLElements[2].className = '';

    nextBallColorHTMLElements[0].classList.add('color' + nextBallColors[0], 'nextBallColor');
    nextBallColorHTMLElements[1].classList.add('color' + nextBallColors[1], 'nextBallColor');
    nextBallColorHTMLElements[2].classList.add('color' + nextBallColors[2], 'nextBallColor');
}

function restartGame() {
    isGameOver = false;
    boardSize = boardSizeInput.valueAsNumber;
    numberOfColors = numberOfColorsInput.valueAsNumber;
    currentScore = 0;
    currentScoreOutput.innerHTML = 0;
    randomNext3Colors();
    drawBoard();
    // add 3 balls to the board:
    for (let i = 0; i < 3; i++) {
        while (true) {
            let x = randomInt(0, boardSize - 1);
            let y = randomInt(0, boardSize - 1);
            if (addNewBall(x, y)) {
                break;
            }
        }
    }
}

function setGameScore(score) {
    currentScore = score;
    currentScoreOutput.innerHTML = score;
}
