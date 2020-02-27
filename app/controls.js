var fowards = false;
var left = false;
var backwards = false;
var right = false;
var up = false;
var down = false;

window.onkeydown = function(e)
{
    if(isInspectingTile)
        return;
    switch(e.keyCode)
    {
        case 87: //W - fowards
            fowards = true;
            break;
        case 65: //A - left
            left = true;
            break;
        case 83: //S - backwards
            backwards = true;
            break;
        case 68: //D - right
            right = true;
            break;
        case 86: //V - up
            up = true;
            break;
        case 67: //C - down
            down = true;
            break;
        case 38: //up arrow
            sim.tileSet.selectNextRow();
            break;
        case 37: //left arrow
            sim.tileSet.selectPrev();
            break;
        case 39: //right arrow
            sim.tileSet.selectNext();
            break;
        case 40: //down arrow
            sim.tileSet.selectPrevRow();
            break;
    }
}

window.onkeyup = function(e)
{
    switch(e.keyCode)
    {
        case 87: //W - fowards
            fowards = false;
            break;
        case 65: //A - left
            left = false;
            break;
        case 83: //S - backwards
            backwards = false;
            break;
        case 68: //D - right
            right = false;
            break;
        case 86: //V - up
            up = false;
            break;
        case 67: //C - down
            down = false;
    }
}

window.onwheel = function(e)
{
    var camNumber = event.clientX < canvas.width * split ? 0 : 1;
    if(e.deltaY > 0)
        cams[camNumber].range *= zoomSpeed;
    else
        cams[camNumber].range = Math.max(maxZoom, cams[camNumber].range / zoomSpeed);
    cams[camNumber].updateCam();
}



function resizeWindow()
{
    canvas.width = Math.max(window.innerWidth, 480);
    canvas.height = Math.max(window.innerHeight - 160, 240);
    cams.forEach(function(cam){
        cam.updateProjection();
    });
}

function changeCam(cameraNumber)
{
    gl.uniform1i(camNumberLoc, cameraNumber);
    currentCam = cams[cameraNumber];
}

function setSimSpeed(value)
{
    if(simSpeed != 0)
        simSpeed = Math.pow(3, value);
}

function toggleDetail()
{
    detailed = !detailed;
    needsRefresh = true;
}

function pause()
{
    simSpeed = 0;
    frameCounter = 0;
    document.getElementById('slider').style.background = 'FireBrick';
}

function play()
{
    simSpeed = 1;
    frameCounter = 0;
    setSimSpeed(document.getElementById('slider').value);
    document.getElementById('slider').style.background = '#d3d3d3';
}

function restart()
{
    simSpeed = 0;
    frameCounter = 0;
    sim.restart();
    needsRefresh = true;
    document.getElementById('slider').style.background = 'FireBrick';
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('stepButton').disabled = false;
    document.getElementById('playButton').disabled = false;
    document.getElementById('endButton').disabled = false;
}

function toggleCursor()
{
    showCursor = !showCursor;
    needsRefresh = true;
}

function end()
{
    simSpeed = maxSim;
    document.getElementById('slider').style.background = 'FireBrick';
}

function requireRestart()
{
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('playButton').disabled = true;
    document.getElementById('endButton').disabled = true;
    document.getElementById('slider').style.background = 'FireBrick';
    simSpeed = 0;
    frameCounter = 0;
}

function goToOrigin()
{
    cams[0].setTarget([0,0,0]);
}

function setMaxSim()
{
    var newMax = prompt(`Set the maximum number of simulated tiles.\nThe current maximum is ${sim.maxSize}.`, sim.maxSize);
    if(newMax == null)
        return;
    requireRestart();
    sim.maxSize = Number(newMax);
}

function setTemp()
{
    var newTemp = prompt(`Set the simulation temperature.\nThe current temperature is ${sim.temperature}.`, sim.temperature);
    if(newTemp == null)
        return;
    requireRestart();
    sim.temperature = Number(newTemp);
}

