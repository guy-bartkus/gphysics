import { Vec2 } from './math';
import { UserInput } from "./UserInput";

export class SimManager {
    canvas: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    gl?: WebGL2RenderingContext;
    physicsInterval: number = 10; // ms
    resizeListeners: (() => void)[] = [];
    userInput: UserInput;
    private static _instance: SimManager;

    private constructor(canvas: HTMLCanvasElement, webgl: boolean) {
        this.canvas = canvas;
        
        if (webgl) {
            this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
        } else {
            this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        }

        // prevent right clicking on canvas
        canvas.addEventListener("contextmenu", e => { e.preventDefault(); });
        window.addEventListener("resize", () => {
            this.resize();
            this.resizeListeners.forEach(fn => fn());
        });

        this.userInput = new UserInput(canvas);

        this.resize();
    }

    resize() {
        const { innerWidth, innerHeight } = window;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
    }

    static init(canvas: HTMLCanvasElement, webgl: boolean): SimManager {
        if(!SimManager._instance) {
            SimManager._instance = new SimManager(canvas, webgl);
        }

        return SimManager._instance;
    }

    static instance(): SimManager {
        return SimManager._instance;
    }
}