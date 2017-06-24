const path = require('path');
const fs   = require('fs');

const outputFilePath = path.join(__dirname, 'write.txt');
const writeStream = fs.createWriteStream(outputFilePath);

const inputFilePath = path.join(__dirname, 'test.txt');
const readStream = fs.createReadStream(inputFilePath, {bufferSize: 4});

writeStream.on('pipe', () => {
  console.log('a readableStream pipes writeStream');
});
writeStream.on('error', (err) => {
  console.log('An error occured');
  console.log(err);
});
writeStream.on('close', () => {
  console.log('writable stream closed');
});

readStream.pipe(writeStream);
readStream.on('data', (data) => {
  console.log('>> a data event occured');
});
readStream.on('end', () => {
  console.log('read end');
});
readStream.on('error', (err) => {
  console.log('an error occured');
  console.log(err);
});
