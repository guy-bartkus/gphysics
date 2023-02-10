import {randFloat} from './helpers'

export class Vec2 {
    private _x: number;
    private _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    add(v: Vec2): Vec2 {
        return new Vec2(this._x + v.x, this._y + v.y);
    }

    sub(v: Vec2): Vec2 {
        return new Vec2(this._x - v.x, this._y - v.y);
    }

    mul(scalar: number): Vec2 {
        return new Vec2(this._x * scalar, this._y * scalar);
    }

    div(v: Vec2): Vec2 {
        return new Vec2(this._x / v.x, this._y / v.y);
    }

    normalize(): Vec2 {
        const m = Math.sqrt(this._x ** 2 + this._y ** 2);

        return new Vec2(this._x / m, this._y / m);
    }

    dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vec2): number {
        return (this.x * v.y) - (this.y * v.x);
    }

    distance(v: Vec2): number {
        const lX = this._x - v.x;
        const lY = this._y - v.y;

        return Math.sqrt(lX ** 2 + lY ** 2);
    }

    direction(v: Vec2): Vec2 {
        return this.sub(v).normalize();
    }

    rotate(ang: number): Vec2 {
        return new Vec2(this._x * Math.cos(ang) - this._y * Math.sin(ang), this._x * Math.sin(ang) + this._y * Math.cos(ang));
    }

    angleBetween(v: Vec2): number {
        return Math.atan2(v.y*this._x - v.x*this._y, v.x*this._x + v.y*this._y);
    }

    toAngle(): number {
        return Math.atan2(this._y, this._x);
    }

    copy(): Vec2 {
        return new Vec2(this._x, this._y);
    }

    surfaceNorm(): Vec2 {
        return new Vec2(-this._y, this._x);
    }

    static random(xMin: number, xMax: number, yMin: number, yMax: number): Vec2 {
        return new Vec2(randFloat(xMin, xMax), randFloat(yMin, yMax));
    }

    static fromAngle(rads: number): Vec2 {
        return new Vec2(Math.cos(rads), Math.sin(rads));
    }

    get mag(): number {
        return Math.sqrt(this._x ** 2 + this._y ** 2);
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }
}

export class Color {
    constructor(
        public h: number = 0,
        public s: number = 0,
        public l: number = 0
    ) {}
}

// Expect 1, 0
// const d = new Vec2(0, 1);
// const rD = new Vec2(-d.x, -d.y);
// const n = new Vec2(-1, -1);
// const h = new Vec2(0, 0);

// const r = n.sub(rD).normalize();

// console.log(r);

// console.log(new Vec2(0, 0).mag);

// 1rad × 180/π = 57.296°

// const deg = 360 * (Math.PI/180);
// const v1 = new Vec2(1, 0);
// const v2 = new Vec2(-1, 0);
// const ang = v1.angleBetween(v2);
// console.log(ang * (180/Math.PI));
// console.log(Vec2.fromAngle(-1.58825));
// console.log((new Vec2(-1, 2).toAngle()) * (180/Math.PI));
// console.log(v1.rotate(deg));
// console.log(ang);