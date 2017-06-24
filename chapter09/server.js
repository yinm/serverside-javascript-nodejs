const net = require('net');

const server = net.createServer((socket) => {
  socket.end();
  socket.on('close', () => {
    console.log('socket closed');
  });
});
server.listen(11111);