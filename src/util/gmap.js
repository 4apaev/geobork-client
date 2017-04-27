'use strict';
// Radius of the Earth in km
const R = 6371e3;
const Pi = Math.PI/180
const deg2rad = deg => deg * Pi

const gmap = {
  deg2rad,

  mark(opts) {
    return new google.maps.Marker(opts)
  },

  info(content) {
    return new google.maps.InfoWindow({ content })
  },

  on(e, el, cb) {
    return google.maps.event.addListener(e, el, cb)
  },

  off(...args) {
    return google.maps.event.clearInstanceListeners(...args)
  },

  makePos(lat, lng) {
    return new google.maps.LatLng(lat, lng)
  },

  diff(a, b) {
    let A = deg2rad(a.lat),
        B = deg2rad(b.lat),
        C = deg2rad(b.lng-a.lng),
        D = Math.sin(A) *
            Math.sin(B) +
            Math.cos(A) *
            Math.cos(B) *
            Math.cos(C)
    return Math.acos(D) * R;
  }
}

module.exports = gmap