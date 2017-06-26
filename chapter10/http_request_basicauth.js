const http = require('http');
const options = {
  host: 'localhost',
  port: 1337,
  auth: 'alice:alicepass'
};
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('===== Response Data =====');
    console.log(data);
  });
});
req.end();
req.on('socket', (socket) => {
  console.log('===== Socket Data =====');
  socket.on('data', (chunk) => {
    console.log(chunk.toString());
  });
});
