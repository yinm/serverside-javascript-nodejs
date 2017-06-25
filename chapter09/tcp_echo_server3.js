const net = require('net');
const readline = require('readline');

const server = net.createServer();
server.maxConnections = 3;

function Data(d) {
  this.data = d;
  this.responded = false;
}

function Client(socket) {
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {};
  this.w_queue = [];
}

Client.prototype.writeData = function(d, id) {
  let socket = this.socket;
  let w_queue = this.w_queue;
  let t_queue = this.t_queue;

  // 送信データが一番最初の未送信データである場合に継続する
  if (w_queue[0] && w_queue[0].responded) {
    let w_data = w_queue.shift().data;
    if (socket.writable) {
      let key = socket.remoteAddress + ':' + socket.remotePort;
      process.stdout.write('[' + key + '] - ' + w_data);
      socket.write('[R] ' + w_data, () => {
        delete t_queue[id];
      });
    }
  }
};

let clients = {};

// 接続開始のログ
server.on('connection', (socket) => {
  server.getConnections((err, count) => {
    let status = count + ':' + server.maxConnections;
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
    function writeDataDelayed(key, d) {
      let client = clients[key];
      let d_obj = new Data(d);
      client.w_queue.push(d_obj);
      let tmout = setTimeout(() => {
        d_obj.responded = true;
        client.writeData(d_obj.data, client.counter);
      }, Math.random() * 10 * 1000);
      client.t_queue[client.counter++] = tmout;
    }

    data += chunk.toString();
    let key = socket.remoteAddress + ':' + socket.remotePort;
    if (newline.test(data)) {
      writeDataDelayed(key, data);
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

// サーバの開始と終了処理
server.listen(11111, '127.0.0.1', () => {
  let addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

// <C-c> でサーバソケットをクローズ
const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', () => {
  for (let i in clients) {
    let socket = clients[i].socket;
    let t_queue = clients[i].t_queue;
    socket.end();

    for (let id in t_queue) {
      clearTimeout(t_queue[id]);
    }
  }

  server.close();
  rl.close();
});

