import { createShader, createProgram, setBuffer, bufferDataAndSetAttribute, setAttributes } from '../modules/glhelpers';
import vs from '../glsl/forcebits/vs.glsl';
import fs from '../glsl/forcebits/fs.glsl';

let gl: WebGL2RenderingContext;
let program: WebGLProgram;

let posBufferLoc: number;
let dirBufferLoc: number;
let propBufferLoc: number;

let sdUniformLoc: WebGLUniformLocation | null; // Screen dims
let usUniformLoc: WebGLUniformLocation | null; // Universe size
let spUniformLoc: WebGLUniformLocation | null; // Speed
let ecUniformLoc: WebGLUniformLocation | null; // Electron count
let etUniformLoc: WebGLUniformLocation | null; // Electron texture

let posBufferGL1: WebGLBuffer | null;
let dirBufferGL1: WebGLBuffer | null;
let propBufferGL1: WebGLBuffer | null;
let posBufferGL2: WebGLBuffer | null;
let dirBufferGL2: WebGLBuffer | null;
let propBufferGL2: WebGLBuffer | null;

let posBuffer1: Float32Array;
let dirBuffer1: Float32Array;
let propBuffer1: Float32Array;
let posBuffer2: Float32Array;
let dirBuffer2: Float32Array;
let propBuffer2: Float32Array;

let electronTex: WebGLTexture | null;

let tf: WebGLTransformFeedback | null;
let bufferSize: number = 0;

let whichBuffer = 0;

export const start = (gl2: WebGL2RenderingContext, posBuf: Float32Array, dirBuf: Float32Array, propBuf: Float32Array): void => {
    gl = gl2;
    bufferSize = propBuf.length;

    gl.enableVertexAttribArray(0);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

    if (typeof vertexShader === 'string') throw vertexShader;
    if (typeof fragmentShader === 'string') throw fragmentShader;

    program = createProgram(gl, vertexShader, fragmentShader, ['oPos', 'oDir', 'oProp']);

    if (typeof program === 'string') throw program;

    sdUniformLoc = gl.getUniformLocation(program, "screenDims");
    usUniformLoc = gl.getUniformLocation(program, "universeSize");
    spUniformLoc = gl.getUniformLocation(program, "speed");
    ecUniformLoc = gl.getUniformLocation(program, "electronCount");
    etUniformLoc = gl.getUniformLocation(program, "electronTex");

    posBufferLoc = gl.getAttribLocation(program, "aPos");
    dirBufferLoc = gl.getAttribLocation(program, "aDir");
    propBufferLoc = gl.getAttribLocation(program, "aProp");

    posBufferGL1 = gl.createBuffer();
    dirBufferGL1 = gl.createBuffer();
    propBufferGL1 = gl.createBuffer();
    posBufferGL2 = gl.createBuffer();
    dirBufferGL2 = gl.createBuffer();
    propBufferGL2 = gl.createBuffer();

    bufferDataAndSetAttribute(gl, posBufferGL1, posBufferLoc, posBuf, gl.FLOAT, 2, gl.DYNAMIC_READ);
    bufferDataAndSetAttribute(gl, dirBufferGL1, dirBufferLoc, dirBuf, gl.FLOAT, 1, gl.DYNAMIC_READ);
    bufferDataAndSetAttribute(gl, propBufferGL1, propBufferLoc, propBuf, gl.FLOAT, 1, gl.DYNAMIC_READ);

    // bufferDataAndSetAttribute(gl, posBufferGL2, posBufferLoc, bufferSize*4*2, gl.FLOAT, 2, gl.DYNAMIC_COPY);
    // bufferDataAndSetAttribute(gl, dirBufferGL2, dirBufferLoc, bufferSize*4, gl.FLOAT, 1, gl.DYNAMIC_COPY);
    // bufferDataAndSetAttribute(gl, propBufferGL2, propBufferLoc, bufferSize*4, gl.FLOAT, 1, gl.DYNAMIC_COPY);

    setBuffer(gl, posBufferGL2, posBuf, gl.DYNAMIC_COPY);
    setBuffer(gl, dirBufferGL2, dirBuf, gl.DYNAMIC_COPY);
    setBuffer(gl, propBufferGL2, propBuf, gl.DYNAMIC_COPY);

    electronTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);

    tf = gl.createTransformFeedback();

    posBuffer1 = posBuf;
    dirBuffer1 = dirBuf;
    propBuffer1 = propBuf;
    posBuffer2 = posBuf;
    dirBuffer2 = dirBuf;
    propBuffer2 = propBuf;
}

export const setElectronTex = (electronData: Float32Array) => {
    gl.bindTexture(gl.TEXTURE_2D, electronTex);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, electronData.length/2, 0, 0, gl.RG, gl.FLOAT, electronData);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

export const setfbBuffers = (posBuf: Float32Array, dirBuf: Float32Array, propBuf: Float32Array) => {
    
}

