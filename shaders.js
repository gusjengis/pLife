const pointVert = '\
attribute float xPos;\
attribute float yPos;\
attribute vec3 pointColor;\
varying vec3 color;\
uniform float pointSize;\
uniform vec2 dim;\
void main() { \
    color = pointColor/255.0;\
    gl_Position = vec4(2.0*xPos/dim.x - 1.0, 2.0*yPos/dim.y - 1.0, 0.0, 1); \
    gl_PointSize = pointSize;\
}';

const pointFrag = '\
precision mediump float;\
varying vec3 color;\
void main() {\
    float r = 0.0, delta = 0.0, alpha = 1.0;\
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;\
    r = dot(cxy, cxy);\
    if (r > 1.0) {\
        discard;\
    }\
    gl_FragColor = vec4(color, 1.0);\
}';

const rectVert = '\
attribute vec2 rectPos;\
void main() {\
    gl_Position = vec4(rectPos.x, rectPos.y, 0.0, 1);\
}';

const rectFrag = '\
precision mediump float;\
uniform vec3 rectColor;\
void main() {\
    gl_FragColor = vec4(rectColor, 1.0);\
}';

var rectProgram;
var rectBuffer;
var rectColor;
var rectPos;

var pointProgram;
var pointXPos;
var pointYPos;
var pointColor;
var pointColorBuffer;
var pointXPosBuffer;
var pointYPosBuffer;
var pointSize;
var dimensions;

function InitializeShaders() {
    pointProgram = InitializeShader(gl, pointVert, pointFrag);
    pointXPos = gl.getAttribLocation(pointProgram, "xPos");
    pointYPos = gl.getAttribLocation(pointProgram, "yPos");
    pointXPosBuffer = gl.createBuffer();
    pointYPosBuffer = gl.createBuffer();
    pointColorBuffer = gl.createBuffer();
    pointColor = gl.getAttribLocation(pointProgram, "pointColor");
    dimensions = gl.getUniformLocation(pointProgram, "dim");
    pointSize = gl.getUniformLocation(pointProgram, "pointSize");

    // setupGPUcompute();

    rectProgram = InitializeShader(gl, rectVert, rectFrag);
    rectBuffer = gl.createBuffer();
    rectPos = gl.getAttribLocation(rectProgram, 'rectPos');
    rectColor = gl.getUniformLocation(rectProgram, "rectColor");
}

function drawPoints(points,s){
    gl.useProgram(pointProgram);
    gl.enableVertexAttribArray(pointXPos);
    gl.enableVertexAttribArray(pointYPos);
    gl.enableVertexAttribArray(pointColor);
    // gl.uniform3fv(pointColor, [1, 1, 1]); //SetColor

    gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
    gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.xPos), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
    gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.yPos), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.colors), gl.STATIC_DRAW);

    gl.uniform2fv(dimensions, [canvas.width, canvas.height]); //SetPos
    gl.uniform1f(pointSize, [s]); //SetSize
    gl.drawArrays(gl.POINT, 0 , points.length());

    gl.disableVertexAttribArray(pointXPos);
    gl.disableVertexAttribArray(pointYPos);
    gl.disableVertexAttribArray(pointColor);

}

function drawPoint(x,y,s,r,g,b){
    gl.useProgram(pointProgram);
    gl.enableVertexAttribArray(pointXPos);
    gl.enableVertexAttribArray(pointYPos);
    gl.enableVertexAttribArray(pointColor);
    // gl.uniform3fv(pointColor, [1, 1, 1]); //SetColor

    gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
    gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
    gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([y]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([r,g,b]), gl.STATIC_DRAW);

    gl.uniform2fv(dimensions, [canvas.width, canvas.height]); //SetPos
    gl.uniform1f(pointSize, [s]); //SetSize
    gl.drawArrays(gl.POINT, 0 , 1);

    gl.disableVertexAttribArray(pointXPos);
    gl.disableVertexAttribArray(pointYPos);
    gl.disableVertexAttribArray(pointColor);

}

function drawRect(x,y,w,h,r,g,b){
    gl.useProgram(rectProgram);
    gl.enableVertexAttribArray(rectPos);
    let rectVertices = [
        X(x), Y(y+h),
        X(x+w), Y(y+h),
        X(x), Y(y),
        X(x+w), Y(y),
    ];
    gl.uniform3fv(rectColor, [r/255.0, g/255.0, b/255.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.vertexAttribPointer(rectPos, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);

    gl.disableVertexAttribArray(rectPos);
}

function X(x){
    return 2*(x)/canvas.width - 1;
}

function Y(y){
    return -2*(y)/canvas.height + 1;
}

function InitializeShader(context, vertex, fragment){

    let vertexShader = context.createShader(context.VERTEX_SHADER);
    let fragmentShader = context.createShader(context.FRAGMENT_SHADER);

    context.shaderSource(vertexShader, vertex);
    context.shaderSource(fragmentShader, fragment);

    context.compileShader(vertexShader);
    context.compileShader(fragmentShader);

    var error = false;

    if(!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        alert("An error occured compiling shaders: " + context.getShaderInfoLog(vertexShader));
        error = true;
    }

    if(!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
        alert("An error occured compiling shaders: " + context.getShaderInfoLog(fragmentShader));
        error = true;
    }

    program = context.createProgram();

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);

    if(context.linkProgram(program) == 0){
        console.log("gl.linkProgram(program) failed with error code 0");
        error = true;
    }

    if(error) {
        console.log("Failed to initialize shader.");
        return false;
    }
    console.log(context.getProgramInfoLog(program))
    console.log("Shader successfully created");

    return program;
}