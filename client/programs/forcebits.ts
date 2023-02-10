import { setBuffer, bufferDataAndSetAttribute, setAttributes } from '../modules/glhelpers';

let gl: WebGL2RenderingContext;

let posBufferLoc: number;
let velBufferLoc: number;
let propBufferLoc: number;
let posBufferGL: WebGLBuffer | null;
let velBufferGL: WebGLBuffer | null;
let posBufferGL2: WebGLBuffer | null;
let velBufferGL2: WebGLBuffer | null;
let propBufferGL: WebGLBuffer | null;

let hitInfoTex: WebGLTexture | null;
let electronsTex1: WebGLTexture | null;
let electronsTex2: WebGLTexture | null;

let frameBuffer: WebGLFramebuffer | null;

let tf: WebGLTransformFeedback | null;

export const start = (gl2: WebGL2RenderingContext, posBuf: Float32Array, velBuf: Float32Array, propBuf: Int8Array): void => {
    gl = gl2;

    posBufferGL = gl.createBuffer();
    velBufferGL = gl.createBuffer();
    propBufferGL = gl.createBuffer();
    posBufferGL2 = gl.createBuffer();
    velBufferGL2 = gl.createBuffer();

    hitInfoTex = gl.createTexture();
    electronsTex1 = gl.createTexture();
    electronsTex2 = gl.createTexture();

    frameBuffer = gl.createFramebuffer();

    tf = gl.createTransformFeedback();

    setBuffer(gl, posBufferGL2, posBuf.byteLength, gl.STATIC_DRAW);
    setBuffer(gl, velBufferGL2, velBuf.byteLength, gl.STATIC_DRAW);

    bufferDataAndSetAttribute(gl, posBufferGL, posBufferLoc, posBuf, gl.FLOAT, 2, gl.STATIC_DRAW);
    bufferDataAndSetAttribute(gl, velBufferGL, velBufferLoc, velBuf, gl.FLOAT, 2, gl.STATIC_DRAW);
    bufferDataAndSetAttribute(gl, propBufferGL, propBufferLoc, propBuf, gl.BYTE, 1, gl.STATIC_DRAW, true);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferGL2);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velBufferGL2);
    // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, propBufferGL2);
    
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    
    gl.enableVertexAttribArray(0);
}