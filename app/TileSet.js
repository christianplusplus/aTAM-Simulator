const rowSize = 5;
const camDiligence = 6;
const glueOrder = ['EAST', 'UP', 'SOUTH', 'WEST', 'DOWN', 'NORTH'];

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
                this.seed.isSeed = false;
            else
            {
                this.hasSeed = true;
                tile.initBuffers();
            }
            this.seed = tile;
        }
        this.list.push(tile);
        for(var f = 0; f < 6; f++)
        {
            if(tile.glueStrengths[f] > 0)
            {
                if(this.glueList[f][tile.glueIDs[f]] === undefined)
                    this.glueList[f][tile.glueIDs[f]] = [];
                this.glueList[f][tile.glueIDs[f]].push(tile);
            }
        }
        this.counter++;
    };
    
    //these next three functions need work. crunching is O(N) work.
    //maybe that is fine on delete, but should really be O(1) on change.
    this.changeSelected = function(tileName, tileColor, glueIDs, glueStrengths, isSeed)
    {
        var temp = this.pointer;
        var label = this.getSelectedTile().label;
        this.deleteSelected();
        this.add(new Tile(tileName, tileColor, [0,0,0], glueIDs, glueStrengths, isSeed, label));
        this.pointer = temp;
        this.list.splice(this.pointer, 0, this.list.splice(this.list.length - 1, 1)[0]);//shifts to the correct index
        this.crunch();
    };
    
    this.deleteSelected = function()
    {
        var tile = this.list[this.pointer];
        if(this.list[this.pointer] === this.seed)
            this.hasSeed = false;
        for(var f = 0; f < 6; f++)
        {
            if(tile.glueStrengths[f] > 0)
            {
                var table = this.glueList[f][tile.glueIDs[f]];
                table.splice(table.indexOf(tile), 1);
                if(table.length == 0)
                    delete this.glueList[f][tile.glueIDs[f]];
            }
        }
        this.list.splice(this.pointer, 1);
        this.counter--;
        this.crunch();
        if(this.pointer >= this.list.length && this.list.length > 0)
            this.pointer = this.list.length - 1;
    };
    
    this.crunch = function()
    {
        for(var i = 0; i < this.list.length; i++)
            this.list[i].updatePosition(this.pointerToPosString(i).split(',').map(Number));
    };
    
    this.draw = function()
    {
        this.list.forEach(function(tile){
            tile.draw();
        });
    };
    
    this.fastDraw = function()
    {
        this.list.forEach(function(tile){
            tile.fastDraw();
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
    
    this.pointerToPosString = function(pointer)
    {
        if(arguments.length == 0)
            return 2 * (this.counter % rowSize) + ',' + 2 * Math.floor(this.counter / rowSize) + ',0';
        return 2 * (pointer % rowSize) + ',' + 2 * Math.floor(pointer / rowSize) + ',0';
    };
    
    this.getSelectedTile = function()
    {
        return this.list[this.pointer];
    };
    
    this.getTilesAsText = function()
    {
        var page = [];
        var usedNames = [];
        this.list.forEach(function(tile){
            var attributes = [];
            
            var name = tile.tileName;
            var i = 1;
            var appendedName = name;
            while(usedNames.includes(appendedName))
                appendedName = name + '(' + (i++) + ')';
            usedNames.push(appendedName);
            
            attributes.push('TILENAME ' + appendedName);
            if(tile.label.length > 0)
                attributes.push('LABEL ' + tile.label);
            for(var f = 0; f < 6; f++)
            {
                if(tile.glueStrengths[f] > 0)
                {
                    attributes.push(glueOrder[f] + 'BIND ' + tile.glueStrengths[f]);
                    attributes.push(glueOrder[f] + 'LABEL ' + tile.glueIDs[f]);
                }
            }
            attributes.push('CREATE');
            page.push(attributes.join('\n'));
            page.push('\n');
        });
        return page.join('\n');
    };
};