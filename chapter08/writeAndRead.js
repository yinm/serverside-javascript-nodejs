const fs = require('fs');

fs.writeFile('target.txt', 'some data', 'utf-8', (err) => {
  if (err) throw err;
  fs.readFile('target.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
});