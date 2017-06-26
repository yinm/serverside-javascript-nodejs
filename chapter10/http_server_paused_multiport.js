const http = require('http');
let servers = {};
const server_num = 3;
const host = 'localhost';
let port_start = 10001; // 1台目のポート番号

function createServer(servers, port) {
  const name = host + ':' + port;
  servers[name] = http.createServer((req, res) => {
    const max_res_delay = 10;
    const delay = Math.floor(max_res_delay * Math.random());

    setTimeout(() => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Delayed ' + delay + '[sec]');
    }, delay * 1000);
  });

  servers[name].listen(port, () => {
    console.log('listening on', name);
  });
}

for (let i = 0; i < server_num; i++) {
  // サーバーを立ち上げるたびに、ポート番号をインクリメントする
  createServer(servers, port_start++);
}