function toggleView()
{
    if(split < .25)
        setScreenSplit(.5);
    else if(split > .75)
        setScreenSplit(.0);
    else
        setScreenSplit(1.);
}

function setScreenSplit(ratio)
{
    split = ratio;
    resizeWindow();
}

var isNewTile = false;
var isInspectingTile = false;
var inspectedTile;

function openTile()
{
    textBoxes.forEach(function(textBox){
        textBox.disabled = false;
    });
    
    inspectedTile = sim.tileSet.getSelectedTile();
    
    
    textBoxes[0].value = inspectedTile.tileName;
    textBoxes[1].value = inspectedTile.colorToString();
    textBoxes[2].value = inspectedTile.glueIDs.join();
    textBoxes[3].value = inspectedTile.glueStrengths.join();
    textBoxes[4].value = inspectedTile.isSeed;
    
    isInspectingTile = true;
    document.getElementById('closeButton').disabled = false;
    document.getElementById('discardButton').disabled = false;
    document.getElementById('destroyButton').disabled = false;
}

function newTile()
{
    isNewTile = true;
    
    textBoxes[0].value = 'new';
    textBoxes[1].value = '255,255,255';
    textBoxes[2].value = 'a,b,c,d,e,f';
    textBoxes[3].value = '1,1,1,1,1,1';
    textBoxes[4].value = 'false';
    
    textBoxes.forEach(function(textBox){
        textBox.disabled = false;
    });
    isInspectingTile = true;
    document.getElementById('closeButton').disabled = false;
    document.getElementById('discardButton').disabled = false;
    document.getElementById('destroyButton').disabled = true;
}

function closeTile()
{
    if(validateInput())
    {
        var tileName = textBoxes[0].value.trim();
        
        var color = textBoxes[1].value.split(',');
        color = color.map(function(c){return parseInt(c) / 255;});
        
        var glues = textBoxes[2].value.split(',');
        glues = glues.map(function(g){return g.trim();});
        
        var strengths = textBoxes[3].value.split(',');
        strengths = strengths.map(function(s){return parseInt(s);});
        
        var isSeed = textBoxes[4].value.trim().toLowerCase() === 'true';
        
        if(isNewTile)
            sim.tileSet.add(new Tile(tileName, color, [0,0,0], glues, strengths, isSeed));
        else
            sim.tileSet.changeSelected(tileName, color, glues, strengths, isSeed)
        
        textBoxes.forEach(function(textBox){
            textBox.value = '';
            textBox.disabled = true;
        });
        
        isNewTile = false;
        isInspectingTile = false;
        document.getElementById('closeButton').disabled = true;
        document.getElementById('discardButton').disabled = true;
        document.getElementById('destroyButton').disabled = true;
        requireRestart();
        needsRefresh = true;
    }
}

function discardTile()
{
    textBoxes.forEach(function(textBox){
        textBox.value = '';
        textBox.disabled = true;
    });
    
    isNewTile = false;
    isInspectingTile = false;
    document.getElementById('closeButton').disabled = true;
    document.getElementById('discardButton').disabled = true;
    document.getElementById('destroyButton').disabled = true;
}

function deleteTile()
{
    sim.tileSet.deleteSelected();
    
    textBoxes.forEach(function(textBox){
        textBox.value = '';
        textBox.disabled = true;
    });
    isNewTile = false;
    isInspectingTile = false;
    document.getElementById('closeButton').disabled = true;
    document.getElementById('discardButton').disabled = true;
    document.getElementById('destroyButton').disabled = true;
    requireRestart();
    needsRefresh = true;
}

