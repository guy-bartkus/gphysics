#version 300 es

#define COMB_RADIUS 11.0

in vec2 aPos;
in float aDir;
in int aProp;

uniform vec2 screenDims;
uniform float universeSize;
uniform float speed;
uniform int electronCount;
uniform sampler2D electronTex;

out vec2 oPos;
out float oDir;
out int oProp;
out vec3 oColor;

vec4 toClipSpace(vec2 v) {
    float x = (v.x / screenDims.x) * 2.0 - 1.0;
    float y = -( (v.y / screenDims.y) * 2.0 - 1.0 );

   return vec4(x, y, 0.0, 1.0);
}

vec2 fromAngle(float rads) {
    return vec2(cos(rads), sin(rads));
}

void main() {
    int checkCollide = (aProp >> 2) & 1;
    int type = (aProp >> 3) & 1;

    if(checkCollide == 0) {
        oPos = aPos;
        oDir = aDir;
        oProp = aProp;
        oColor = vec3(0.0, 0.0, 0.0);
        gl_PointSize = 0.0;
        gl_Position = toClipSpace(aPos);

        return;
    }

    if(type == 1) {
        oColor = vec3(1, 0.2588, 0.2588);
    } else {
        oColor = vec3(0.2157, 0.3921, 1);
    }

    vec2 center = screenDims/2.0;
    int newPos = aPos;
    int newProp = aProp;

    if(distance(aPos, center) > universeSize) {
        newProp ^= (1 << 0); // Respawn

        oPos = aPos;
        oDir = aDir;
        oProp = newProp;
        gl_PointSize = 0.0;
        gl_Position = toClipSpace(aPos);

        return;
    }

    for(int i = 0; i < electronCount; i++) {
        vec2 ePos = texelFetch(electronTex, ivec2(i, 0), 0).xy;

        if(distance(aPos, ePos) <= COMB_RADIUS) {
            newProp |= (i << 4); // Encode electron ID
            newProp ^= (1 << 1); // Collided

            break;
        }
    }

    vec2 fbVel = fromAngle(aDir);

    newPos = newPos+(fbVel*speed);

    oPos = newPos;
    oDir = aDir;
    oProp = newProp;

    gl_PointSize = 2.0;
    gl_Position = toClipSpace(newPos);
}