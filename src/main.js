((exports, URL, icon) => {
    const app = exports.app = { init, BORKS: [] }
    function init(center) {
        app.map = new google.maps.Map($('map'), {
            center,
            zoom: 16
          })
        app.marker = new google.maps.Marker({
            map: app.map,
            position: center,
            draggable: true
          })
        app.marker.addListener('click', e => {
            confirm('add inspector?') && sync('add')
          })
        app.marker.addListener('dragend', e => {
            sync()
          })
        sync()
      }
    function sync(...args) {
        return fetch(`${ [ URL, ...args ].join('/') }?lat=${ app.marker.position.lat() }&lng=${ app.marker.position.lng() }`)
                .then(x => x.json())
                .then(resolve)
                .catch(fail)
      }
    function resolve({ err, result }) {
        if (Array.isArray(result)) {
          clear(), result.forEach(spawn)
        } else if (result) {
          spawn(result)
        } else {
          fail(err)
        }
      }
    function spawn({ loc, updated }) {
        app.BORKS.push(new google.maps.Marker({
          icon,
          updated,
          map: app.map,
          position: {
            lat: loc[ 0 ],
            lng: loc[ 1 ]
          }
        }))
      }
    function clear() {
        app.BORKS.forEach(bork => bork.setMap(null))
        app.BORKS.length = 0
      }
    function fail(err) {
        $('message').textContent = err.message
        $('stack').textContent = err.stack
        $('modal').removeAttribute('style')
      }
  })(this, `https://localhost:3000/v2/borks`, {
    scale: .5,
    fillColor: 'tomato',
    strokeColor: 'crimson',
    fillOpacity: 1,
    strokeWeight: 2,
    path: `M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z`
  })

document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(pos => app.init({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }), err => app.init({
      lat: 32.097,
      lng: 34.790
    }), {
      timeout: 5000,
      maximumAge: 1000,
      enableHighAccuracy: true
    })
  });