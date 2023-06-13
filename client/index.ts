import { SimManager } from "./modules/SimManager";
import { Vec2 } from './modules/math';
import { PolygonGL } from './modules/glhelpers';
// import * as circle from './programs/circle';
// import * as gpgpuShader from './programs/gpgpu';
import * as forcebitsShader from './programs/forcebits';
import { Mat3 } from "./modules/Mat3";
import ForceBit from "./modules/ForceBit";
// import Electron from "./modules/Electron";

const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
const cpuTime = document.getElementById('cput') as HTMLParagraphElement;
const gpuTime = document.getElementById('gput') as HTMLParagraphElement;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sm = SimManager.init(canvas, true);
const gl = sm.gl!;

console.log("gl: ", sm.gl);
console.log("sm.canvas: ", sm.canvas);
console.log("canvas: ", canvas)

let cpuRuns = 0;
let cpuTotalTime = 0;

let gpuRuns = 0;
let gpuTotalTime = 0;

let forceBits: ForceBit[] = [];

let fbPos: Float32Array;
let fbDir: Float32Array;
let fbProp: Float32Array;

function draw() {
    requestAnimationFrame(draw);

    const startTime = performance.now();

    if(forceBits.length > 0) {
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const totalTimeCpu = performance.now()-startTime;

        cpuRuns++;
        cpuTotalTime += totalTimeCpu;

        if(cpuRuns >= 10) {
            cpuTime.innerText = `CPU Time: ${(cpuTotalTime/10).toFixed(2)}ms`;
            cpuRuns = 0;
            cpuTotalTime = 0;
        }

        forcebitsShader.draw(+slider.value, 0);
    }

    const totalTime = performance.now()-startTime;

    gpuRuns++;
    gpuTotalTime += totalTime;

    if(gpuRuns >= 10) {
        gpuTime.innerText = `GPU Time: ${(gpuTotalTime/10).toFixed(2)}ms`;
        gpuRuns = 0;
        gpuTotalTime = 0;
    }
}

draw();

function spawnBits(count: number) {
    forceBits = [];

    const fbPosArr: number[] = [];
    const fbDirArr: number[] = [];
    const fbPropArr: number[] = [];

    for(let i = 0; i < count; i++) {
        const randPos: Vec2 = Vec2.random(ForceBit.radius*2, canvas.width-ForceBit.radius*2, ForceBit.radius*2, canvas.height-ForceBit.radius*2);
        const type: PolarityType = (Math.random() > 0.5 ? 'ERB' : 'PRB');
        const forceBit: ForceBit = new ForceBit(randPos.x, randPos.y, Vec2.fromAngle(Math.random()*(Math.PI*2)), type);
    
        forceBits.push(forceBit);

        fbPosArr.push(forceBit.pos.x, forceBit.pos.y);
        fbDirArr.push(forceBit.vel.toAngle());
        let props = 0b00000100;
        props |= (type === 'ERB' ? 0 : 1) << 3;
        fbPropArr.push(props);
    }

    fbPos = new Float32Array(fbPosArr);
    fbDir = new Float32Array(fbDirArr);
    fbProp = new Float32Array(fbPropArr);

    forcebitsShader.start(gl, fbPos, fbDir, fbProp);
    // forcebitsShader.setElectronTex(new Float32Array(0));
}

(document.getElementById('4k') as HTMLButtonElement).onclick = () => spawnBits(4000);
(document.getElementById('8k') as HTMLButtonElement).onclick = () => spawnBits(8000);
(document.getElementById('16k') as HTMLButtonElement).onclick = () => spawnBits(16000);
(document.getElementById('32k') as HTMLButtonElement).onclick = () => spawnBits(32000);
(document.getElementById('64k') as HTMLButtonElement).onclick = () => spawnBits(64000);
(document.getElementById('128k') as HTMLButtonElement).onclick = () => spawnBits(128000);
(document.getElementById('256k') as HTMLButtonElement).onclick = () => spawnBits(256000);

window['sbits'] = (count: string) => {
    spawnBits(+count);
}





