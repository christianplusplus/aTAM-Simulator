//Tile Class

const sqrt2 = Math.sqrt(2);
const cr = .45; //cubic radius
const gd = .05; //glue depth
const gr = .3; //glue square radius
const lineColor = vec3(0, 0, 0);
var tileVertexBuffer;
var tileVertexAttribute;
var tileColorLoc;
const colorAngleDict = [
    [0,1,2,3,4,5],
    [2,1,3,5,4,0],
    [0,2,4,3,5,1],
    [3,4,2,0,1,5],
    [5,1,0,2,4,3],
    [3,1,5,0,4,2],
    [0,4,5,3,1,2],
    [5,4,3,2,1,0]
];

/*
 * parameters:
 * tileName - String
 * position - int[x,y,z]
 * glueIDs - int[x,y,z,nx,ny,nz]
 * isSeed - boolean
 */
function Tile(tileName, tileColor, position, glueIDs, glueStrengths, isSeed)
{
    this.tileName = tileName;
    this.tileColor = tileColor;
    this.position = position;
    this.glueIDs = glueIDs;
    this.glueStrengths = glueStrengths;
    this.isSeed = isSeed;
    this.colors = [];
    this.modelViewMatrix = mat4(1,0,0,position[0],0,1,0,position[1],0,0,1,position[2],0,0,0,1);
    
    this.init = function()
    {
        for(var i = 0; i < glueIDs.length; i++)
            this.colors.push(this.colorHash(glueIDs[i]));
    };
    
    this.initBuffers = function()
    {
        tileColorLoc = gl.getUniformLocation(program, "fColor");
        
        var vertices = this.buildModel();
        tileVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tileVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW);
        tileVertexAttribute = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(tileVertexAttribute);//might be bad to put this here.
    };
    
    this.draw = function()
    {
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(this.modelViewMatrix));
        
        if(flag != bufferFlags.TILE)
        {
            flag = bufferFlags.TILE;
            gl.bindBuffer(gl.ARRAY_BUFFER, tileVertexBuffer);
            gl.vertexAttribPointer(tileVertexAttribute, 3, gl.FLOAT, false, 0, 0);
        }
        
        var angleNumber = 0;
        if(camPosition[0] - this.position[0] < 0)
            angleNumber += 1;
        if(camPosition[1] - this.position[1] < 0)
            angleNumber += 2;
        if(camPosition[2] - this.position[2] < 0)
            angleNumber += 4;
        var viewingAngleOffset = 53 * angleNumber;
        
        gl.uniform3fv(tileColorLoc, this.tileColor);
        gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 0, 8);
        
        if(glueStrengths[colorAngleDict[angleNumber][0]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][0]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 8, 8);
        }
        if(glueStrengths[colorAngleDict[angleNumber][1]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][1]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 16, 8);
        }
        if(glueStrengths[colorAngleDict[angleNumber][2]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][2]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 24, 8);
        }
        if(glueStrengths[colorAngleDict[angleNumber][3]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][3]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 32, 6);
        }
        if(glueStrengths[colorAngleDict[angleNumber][4]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][4]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 38, 6);
        }
        if(glueStrengths[colorAngleDict[angleNumber][5]] > 0)
        {
            gl.uniform3fv(tileColorLoc, this.colors[colorAngleDict[angleNumber][5]]);
            gl.drawArrays(gl.TRIANGLE_FAN, viewingAngleOffset + 44, 6);
        }
        
        gl.uniform3fv(tileColorLoc, lineColor);
        gl.drawArrays(gl.LINE_STRIP, viewingAngleOffset + 0, 8);
        gl.drawArrays(gl.LINE_STRIP, viewingAngleOffset + 50, 3);
    };
    
    this.buildModel = function()
    {
        var vertices = [];
        var index;
        
        //angle 0
        //faces
        vertices.push([cr,cr,cr]);
        vertices.push([cr,cr,-cr]);
        vertices.push([-cr,cr,-cr]);
        vertices.push([-cr,cr,cr]);
        vertices.push([-cr,-cr,cr]);
        vertices.push([cr,-cr,cr]);
        vertices.push([cr,-cr,-cr]);
        vertices.push([cr,cr,-cr]);
        
        //x glue
        vertices.push([cr+gd,gr,gr]);
        vertices.push([cr+gd,gr,-gr]);
        vertices.push([cr,gr,-gr]);
        vertices.push([cr,gr,gr]);
        vertices.push([cr,-gr,gr]);
        vertices.push([cr+gd,-gr,gr]);
        vertices.push([cr+gd,-gr,-gr]);
        vertices.push([cr+gd,gr,-gr]);
        
        //y glue
        vertices.push([gr,cr+gd,gr]);
        vertices.push([gr,cr+gd,-gr]);
        vertices.push([-gr,cr+gd,-gr]);
        vertices.push([-gr,cr+gd,gr]);
        vertices.push([-gr,cr,gr]);
        vertices.push([gr,cr,gr]);
        vertices.push([gr,cr,-gr]);
        vertices.push([gr,cr+gd,-gr]);
        
        //z glue
        vertices.push([gr,gr,cr+gd]);
        vertices.push([gr,gr,cr]);
        vertices.push([-gr,gr,cr]);
        vertices.push([-gr,gr,cr+gd]);
        vertices.push([-gr,-gr,cr+gd]);
        vertices.push([gr,-gr,cr+gd]);
        vertices.push([gr,-gr,cr]);
        vertices.push([gr,gr,cr]);
        
        //-x glue
        vertices.push([-cr,gr,gr]);
        vertices.push([-cr,gr,-gr]);
        vertices.push([-cr-gd,gr,-gr]);
        vertices.push([-cr-gd,gr,gr]);
        vertices.push([-cr-gd,-gr,gr]);
        vertices.push([-cr,-gr,gr]);
        
        //-y glue
        vertices.push([gr,-cr,gr]);
        vertices.push([-gr,-cr,gr]);
        vertices.push([-gr,-cr-gd,gr]);
        vertices.push([gr,-cr-gd,gr]);
        vertices.push([gr,-cr-gd,-gr]);
        vertices.push([gr,-cr,-gr]);
        
        //-z glue
        vertices.push([gr,gr,-cr]);
        vertices.push([gr,-gr,-cr]);
        vertices.push([gr,-gr,-cr-gd]);
        vertices.push([gr,gr,-cr-gd]);
        vertices.push([-gr,gr,-cr-gd]);
        vertices.push([-gr,gr,-cr]);
        
        //extra filler line
        vertices.push([cr,-cr,cr]);
        vertices.push([cr,cr,cr]);
        vertices.push([-cr,cr,cr]);
        
        index = vertices.length;
        
        //angle 1
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateY(-90), vec4(vertices[i])).slice(0, 3));
        
        //angle 2
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateX(90), vec4(vertices[i])).slice(0, 3));
        
        //angle 3
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateZ(180), vec4(vertices[i])).slice(0, 3));
        
        //angle 4
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateY(90), vec4(vertices[i])).slice(0, 3));
        
        //angle 5
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateY(180), vec4(vertices[i])).slice(0, 3));
        
        //angle 6
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateX(180), vec4(vertices[i])).slice(0, 3));
        
        //angle 7
        for(var i = 0; i < index; i++)
            vertices.push(mult(rotateZ(180), mult(rotateY(90), vec4(vertices[i]))).slice(0, 3));
        
        return vertices;
    };
    
    //Takes a number and outputs a vec3 with psuedo random number elements in the range [0,1)
    this.colorHash = function(seed)
    {
        if(typeof seed == "string")
            seed = seed.hashCode();
        
        var r = Math.sin(seed+sqrt2) * 12289;
        r -= Math.floor(r);
        var g = Math.sin((seed+sqrt2)*31) * 24593;
        g -= Math.floor(g);
        var b = Math.sin((seed+sqrt2)*53) * 49157;
        b -= Math.floor(b);
        return [r,g,b];
    };
    
    //takes and string like "-5,0,20" and creates copied tile at coordinates [-5,0,20]
    this.copyAt = function(keyString)
    {
        var stringCoords = keyString.split(',');
        var coords = [parseInt(stringCoords[0]), parseInt(stringCoords[1]), parseInt(stringCoords[2])];
        var tile = new Tile(this.tileName, this.tileColor, coords, this.glueIDs, this.glueStrengths, this.isSeed);
        tile.init();
        return tile;
    };
};

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