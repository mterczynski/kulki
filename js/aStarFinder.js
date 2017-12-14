function AStarFinder(){
    // Manhattan heuristic:
    function getEstimate(from, to){
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    }


    this.findPath = (array, from, targetPos, arraySize) =>{
        const openList = [];
        const closedList = [];    
        closedList.push(from);

        // value adjacent tiles:
        const adjacentTiles = [];
        for(let x=-1; x<=1; x++){
            for(let y=-1; y<=1; y++){
                if((x != 0 || y != 0) && Math.abs(x%2) != Math.abs(y%2)){ // no self-pos and no diagonal tiles
                    let tilePos = {x: from.x + x, y: from.y + y};
                    let posExists = tilePos.x >=0 && tilePos.x < arraySize.x && tilePos.y >=0 && tilePos.y < arraySize.y;
                    if(posExists){
                        let adjacentTileValue = array[tilePos.x][tilePos.y];
                        if(adjacentTileValue == null){
                            adjacentTiles.push({x: tilePos.x, y: tilePos.y, estimate: getEstimate(tilePos, targetPos)});                            
                        }
                    }           
                }
            }
        }

        console.log(adjacentTiles)

        return null;
    }
}