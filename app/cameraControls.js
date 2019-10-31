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
        case 32: //SPACE - up
            up = true;
            break;
        case 67: //C - down
            down = true;
        case 13: //enter
            sim.simulate();
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
        case 32: //SPACE - up
            up = false;
            break;
        case 67: //C - down
            down = false;
    }
};

window.onwheel = function(e)
{
    if(e.deltaY > 0)
        camRange *= zoomSpeed;
    else
        camRange = Math.max(maxZoom, camRange / zoomSpeed);
    cams[0].updateCam();
};



function resizeWindow()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cams.forEach(function(cam){cam.updateProjection();});
};

function changeCam(cameraNumber)
{
    gl.uniform1i(camNumberLoc, cameraNumber);
    currentCam = cams[cameraNumber];
};