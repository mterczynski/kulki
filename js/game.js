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
let hoveredTile = {x:0, y:0, isPath: false} // only for moving active ball

restartGameButton.addEventListener('click', ()=>{
    restartGame();
});

function addNewBall(x, y){
    const ballElement = document.createElement('div');
    const ballColor = randomInt(1, numberOfColors);
    ballElement.classList.add('ball');
    ballElement.classList.add('color' + ballColor);
    const tile = boardHTMLElement.querySelectorAll(':scope >*')[y].childNodes[x];
    if(tile.childNodes.length > 0){
        return false;   // if tile is busy stop function, return false
    }
    tile.appendChild(ballElement);
    // numberOfBusyTiles++;
    board[x][y] = ballColor;
    return true;
}

function checkFor5(movedPos, board){

}

function checkForLoss(board){

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

    tileNodes = boardToTileNodeArray(boardHTMLElement, boardSize);
}

function drawPath(from, to){
    const boardRows = boardHTMLElement.childNodes;
    let path = aStarFinder.findPath(board, from, to, {x:boardSize, y:boardSize});
    // paintPath(path);

    hoveredTile = {x:to.x, y:to.y, isPath: path.success}; 
}

function onTileClick(event){
    if(isGameOver){
        return;
    }

    const tile = getTileFromEventTarget(event.target);

    let clickedPos = getTilePosition(tile);

    if(board[clickedPos.x][clickedPos.y]){  // if there is ball on clicked tile: change selection
        // remove selection from all balls:
        document.querySelectorAll('.ball').forEach((el)=>{
            el.classList.remove('selected');
        });
        // change selected tile, add css class
        selectedTile = {x: clickedPos.x, y: clickedPos.y, htmlElement: tile};
        selectedTile.htmlElement.children[0].classList.add('selected');
    } else { // if there is no ball on clicked tile
        if(selectedTile && hoveredTile.isPath){ // move, check if 5 in line
            const clickedTileNode = tileNodes[clickedPos.x][clickedPos.y];
            const selectedTileNode = tileNodes[selectedTile.x][selectedTile.y];
            const selectedBallColor = board[selectedTile.x][selectedTile.y];

            clickedTileNode.appendChild(selectedTileNode.children[0]);
            clickedTileNode.children[0].classList.remove('selected');
            selectedTile = null;
            board[clickedPos.x][clickedPos.y] = selectedBallColor;
            // todo: check if at least 5 in line
            
            // todo: check for loss
        } 
    }
}

function onTileHover(event){
    // if there is selected tile and target has no child(tile with no ball) and target is not ball:
    if(selectedTile && event.target.childNodes.length == 0 && !event.target.classList.contains('ball')){ 
        const tile = getTileFromEventTarget(event.target);
        drawPath(selectedTile, getTilePosition(tile));
    }
}

function randomNext3Colors(){
    nextBallColors = [
        randomInt(1, numberOfColors), 
        randomInt(1, numberOfColors),
        randomInt(1, numberOfColors)
    ];

    nextBallColorHTMLElements[0].className = '';
    nextBallColorHTMLElements[1].className = '';
    nextBallColorHTMLElements[2].className = '';

    nextBallColorHTMLElements[0].classList.add('color' + nextBallColors[0], 'nextBallColor');
    nextBallColorHTMLElements[1].classList.add('color' + nextBallColors[1], 'nextBallColor');
    nextBallColorHTMLElements[2].classList.add('color' + nextBallColors[2], 'nextBallColor');
}

function restartGame(){
    isGameOver = false;
    boardSize = boardSizeInput.valueAsNumber;
    numberOfColors = numberOfColorsInput.valueAsNumber;
    currentScore = 0;
    currentScoreOutput.innerHTML = 0;
    randomNext3Colors();
    drawBoard();
    // add 3 balls to the board:
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