function validateInput()
{
    var boolRegExp = new RegExp('^\\s*(true|false)\\s*$', 'i');
    var digit255RegExp = new RegExp('(25[0-5]|[2][0-4]\\d|[1]\\d\\d|[1-9]\\d|\\d)');
    var colorRegExp = new RegExp('^\\s*' + digit255RegExp.source + '\\s*,\\s*' + digit255RegExp.source + '\\s*,\\s*' + digit255RegExp.source + '\\s*$');
    //var glueRegExp = new RegExp('^\\s*\\S+\\s*(,\\s*\\S+\\s*){5}$'); Not needed.
    var strengthsRegExp = new RegExp('^\\s*([1-9]\\d*|\\d)\\s*(,\\s*([1-9]\\d*|\\d)\\s*){5}$');
    
    if(textBoxes[0].value.trim().length == 0)
    {
        alert('This tile needs a name!');
        return false;
    }
    
    if(!colorRegExp.test(textBoxes[1].value))
    {
        alert('Expected "[0-255],[0-255],[0-255]" for COLOR.')
        return false;
    }
    
    if(textBoxes[2].value.split(',').length != 6)
    {
        alert('Expected "[string],[string],[string],[string],[string],[string]" for GLUE IDS.')
        return false;
    }
    
    if(!strengthsRegExp.test(textBoxes[3].value))
    {
        alert('Expected "[unsigned int],[unsigned int],[unsigned int],[unsigned int],[unsigned int],[unsigned int]" for STRENGTHS.');
        return false;
    }
    
    if(!boolRegExp.test(textBoxes[4].value))
    {
        alert('Expected either "true" or "false" for SEED.');
        return false;
    }
    
    return true;
}

var lastRequest = '';
var lastFileName = '';

function requestDownload()
{
    //prompt and test file types
    var query = prompt('Please list the file extensions/types you want.\n.sts, .tdp, and .tds are supported.\nExample: ".tds .tdp"\nSee README for file format descriptions.', lastRequest);
    if(query == null)
        return;
    var fileRegExp = new RegExp('(\\s*(\\.sts|\\.tdp|\\.tds))+\\s*');
    if(!fileRegExp.test(query))
    {
        alert('Expected something like ".sts .tds .tdp".');
        return;
    }
    
    //prompt and test file names
    var fileName = prompt('Name the download file(s).\nDon\'t worry about extensions.', lastFileName);
    if(fileName == null)
        return;
    lastFileName = fileName;
    
    //format the request
    query = query.replace(/\./g, ' .');
    query = query.replace(/w/g, ' ');
    query = superTrim(query);
    query = query.split(' ');
    var dList = [];
    query.forEach(function(type){dList[type] = 0;});
    
    //format lastRequest (to remember previous requests)
    query = [];
    for(var type in dList)
        query.push(type);
    lastRequest = query.join(' ');
    
    //call relevant download functions
    for(var type in dList)
    {
        switch(type)
        {
            case '.sts':
                downloadSTS(fileName);
                break;
            case '.tdp':
                downloadTDP(fileName);
                break;
            case '.tds':
                downloadTDS(fileName);
                break;
        }
    }
}

function superTrim(string)
{
    string = string.trim();
    var newString = string.replace('  ', ' ');
    while(newString != string)
    {
        string = newString;
        newString = string.replace('  ', ' ');
    }
    return newString;
}

function downloadSTS(fileName)
{
    var TDSText = sim.tileSet.getTilesAsSTSText();
    download(TDSText, fileName + '.sts', 'text/plain');
}

function downloadTDS(fileName)
{
    var TDSText = sim.tileSet.getTilesAsTDSText();
    download(TDSText, fileName + '.tds', 'text/plain');
}

function downloadTDP(fileName)
{
    var TDPText = [];
    TDPText.push(fileName + '.tds');
    TDPText.push('Temperature=' + sim.temperature);
    TDPText.push(sim.tileSet.seed.tileName + ' ' + sim.tileSet.seed.position.join(' '));
    TDPText.push('');
    TDPText = TDPText.join('\n');
    download(TDPText, fileName + '.tdp', 'text/plain');
}

