const http = require('http');
const port = 1337;
let obj = {};
const server = http.createServer((req, res) => {
  const remoteAddress = req.connection.remoteAddress;
  const header = {'Connection': 'close', 'Content-Length': 0};
  // データ保管のキーを url にして一意に保つ
  const key = req.url;
  // リクエストメソッドごとに処理を分ける
  switch (req.method) {
    case 'POST':
      if (obj[key]) {
        res.writeHead(403, header);
        res.end();
      } else {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => {
          try {
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('POST', key, obj[key], ' from ' + remoteAddress);
          } catch (e) {
            res.writeHead(400, e.message, header);
          }
          res.end();
        });
      }
      break;
    case 'GET':
      if (obj[key]) {
        let json = JSON.stringify(obj[key]);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(json),
          'Content-Type': 'application/json',
          'Connection': 'close'
        });
        res.write(json);
        console.log('GET', key, ' from ' + remoteAddress);
      } else {
        res.writeHead(404, header);
      }
      res.end();
      break;
    case 'PUT':
      if (obj[key]) {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => {
          try {
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('PUT', key, obj[key], ' from ' + remoteAddress);
          } catch (e) {
            res.writeHead(400, e.message, header);
          }
          res.end();
        });
      } else {
        res.writeHead(403, header);
        res.end();
      }
      break;
    case 'DELETE':
      if (obj[key]) {
        delete obj[key];
        res.writeHead(200, header);
        console.log('DELETE', key, ' from ' + remoteAddress);
      } else {
        res.writeHead(404, header);
      }
      res.end();
      break;
  }
});

server.on('error', (e) => {
  console.log('Server Error', e.message);
});
server.on('clientError', (e) => {
  console.log('Client Error', e.message);
});
server.listen(port, () => {
  console.log('listening on ' + port);
});