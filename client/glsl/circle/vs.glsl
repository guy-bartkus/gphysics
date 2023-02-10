#version 300 es
//in vec2 aVert;
in vec4 aProps;
uniform vec2 screenDims;
out vec3 vColor;

vec4 toClipSpace(vec2 v) {
    float x = (v.x / screenDims.x) * 2.0 - 1.0;
    float y = -( (v.y / screenDims.y) * 2.0 - 1.0 );

    return vec4(x, y, 0.0, 1.0);
}

void main() {
    vColor = vec3(aProps.z, 0.4, aProps.w);
    gl_Position = toClipSpace(aProps.xy);
    gl_PointSize = 2.0;
}