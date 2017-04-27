require('dom');

const Geo = require('./Geo')
const Ctrl = require('./Ctrl')
const Sync = require('./util/sync')
const PubSub = require('./util/pubsub')

function init(app={}) {
    app.Geo = new Geo(document.getElementById('map'))
    app.Ctrl = new Ctrl(document.getElementById('ctrl'))

    app.fetch = () => {
      let { lat, lng } = app.Geo
      let { radius, type, ago } = app.Ctrl

      Sync.list({ radius, type, ago, lat, lng })
          .then(x => app.Geo.parce(x))
    }

    PubSub.on('change', app.fetch)
    PubSub.once('ready', app.fetch)
  }

module.exports = { init, PubSub }