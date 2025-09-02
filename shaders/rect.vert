attribute vec2 rectPos;
void main() {
    gl_Position = vec4(rectPos.x, rectPos.y, 0.0, 1);
}
