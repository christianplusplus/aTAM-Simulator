var gl;
var canvas; 
var program;

var projectionMatrix;
var modelViewMatrix;

var projectionMatrixLoc;
var modelViewMatrixLoc;
var camViewMatrixLoc;

var sim;
var cursor;

const beige = [255./255, 204./255, 153./255];

var bufferFlags = {
        TILE : 1,
        CURSOR : 2
};
var flag = 0;

window.onload = function()
{
    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    //gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); //For debugging
    if(!gl){alert("WebGL isn't available");}
    gl.clearColor(.0, .0, .0, 1.0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    camViewMatrixLoc = gl.getUniformLocation(program, "camViewMatrix");
    
    projectionMatrix = perspective(45.0, canvas.width/canvas.height, .01, Number.MAX_VALUE);
    updateCam();
    
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1, .1);
    var ts = new TileSet();
    var N = 10;
    ts.add(new Tile("Seed", beige, [0,0,0], [0,0,0,0,0,0], [2,2,2,0,0,0], true));
    for(var i = 0; i < N - 1; i++)
    {
        ts.add(new Tile("Scaffold", beige, [0,0,0], [i+1,"xy","xz",i,0,0], [2,1,1,2,0,0], false));
        ts.add(new Tile("Scaffold", beige, [0,0,0], ["xy",i+1,"yz",0,i,0], [1,2,1,0,2,0], false));
        ts.add(new Tile("Scaffold", beige, [0,0,0], ["xz","yz",i+1,0,0,i], [1,1,2,0,0,2], false));
    }
    ts.add(new Tile("Filler", beige, [0,0,0], ["xy","xy",N,"xy","xy",0], [1,1,1,1,1,0], false));
    ts.add(new Tile("Filler", beige, [0,0,0], ["xz",N,"xz","xz",0,"xz"], [1,1,1,1,0,1], false));
    ts.add(new Tile("Filler", beige, [0,0,0], [N,"yz","yz",0,"yz","yz"], [1,1,1,0,1,1], false));
    ts.add(new Tile("Filler", beige, [0,0,0], [N,N,N,N,N,N], [1,1,1,1,1,1], false));
    
    sim = new aTAMSim(ts, 2, 2000);
    
    cursor = new Cursor();
    cursor.initBuffers();
    
    makeEvents();
    
    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sim.simulate();
    sim.draw();
    cursor.draw();
    if(fowards || left || backwards || right || up || down)
        translateCam();
    requestAnimFrame(render);
};

function makeEvents()
{
    canvas.onmousedown = function(){startRotatingCam();};
    canvas.onmouseup = function(){stopRotatingCam();};
    canvas.onmouseleave = function(){stopRotatingCam();};
    canvas.onmousemove = function(){rotateCam();};
};