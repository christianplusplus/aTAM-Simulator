const rowSize = 5;
const camDiligence = 6;

function TileSet()
{
    this.list = [];
    this.counter = 0;
    this.pointer = 0;
    this.hasSeed = false;
    this.seed;
    this.glueList = [];
    for(var i = 0; i < 6; i++)
        this.glueList.push([]);
    
    this.add = function(tile)
    {
        tile = tile.copyAt(this.pointerToPosString());
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
        this.counter++;
    };
    
    this.draw = function()
    {
        this.list.forEach(function(tile){
            tile.draw();
        });
    };
    
    this.selectNext = function()
    {
        if(this.pointer + 1 < this.counter && this.pointer % rowSize < rowSize - 1)
        {
            this.pointer++;
            needsRefresh = true;
            this.adjustCam();
        }
    };
    
    this.selectPrev = function()
    {
        if(this.pointer - 1 >= 0 && this.pointer % rowSize > 0)
        {
            this.pointer--;
            needsRefresh = true;
            this.adjustCam();
        }
    };
    
    this.selectNextRow = function()
    {
        if(this.pointer + rowSize < this.counter)
        {
            this.pointer += rowSize;
            needsRefresh = true;
            this.adjustCam();
        }
    };
    
    this.selectPrevRow = function()
    {
        if(this.pointer - rowSize >= 0)
        {
            this.pointer -= rowSize;
            needsRefresh = true;
            this.adjustCam();
        }
    };
    
    this.adjustCam = function()
    {
        var cam = cams[1];
        var camAdjustmentRange = cam.range / camDiligence;
        var target = cam.target;
        var pointerPosition = this.list[this.pointer].position;
        
        if(pointerPosition[1] - target[1] > camAdjustmentRange)
        {
            cam.setTarget([target[0], pointerPosition[1] - camAdjustmentRange, target[2]]);
            target = cam.target;
        }
        else if(target[1] - pointerPosition[1] > camAdjustmentRange)
        {
            cam.setTarget([target[0], pointerPosition[1] + camAdjustmentRange, target[2]]);
            target = cam.target;
        }
        
        if(pointerPosition[0] - target[0] > camAdjustmentRange)
            cam.setTarget([pointerPosition[0] - camAdjustmentRange, target[1], target[2]]);
        else if(target[0] - pointerPosition[0] > camAdjustmentRange)
            cam.setTarget([pointerPosition[0] + camAdjustmentRange, target[1], target[2]]);
    };
    
    this.pointerToPosString = function()
    {
        return 2 * (this.counter % rowSize) + ',' + 2 * Math.floor(this.counter / rowSize) + ',0';
    };
    
    this.getSelectedTile = function()
    {
        return this.list[this.pointer];
    };
};