function upload(file)
{
    document.getElementById('hiddenFileElement').value = null;
    var reader = new FileReader();
    reader.onload = function(event)
    {
        var contents = event.target.result;
        var tileSet;
        switch(file.name.substring(file.name.length - 4))
        {
            case '.sts':
                tileSet = makeTileSetWithSTS(contents);
                break;
            case '.tds':
                tileSet = makeTileSetWithTDS(contents);
                break;
            default:
                alert('Not the correct file type.');
                return;
        }
        pause();
        sim.tileSet = tileSet;
        sim.restart();
        needsRefresh = true;
        discardTile();
        goToOrigin();
    };
    reader.readAsText(file);
}

function makeTileSetWithSTS(contents)
{
    var ts = new TileSet();
    contents = contents.split('\n--\n');
    for(var tile of contents)
    {
        tile = tile.split('\n');
        ts.add(new Tile(tile[0], tile[2].split(',').map(Number), [0,0,0], tile[3].split(','), tile[4].split(',').map(Number), tile[5] == 'true', tile[1]));
    }
    return ts;
}

function makeTileSetWithTDS(contents)
{
    var ts = new TileSet();
    var seedName = prompt('What is the seed\'s name?\nYou can add/edit a seed tile later if you want.', '');
    
    (contents = contents.split(/\s*CREATE\s*/m)).pop();
    for(var tile of contents)
    {
        var name = 'default';
        var label = '';
        var color = beige.slice();
        var glueIDs = ['','','','','',''];
        var glueStrengths = [0,0,0,0,0,0];
        var isSeed = false;
        
        tile = tile.split('\n');
        for(var attribute of tile)
        {
            var words = attribute.match(/\S+/g);
            if(words == null || words.length < 2)
                continue;
            var type = words[0];
            var data = words[1];
            switch(type)
            {
                case 'TILENAME':
                    name = data;
                    if(data == seedName)
                        isSeed = true;
                    break;
                case 'LABEL':
                    label = data;
                    break;
                //case 'TILECOLOR':       not supported
                //case 'TEXTCOLOR':       not supported
                //case 'CONCENTRATION':   not supported
                case 'NORTHBIND':
                    glueStrengths[5] = Number(data);
                    break;
                case 'SOUTHBIND':
                    glueStrengths[2] = Number(data);
                    break;
                case 'WESTBIND':
                    glueStrengths[3] = Number(data);
                    break;
                case 'EASTBIND':
                    glueStrengths[0] = Number(data);
                    break;
                case 'UPBIND':
                    glueStrengths[1] = Number(data);
                    break;
                case 'DOWNBIND':
                    glueStrengths[4] = Number(data);
                    break;
                case 'NORTHLABEL':
                    glueIDs[5] = data;
                    break;
                case 'SOUTHLABEL':
                    glueIDs[2] = data;
                    break;
                case 'WESTLABEL':
                    glueIDs[3] = data;
                    break;
                case 'EASTLABEL':
                    glueIDs[0] = data;
                    break;
                case 'UPLABEL':
                    glueIDs[1] = data;
                    break;
                case 'DOWNLABEL':
                    glueIDs[4] = data;
                    break;
            }
        }
        
        ts.add(new Tile(name, color, [0,0,0], glueIDs, glueStrengths, isSeed, label));
    }
    return ts;
}

function demo()
{
    var names = Object.keys(demos);
    var query = prompt('Enter a demo ID:\n' + names.join(', ') + ', thin [N] [d]', '');
    if(query == null)
        return;
    var query = superTrim(query.toLowerCase());
    var fileRegExp = new RegExp(names.toLowerCase().join('|')+'|thin\\s\\d*\\s\\d*');
    if(!fileRegExp.test(query))
    {
        alert('Expected a demo from the list.');
        return;
    }
    var tileSet;
    if(query.split(' ')[0] == 'thin')
        tileSet = makeThin(query.split(' ')[1], query.split(' ')[2]);
    else
        tileSet = makeTileSetWithSTS(demos[query]);
    pause();
    sim.tileSet = tileSet;
    sim.restart();
    needsRefresh = true;
    discardTile();
    goToOrigin();
}