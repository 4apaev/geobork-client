const Tmpls = require('./util/templates')
const Sync = require('./util/sync')
const PubSub = require('./util/pubsub')

const GMap = require('./GMap')
const Bork = require('./Bork')

module.exports = class Geo extends GMap {
  constructor(el) {
    super(el)
    this.borks = []

    this.getLocation().then(position => {
        this.map.setCenter(position)
        this.marker = this.createMark({ position, draggable: true })

        this.map.addListener('dragend', () => {
          this.marker.setPosition(this.map.center)
        })

        this.marker.addListener('click', () => {
          this.createInfo(Tmpls.info).open(this.map, this.marker)
        })

        this.el.addEventListener('click button.btn.btn-ok', this.add.bind(this))
        PubSub.emit('ready')
    })
    .catch(err => {
      throw err
    })
  }

  add(e, trg) {
    let { lat, lng } = this
    let type = trg.value
    let name = trg.parent.prev.value.trim()

    return Sync.add({ lat, lng, type, name })
              .then(x => this.parce(x))
  }

  parce({ result }) {
    if (Array.isArray(result)) {
      this.clear()
      result.forEach(this.setBork, this)
    } else {
      this.setBork(result)
    }
    return this
  }

  setBork(x) {
    this.borks.unshift(new Bork(this.map, x))
    return this
  }

  clear(bork) {
    while(bork=this.borks.shift())
      bork.removeMark()
    return this
  }

  get lat() { return this.marker.position.lat() }
  get lng() { return this.marker.position.lng() }

}
