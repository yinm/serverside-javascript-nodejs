const path = require('path');
const fs = require('fs');

const outputFilePath = path.join(__dirname, 'write.txt');
const writeStream = fs.createWriteStream(outputFilePath);

const inputFilePath = path.join(__dirname, 'test.txt');
const readStream = fs.createReadStream(inputFilePath);

writeStream.on('error', (err) => {
  console.log('An error occured');
  console.log(err);
});
writeStream.on('close', () => {
  console.log('writable stream closed');
});
writeStream.on('drain', () => {
  console.log('resumed writing');
  readStream.resume();
});

readStream.on('data', (data) => {
  console.log('>> a data event occured');
  if (writeStream.write(data) === false) {
    console.log('paused writing');
    readStream.pause();
  }
});
readStream.on('end', () => {
  console.log('read end');
});
readStream.on('error', (err) => {
  console.log('An error occured');
  console.log(err);
});