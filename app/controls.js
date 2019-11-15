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
};

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
};

window.onwheel = function(e)
{
    var camNumber = event.clientX < canvas.width / 2 ? 0 : 1;
    if(e.deltaY > 0)
        cams[camNumber].range *= zoomSpeed;
    else
        cams[camNumber].range = Math.max(maxZoom, cams[camNumber].range / zoomSpeed);
    cams[camNumber].updateCam();
};



function resizeWindow()
{
    canvas.width = Math.max(window.innerWidth, 480);
    canvas.height = Math.max(window.innerHeight - 160, 240);
    cams.forEach(function(cam){
        cam.updateProjection();
    });
};

function changeCam(cameraNumber)
{
    gl.uniform1i(camNumberLoc, cameraNumber);
    currentCam = cams[cameraNumber];
};

function setSimSpeed(value)
{
    if(simSpeed != 0)
        simSpeed = Math.pow(3, value);
};

function toggleDetail()
{
    detailed = !detailed;
    needsRefresh = true;
};

function pause()
{
    simSpeed = 0;
    frameCounter = 0;
    document.getElementById('slider').style.background = 'FireBrick';
};

function play()
{
    simSpeed = 1;
    frameCounter = 0;
    setSimSpeed(document.getElementById('slider').value);
    document.getElementById('slider').style.background = '#d3d3d3';
};

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
};

function toggleCursor()
{
    showCursor = !showCursor;
    needsRefresh = true;
};

function end()
{
    simSpeed = maxSim;
    document.getElementById('slider').style.background = 'FireBrick';
};

function requireRestart()
{
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('playButton').disabled = true;
    document.getElementById('endButton').disabled = true;
    document.getElementById('slider').style.background = 'FireBrick';
    simSpeed = 0;
    frameCounter = 0;
};

function goToOrigin()
{
    cams[0].setTarget([0,0,0]);
};

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
};

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
};

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
};

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
};

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
};

function validateInput()
{
    var boolRegExp = new RegExp('^\\s*(true|false)\\s*$', 'i');
    var digit255RegExp = new RegExp('(25[0-5]|[2][0-4]\\d|[1]\\d\\d|[1-9]\\d|\\d)');
    var colorRegExp = new RegExp('^\\s*' + digit255RegExp.source + '\\s*,\\s*' + digit255RegExp.source + '\\s*,\\s*' + digit255RegExp.source + '\\s*$');
    var glueRegExp = new RegExp('^\\s*\\S+\\s*(,\\s*\\S+\\s*){5}$');
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
    
    if(!glueRegExp.test(textBoxes[2].value) || textBoxes[2].value.split(',').length != 6)
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
};

function downloadTDS()
{
    var fileName = prompt('Please name your tile set files.\n.tds and .tdp will be appended automatically.', '');
    if(fileName == null)
        return;
    var TDSText = sim.tileSet.getTilesAsText();
    download(TDSText, fileName + '.tds', 'text/plain');
    var TDPText = [];
    TDPText.push(fileName + '.tds');
    TDPText.push('Temperature=' + sim.temperature);
    TDPText.push(sim.tileSet.seed.tileName + ' ' + sim.tileSet.seed.position.join(' '));
    TDPText.push('');
    TDPText = TDPText.join('\n');
    download(TDPText, fileName + '.tdp', 'text/plain');
};