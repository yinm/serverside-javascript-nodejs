const net = require('net');
const readline = require('readline');

let options = {};
options.host = process.argv[2];
options.port = process.argv[3];

const client = net.connect(options);

// 接続失敗時のイベント
client.on('error', (e) => {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

// クライアントソケット接続確立時のイベント
client.on('connect', () => {
  console.log('Connected - ' + options.host + ':' + options.port);
});

// <C-c> でクライアントソケットをクローズできるようにする
const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', () => {
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

// 1秒ごとにtimeoutして、 'Hello World' をサーバに送信
let i = 0;
client.setTimeout(1000);
client.on('timeout', function() {
  let str = i + ': Hello World\n';
  process.stdout.write('[S] ' + str);
  client.write(str);
  i = i + 1;
});

// Echoバックされてきたデータを標準出力に表示
client.on('data', (chunk) => {
  process.stdout.write(chunk.toString());
});

// クライアントソケット終了時のイベント
client.on('end', (had_error) => {
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', () => {
  console.log('Client Closed');
  rl.close();
});