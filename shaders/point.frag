precision mediump float;

varying vec3 vColor;
varying vec2 vUV;

void main() {
    vec2 cxy = vUV * 2.0 - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    gl_FragColor = vec4(vColor, 1.0);
}
