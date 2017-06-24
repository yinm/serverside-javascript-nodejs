const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'test.txt');

const readStream = fs.createReadStream(filePath);
readStream.setEncoding('utf8');
readStream.on('data', (data) => {
  console.log(data);
});
readStream.on('end', () => {
  console.log('end');
});
readStream.on('error', (err) => {
  console.log('An error occurred');
  console.log(err);
});