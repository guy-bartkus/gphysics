import { NodeImportAssertions } from "ts-node/dist/esm";
import ForceBit from "./ForceBit";
import { radiansToDegrees } from "./helpers";
import { Vec2 } from "./math";
import Physical from './Physical';

export default class Electron extends Physical {
    mass: number = 10;
    zones: [Vec2, ForceBit[]][] = [];
    // zoneLines: [Vec2, Vec2][] = [];
    zoneCount: number;
    velNorm: Vec2 = new Vec2();
    _rot: number = 0;

    static radius: number = 60;

    constructor(x: number, y: number, zoneCount: number = 4) {
        super(Electron.radius, x, y);
        this.zoneCount = zoneCount;
        this.calcZones(true);
        // this.calcZoneLines(); // If allowed to initialze ForceBit with rotation, remember to set rotation AFTER calling this method
    }

    get rot(): number {
        return this._rot;
    }

    set rot(rot: number) {
        this._rot = rot % (Math.PI*2);
        this.calcZones();
    }

    calcZones(initial: boolean = false) {
        for(let i = 0; i < this.zoneCount; i++) {
            const curRot = (this._rot+(i*Math.PI*2)/this.zoneCount) % (Math.PI*2);

            if(!initial) {
                this.zones[i][0] = Vec2.fromAngle(curRot);
            } else {
                this.zones[i] = [Vec2.fromAngle(curRot), []];
            }
        }
    }

    calcVel() {
        let newVel = new Vec2();

        for(const zone of this.zones) {
            for(const fb of zone[1]) {
                const dirOpp = zone[0].mul(-1);
                newVel = newVel.add(dirOpp.mul(1/this.mass));
            }
        }

        const velNorm = newVel.normalize();
        this.velNorm = velNorm;

        if(newVel.mag > 1) {
            this.vel = velNorm;
        } else {
            this.vel = newVel;
        }
    }

    // calcZoneLines() {
    //     for(let i = 0; i < this.zoneCount/2; i++) {
    //         this.zoneLines[i] = [this.zones[i][0].mul(-Electron.radius), this.zones[i][0].mul(Electron.radius)];
    //     }
    // }
}