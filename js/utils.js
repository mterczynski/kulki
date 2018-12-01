function boardToTileNodeArray(htmlBoard, boardSize) {
    const tileNodes = [];
    const boardTiles = htmlBoard.querySelectorAll(':scope >*>*');

    for (let i = 0; i < boardSize; i++) {
        tileNodes.push([]);
    }

    for (let i = 0; i < boardSize * boardSize; i++) {
        tileNodes[i % boardSize].push(boardTiles[i]);
    }

    return tileNodes;
}

function getTilePosition(tile) {
    const boardRows = boardHTMLElement.querySelectorAll(':scope >*');

    let x;
    let y;

    for (let i = 0; i < boardSize; i++) {
        if (tile.parentNode === boardRows[i]) {
            y = i;
            const row = boardRows[i];
            for (let j = 0; j < boardSize; j++) {
                if (row.childNodes[j] === tile) {
                    x = j;
                }
            }
        }
    }
    return { x, y };
}

function getTileFromEventTarget(eventTarget) {
    let tile = eventTarget;
    if (tile.classList.contains('ball')) {
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

function paintPath(path) {
    clearPaths();

    path.openList.forEach((tile) => {
        tileNodes[tile.x][tile.y].classList.add('openList');
    });

    path.closedList.forEach((tile) => {
        tileNodes[tile.x][tile.y].classList.add('closedList');
    });

    if (path.finalPath) {
        path.finalPath.forEach((tile) => {
            tileNodes[tile.x][tile.y].classList.add('finalPath');
        });
    }
}