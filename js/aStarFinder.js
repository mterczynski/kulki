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

        const closedList = [];
        let openList = [];    
        closedList.push(from);

        let currentPos = {x:from.x, y:from.y};
        
        // add adjacent tiles to open list:
        const adjacentTiles = getFreeAdjacentTiles(currentPos, array, 0, arraySize, targetPos);
        adjacentTiles.forEach((el)=>{ 
            openList.push(el); 
        }); 

        // console.log('adjacentTiles:')
        // console.log(adjacentTiles);

        let iters = 0;

        while(true){

            if(openList.length == 0){
                console.log('null: open list is empty')
                return {success: false, openList, closedList};
            }

            let bestTileFromOpenList = openList.sort((a,b)=>{
                return getTileScore(a) > getTileScore(b);
            })[0];

            console.log('open list:')
            console.log(JSON.parse(JSON.stringify(openList)))

            // console.log('best tile from open list:')
            // console.log(bestTileFromOpenList)

            if(!bestTileFromOpenList){
                console.log('null: no best tile')
                return {success: false, openList, closedList};
            }

            currentPos = bestTileFromOpenList;
            console.log('bestTileFromOpenList: ');
            console.log(bestTileFromOpenList);
            
            // remove bestTile from open list and it to closed list
           
            // console.log('closed list:')
            // console.log(closedList)

            // closedList.push(openList.shift());
            addUniquePointToArray(openList.shift(), closedList);

            if(currentPos.x == targetPos.x && currentPos.y == targetPos.y){
                // todo: compute and return path
                console.log('path found')
                // console.log(openList);
                // console.log(closedList)
                return {success: true, openList, closedList};
            }

            // get adjacent tiles
            const adjacentTiles = getFreeAdjacentTiles(currentPos, array, getEstimate(from, currentPos), arraySize, targetPos);

            // if tile is not  in the open list, add it

            /*
                todo:
                If T is in the closed list: Ignore it.
                If T is not in the open list: Add it and compute its score.
                If T is already in the open list: Check if the F score is lower when we use the current generated path to get there. If it is, update its score and update its parent as well.
            */
            
            adjacentTiles.forEach((adjTile)=>{
                // addUniquePointToArray(adjTile, openList);
                
                // 1. if tile is in the closed list, ignore it
                if(checkIfPointInList(adjTile, closedList)){
                    // ignore this tile
                } 
                // 2. if tile is not in the open list: add it to open list.
                else if(!checkIfPointInList(adjTile, openList)){
                    // todo add to open list
                    addUniquePointToArray(adjTile, openList);
                }
                // 3. if title is in the open list: Check if the F score is lower when we use the current generated path to get there. If it is, update its score and update its parent as well.
                else {
                    // todo
                    // (?) optional if we dont need shortest path
                }
            });
        
            iters++;

            if(iters>300){
                console.log('path not found, too much iters')
                return {success: false, openList, closedList};
            }
        }

        return {success: false, openList, closedList};
    }

    this.getFreeAdjacentTiles = getFreeAdjacentTiles;
}