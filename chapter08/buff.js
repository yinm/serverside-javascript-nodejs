const size = 16;
const buf = new Buffer(size);
const arr = [1, 2, 3, 4, 5, 6];
const arrayBuf = new Buffer(arr);
const str = 'sample';
const stringBuf = new Buffer(str);

console.log(buf);
console.log(arrayBuf);
console.log(stringBuf);