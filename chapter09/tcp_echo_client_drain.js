const net = require('net');
const readline = require('readline');

let options = {};
options.host = process.argv[2];
options.port = process.argv[3];

const client = net.connect(options);

client.on('error', (e) => {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

client.on('connect', () => {
  console.log('Connected - ' + options.host + ':' + options.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', () => {
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

client.setTimeout(1000);
client.on('timeout', () => {
  let str = '';
  for (let i = 0; i < 20000; i++) {
    str += 'Hello World,';
  }
  str += '\n';
  let ret = client.write(str);
  process.stdout.write('write:' + ret + ', ' +
                        client.bytesWritten + ' bytesWritten bufferSize:' +
                        client.bufferSize + 'byte\n'
  );
});

client.on('drain', () => {
  console.log('drain emitted');
});

client.on('end', (had_error) => {
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', () => {
  console.log('Client Closed');
  rl.close();
});