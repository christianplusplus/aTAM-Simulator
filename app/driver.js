var gl;
var canvas; 
var program;

var modelViewMatrixLoc;
var projectionMatrixLoc0;
var camViewMatrixLoc0;
var projectionMatrixLoc1;
var camViewMatrixLoc1;
var camNumberLoc;
var lightOnLoc;
var lightSrcLoc;

const maxSim = 10000;
const defaultTemp = 2;
var currentCam;
var cams = [];
var sim;
var cursor;
var needsRefresh = true; //set in aTAMSim.simulate(), Camera.updateCam(), Camera.updateProjection(), TileSet.select(next|prev)?Row()
var frameCounter = 0;
var simSpeed = 0;
var detailed = false;
var showCursor = true;
var textBoxes = [];

const beige = [255./255, 204./255, 153./255];
const white = [1., 1., 1.];
const blue = [0./255, 102./255, 204./255];
const green = [153./255, 1., 204./255];
const brown = [102./255, 51./255, 0.];

var bufferFlags = {
        TILE : 1,
        CURSOR : 2
};
var flag = 0;

window.onload = function()
{
    canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    gl = WebGLUtils.setupWebGL(canvas);
    //gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); //For debugging
    if(!gl){alert("WebGL isn't available");}
    gl.clearColor(.0, .0, .0, 1.0);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    camViewMatrixLoc0 = gl.getUniformLocation(program, "camViewMatrix0");
    projectionMatrixLoc0 = gl.getUniformLocation(program, "projectionMatrix0");
    camViewMatrixLoc1 = gl.getUniformLocation(program, "camViewMatrix1");
    projectionMatrixLoc1 = gl.getUniformLocation(program, "projectionMatrix1");
    camNumberLoc = gl.getUniformLocation(program, "camNumber");
    lightOnLoc = gl.getUniformLocation(program, "lightOn");
    lightSrcLoc = gl.getUniformLocation(program, "lightSrc");
    
    cams[0] = new Camera(
            [8,8,8],
            Math.PI/4,
            Math.PI/4,
            30,
            function(){return perspective(45, canvas.width/canvas.height/2, .01, Number.MAX_VALUE);},
            camViewMatrixLoc0,
            projectionMatrixLoc0
    );
    cams[1] = new Camera(
            [2,2,0],
            0,
            Math.PI/2,
            12,
            function(){return perspective(45, canvas.width/canvas.height/2, .01, Number.MAX_VALUE);},
            camViewMatrixLoc1,
            projectionMatrixLoc1
    );
    cams.forEach(function(cam){
        cam.updateCam();
        cam.updateProjection();
    });
    resizeWindow();
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1, .1);
    
    //Demo
    var ts = new TileSet();
    var N = 2; //16 for fast draw
    ts.add(new Tile("Seed", brown, [0,0,0], [0,0,0,0,0,0], [2,2,2,0,0,0], true));
    for(var i = 0; i < N - 1; i++)
    {
        ts.add(new Tile("Scaffold", white, [0,0,0], [i+1,"xy","xz",i,0,0], [2,1,1,2,0,0], false));
        ts.add(new Tile("Scaffold", white, [0,0,0], ["xy",i+1,"yz",0,i,0], [1,2,1,0,2,0], false));
        ts.add(new Tile("Scaffold", white, [0,0,0], ["xz","yz",i+1,0,0,i], [1,1,2,0,0,2], false));
    }
    ts.add(new Tile("Filler", green, [0,0,0], ["xy","xy",N,"xy","xy",0], [1,1,1,1,1,0], false));
    ts.add(new Tile("Filler", green, [0,0,0], ["xz",N,"xz","xz",0,"xz"], [1,1,1,1,0,1], false));
    ts.add(new Tile("Filler", green, [0,0,0], [N,"yz","yz",0,"yz","yz"], [1,1,1,0,1,1], false));
    ts.add(new Tile("Filler3D", blue, [0,0,0], [N,N,N,N,N,N], [1,1,1,1,1,1], false));
    
    sim = new aTAMSim(ts, defaultTemp, maxSim);
    
    cursor = new Cursor();
    cursor.initBuffers();
    
    makeEvents();
    
    render();
};

function render()
{
    frameCounter += simSpeed;
    while(frameCounter >= 1. && sim.simulate())
        frameCounter -= 1.;
    
    if(fowards || left || backwards || right || up || down)
        cams[0].translateCam();
    
    if(needsRefresh)
        refresh();
    
    requestAnimFrame(render);
};

function refresh()
{
    needsRefresh = false;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.viewport(0, 0, canvas.width/2, canvas.height);
    changeCam(0);
    gl.uniform1i(lightOnLoc, false);
    
    if(detailed)
        sim.draw();
    else
        sim.fastDraw();
    if(showCursor)
        cursor.draw();
    
    gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height);
    changeCam(1);
    if(sim.tileSet.list.length > 0)
    {
        gl.uniform1i(lightOnLoc, true);
        gl.uniform3fv(lightSrcLoc, sim.tileSet.list[sim.tileSet.pointer].position);
    }
    
    sim.tileSet.draw();
};

function makeEvents()
{
    for(var i = 0; i < 5; i++)
        textBoxes.push(document.getElementById('text' + i));
    canvas.onmousedown = function(){
        if(event.clientX < canvas.width / 2)
            cams[0].startRotatingCam();
        else
            cams[1].startRotatingCam();
    };
    canvas.onmouseup = function(){
        cams.forEach(function(cam){
            cam.stopRotatingCam();
        });
    };
    canvas.onmouseleave = function(){
        cams.forEach(function(cam){
            cam.stopRotatingCam();
        });
    };
    canvas.onmousemove = function(){
        cams.forEach(function(cam){
            cam.rotateCam();
        });
    };
    window.onresize = function(){resizeWindow();};
};

//found this hashing function on stack overflow
String.prototype.hashCode = function(){
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};