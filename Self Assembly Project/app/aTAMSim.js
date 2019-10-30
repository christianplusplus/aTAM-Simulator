function aTAMSim(tileSet, temperature, maxSize)
{
    this.assembly = new Map();
    this.frontier = [];
    this.tileSet = tileSet;
    this.seed = tileSet.seed;
    this.temperature = temperature;
    this.maxSize = maxSize;
    this.size = 0;
    this.seeded = false;
    
    this.simulate = function()
    {
        var tile;
        var position;
        if(this.size >= this.maxSize)
            return false;
        if(this.seeded)
        {
            while(true)
            {
                if(!this.frontier.length)//frontier is empty
                    return false;
                
                //get random frontier cell
                position = this.frontier.splice(Math.floor(Math.random() * this.frontier.length), 1)[0];
                
                //gather possible glue and tile combinations
                var possibleGlues = [];
                var possibleGluesStrengths = [];
                var possibleTiles = [];
                var neighbors = this.getNeighbors(position);
                for(var face = 0; face < 6; face++)
                {
                    if(this.assembly.has(neighbors[face]))
                    {
                        var neighborTile = this.assembly.get(neighbors[face]);
                        var oppositeFace = (face + 3) % 6;
                        if(neighborTile.glueStrengths[oppositeFace] > 0)
                        {
                            var glue = neighborTile.glueIDs[oppositeFace];
                            var glueList = this.tileSet.glueList[face][glue];
                            if(glueList !== undefined)
                            {
                                possibleGlues[face] = glue;
                                possibleGluesStrengths[face] = neighborTile.glueStrengths[oppositeFace];
                                possibleTiles = possibleTiles.concat(glueList);
                            }
                            else
                                possibleGluesStrengths[face] = 0;
                        }
                    }
                }
                
                //filter tiles based on temperature and matching glues
                var filteredTiles = [];
                for(var tile of possibleTiles)
                {
                    var temp = 0;
                    for(var face = 0; face < 6; face++)
                    {
                        if(possibleGluesStrengths[face] > 0 && possibleGlues[face] == tile.glueIDs[face])
                            temp += possibleGluesStrengths[face];
                        if(temp >= this.temperature)
                        {
                            filteredTiles.push(tile);
                            break;
                        }
                    }
                }
                
                //pick a random tile that is valid
                if(filteredTiles.length)
                {
                    tile = filteredTiles[Math.floor(Math.random() * filteredTiles.length)].copyAt(position);
                    break;
                }
            }
        }
        else
        {
            position = "0,0,0";
            tile = this.tileSet.seed.copyAt(position);
            this.seeded = true;
        }
        
        this.assembly.set(position, tile);
        
        var neighbors = this.getNeighbors(position);
        for(var face = 0; face < 6; face++)
            if(tile.glueStrengths[face] > 0 && !this.assembly.has(neighbors[face]) && !this.frontier.includes(neighbors[face]))
                this.frontier.push(neighbors[face]);
        
        this.size++;
        return true;
    };
    
    this.draw = function()
    {
        for(var tile of this.assembly.values())
            tile.draw();
    };
    
    this.fastDraw = function()
    {
        for(var tile of this.assembly.values())
            tile.fastDraw();
    };
    
    this.getNeighbors = function(keyString)
    {
        var keyStringSplit = keyString.split(',');
        var key = [];
        for(var string of keyStringSplit)
            key.push(parseInt(string));
        var keys = [];
        keys.push([key[0] + 1, key[1], key[2]].join());
        keys.push([key[0], key[1] + 1, key[2]].join());
        keys.push([key[0], key[1], key[2] + 1].join());
        keys.push([key[0] - 1, key[1], key[2]].join());
        keys.push([key[0], key[1] - 1, key[2]].join());
        keys.push([key[0], key[1], key[2] - 1].join());
        return keys;
    };
};