export const draw = (speed: number, elecCount: number) => {
    if (!gl || !program) throw "Cannot draw before starting!";

    gl.useProgram(program);

    gl.uniform2f(sdUniformLoc, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(usUniformLoc, 500);
    gl.uniform1f(spUniformLoc, speed);
    gl.uniform1i(ecUniformLoc, elecCount);

    gl.uniform1i(etUniformLoc, 0);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferGL2);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, dirBufferGL2);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, propBufferGL2);

    setBuffer(gl, posBufferGL1, posBuffer2, gl.DYNAMIC_READ);
    setBuffer(gl, dirBufferGL1, dirBuffer2, gl.DYNAMIC_READ);
    setBuffer(gl, propBufferGL1, propBuffer2, gl.DYNAMIC_READ);

    // if(whichBuffer == 0) {
    //     // setBuffer(gl, posBufferGL1, posBuffer1, gl.DYNAMIC_COPY);
    //     // setBuffer(gl, dirBufferGL1, dirBuffer1, gl.DYNAMIC_COPY);
    //     // setBuffer(gl, propBufferGL1, propBuffer1, gl.DYNAMIC_COPY);

    //     bufferDataAndSetAttribute(gl, posBufferGL1, posBufferLoc, posBuffer1, gl.FLOAT, 2, gl.STATIC_DRAW);
    //     bufferDataAndSetAttribute(gl, dirBufferGL1, dirBufferLoc, dirBuffer1, gl.FLOAT, 1, gl.STATIC_DRAW);
    //     bufferDataAndSetAttribute(gl, propBufferGL1, propBufferLoc, propBuffer1, gl.FLOAT, 1, gl.STATIC_DRAW);

    //     setBuffer(gl, posBufferGL2, bufferSize*4*2, gl.STATIC_COPY);
    //     setBuffer(gl, dirBufferGL2, bufferSize*4, gl.STATIC_COPY);
    //     setBuffer(gl, propBufferGL2, bufferSize*4, gl.STATIC_COPY);

    //     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferGL2);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, dirBufferGL2);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, propBufferGL2);
    // } else {
    //     // setBuffer(gl, posBufferGL2, posBuffer2, gl.DYNAMIC_COPY);
    //     // setBuffer(gl, dirBufferGL2, dirBuffer2, gl.DYNAMIC_COPY);
    //     // setBuffer(gl, propBufferGL2, propBuffer2, gl.DYNAMIC_COPY);

    //     bufferDataAndSetAttribute(gl, posBufferGL2, posBufferLoc, posBuffer2, gl.FLOAT, 2, gl.STATIC_DRAW);
    //     bufferDataAndSetAttribute(gl, dirBufferGL2, dirBufferLoc, dirBuffer2, gl.FLOAT, 1, gl.STATIC_DRAW);
    //     bufferDataAndSetAttribute(gl, propBufferGL2, propBufferLoc, propBuffer2, gl.FLOAT, 1, gl.STATIC_DRAW);

    //     setBuffer(gl, posBufferGL1, bufferSize*4*2, gl.STATIC_COPY);
    //     setBuffer(gl, dirBufferGL1, bufferSize*4, gl.STATIC_COPY);
    //     setBuffer(gl, propBufferGL1, bufferSize*4, gl.STATIC_COPY);

    //     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferGL1);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, dirBufferGL1);
    //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, propBufferGL1);
    // }

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, bufferSize);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);

    gl.flush();

    const returnPromise: Promise<void> = new Promise(resolve => {
        let whichBuffer2 = whichBuffer;

        function checkSync() {
            if(!sync) throw new Error('Sync is not defined!!!');

            const status = gl.clientWaitSync(sync!, 0, 0);
            
            switch (status) {
                case gl.TIMEOUT_EXPIRED:
                    return setTimeout(checkSync);
                case gl.WAIT_FAILED:
                    throw new Error('Failed to wait for sync!!!');
                default:
                    gl.deleteSync(sync!);
                    
                    // if(whichBuffer2 == 0) {
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, posBufferGL2);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, posBuffer2);
                
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, dirBufferGL2);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, dirBuffer2);
                
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, propBufferGL2);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, propBuffer2);
                    // } else {
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, posBufferGL1);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, posBuffer1);
                
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, dirBufferGL1);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, dirBuffer1);
                
                    //     gl.bindBuffer(gl.ARRAY_BUFFER, propBufferGL1);
                    //     gl.getBufferSubData(gl.ARRAY_BUFFER, 0, propBuffer1);
                    // }

                    gl.bindBuffer(gl.ARRAY_BUFFER, posBufferGL2);
                    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, posBuffer2);
            
                    gl.bindBuffer(gl.ARRAY_BUFFER, dirBufferGL2);
                    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, dirBuffer2);
            
                    gl.bindBuffer(gl.ARRAY_BUFFER, propBufferGL2);
                    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, propBuffer2);
    
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                    resolve();
            }
        }

        checkSync();
    });

    whichBuffer = +!whichBuffer;

    return returnPromise;
}