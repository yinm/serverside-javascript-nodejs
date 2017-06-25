const net = require('net');
const readline = require('readline');

const server = net.createServer();
server.maxConnections = 3;

function Client(socket) {
  this.socket = socket;
}

Client.prototype.writeData = function(d) {
  const socket = this.socket;
  if (socket.writable) {
    let key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d);
  }
};
let clients = {};

// 接続開始ログ
server.on('connection', (socket) => {
  server.getConnections((err, count) => {
    let status = count + '/' + server.maxConnections;
    let key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('Connection Start(' + status + ') - ' + key);
    clients[key] = new Client(socket);
  });
});

// socket に対して data イベントリスナを登録する
server.on('connection', (socket) => {
  let data = '';
  let newline = /\r\n|\n/;
  socket.on('data', (chunk) => {
    // 改行コードが送られてくるまで溜めておく (Windowsのtelnetクライアント対応)
    data += chunk.toString();
    let key = socket.remoteAddress + ':' + socket.remotePort;
    if (newline.test(data)) {
      clients[key].writeData(data);
      data = '';
    }
  });
});

// クライアント接続終了時のイベントリスナを登録する
server.on('connection', (socket) => {
  let key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end', () => {
    server.getConnections((err, count) => {
      let status = count + '/' + server.maxConnections;
      console.log('Connection End(' + status + ') - ' + key);
      delete clients[key];
    });
  });
});

// server.close() 後、すべての接続が終了した時にイベントが発生する
server.on('close', () => {
  console.log('Server Closed');
});

// サーバーの開始と終了処理
server.listen(11111, '127.0.0.1', () => {
  let addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

// <C-c> でサーバソケットをクローズ
const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', () => {
  for (let i in clients) {
    let socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
});
