import { Vec2 } from './math';

export class UserInput {
    mousePos: Vec2 = new Vec2();
    lmbDown: boolean = false;
    rmbDown: boolean = false;
    downListeners: ((e: MouseEvent) => void)[] = [];
    upListeners: ((e: MouseEvent) => void)[] = [];
    scrollListeners: Function[] = [];

    constructor(canvas: HTMLCanvasElement) {
        canvas.addEventListener('wheel', e => {
            for(const fn of this.scrollListeners) {
                const value = e.deltaY / Math.abs(e.deltaY)
                fn(value);
            }
        });

        canvas.addEventListener('mousemove', e => {
            this.mousePos = new Vec2(e.offsetX, e.offsetY);
        });

        canvas.addEventListener('mousedown', e => {
            switch(e.button) {
                case 0:
                    this.lmbDown = true;
                    break;
                case 2:
                    this.rmbDown = true;
                    break;
            }

            for(const fn of this.downListeners) {
                fn(e);
            }
        });

        canvas.addEventListener('mouseup', e => {
            for(const fn of this.upListeners) {
                fn(e);
            }
            
            switch(e.button) {
                case 0:
                    this.lmbDown = false;
                    break;
                case 2:
                    this.rmbDown = false;
                    break;
            }
        });

        canvas.addEventListener('mouseout', e => {
            this.lmbDown = false;
            this.rmbDown = false;
        });
    }
}