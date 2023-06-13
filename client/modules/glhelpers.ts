import { degreesToRadians, radiansToDegrees } from "./helpers";
import { Mat3 } from "./Mat3";
import { Vec2 } from './math';

export const createShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | string => {
    const shader = gl.createShader(type);

    if (!shader) return "Failed to create shader!";

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        return "Failed to compile shader!";
    }

    return shader;
}

export const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader, feedbackVaryings?: string[]): WebGLProgram | string => {
    const program = gl.createProgram();

    if (!program) return "Failed to create program!";

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    if(feedbackVaryings) {
        gl.transformFeedbackVaryings(
            program,
            feedbackVaryings,
            gl.SEPARATE_ATTRIBS,
        );
    }

    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
        const programInfo = gl.getProgramInfoLog(program) as string;

        gl.deleteProgram(program);

        return programInfo;
    }

    return program;
}

export const setBuffer = (gl: WebGL2RenderingContext, bufGL: WebGLBuffer | null, sizeOrData: any, usage: number): void => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufGL);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export const bufferDataAndSetAttribute = (gl: WebGL2RenderingContext, bufGL: WebGLBuffer | null, loc: number, data: any, type: number, size: number, usage: number, isInt: boolean = false) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufGL);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.enableVertexAttribArray(loc);

    if(isInt) {
        gl.vertexAttribIPointer(
            loc,
            size,         // size (num components)
            type,  // type of data in buffer
            0,         // stride (0 = auto)
            0,         // offset
        );
    } else {
        gl.vertexAttribPointer(
            loc,
            size,         // size (num components)
            type,  // type of data in buffer
            false,     // normalize
            0,         // stride (0 = auto)
            0,         // offset
        );
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export const setAttributes = (gl: WebGL2RenderingContext, bufGL: WebGLBuffer | null, loc: number, type: number, size: number) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufGL);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(
        loc,
        size,         // size (num components)
        type,  // type of data in buffer
        false,     // normalize
        0,         // stride (0 = auto)
        0,         // offset
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export class PolygonGL {
    radius: number;
    nVerts: number;
    verts: number[] = [];

    constructor(radius: number, nVerts: number) {
        this.radius = radius;
        this.nVerts = nVerts;

        const rotPerVert = (Math.PI * 2) / nVerts; // in radians

        let curRot = degreesToRadians(0);

        this.verts.push(0, 0, Math.cos(curRot) * radius, Math.sin(curRot) * radius, Math.cos(curRot+rotPerVert) * radius, Math.sin(curRot+rotPerVert) * radius);
        // this.verts.push(0, 0, Math.cos(curRot) * radius, Math.sin(curRot) * radius);
        curRot += rotPerVert;

        for (let i = 1; i < nVerts + 1; i++) {
            // this.verts.push(Math.cos(curRot) * radius, Math.sin(curRot) * radius);
            this.verts.push(0, 0, this.verts.at(-2)!, this.verts.at(-1)!, Math.cos(curRot) * radius, Math.sin(curRot) * radius);
            curRot += rotPerVert;
        }
    }
}