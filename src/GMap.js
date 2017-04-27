const GM = require('./util/gmap')

module.exports = class Gmap {
  constructor(el) {
    this.map = new google.maps.Map(el, { zoom: 16 })
  }

  createMark(opts={}) {
    opts.map = this.map
    return GM.mark(opts)
  }

  createInfo(content) {
    return GM.info(content)
  }

  getLocation() {

    return new Promise((done, fail) => {
      navigator.geolocation.getCurrentPosition(pos => {
        done({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      }, err => {
        log(err)
        done({ lat: 32.095307399999996, lng: 34.79066839999996 })
      }, { timeout: 5000 })
    })
  }

  get el() { return this.map.getDiv()}
}
