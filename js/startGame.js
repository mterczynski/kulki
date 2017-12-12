const boardHTMLElement = document.querySelector('#board');
const boardSizeInput = document.querySelector('#boardSizeInput');
const restartGameButton = document.querySelector('#restartGameButton');
const numberOfColorsInput = document.querySelector('#numberOfColorsInput');
const currentScoreOutput = document.querySelector('#currentScoreOutput');
const nextBallColorHTMLElement = document.querySelector('#nextBallColor');

let boardSize;
let currentScore = 0;
let ballColors = [];
let isGameOver = false;
let board = []; // two dimension array
let nextBallColor;
let selectedTile; // tile with selected ball (first click to select, second click to move)

restartGameButton.addEventListener('click', ()=>{
    restartGame();
});

function addNewBall(x, y){
    const ballElement = document.createElement('div');
    ballElement.classList.add('ball');
    ballElement.style.background = getRandomBallColor();
    boardHTMLElement.querySelectorAll(':scope >*').childNodes[y].childNodes[x];
    boardHTMLElement.appendChild(ballElement);
}

function drawBoard(){
    // Clear board:
    while (boardHTMLElement.firstChild) {
        boardHTMLElement.removeChild(boardHTMLElement.firstChild);
    }
    board = [];
    for(let i=0; i<boardSize; i++){
        board.push([]);
    }

    // Draw new rows and tiles:
    for(let i=0; i<boardSize; i++){
        const row = document.createElement('div');
        row.classList.add('board__row');
        for(let j=0; j<boardSize; j++){
            const tile = document.createElement('div');
            tile.classList.add('board__row__tile');
            tile.addEventListener('click', onTileClick);
            row.appendChild(tile);
        }
        boardHTMLElement.appendChild(row);
    }
}

function generateColors(){
    const firstColorHue = randomFloat(0, 360);
    ballColors = [firstColorHue];
    for(let i=1; i<boardSize; i++){
        const nextColor = (firstColorHue + 360/boardSize * i) % 360;
        ballColors.push(nextColor);
    }
    nextBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
    nextBallColorHTMLElement.style.backgroundColor = `hsl(${nextBallColor}, 80%, 50%)`;
}

function onTileClick(event){
    if(isGameOver){
        return;
    }

    const boardRows = boardHTMLElement.querySelectorAll(':scope >*');

    let clickedX; // x axis
    let clickedY; // y axis 

    // get x and y of clicked tile:
    for(let i=0; i<boardSize; i++){
        if(event.target.parentNode === boardRows[i]){
            clickedY = i;
            const row = boardRows[i];
            for(let j=0; j<boardSize; j++){
                if(row.childNodes[j] === event.target){
                    clickedX = j
                }
            }
        }  
    }

    console.log({x: clickedX, y: clickedY});
    if(board[clickedX][clickedY]){  // if there is ball on clicked tile: change selection
        // remove selection from all tiles:
        document.querySelectorAll('.board__row__tile').forEach((el)=>{
            el.classList.remove('selected');
        });
        // change selected tile, add css class
        selectedTile = {x: clickedX, y: clickedY, htmlElement: event.target};
        selectedTile.htmlElement.classList.add('selected');
    } else { // if there is no ball on clicked tile
        if(selectedTile){ // move, check if 5 in line
            // todo: move
            // todo: check if at least 5 in line
        } else { // add new ball on clicked tile, random 3 new balls, check for lose
            // todo: add new ball
            addNewBall(clickedX, clickedY);
            // todo: add 3 new random balls
            // todo: check for lose
        }
    }
}

function restartGame(){
    isGameOver = false;
    boardSize = boardSizeInput.valueAsNumber;
    currentScore = 0;
    currentScoreOutput.innerHTML = 0;
    generateColors();

    drawBoard();
}