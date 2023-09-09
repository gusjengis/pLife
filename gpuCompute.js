const VelVert = '\
#version 300 es\n\
uniform sampler2D u_texture;\
uniform int dim;\
in int gl_VertexID;\
void main(){\
    float y = floor((float(gl_VertexID)/float(dim)));\
    vec2 pos = vec2(float(gl_VertexID") - float(dim)*y, y);\
    gl_Position = vec4(pos/float(dim), 0, 1);\
    gl_PointSize = 1.0;\
}\
';

const VelFrag = '\
#version 300 es\n\
precision mediump float;\
\
uniform sampler2D u_posTex;\
uniform sampler2D u_colorTex;\
uniform sampler2D u_attrTex;\
uniform float rMax;\
uniform float rMin;\
uniform int dim;\
uniform int length;\
\
void distance(out float returnVal, in vec4 pos1, in vec4 pos2){\
    returnVal = sqrt((pos2.x-pos1.x) + (pos2.y-pos1.y))/rMax;\
}\
\
void main(){\
\
    float dist;\
    float mult;\
    float attraction;\
    ivec2 p1 = int(gl_FragCoord.x*float(dim), gl_FragCoord.y*float(dim));\
    \
    for(int i=0; i<length; i+=1){\
        distance(dist, texelFetch(u_texture, p1, 0), texelFetch(u_texture, ivec2(0, 0), 0))\
        if(dist>1.0 || dist <= 0){ continue; }\
        if(dist < rMin){\
            mult = (dist / rMin - 1);\
        } else if(dist > rMin){\
            attraction = ???;\
            mult = attraction * (1.0 - abs(1.0 + rMin - 2.0 * dist) / (1.0 - rMin));\
         }\
        return mult/dist;\
    }\
}\
';

var VelProgram;
var VelTex;
var uVelTex;
var uRMax;  
var uRMin;
var uDim;
var uLength;

function setupGPUcompute(){
    VelProgram = InitializeShader(gl, VelVert, VelFrag);
    uVelTex = gl.getUniformLocation(posVelProgram, 'u_texture');
    uRMax = gl.getUniformLocation(posVelProgram, 'rMax');
    uRMin = gl.getUniformLocation(posVelProgram, 'rMin');
    uDim = gl.getUniformLocation(posVelProgram, 'dim');
    uLength = gl.getUniformLocation(posVelProgram, 'length');

    VelTex = gl.createTexture();
    setupTextures();
}

function setupTextures(){ //https://webglfundamentals.org/webgl/lessons/webgl-qna-how-to-use-textures-as-data.html
    let Texlevel = 0;
    let TexinternalFormat = gl.RGBA32F;
    let Texwidth = Math.round(Math.sqrt(PIXELS.length()));
    let Texheight = Math.round(Math.sqrt(PIXELS.length()));
    let Texborder = 0;
    let Texformat = gl.RGBA;
    let Textype = gl.FLOAT;
    
    let alignment = 1;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);

    

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function resizeTexture(){
    let Texlevel = 0;
    let TexinternalFormat = gl.RGBA32F;
    let Texwidth = Math.round(Math.sqrt(PIXELS.length()));
    let Texheight = Math.round(Math.sqrt(PIXELS.length()));
    let Texborder = 0;
    let Texformat = gl.RGBA;
    let Textype = gl.FLOAT;

    gl.texImage2D(gl.TEXTURE_2D, Texlevel, TexinternalFormat, Texwidth, Texheight, Texborder, Texformat, Textype, PIXELS.Data());   
}

function computeVelocities(){

}