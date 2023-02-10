import { createShader, createProgram, setBuffer, bufferDataAndSetAttribute, setAttributes } from '../../modules/glhelpers';
import vs from '../glsl/forcebits/p1/vs.glsl';
import fs from '../glsl/forcebits/p1/fs.glsl';

let gl: WebGL2RenderingContext;
let program: WebGLProgram;

let posBufferLoc: number;
let velBufferLoc: number;
let propBufferLoc: number;
let sdUniformLoc: WebGLUniformLocation | null;
let spUniformLoc: WebGLUniformLocation | null;
let posBufferGL: WebGLBuffer | null;
let velBufferGL: WebGLBuffer | null;
let posBufferGL2: WebGLBuffer | null;
let velBufferGL2: WebGLBuffer | null;
let propBufferGL: WebGLBuffer | null;
let tf: WebGLTransformFeedback | null;
let bufferSize: number = 0;

export const start = (gl2: WebGL2RenderingContext, posBuf: Float32Array, velBuf: Float32Array, propBuf: Int8Array): void => {
    gl = gl2;
    bufferSize = posBuf.length/2;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

    if (typeof vertexShader === 'string') throw vertexShader;
    if (typeof fragmentShader === 'string') throw fragmentShader;

    program = createProgram(gl, vertexShader, fragmentShader, ['oPos', 'oVel', 'oProp', 'oProp2']);

    if (typeof program === 'string') throw program;

    sdUniformLoc = gl.getUniformLocation(program, "screenDims");
    spUniformLoc = gl.getUniformLocation(program, "speed");
    posBufferLoc = gl.getAttribLocation(program, "aPos");
    velBufferLoc = gl.getAttribLocation(program, "aVel");
    propBufferLoc = gl.getAttribLocation(program, "aProp");
}

export const draw = (speed: number) => {
    if (!gl || !program) throw "Cannot draw before starting!";

    gl.useProgram(program);

    gl.uniform2f(sdUniformLoc, gl.canvas.width, gl.canvas.height);

    gl.uniform1f(spUniformLoc, speed);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, bufferSize);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    gl.flush();

    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, posBufferGL2);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBufferGL);

    gl.copyBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, gl.ARRAY_BUFFER, 0, 0, bufferSize*8);

    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, velBufferGL2);
    gl.bindBuffer(gl.ARRAY_BUFFER, velBufferGL);

    gl.copyBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, gl.ARRAY_BUFFER, 0, 0, bufferSize*8);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
}