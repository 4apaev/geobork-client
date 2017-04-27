const PubSub = require('./util/pubsub')
const { calc } = require('./util/date')
const { aside } = require('./util/templates')

module.exports = class Ctrl {
  constructor(el) {
    this.el = el.on('change', this.setup, this)
    this.el.html = aside(this.query = {
      radius:1500,
      minutes:30,
      hours:1,
      days:7
    })
  }

  setup(e, { name, value }) {
    this.query[ name ] = value
    PubSub.emit('change', this)
    return false;
  }

  get radius() { return this.query.radius }
  get type() { return this.query.type }
  get ago() { return calc(this.query) }

}
