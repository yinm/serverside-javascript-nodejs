const net = require('net');

const server = net.createServer((socket) => {
  console.log('new connection:', server.connections);
  socket.on('end', () => {
    console.log('end connection:', server.connections);
  });
});
server.listen(11111);
