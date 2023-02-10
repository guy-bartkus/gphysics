#version 300 es

#define PI_Half 1.5707963267
#define PI 3.1415926538
#define PI2 6.2831853071

in vec2 aPos;
in vec2 aVel;
in int aProp;
in int aProp2;

uniform vec2 screenDims;
uniform float speed;
uniform float spawnRadius;
uniform int electronCount;
uniform sampler2D electronTex;
uniform sampler2D hitInfo;

out vec2 oPos;
out vec2 oVel;
out int oProp;
out int oProp2;
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
    float fbRadius = 1.0;
    float elecRadius = 8.0;
    float combRadius = fbRadius+elecRadius;

    int type = (aProp >> 0) & 1;
    int visible = (aProp >> 1) & 1;
    int passing = (aProp >> 2) & 1;
    int electronId = aProp2;

    vec2 newPos = aPos;
    vec2 newVel = aVel;
    int newProp = aProp;
    int newProp2 = aProp2;

    if(type == 1) {
        oColor = vec3(1, 0.2588, 0.2588);
    } else {
        oColor = vec3(0.2157, 0.3921, 1);
    }

    bool colliding = false; // Might be an issue, idk

    for(int i = 0; i < electronCount; i++) {
        if(passing == 1) {
            vec2 electronPos = texelFetch(electronTex, ivec2((i*3), 0), 0).xy;
            float dist = distance(electronPos, aPos);

            if(dist <= combRadius) {
                colliding = true;
            }

            continue;
        }

        int fbIndex = int(texelFetch(hitInfo, ivec2(i, 0), 0).x);

        if(fbIndex != gl_VertexID) continue;

        int collideType = int(texelFetch(hitInfo, ivec2(i, 0), 0).y); // 0 = absorb, 1 = eject

        if(collideType == 0 && visible == 1 && passing == 0) { // Absorb
            gl_PointSize = 0.0; // Might be an issue, idk

            visible = 0;
            newProp ^= (1 << 1);
        } else if(collideType == 1 && visible == 0 && passing == 0) { // Eject
            vec2 electronPos = texelFetch(electronTex, ivec2((i*3), 0), 0).xy;
            int ejectZone = int(texelFetch(electronTex, ivec2((i*3)+2, 0), 0).y);
            float rot = texelFetch(electronTex, ivec2((i*3)+2, 0), 0).z;

            float zoneRot = float(ejectZone)*PI_Half;
            float zoneAbsRot = mod(rot+zoneRot, PI2);

            vec2 zoneDir = fromAngle(zoneAbsRot);

            visible = 1;
            newProp ^= (1 << 1);
            newPos = electronPos+zoneDir*(elecRadius+fbRadius);
            newVel = zoneDir;
        }
    }

    if(colliding) {
        newProp ^= (1 << 4);
    } else {
        newProp ^= (1 << 4);
    }

    if(passing == 1 && !colliding) {
        passing = 0;
        newProp ^= (1 << 2);
    } 
    
    if(visible == 1) {
        
    }

    gl_Position = toClipSpace(newPos);
    oPos = newPos;
    oVel = newVel;
    oProp = newProp;
    oProp2 = aProp2;
}