const board = document.querySelector('#board');
const boardSizeInput = document.querySelector('#boardSizeInput');
const restartGameButton = document.querySelector('#restartGameButton');
const numberOfColorsInput = document.querySelector('#numberOfColorsInput');
const currentScoreOutput = document.querySelector('#currentScoreOutput');

let boardSize;
let currentScore = 0;
let ballColors;

restartGameButton.addEventListener('click', ()=>{
    restartGame();
});

function drawBoard(){
    // Clear board:
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    // Draw new rows and tiles:
    for(let i=0; i<boardSize; i++){
        const row = document.createElement('div');
        row.classList.add('board__row');

        for(let j=0; j<boardSize; j++){
            const tile = document.createElement('div');
            tile.classList.add('board__row__tile');
            row.appendChild(tile);
        }

        board.appendChild(row);
    }
}

function generateColors(){
    let firstColorHue = randomInt(0, 360);
    for(let i=0; i<boardSize; i++){
        // stopped here
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restartGame(){
    boardSize = boardSizeInput.value;
    currentScore = 0;
    currentScoreOutput.innerHTML = 0;
    generateColors();

    drawBoard();
}