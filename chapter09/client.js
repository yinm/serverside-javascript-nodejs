const net = require('net');

const socket = new net.Socket();
socket.connect(1338, 'localhost');
socket.on('connect', () => {
  console.log('TCP Client connected');
  socket.end();
});