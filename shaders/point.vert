attribute float xPos;
attribute float yPos;
attribute vec3  pointColor;
attribute vec2  quadOffset;

varying vec3 vColor;
varying vec2 vUV;

uniform float pointSize;
uniform vec2  dim;

void main() {
    vColor = pointColor / 255.0;

    vec2 posPx = vec2(xPos, yPos) + 0.5 * pointSize * quadOffset;

    // pixel -> clip
    float clipX =  2.0 * posPx.x / dim.x - 1.0;
    float clipY = -2.0 * posPx.y / dim.y + 1.0;
    gl_Position = vec4(clipX, clipY, 0.0, 1.0);

    // for circular mask
    vUV = quadOffset * 0.5 + 0.5; 
}
