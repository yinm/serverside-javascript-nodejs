const net = require('net');
const server = net.createServer();

server.listen(11111, '127.0.0.1', () => {
});

server.on('connection', (socket) => {
  socket.on('data', (chunk) => {

  });
});