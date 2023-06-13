import ForceBit from "./ForceBit";
import { PolygonGL } from "./glhelpers";
import { Vec2 } from "./math";

export default class Physical {
    pos: Vec2;
    vel: Vec2;

    constructor(radius: number, x: number, y: number, velocity: Vec2 = new Vec2()) {
        this.pos = new Vec2(x, y);
        this.vel = velocity;
    }
}