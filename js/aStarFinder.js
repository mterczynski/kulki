function AStarFinder(){
    // Manhattan heuristic:
    function getEstimate(from, to){  
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    }

    function getTileScore(tile){
        return tile.estimate + tile.travelCost;
    }
    // return array of tiles sorted by their score
    function getFreeAdjacentTiles(currentPos, board, currentTravelCost, boardSize, targetPos){
        const adjacentTiles = [];
        for(let x=-1; x<=1; x++){
            for(let y=-1; y<=1; y++){
                if((x != 0 || y != 0) && Math.abs(x%2) != Math.abs(y%2)){ // no self-pos and no diagonal tiles
                    let tilePos = {x: currentPos.x + x, y: currentPos.y + y};
                    let posExists = tilePos.x >=0 && tilePos.x < boardSize.x && tilePos.y >=0 && tilePos.y < boardSize.y;
                    if(posExists){
                        let adjacentTileValue = board[tilePos.x][tilePos.y];
                        if(adjacentTileValue == null){
                            adjacentTiles.push({
                                x: tilePos.x,
                                y: tilePos.y,
                                estimate: getEstimate(tilePos, targetPos),
                                travelCost: currentTravelCost + 1
                            });                           
                        }
                    }           
                }
            }
        }
        adjacentTiles.sort((a,b)=>{
            return getTileScore(a) > getTileScore(b);
        });
        return adjacentTiles;
    }

    function getAdjacentFromClosedList(closedList, currentPos){
        return closedList.filter((tile)=>{
            return Math.abs(tile.x - currentPos.x) == 1 && Math.abs(tile.y - currentPos.y) == 0 ||
            Math.abs(tile.x - currentPos.x) == 0 && Math.abs(tile.y - currentPos.y) == 1;
        });
    }

    function addUniquePointToArray(point, array){
        if(array.filter((el)=>{
            return el.x == point.x && el.y == point.y;
        }).length == 0){
            array.push(point);
            return true;
        } 
        return false;
    }

    function checkIfPointInList(point, list){
        if(list.filter((el)=>{
            return el.x == point.x && point.y == el.y;
        }).length > 0){
            return true;
        } else {
            return false;
        }
    }

    this.findPath = (array, from, targetPos, arraySize) =>{   
        if(from.x == targetPos.x && from.y == targetPos.y){
            return {success: false, openList:[], closedList:[]};
        }

        let openList = [];    
        let currentPos = {x:from.x, y:from.y, travelCost: 0};
        const closedList = [currentPos];
        
        // add adjacent tiles to open list:
        const adjacentTiles = getFreeAdjacentTiles(currentPos, array, 0, arraySize, targetPos);
        adjacentTiles.forEach((el)=>{ 
            openList.push(el); 
        }); 
        
        while(!openList.length == 0){
            // 1. if openList is empty -> no more field to check -> no path
            
            // 2. get the best tile from open list
            let bestTileFromOpenList = openList.sort((a,b)=>{
                return getTileScore(a) - getTileScore(b);
            })[0];
            // 3. change position to the best tile and move it from openList to closedList
            currentPos = bestTileFromOpenList;
            closedList.push(openList.shift());
            // 4. if currentPos == targetPos compute final path:
            if(currentPos.x == targetPos.x && currentPos.y == targetPos.y){
                // compute and return final path:
                const finalPath = [currentPos];

                let iters = 1;
                while(!(currentPos.x == from.x && currentPos.y == from.y)){
                    iters++;

                    const adjacentTiles = getAdjacentFromClosedList(closedList, currentPos);

                    const someResult = adjacentTiles.some((tile)=>{
                        if(currentPos.travelCost - 1 == tile.travelCost){
                            finalPath.push(tile);
                            currentPos = tile;
                            return true;
                        }
                    });

                    if(!someResult){     
                        console.log('closedList', closedList)
                        console.warn('There is something wrong with A* algorithm');
                        throw new Error('A* error');
                    }
                }

                return {success: true, openList, closedList, finalPath};
            }
            // 5. get adjacent tiles
            const adjacentTiles = getFreeAdjacentTiles(currentPos, array, currentPos.travelCost, arraySize, targetPos);
            // 6. forEach adjTile do action depending on in which list is the tile
            adjacentTiles.forEach((adjTile)=>{  
                // 6.1. if tile is in the closed list, ignore it
                if(checkIfPointInList(adjTile, closedList)){
                    // do nothing
                } 
                // 6.2. if tile is not in the open list: add it to open list.
                else if(!checkIfPointInList(adjTile, openList)){
                    addUniquePointToArray(adjTile, openList);
                }
                // 6.3. if title is in the open list: 
                else {
                    // Check if the travelCost is lower when we use the current generated path to get there.
                    // If it is, update its score and update its parent as well.          
                    if(adjTile.travelCost > currentPos.travelCost + 1){
                        adjTile.travelCost = currentPos.travelCost + 1;
                        console.log('A* mechanics: 6.3');
                    }
                    // todo update parent (? optional ?)
                }
            });
        }

        return {success: false, openList, closedList};
    }
}