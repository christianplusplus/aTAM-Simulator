//Cursor Class

const pr = .1; //polygonal radius
const cursorColor = vec3(1, 1, 1);
const cursorLineColor = vec3(0, 0, 0);
var cursorVertexBuffer;
var cursorVertexAttribute;
var cursorColorLoc;

function Cursor()
{
    this.modelViewMatrix = mat4(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    
    this.initBuffers = function()
    {
        cursorColorLoc = gl.getUniformLocation(program, "fColor");
        
        var vertices = this.buildModel();
        cursorVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cursorVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW);
        cursorVertexAttribute = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(cursorVertexAttribute);//might be bad to put this here.
    }
    
    this.draw = function()
    {
        this.modelViewMatrix[0][3] = currentCam.target[0];
        this.modelViewMatrix[1][3] = currentCam.target[1];
        this.modelViewMatrix[2][3] = currentCam.target[2];
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(this.modelViewMatrix));
        
        if(flag != bufferFlags.CURSOR)
        {
            flag = bufferFlags.CURSOR;
            gl.bindBuffer(gl.ARRAY_BUFFER, cursorVertexBuffer);
            gl.vertexAttribPointer(cursorVertexAttribute, 3, gl.FLOAT, false, 0, 0);
        }
        
        //faces
        gl.uniform3fv(cursorColorLoc, cursorColor);
        for(var i = 0; i < 12; i += 6)
            gl.drawArrays(gl.TRIANGLE_FAN, i, 6);
        
        //outlines
        gl.uniform3fv(cursorColorLoc, cursorLineColor);
        for(var i = 12; i < 24; i += 4)
            gl.drawArrays(gl.LINE_LOOP, i, 4);
    }
    
    this.buildModel = function()
    {
        var vertices = [];
        var index;
        
        //+y faces
        vertices.push([0,pr,0]);
        vertices.push([pr,0,0]);
        vertices.push([0,0,-pr]);
        vertices.push([-pr,0,0]);
        vertices.push([0,0,pr]);
        vertices.push([pr,0,0]);
        
        //-y faces
        vertices.push([0,-pr,0]);
        vertices.push([pr,0,0]);
        vertices.push([0,0,pr]);
        vertices.push([-pr,0,0]);
        vertices.push([0,0,-pr]);
        vertices.push([pr,0,0]);
        
        //lines
        vertices.push([pr,0,0]);
        vertices.push([0,pr,0]);
        vertices.push([-pr,0,0]);
        vertices.push([0,-pr,0]);
        
        vertices.push([0,0,pr]);
        vertices.push([0,pr,0]);
        vertices.push([0,0,-pr]);
        vertices.push([0,-pr,0]);
        
        vertices.push([pr,0,0]);
        vertices.push([0,0,-pr]);
        vertices.push([-pr,0,0]);
        vertices.push([0,0,pr]);
        
        return vertices;
    }
}