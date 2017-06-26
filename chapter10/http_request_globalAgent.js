const http = require('http');
const server_num = 3;
const host = 'localhost';
let port_start = 10001;
let req_targets = [];
let loop_counter = 0;
const req_interval = 0.1;
const globalAgent = http.globalAgent;

function printStatus(name, sockets, requests, evname) {
  const request_num = requests[name] ? requests[name].length : 0;
  const sockets_num = sockets[name] ? sockets[name].length : 0;
  console.log(name, 'conns:', sockets_num, 'waits:', request_num, ':', evname);
  return request_num;
}

function clientRequest(req_targets) {
  const max_loop_counter = 100;
  const max_requests_queue = 10;
  const name = req_targets[loop_counter % req_targets.length];
  const requests = globalAgent.requests;
  const sockets = globalAgent.sockets;
  const target = name.split(':');
  const req = http.get({host: target[0], port: target[1]});
  req.on('response', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      printStatus(name, sockets, requests, 'res end: ' + data);
    });
  });

  if (printStatus(name, sockets, requests, 'http.get') >= max_requests_queue) {
    console.log('===== no more new http.get() to', name, '=====');
    req_targets.splice(req_targets.indexOf(name), 1);
  }

  if (req_targets.length && loop_counter++ < max_loop_counter) {
    return true;
  } else {
    return false;
  }
}

function runLoop(req_targets) {
  setTimeout(() => {
    if (clientRequest(req_targets)) {
      runLoop(req_targets);
    }
  }, req_interval * 1000);
}

for (let i = 0; i < server_num; i++) {
  let name = host + ':' + port_start;
  req_targets.push(name);
  port_start++;
}
console.log('===== http requests with globalAgent start =====');
runLoop(req_targets);