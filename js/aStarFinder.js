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

    this.findPath = (array, from, targetPos, arraySize) =>{   
        if(from.x == targetPos.x && from.y == targetPos.y){
            return {success: false, openList:[], closedList:[]};
        }

        const closedList = [];
        let openList = [];    
        closedList.push(from);

        let currentPos = {x:from.x, y:from.y};
        
        // add adjacent tiles to open list:
        const adjacentTiles = getFreeAdjacentTiles(currentPos, array, 0, arraySize, targetPos);
        adjacentTiles.forEach((el)=>{
            openList.push(el);
        }); 

        let iters = 0;

        while(true){

            if(openList.length == 0){
                console.log('null: open list is empty')
                return {success: false, openList, closedList};
            }

            let bestTileFromOpenList = openList.sort((a,b)=>{
                return getTileScore(a) > getTileScore(b);
            })[0];

            if(!bestTileFromOpenList){
                console.log('null: no best tile')
                return {success: false, openList, closedList};
            }

            currentPos = bestTileFromOpenList;
            // remove bestTile from open list and it to closed list
            closedList.push(openList.pop());
           
            if(currentPos.x == targetPos.x && currentPos.y == targetPos.y){
                // todo: compute and return path
                console.log('path found')
                // console.log(openList);
                // console.log(closedList)
                return {success: true, openList, closedList};
            }

            // get adjacent tiles
            // todo get tile travelcost
            const adjacentTiles = getFreeAdjacentTiles(currentPos, array, getEstimate(from, currentPos), arraySize, targetPos);
            openList = [...adjacentTiles, ...openList];
            iters++;

            if(iters>300){
                console.log('path not found')
                return {success: false, openList, closedList};
            }
        }

        return {success: false, openList, closedList};
    }
}