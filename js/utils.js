function boardToTileNodeArray(htmlBoard, boardSize){
    const tileNodes = [];
    const boardTiles = htmlBoard.querySelectorAll(':scope >*>*');

    for(let i=0; i<boardSize; i++){
        tileNodes.push([]);
    }

    for(let i=0; i<boardSize*boardSize; i++){
        tileNodes[i % boardSize].push(boardTiles[i]);
    }

    return tileNodes;
}

function getRandomBallColor(){
    return `hsl(${randomFloat(0,360)}, 80%, 50%)`;
}

function getTilePosition(tile){
    const boardRows = boardHTMLElement.querySelectorAll(':scope >*');

    let x;
    let y;

    for(let i=0; i<boardSize; i++){
        if(tile.parentNode === boardRows[i]){
            y = i;
            const row = boardRows[i];
            for(let j=0; j<boardSize; j++){
                if(row.childNodes[j] === tile){
                    x = j;
                }
            }
        }  
    }
    return {x, y};
}

function getTileFromEventTarget(eventTarget){
    let tile = eventTarget;
    if(tile.classList.contains('ball')){
        tile = tile.parentNode;
    }
    return tile;
}

function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 100, s * 100, l * 100];
}

function paintPath(path){
    clearPaths();

    path.openList.forEach((tile)=>{
        tileNodes[tile.x][tile.y].classList.add('openList');
    });

    path.closedList.forEach((tile)=>{
        tileNodes[tile.x][tile.y].classList.add('closedList');
    });

    if(path.finalPath){
        path.finalPath.forEach((tile)=>{
            tileNodes[tile.x][tile.y].classList.add('finalPath');
        });
    }
}