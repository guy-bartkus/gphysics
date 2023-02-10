import { createShader, createProgram } from '../modules/glhelpers';
import vs from '../glsl/circle/vs.glsl';
import fs from '../glsl/circle/fs.glsl';

let gl: WebGL2RenderingContext;
let program: WebGLProgram;

let aVertAttributeLocation: number;
let aPropsAttributeLocation: number;
let sdUniformLocation: WebGLUniformLocation | null;
let vertBufferGL: WebGLBuffer | null;
let propsBufferGL: WebGLBuffer | null;
let vertBuffer: Float32Array = new Float32Array();
let propsBuffer: Float32Array = new Float32Array();

export const start = (gl2: WebGL2RenderingContext): WebGLProgram => {
    gl = gl2;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

    if (typeof vertexShader === 'string') throw vertexShader;
    if (typeof fragmentShader === 'string') throw fragmentShader;

    program = createProgram(gl, vertexShader, fragmentShader);

    if (typeof program === 'string') throw program;

    //aVertAttributeLocation = gl.getAttribLocation(program, "aVert");
    aPropsAttributeLocation = gl.getAttribLocation(program, "aProps");
    sdUniformLocation = gl.getUniformLocation(program, "screenDims");
    //vertBufferGL = gl.createBuffer();
    propsBufferGL = gl.createBuffer();

    return program;
}

export const setVertexBuffer = (buffer: Float32Array) => {
    vertBuffer = buffer;
}

export const setPropsBuffer = (buffer: Float32Array) => {
    propsBuffer = buffer;
}

export const draw = (canvas: HTMLCanvasElement) => {
    if (!gl || !program) throw "Cannot draw before starting!";

    gl.useProgram(program);

    gl.uniform2f(sdUniformLocation, canvas.width, canvas.height);

    //gl.enableVertexAttribArray(aVertAttributeLocation);

    //gl.bindBuffer(gl.ARRAY_BUFFER, vertBufferGL);
    //gl.bufferData(gl.ARRAY_BUFFER, vertBuffer, gl.STATIC_DRAW);

    //gl.vertexAttribPointer(aVertAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPropsAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, propsBufferGL);
    gl.bufferData(gl.ARRAY_BUFFER, propsBuffer, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(aPropsAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    const primitiveType = gl.POINTS;
    const count = propsBuffer.length/4;

    gl.drawArrays(primitiveType, 0, count);
}