// import { SimManager } from "./modules/SimManager";
// import { Vec2 } from './modules/math';
// import ForceBit from "./modules/ForceBit";
// import Electron from "./modules/Electron";
// import { radiansToDegrees } from "./modules/helpers";

// const canvas = document.querySelector('canvas') as HTMLCanvasElement;
// const cpuTime = document.getElementById('cput') as HTMLParagraphElement;
// const noMove = document.getElementById('nomove') as HTMLInputElement;
// const sm = SimManager.init(canvas, false);
// const ui = sm.userInput;
// const ctx = sm.ctx!;
// let mouseDownPos = new Vec2();

// let rotateIndicatorTime = 0;
// let indicateRotation = 0;

// let runs = 0;
// let runTimeTotal = 0;
// let lastPhysUpdate = 0;

// let forceBits: ForceBit[] = [];
// let electron = new Electron(ctx, canvas.width/2, canvas.height/2);

// sm.resizeListeners.push(() => {
//     electron.pos = new Vec2(canvas.width/2,  canvas.height/2);
// });

// ui.downListeners.push(e => {
//     mouseDownPos = new Vec2(e.offsetX, e.offsetY);
// });

// ui.upListeners.push(e => {
//     if(!ui.lmbDown) return;

//     const direction = ui.mousePos.sub(mouseDownPos).normalize();

//     const forceBit = new ForceBit(ctx, mouseDownPos.x, mouseDownPos.y, direction, 'ERB');
//     forceBits.push(forceBit);
// });

// function draw() {
//     requestAnimationFrame(draw);

//     const startTime = performance.now();

//     if(performance.now()-lastPhysUpdate >= 30) {
//         lastPhysUpdate = performance.now();
//         physicsUpdate();

//         const mp = sm.userInput.mousePos;

//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         if(indicateRotation !== 0) {
//             ctx.fillStyle = "#39e630";
//             ctx.strokeStyle = "#39e630";
    
//             ctx.beginPath();
//             ctx.arc(electron.pos.x+(Electron.radius*-indicateRotation), electron.pos.y-(Electron.radius+20), ForceBit.radius, 0, Math.PI*2);
//             ctx.closePath();
//             ctx.fill();

//             ctx.beginPath();
//             ctx.moveTo(electron.pos.x+Electron.radius, electron.pos.y-(Electron.radius+20));
//             ctx.lineTo(electron.pos.x-Electron.radius, electron.pos.y-(Electron.radius+20));
//             ctx.closePath();
//             ctx.stroke();

//             if(performance.now()-rotateIndicatorTime > 2000) {
//                 indicateRotation = 0;
//             }
//         }
    
//         for(const forceBit of forceBits) {
//             if(forceBit.visible) {
//                 forceBit.draw();
//             }
//         }
    
//         electron.draw();

//         if(electron.mass > 10) {
//             const lineStart = electron.velNorm.mul(Electron.radius);
//             const lineEnd = electron.velNorm.mul(Electron.radius*2)
//             ctx.beginPath();
//             ctx.moveTo(electron.pos.x+lineStart.x, electron.pos.y+lineStart.y);
//             ctx.lineTo(electron.pos.x+lineEnd.x, electron.pos.y+lineEnd.y);
//             ctx.closePath();
//             ctx.stroke();
//         }
    
//         let ballPos = mp;
    
//         if(ui.lmbDown) {
//             ballPos = mouseDownPos;
    
//             ctx.lineWidth = 2;
//             ctx.strokeStyle = "#2f54f7";
    
//             ctx.beginPath();
//             ctx.moveTo(mouseDownPos.x, mouseDownPos.y);
//             ctx.lineTo(mp.x, mp.y);
//             ctx.closePath();
//             ctx.stroke();
//         }
    
//         ctx.fillStyle = "#2f54f7";
    
//         ctx.beginPath();
//         ctx.arc(ballPos.x, ballPos.y, ForceBit.radius, 0, Math.PI*2);
//         ctx.closePath();
//         ctx.fill();
//     }

//     const totalTime = performance.now()-startTime;

