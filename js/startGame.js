const boardHTMLElement = document.querySelector('#board');
const boardSizeInput = document.querySelector('#boardSizeInput');
const restartGameButton = document.querySelector('#restartGameButton');
const numberOfColorsInput = document.querySelector('#numberOfColorsInput');
const currentScoreOutput = document.querySelector('#currentScoreOutput');
const nextBallColorHTMLElements = document.querySelectorAll('.nextBallColor');

let boardSize;
let currentScore = 0;
let ballColors = [];
let isGameOver = false;
let board = []; // two dimension array
let nextBallColors = [];
let selectedTile; // tile with selected ball (first click to select, second click to move)
let numberOfBusyTiles = 0;

restartGameButton.addEventListener('click', ()=>{
    restartGame();
});

function addNewBall(x, y){
    const ballElement = document.createElement('div');
    const ballColor = getRandomBallColor();
    ballElement.classList.add('ball');
    ballElement.style.background = ballColor;
    const tile = boardHTMLElement.querySelectorAll(':scope >*')[y].childNodes[x];
    if(tile.childNodes.length > 0){
        return false;   // if tile is busy stop function, return false
    }
    tile.appendChild(ballElement);
    numberOfBusyTiles++;
    board[x][y] = ballColor;
    return true;
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
    nextBallColors = [];
    for(let i=0; i<3; i++){
        const nextBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
        nextBallColors.push(nextBallColor);
        nextBallColorHTMLElements[i].style.backgroundColor = `hsl(${nextBallColor}, 80%, 50%)`;
    }
}

function onTileClick(event){
    if(isGameOver){
        return;
    }

    let target = event.target;
    if(event.target.classList.contains('ball')){
        target = target.parentNode;
    }

    const boardRows = boardHTMLElement.querySelectorAll(':scope >*');

    let clickedX; // x axis
    let clickedY; // y axis 

    // get x and y of clicked tile:
    for(let i=0; i<boardSize; i++){
        if(target.parentNode === boardRows[i]){
            clickedY = i;
            const row = boardRows[i];
            for(let j=0; j<boardSize; j++){
                if(row.childNodes[j] === target){
                    clickedX = j
                }
            }
        }  
    }

    if(board[clickedX][clickedY]){  // if there is ball on clicked tile: change selection
        // remove selection from all tiles:
        document.querySelectorAll('.board__row__tile').forEach((el)=>{
            el.classList.remove('selected');
        });
        // change selected tile, add css class
        selectedTile = {x: clickedX, y: clickedY, htmlElement: target};
        selectedTile.htmlElement.classList.add('selected');
    } else { // if there is no ball on clicked tile
        if(selectedTile){ // move, check if 5 in line
            // todo: move
            // todo: check if at least 5 in line
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