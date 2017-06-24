const http = require('http');
const server = http.createServer(() => {});
server.listen(1337, () => {
  console.log('server listening');
  server.close();
});