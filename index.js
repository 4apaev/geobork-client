'use strict';

const { PORT=3001 } = process.env;
const Fs = require('fs');
const Https = require('https')
const path = './index.html'
const cert = Fs.readFileSync('./cert.pem')
const key  = Fs.readFileSync('./key.pem')
const body = Fs.readFileSync(path)

Https.createServer({ key, cert }, (req, res) => {

  if (req.method==='GET' && req.url==='/')
    serveStream(res)
  else
    notFound(res)

})
  .listen(PORT, () => console.log('geobork client on', PORT))

function serveStream(res) {
    res.writeHead(200, 'Ok', { 'Content-Type': 'text/html' })
    Fs.createReadStream(path).pipe(res);
  }

function serveCached(res) {
    res.writeHead(200, 'Ok', { 'Content-Type': 'text/html', 'Content-Length': body.length })
    res.end(body);
  }

function notFound(res) {
    res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html' })
    res.end()
  }