const data: number[] = [];
const results: number[] = [];

const chance = 0.1/100;
let total = 0;

for(let i = 0; i < 16000; i++) {
    const res = +(Math.random() < chance);
    data.push(res);

    total += res;
}

console.log(`${((total/16000)*100).toFixed(2)}%`);

const arr = new Uint8Array(data);

console.time();

for(let i = 0; i < arr.byteLength; i++) {
    if(arr[i]) {
        results.push(i * 3.619845);
        results.push(i * 9.385767);
        results.push(i * 3775.456);
        results.push(i * 39496.35);
    }
}

console.timeEnd();