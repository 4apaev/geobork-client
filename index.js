'use strict';

const Fs = require('fs');
const Https = require('https')
const { STATUS_CODES } = require('http')
const { PORT = 3001 } = process.env;
const { log } = console

const html = Fs.readFileSync('./index.html')
const certs = {
  key: Fs.readFileSync('./key.pem'),
  cert: Fs.readFileSync('./cert.pem')
}


Https.createServer(certs, (req, res) => {
  let code, body;
  if (req.method==='GET' && req.url==='/') {
    code = 200
    body = html
  } else {
    code = 404
    body = '<h1>404 Not Found....</h1>'
  }
  res.statusCode = code;
  res.statusMessage = STATUS_CODES[ code ];
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', body.length);
  res.end(body);
  log(code, req.method, req.url)

}).listen(PORT, () => {
    log('geobork client on ', PORT)
  })