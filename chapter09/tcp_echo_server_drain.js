const net = require('net');
const readline = require('readline');

const server = net.createServer();
server.maxConnections = 3;

function Client(socket) {
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {};
  this.tmout = null;
}

Client.prototype.writeData = function(d, id) {
  let socket = this.socket;
  let t_queue = this.t_queue;

  if (socket.writable) {
    let key = socket.remoteAddress + ':' + socket.remotePort;
    socket.write('[R] ' + d, () => {
      delete t_queue[id];
    });
    process.stdout.write(key + ' ' + socket.bytesWritten + ' bytes Written\n');
  }
};

let clients = {};

server.on('connection', (socket) => {
  server.getConnections((err, count) => {
    let status = count + '/' + server.maxConnections;
    let key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('Connection Start(' + status + ') - ' + key);
    clients[key] = new Client(socket);
    // 10msec秒後からソケットを停止・再開ランダムに繰り返す
    controlSocket(clients[key], 'pause', 10);
  });
});

// pause時間: 最大3秒間, resume時間: 最大10秒間
function controlSocket(client, action, delay) {
  let socket = client.socket;
  let key = socket.remoteAddress + ':' + socket.remotePort;

  if (action === 'pause') {
    socket.pause();
    console.log(key + ' socket paused');
    client.tmout = setTimeout(() => {
      controlSocket(client, 'resume', Math.random() * 3 * 1000);
    }, delay);
  } else if (action === 'resume') {
    socket.resume();
    console.log(key + ' socket resumed');
    client.tmout = setTimeout(() => {
      controlSocket(client, 'pause', Math.random() * 10 * 1000);
    }, delay);
  }
}

server.on('connection', (socket) => {
  let data = '';
  const newline = /\r\n|\n/;
  socket.on('data', (chunk) => {
    data += chunk.toString();
    let key = socket.remoteAddress + ':' + socket.remotePort;
    if (newline.test(data)) {
      clients[key].writeData(data);
      process.stdout.write(key + ' ' + socket.bytesRead + ' bytes Read\n');
      data = '';
    }
  });
});

server.on('connection', (socket) => {
  let key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end', () => {
    server.getConnections((err, count) => {
      let status = count + '/' + server.maxConnections;
      console.log('Connection End(' + status + ') - ' + key);

      if (clients[key].tmout) {
        clearTimeout(clients[key].tmout);
      }
      delete clients[key];
    });
  });
});

server.on('close', () => {
  console.log('Server Closed');
});

server.listen(11111, () => {
  let addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', () => {
  for (let i in clients) {
    if (clients[i].tmout) {
      clearTimeout(clients[i].tmout);
    }
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