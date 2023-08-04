let curCount = 0;

console.time();

setInterval(() => {
    curCount += 1;

    if(curCount == 17) {
        curCount = 0;
        console.timeEnd();
        console.time();
    }
}, 1);

