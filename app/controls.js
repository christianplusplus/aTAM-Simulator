var fowards = false;
var left = false;
var backwards = false;
var right = false;
var up = false;
var down = false;

window.onkeydown = function(e)
{
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