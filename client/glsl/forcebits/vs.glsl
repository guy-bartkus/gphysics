#version 300 es
in vec2 aPos;
in vec2 aVel;
in int aProp;
uniform vec2 screenDims;
uniform float speed;
out vec2 oPos;
out vec2 oVel;
// out uint aProp;
out vec3 oColor;

vec4 toClipSpace(vec2 v) {
    float x = (v.x / screenDims.x) * 2.0 - 1.0;
    float y = -( (v.y / screenDims.y) * 2.0 - 1.0 );

    return vec4(x, y, 0.0, 1.0);
}

void main() {
    vec2 aVel2 = aVel;
    vec2 newPos = aPos+aVel*speed;
    int type = (aProp >> 7) & 1;

    if(newPos.x > screenDims.x - 3.0 || newPos.x < 0.0 + 3.0) {
        aVel2.x = -aVel2.x;
        newPos = aPos+aVel*speed;
    }

    if(newPos.y > screenDims.y - 3.0 || newPos.y < 0.0 + 3.0) {
        aVel2.y = -aVel2.y;
        newPos = aPos+aVel*speed;
    }

    gl_Position = toClipSpace(newPos);
    gl_PointSize = 2.0;
    oPos = newPos;
    oVel = aVel2;

    if(type == 1) {
        oColor = vec3(1, 0.2588, 0.2588);
    } else {
        oColor = vec3(0.2157, 0.3921, 1);
    }
}