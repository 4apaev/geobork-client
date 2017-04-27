const Tmpls = require('./util/templates')
const GM = require('./util/gmap')

module.exports = class Bork {

  constructor(map, opts={}) {
    Object.assign(this, opts)
    setTimeout(() => this.setMark(map), 0)
  }

  setMark(map) {
    let { icon, position, content } = this.removeMark();
    let mark = GM.mark({ map, icon, position })

    if (this.type==='inspector') {
      let tid, info = GM.info(content);
      const cb = () => info.getMap()
          ? info.setContent(this.content)
          : clearInterval(tid);

      mark.addListener('click', () => {
        clearInterval(tid)
        tid = setInterval(cb, 1000)
        info.open(map, mark)
      })
    }

    this.mark = mark
    return this
  }

  removeMark() {
    if (this.mark) {
      GM.off(this.mark)
      this.mark.setMap(null)
    }
    return this
  }

  get id() { return this._id }
  get lat() { return this.loc[ 0 ] }
  get lng() { return this.loc[ 1 ] }
  get position() { return { lat: this.lat, lng: this.lng } }
  get content() { return Tmpls.updated(this) }
  get icon() { return `/css/ico/${ this.type }.png` }

}
