// let lastTime = performance.now();
// let runs = 0;
// let total = 0;

// function draw(now) {
//     runs++;
//     total += now-lastTime;
//     lastTime = now;

//     if(runs === 100) {
//         console.log(`Refresh rate is ${Math.round(1000/(total/runs))}`);
//     } else {
//         requestAnimationFrame(draw);
//     }
// }

// requestAnimationFrame(draw);

let lastRun = 0;

console.time();

while (true) {
    const now = performance.now();

    if (now-lastRun >= 16.666) {
        lastRun = now;
        console.timeEnd();
        console.time();
    }
}