const maxZoom = 1;
const speedCoefficient = .05;
const zoomSpeed = 1.1;

function Camera(target, theta, phi, range, projectionFunction, camViewMatrixLoc, projectionMatrixLoc)
{
    this.target = target;
    this.theta = theta;
    this.phi = phi;
    this.range = range;
    this.projectionFunction = projectionFunction;
    this.camViewMatrixLoc = camViewMatrixLoc;
    this.projectionMatrixLoc = projectionMatrixLoc;
    this.position = [];
    this.isRotating;
    
    this.startRotatingCam = function()
    {
        this.isRotating = true;
        this.mouseStartX = event.clientX;
        this.mouseStartY = event.clientY;
    };

    this.rotateCam = function()
    {
        if(this.isRotating)
        {
            var changeX = this.mouseStartX - event.clientX;
            var changeY = this.mouseStartY - event.clientY;
            this.mouseStartX = event.clientX;
            this.mouseStartY = event.clientY;
            this.theta += changeX * Math.PI / 360;
            this.phi += changeY * Math.PI / 360;
            if(this.phi < .0001)
                this.phi = .0001;
            else
            {
                if(this.phi > Math.PI - .0001)
                    this.phi = Math.PI - .0001;
            }
            this.updateCam();
        }
    };

    this.stopRotatingCam = function()
    {
        this.isRotating = false;
    };
    
    this.translateCam = function()
    {
        var scrollSpeed = speedCoefficient * this.range;
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
        
        var direction = this.theta + Math.PI;
        this.target[0] += fowardsBack * Math.sin(direction) - rightLeft * Math.cos(direction);
        this.target[1] += upDown;
        this.target[2] += rightLeft * Math.sin(direction) + fowardsBack * Math.cos(direction);
        this.updateCam();
    };
    
    this.updateCam = function()
    {
        this.position[0] = this.range;
        this.position[1] = this.position[0];
        this.position[0] *= Math.sin(this.phi);
        this.position[2] = this.position[0];
        this.position[0] *= Math.sin(this.theta);
        this.position[2] *= Math.cos(this.theta);
        this.position[1] *= Math.cos(this.phi);
        this.position[0] += this.target[0];
        this.position[1] += this.target[1];
        this.position[2] += this.target[2];
        
        var cam = lookAt(
                this.position,
                this.target,
                vec3(0,1,0)
        );
        gl.uniformMatrix4fv(this.camViewMatrixLoc, false, flatten(cam));
    };
    
    this.updateProjection = function()
    {
        gl.uniformMatrix4fv(this.projectionMatrixLoc, false, flatten(projectionFunction()));
    };
};