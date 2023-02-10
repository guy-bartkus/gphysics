import { Vec2 } from './math';

export class Mat3 extends Array<number> {
    constructor(mat: number[] = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]) {
        super(...mat);
    }

    multiply(m: Mat3): Mat3 {
        const mA = this;
        const mB = m;

        const mA00 = mA[0],
            mA01 = mA[1],
            mA02 = mA[2];
        const mA10 = mA[3],
            mA11 = mA[4],
            mA12 = mA[5];
        const mA20 = mA[6],
            mA21 = mA[7],
            mA22 = mA[8];
        // ------------
        const mB00 = mB[0],
            mB01 = mB[1],
            mB02 = mB[2];
        const mB10 = mB[3],
            mB11 = mB[4],
            mB12 = mB[5];
        const mB20 = mB[6],
            mB21 = mB[7],
            mB22 = mB[8];

        const out: number[] = [];

        out[0] = mB00 * mA00 + mB01 * mA10 + mB02 * mA20;
        out[1] = mB00 * mA01 + mB01 * mA11 + mB02 * mA21;
        out[2] = mB00 * mA02 + mB01 * mA12 + mB02 * mA22;

        out[3] = mB10 * mA00 + mB11 * mA10 + mB12 * mA20;
        out[4] = mB10 * mA01 + mB11 * mA11 + mB12 * mA21;
        out[5] = mB10 * mA02 + mB11 * mA12 + mB12 * mA22;

        out[6] = mB20 * mA00 + mB21 * mA10 + mB22 * mA20;
        out[7] = mB20 * mA01 + mB21 * mA11 + mB22 * mA21;
        out[8] = mB20 * mA02 + mB21 * mA12 + mB22 * mA22;

        return new Mat3(out);
    }

    translate(x: number, y: number): Mat3 {
        const m = this;

        let m00 = m[0],
            m01 = m[1],
            m02 = m[2],
            m10 = m[3],
            m11 = m[4],
            m12 = m[5],
            m20 = m[6],
            m21 = m[7],
            m22 = m[8]

        const out: number[] = [];

        out[0] = m00;
        out[1] = m01;
        out[2] = m02;

        out[3] = m10;
        out[4] = m11;
        out[5] = m12;

        out[6] = x * m00 + y * m10 + m20;
        out[7] = x * m01 + y * m11 + m21;
        out[8] = x * m02 + y * m12 + m22;

        return new Mat3(out);
    }

    rotate(rad: number): Mat3 {
        const m = this;

        let m00 = m[0],
            m01 = m[1],
            m02 = m[2],
            m10 = m[3],
            m11 = m[4],
            m12 = m[5],
            m20 = m[6],
            m21 = m[7],
            m22 = m[8],
            s = Math.sin(rad),
            c = Math.cos(rad);

        const out: number[] = [];

        out[0] = c * m00 + s * m10;
        out[1] = c * m01 + s * m11;
        out[2] = c * m02 + s * m12;

        out[3] = c * m10 - s * m00;
        out[4] = c * m11 - s * m01;
        out[5] = c * m12 - s * m02;

        out[6] = m20;
        out[7] = m21;
        out[8] = m22;

        return new Mat3(out);
    }

    scale(x: number, y: number): Mat3 {
        const m = this;

        const out: number[] = [];

        out[0] = x * m[0];
        out[1] = x * m[1];
        out[2] = x * m[2];

        out[3] = y * m[3];
        out[4] = y * m[4];
        out[5] = y * m[5];

        out[6] = m[6];
        out[7] = m[7];
        out[8] = m[8];

        return new Mat3(out);
    }

    print(): void {
        const m = this;

        let m00 = m[0],
            m01 = m[1],
            m02 = m[2],
            m10 = m[3],
            m11 = m[4],
            m12 = m[5],
            m20 = m[6],
            m21 = m[7],
            m22 = m[8];

        console.table({
            0: [m00, m01, m02],
            1: [m10, m11, m12],
            2: [m20, m21, m22]
        });
    }

    transpose(): Mat3 {
        const out: number[] = [];

        out[0] = this[0];
        out[1] = this[3];
        out[2] = this[6];
        out[3] = this[1];
        out[4] = this[4];
        out[5] = this[7];
        out[6] = this[2];
        out[7] = this[5];
        out[8] = this[8];

        return new Mat3(out);
    }
}