const pointVert = '\
attribute float xPos;\
attribute float yPos;\
attribute vec3  pointColor;\
attribute vec2  quadOffset;\
varying vec3 vColor;\
varying vec2 vUV;\
uniform float pointSize;\
uniform vec2  dim;\
void main() {\
    vColor = pointColor / 255.0;\
    vec2 posPx = vec2(xPos, yPos) + 0.5 * pointSize * quadOffset;\
    float clipX =  2.0 * posPx.x / dim.x - 1.0;\
    float clipY = -2.0 * posPx.y / dim.y + 1.0;\
    gl_Position = vec4(clipX, clipY, 0.0, 1.0);\
    vUV = quadOffset * 0.5 + 0.5; \
}';

const pointFrag = '\
precision mediump float;\
varying vec3 vColor;\
varying vec2 vUV;\
void main() {\
    vec2 cxy = vUV * 2.0 - 1.0;\
    if (dot(cxy, cxy) > 1.0) discard;\
    gl_FragColor = vec4(vColor, 1.0);\
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
var pointQuadOffset;
var pointQuadOffsetBuffer;
var pointIndexBuffer;
var isWebGL2;
var angle;

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
        pointQuadOffset = gl.getAttribLocation(pointProgram, "quadOffset");
        pointQuadOffsetBuffer = gl.createBuffer();
        pointIndexBuffer = gl.createBuffer();

        isWebGL2 = (gl instanceof WebGL2RenderingContext);
        angle = isWebGL2 ? null : gl.getExtension('ANGLE_instanced_arrays');

        gl.useProgram(pointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, pointQuadOffsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(pointQuadOffset);
        gl.vertexAttribPointer(pointQuadOffset, 2, gl.FLOAT, false, 0, 0);
        if (isWebGL2) {
                gl.vertexAttribDivisor(pointQuadOffset, 0);
        } else if (angle) {
                angle.vertexAttribDivisorANGLE(pointQuadOffset, 0);
        }

        rectProgram = InitializeShader(gl, rectVert, rectFrag);
        rectBuffer = gl.createBuffer();
        rectPos = gl.getAttribLocation(rectProgram, 'rectPos');
        rectColor = gl.getUniformLocation(rectProgram, "rectColor");
}

function drawPoints(points, s) {
        const n = points.length();
        if (n === 0) return;

        gl.useProgram(pointProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.xPos), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointXPos);
        gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointXPos, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointXPos, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.yPos), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointYPos);
        gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointYPos, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointYPos, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.colors), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointColor);
        gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointColor, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointColor, 1);

        gl.uniform2fv(dimensions, [canvas.width, canvas.height]);
        gl.uniform1f(pointSize, s);

        if (isWebGL2) {
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
        } else if (angle) {
                angle.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, 4, n);
        }

        gl.disableVertexAttribArray(pointXPos);
        gl.disableVertexAttribArray(pointYPos);
        gl.disableVertexAttribArray(pointColor);
}

function drawPoint(x, y, s, r, g, b) {
        gl.useProgram(pointProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x]), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointXPos);
        gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointXPos, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointXPos, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([y]), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointYPos);
        gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointYPos, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointYPos, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([r, g, b]), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(pointColor);
        gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
        if (isWebGL2) gl.vertexAttribDivisor(pointColor, 1); else if (angle) angle.vertexAttribDivisorANGLE(pointColor, 1);

        gl.uniform2fv(dimensions, [canvas.width, canvas.height]);
        gl.uniform1f(pointSize, s);

        if (isWebGL2) {
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 1);
        } else if (angle) {
                angle.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, 4, 1);
        }

        gl.disableVertexAttribArray(pointXPos);
        gl.disableVertexAttribArray(pointYPos);
        gl.disableVertexAttribArray(pointColor);
}

function drawRect(x, y, w, h, r, g, b) {
        gl.useProgram(rectProgram);
        gl.enableVertexAttribArray(rectPos);
        let rectVertices = [
                X(x), Y(y + h),
                X(x + w), Y(y + h),
                X(x), Y(y),
                X(x + w), Y(y),
        ];
        gl.uniform3fv(rectColor, [r / 255.0, g / 255.0, b / 255.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
        gl.vertexAttribPointer(rectPos, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.disableVertexAttribArray(rectPos);
}

function X(x) {
        return 2 * (x) / canvas.width - 1;
}

function Y(y) {
        return -2 * (y) / canvas.height + 1;
}

function InitializeShader(context, vertex, fragment) {
        let vertexShader = context.createShader(context.VERTEX_SHADER);
        let fragmentShader = context.createShader(context.FRAGMENT_SHADER);

        context.shaderSource(vertexShader, vertex);
        context.shaderSource(fragmentShader, fragment);

        context.compileShader(vertexShader);
        context.compileShader(fragmentShader);

        var error = false;

        if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
                alert("An error occured compiling shaders: " + context.getShaderInfoLog(vertexShader));
                error = true;
        }

        if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
                alert("An error occured compiling shaders: " + context.getShaderInfoLog(fragmentShader));
                error = true;
        }

        program = context.createProgram();

        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
                console.log("gl.linkProgram(program) failed with error code 0");
                error = true;
        }

        if (error) {
                console.log("Failed to initialize shader.");
                return false;
        }
        console.log(context.getProgramInfoLog(program))
        console.log("Shader successfully created");

        return program;
}
