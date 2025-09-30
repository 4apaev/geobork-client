'use strict';

const { PORT=3001, API_KEY } = process.env;

const app = require('miniserver')()

app
  .use(require('miniserver/middleware/logger')('statusCode', 'method', 'url'))
  .get('/'     , require('miniserver/middleware/pugify')('./view/index.pug', { apiKey: API_KEY }))
  .get(/^\/src/, require('miniserver/middleware/brws')())
  .get(/\.css$/, require('miniserver/middleware/stylify')())
  .get(require('miniserver/middleware/static')())
  .listen(PORT, () => console.log(`running on localhost:`, PORT));
