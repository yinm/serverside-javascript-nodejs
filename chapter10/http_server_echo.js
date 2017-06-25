const http = require('http');
const server = http.createServer();
const port = 1337;

server.on('request', (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Body Echo: ' + data + '\n');
  });
});

server.on('connection', (socket) => {
  console.log('=== Raw Socket Data Start ===');
  socket.on('data', (chunk) => {
    console.log(chunk.toString());
  });
  socket.on('end', () => {
    console.log('=== Raw Socket Data End ===');
  });
});

server.on('clientError', (e) => {
  console.log('Client Error: ', e.message);
});
server.on('error', (e) => {
  console.log('Server Error: ' , e.message);
});

server.listen(port, () => {
  console.log('listening on ' + port);
});