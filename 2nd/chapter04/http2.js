const http = require('http');
http.createServer((req, res) => {
  // req.url === '/10'
  // ref:  https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_message_url
  let num = parseInt(req.url.slice(1));
  if (isNaN(num)) {
    res.end();
    return;
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('fib(' + num + ') = ' + fib(num));
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function fib(n) {
  if (n === 0 || n === 1) return n;
  return fib(n - 1) + fib(n - 2);
}