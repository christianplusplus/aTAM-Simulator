function TileSet()
{
    this.list = [];
    this.hasSeed = false;
    this.seed;
    this.glueList = [];
    for(var i = 0; i < 6; i++)
        this.glueList.push([]);
    
    this.add = function(tile)
    {
        if(tile.isSeed)
        {
            if(this.hasSeed)
                throw "Can't add more than one seed to a tile set.";
            this.hasSeed = true;
            this.seed = tile;
            tile.initBuffers();
        }
        this.list.push(tile);
        for(var i = 0; i < 6; i++)
        {
            if(tile.glueStrengths[i] > 0)
            {
                if(this.glueList[i][tile.glueIDs[i]] === undefined)
                    this.glueList[i][tile.glueIDs[i]] = [];
                this.glueList[i][tile.glueIDs[i]].push(tile);
            }
        }
    };
};