//     runs++;
//     runTimeTotal += totalTime;

//     if(runs >= 30) {
//         const runTimeAvg = runTimeTotal/runs;

//         runs = 0;
//         runTimeTotal = 0;

//         cpuTime.innerText = `CPU Time: ${runTimeAvg.toFixed(2)}ms`;
//     }
// }

// draw();

// function physicsUpdate() {
//     if(!noMove.checked) electron.pos = electron.pos.add(electron.vel.mul(5));
    
//     for(let i = 0; i < forceBits.length; i++) {
//         const forceBit = forceBits[i];

//         if(!forceBit.visible) continue;

//         let newPos: Vec2 = forceBit.pos.add(forceBit.vel.mul(5));

//         const xWallsCollide = newPos.x > canvas.width || newPos.x < 0;
//         const yWallsCollide = newPos.y > canvas.height || newPos.y < 0;

//         if(xWallsCollide || yWallsCollide) {
//             forceBits.splice(i, 1);
//             continue;
//         } else {
//             forceBit.pos = newPos;
//         }

//         if(forceBit.pos.distance(electron.pos) <= ForceBit.radius + Electron.radius) {
//             const dirOpp = forceBit.vel.mul(-1);

//             let zoneMatch: [number, number] = [-1, 0]; // zoneID, angle

//             for(let i2 = 0; i2 < electron.zoneCount; i2++) {
//                 const zoneDir = electron.zones[i2][0];

//                 if(zoneDir.dot(dirOpp) >= 0) {
//                     const angle = zoneDir.angleBetween(dirOpp);
//                     // console.log(`Possible zone: ${i2}, ang: ${radiansToDegrees(angle)}`)

//                     if(zoneMatch[0] === -1 || Math.abs(angle) < Math.abs(zoneMatch[1])) {
//                         zoneMatch = [i2, angle];
//                     }
//                 }
//             }

//             const zone = electron.zones[zoneMatch[0]];
//             const oppZone = electron.zones[(zoneMatch[0]+electron.zoneCount/2) % electron.zoneCount];

//             electron.rot += zoneMatch[1]/(electron.mass-9); // Rotate electron by hit angle offset from matched zone
//             // console.log(radiansToDegrees(electron.rot));
//             indicateRotation = zoneMatch[1]/Math.abs(zoneMatch[1]); // Divide by self to get either -1 if rotated ccw and 1 if cw
//             rotateIndicatorTime = performance.now();

//             if(oppZone[1].length > 0) {
//                 // Relfect
//                 forceBit.vel = zone[0];
//                 forceBit.pos = electron.pos.add(zone[0].mul(Electron.radius+ForceBit.radius+5));

//                 const oppForceBit = oppZone[1].splice(-1, 1)[0];
//                 electron.mass -= 1;
//                 oppForceBit.visible = true;
//                 oppForceBit.pos = electron.pos.add(oppZone[0].mul(Electron.radius+ForceBit.radius+5));
//                 oppForceBit.vel = oppZone[0];
//             } else {
//                 // Stick
//                 forceBit.visible = false;
//                 zone[1].push(forceBit);
//                 electron.mass += 1;
//                 console.log(electron.vel.mag);
//             }

//             electron.calcVel();

//             // console.log(`Hit zone #${zoneMatch[0]}, angle: ${Math.round(radiansToDegrees(zoneMatch[1]))}`);
//         }
//     }
// }

// function setup(zoneCount: number) {
//     forceBits = [];
//     electron = new Electron(ctx, canvas.width/2, canvas.height/2, zoneCount);
// }

// (document.getElementById('4z') as HTMLButtonElement).onclick = () => setup(4);
// (document.getElementById('6z') as HTMLButtonElement).onclick = () => setup(6);
// (document.getElementById('8z') as HTMLButtonElement).onclick = () => setup(8);
// (document.getElementById('10z') as HTMLButtonElement).onclick = () => setup(10);

// noMove.onchange = () => {
//     if(noMove.checked) electron.pos = new Vec2(canvas.width/2, canvas.height/2);
// }