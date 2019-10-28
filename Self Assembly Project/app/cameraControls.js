const maxZoom = 1;
var camRange = 30;
var camTheta = Math.PI / 4; //xz plane
var camPhi = Math.PI / 4; //y plane
var camPosition = [];
var camTarget = vec3(5,5,5);
var isCamRotating = false;

var mouseStartX;
var mouseStartY;

var fowards = false;
var left = false;
var backwards = false;
var right = false;
var up = false;
var down = false;
var camSpeed = .05;
const zoomSpeed = 1.1;

function startRotatingCam()
{
    isCamRotating = true;
    mouseStartX = event.clientX;
    mouseStartY = event.clientY;
};

function rotateCam()
{
    if(isCamRotating)
    {
        var changeX = mouseStartX - event.clientX;
        var changeY = mouseStartY - event.clientY;
        mouseStartX = event.clientX;
        mouseStartY = event.clientY;
        camTheta += changeX * Math.PI / 360;
        camPhi += changeY * Math.PI / 360;
        if(camPhi < .0001)
            camPhi = .0001;
        else
        {
            if(camPhi > Math.PI - .0001)
                camPhi = Math.PI - .0001;
        }
        updateCam();
    }
};

function stopRotatingCam()
{
    isCamRotating = false;
};

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
    updateCam();
};

function translateCam()
{
    var scrollSpeed = camSpeed * camRange;
    var fowardsBack, rightLeft, upDown;
    fowardsBack = rightLeft = upDown = scrollSpeed;
    if(!fowards)
        fowardsBack -= scrollSpeed;
    if(backwards)
        fowardsBack -= scrollSpeed;
    if(!right)
        rightLeft -= scrollSpeed;
    if(left)
        rightLeft -= scrollSpeed;
    if(!up)
        upDown -= scrollSpeed;
    if(down)
        upDown -= scrollSpeed;
    
    var direction = camTheta + Math.PI;
    camTarget[0] += fowardsBack * Math.sin(direction) - rightLeft * Math.cos(direction);
    camTarget[1] += upDown;
    camTarget[2] += rightLeft * Math.sin(direction) + fowardsBack * Math.cos(direction);
    updateCam();
};

function updateCam()
{
    camPosition[0] = camRange;
    camPosition[1] = camPosition[0];
    camPosition[0] *= Math.sin(camPhi);
    camPosition[2] = camPosition[0];
    camPosition[0] *= Math.sin(camTheta);
    camPosition[2] *= Math.cos(camTheta);
    camPosition[1] *= Math.cos(camPhi);
    camPosition[0] += camTarget[0];
    camPosition[1] += camTarget[1];
    camPosition[2] += camTarget[2];
    
    var cam = lookAt(
            camPosition,
            camTarget,
            vec3(0,1,0)
    );
    gl.uniformMatrix4fv(camViewMatrixLoc, false, flatten(cam));
};