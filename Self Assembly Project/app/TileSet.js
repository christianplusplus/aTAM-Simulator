function TileSet()
{
    this.list = [];
    this.index = 0;
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
        this.list.push(tile.copyAt(this.indexToPosString()));
        for(var i = 0; i < 6; i++)
        {
            if(tile.glueStrengths[i] > 0)
            {
                if(this.glueList[i][tile.glueIDs[i]] === undefined)
                    this.glueList[i][tile.glueIDs[i]] = [];
                this.glueList[i][tile.glueIDs[i]].push(tile);
            }
        }
        this.index++;
    };
    
    this.draw = function()
    {
        this.list.forEach(function(tile){
            tile.draw();
        });
    };
    
    this.indexToPosString = function()
    {
        return (2 * (this.index % 5)) + ',' + (2 * Math.floor(this.index / 5)) + ',0'
    };
};