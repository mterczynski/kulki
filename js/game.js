const boardHTMLElement = document.querySelector('#board');
const boardSizeInput = document.querySelector('#boardSizeInput');
const restartGameButton = document.querySelector('#restartGameButton');
const numberOfColorsInput = document.querySelector('#numberOfColorsInput');
const currentScoreOutput = document.querySelector('#currentScoreOutput');
const nextBallColorHTMLElements = document.querySelectorAll('.nextBallColor');

const aStarFinder = new AStarFinder();

let boardSize;
let currentScore = 0;
let ballColors = [];
let isGameOver = false;
let board = []; // two dimension array
let nextBallColors = [];
let selectedTile; // tile with selected ball (first click to select, second click to move)
let numberOfBusyTiles = 0;
let numberOfColors;

restartGameButton.addEventListener('click', ()=>{
    restartGame();
});

function addNewBall(x, y){
    const ballElement = document.createElement('div');
    const ballColor = `hsl(${ballColors[Math.floor(Math.random() * ballColors.length)]}, 80%, 50%)`;
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
            tile.addEventListener('mouseover', onTileHover);            
            row.appendChild(tile);
        }
        boardHTMLElement.appendChild(row);
    }
}

function drawPath(from, to){
    const boardRows = boardHTMLElement.childNodes;
    // console.log('from', from);
    // console.log('to', to);
    let path = aStarFinder.findPath(board, from, to, {x: boardSize, y:boardSize});
    
    
}

function generateColors(){
    const firstColorHue = randomFloat(0, 360);
    ballColors = [firstColorHue];
    for(let i=1; i<numberOfColors; i++){
        const nextColor = (firstColorHue + 360/numberOfColors * i) % 360;
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

    const tile = getTileFromEventTarget(event.target);

    let clickedPos = getTilePosition(tile);

    if(board[clickedPos.x][clickedPos.y]){  // if there is ball on clicked tile: change selection
        // remove selection from all tiles:
        document.querySelectorAll('.board__row__tile').forEach((el)=>{
            el.classList.remove('selected');
        });
        // change selected tile, add css class
        selectedTile = {x: clickedPos.x, y: clickedPos.y, htmlElement: tile};
        selectedTile.htmlElement.classList.add('selected');
    } else { // if there is no ball on clicked tile
        if(selectedTile){ // move, check if 5 in line
            // todo: move
            // todo: check if at least 5 in line
            // todo: check for loss
        } 
    }
}

function onTileHover(event){
    if(selectedTile && event.target.childNodes.length == 0 && !event.target.classList.contains('ball')){  // and if selected tile has no ball
        const tile = getTileFromEventTarget(event.target);
        drawPath(selectedTile, getTilePosition(tile));
    }
}

function restartGame(){
    isGameOver = false;
    boardSize = boardSizeInput.valueAsNumber;
    numberOfColors = numberOfColorsInput.valueAsNumber;
    currentScore = 0;
    currentScoreOutput.innerHTML = 0;
    generateColors();
    drawBoard();
    for(let i=0; i<3; i++){
        while(true){
            let x = randomInt(0, boardSize-1);
            let y = randomInt(0, boardSize-1);
            if(addNewBall(x,y)){
                break;
            }
        }
    }
}