#version 300 es

#define PI_Half 1.5707963267
#define PI 3.1415926538
#define PI2 6.2831853071

in vec2 aPos;
in float aDir;
in int aProp;

uniform vec2 screenDims;
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

    if(checkCollide == 0) {
        oPos = aPos;
        oDir = aDir;
        oProp = aProp;
        oColor = vec3(0.0, 0.0, 0.0);
        
        return;
    }

    for(int i = 0; i < electronCount; i++) {
        vec2 ePos = texelFetch(electronTex, ivec2(i, 0), 0).xy;
    }

    if(type == 1) {
        oColor = vec3(1, 0.2588, 0.2588);
    } else {
        oColor = vec3(0.2157, 0.3921, 1);
    }
}