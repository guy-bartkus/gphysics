// import { createShader, createProgram, setBuffer, bufferDataAndSetAttribute } from '../modules/glhelpers';
// import vs from '../glsl/gpgpu/vs.glsl';
// import fs from '../glsl/gpgpu/fs.glsl';

// let gl: WebGL2RenderingContext;
// let program: WebGLProgram;

// let posBufferLoc: number;
// let velBufferLoc: number;
// let sdUniformLoc: WebGLUniformLocation | null;
// let spUniformLoc: WebGLUniformLocation | null;
// let posBufferInGL: WebGLBuffer | null;
// let velBufferInGL: WebGLBuffer | null;
// let posBufferOutGL: WebGLBuffer | null;
// let velBufferOutGL: WebGLBuffer | null;
// let posBufferIn: Float32Array;
// let velBufferIn: Float32Array;
// let posBufferOut: Float32Array;
// let velBufferOut: Float32Array;
// let va: WebGLVertexArrayObject | null;
// let tf: WebGLTransformFeedback | null;
// let isBusy: boolean = false;

// let outBufferSize: number = -1;

// export const start = (gl2: WebGL2RenderingContext): WebGLProgram => {
//     gl = gl2;

//     const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
//     const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

//     if (typeof vertexShader === 'string') throw vertexShader;
//     if (typeof fragmentShader === 'string') throw fragmentShader;

//     program = createProgram(gl, vertexShader, fragmentShader, ['oPos', 'oVel']);

//     if (typeof program === 'string') throw program;

//     sdUniformLoc = gl.getUniformLocation(program, "screenDims");
//     spUniformLoc = gl.getUniformLocation(program, "speed");
//     posBufferLoc = gl.getAttribLocation(program, "aPos");
//     velBufferLoc = gl.getAttribLocation(program, "aVel");

//     posBufferInGL = gl.createBuffer();
//     velBufferInGL = gl.createBuffer();

//     tf = gl.createTransformFeedback();

//     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

//     posBufferOutGL = gl.createBuffer();
//     velBufferOutGL = gl.createBuffer();

//     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferOutGL);
//     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velBufferOutGL);
    
//     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    
//     gl.enableVertexAttribArray(0);
//     // va = gl.createVertexArray();
//     // gl.bindVertexArray(va);
//     // const vattrib_count = Math.min(32, gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
//     // for (let i = 0; i < vattrib_count; i++) {
//     //     gl.disableVertexAttribArray(i); 
//     // }
//     // gl.bindVertexArray(null);

//     return program;
// }

// export const setPosBufferIn = (buffer: Float32Array) => {
//     bufferDataAndSetAttribute(gl, posBufferInGL, buffer, 2, posBufferLoc);
//     posBufferIn = buffer;

//     updateOutBuffersGL(buffer.length * 4);
// }

// export const setVelBufferIn = (buffer: Float32Array) => {
//     bufferDataAndSetAttribute(gl, velBufferInGL, buffer, 2, velBufferLoc);
//     velBufferIn = buffer;

//     updateOutBuffersGL(buffer.length * 4);
// }

// function updateOutBuffersGL(bufLength: number) {
//     if(bufLength !== outBufferSize) {
//         console.log("Buffer size changed!");
//         outBufferSize = bufLength;

//         // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

//         gl.bindBuffer(gl.ARRAY_BUFFER, posBufferOutGL);
//         gl.bufferData(gl.ARRAY_BUFFER, outBufferSize, gl.DYNAMIC_READ);

//         gl.bindBuffer(gl.ARRAY_BUFFER, velBufferOutGL);
//         gl.bufferData(gl.ARRAY_BUFFER, outBufferSize, gl.DYNAMIC_READ);

//         // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBufferOutGL);
//         // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velBufferOutGL);
        
//         // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
//         gl.bindBuffer(gl.ARRAY_BUFFER, null)
//     }
// }

// export const setPosBufferOut = (buffer: Float32Array) => posBufferOut = buffer;
// export const setVelBufferOut = (buffer: Float32Array) => velBufferOut = buffer;

// export const draw = (speed: number): boolean => {
//     if (!gl || !program) throw "Cannot draw before starting!";

//     if(isBusy) return false;
//     isBusy = true;

//     gl.useProgram(program);

//     gl.uniform2f(sdUniformLoc, gl.canvas.width, gl.canvas.height);

//     gl.uniform1f(spUniformLoc, speed);
//     // gl.bindVertexArray(va);

//     gl.enable(gl.RASTERIZER_DISCARD);

//     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
//     gl.beginTransformFeedback(gl.POINTS);
//     gl.drawArrays(gl.POINTS, 0, posBufferIn.length/2);
//     gl.endTransformFeedback();
//     gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
//     // gl.bindVertexArray(null);
//     let fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;
//     gl.flush();
    
//     gl.disable(gl.RASTERIZER_DISCARD);


//     const checkSync = () => {
//         const status = gl.clientWaitSync(fence, 0, 0);
//         switch (status) {
//           case gl.TIMEOUT_EXPIRED:
//             return setTimeout(checkSync);
//           case gl.WAIT_FAILED:
//             isBusy = false;
//             throw new Error('should never get here');
//           default:
//             gl.deleteSync(fence);
            
//             gl.bindBuffer(gl.ARRAY_BUFFER, posBufferOutGL);
//             gl.getBufferSubData(
//                 gl.ARRAY_BUFFER,
//                 0,
//                 posBufferOut
//             );
        
//             gl.bindBuffer(gl.ARRAY_BUFFER, velBufferOutGL);
//             gl.getBufferSubData(
//                 gl.ARRAY_BUFFER,
//                 0,
//                 velBufferOut
//             );

//             gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
//             gl.bindBuffer(gl.ARRAY_BUFFER, null);

//             isBusy = false;
//         }
//       }
//       setTimeout(checkSync);

//       return true;
// }