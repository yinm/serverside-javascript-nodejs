const net = require('net');
const socket = net.connect(1338, 'localhost', () => {
  console.log('TCP Client connected');
  socket.end();
});
