'use strict';

const { PORT=3001 } = process.env;
const apiKey = 'AIzaSyAf0WIFYuPX73ZG6DnQebznewgcwH0GXWA'
const app = require('miniserver')()

app
  .use(require('miniserver/middleware/logger')('statusCode', 'method', 'url'))
  .get('/', require('miniserver/middleware/pugify')('./view/index.pug', { apiKey }))
  .get(/^\/src/, require('miniserver/middleware/brws')())
  .get(/\.css$/, require('miniserver/middleware/stylify')())
  .get(require('miniserver/middleware/static')())
  .listen(PORT, () => console.log(`running on localhost:`, PORT));