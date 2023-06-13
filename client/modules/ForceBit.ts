import { Vec2 } from "./math";
import Physical from './Physical';

export default class ForceBit extends Physical {
    polarity: PolarityType;
    color: Color = [0, 0, 0];
    visible: boolean = true;
    fillStyle: string = "";
    static radius = 6;

    constructor(x: number, y: number, direction: Vec2, polarity: PolarityType) {
        super(ForceBit.radius, x, y, direction.normalize().mul(1));
        this.polarity = polarity;
        
        if(polarity === 'ERB') {
            this.color = [0.2157, 0.3921, 1];
        } else {
            this.color = [1, 0.2588, 0.2588]
        }

        this.fillStyle = `rgb(${this.color[0]*255}, ${this.color[1]*255}, ${this.color[2]*255})`;
    }

    switchPolarity() {
        if(this.polarity === 'ERB') {
            this.polarity = 'PRB';
            this.color = [1, 0.2588, 0.2588]
        } else {
            this.polarity = 'ERB';
            this.color = [0.2157, 0.3921, 1];
        }

        this.fillStyle = `rgb(${this.color[0]*255}, ${this.color[1]*255}, ${this.color[2]*255})`;
    }
}