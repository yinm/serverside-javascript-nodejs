const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'write.txt');

const writeStream = fs.createWriteStream(filePath);
writeStream.write('Hello World!');
writeStream.end();

writeStream.on('error', (err) => {
  console.log('An error occured');
  console.log(err);
});

writeStream.on('close', () => {
  console.log('writable stream closed');
});