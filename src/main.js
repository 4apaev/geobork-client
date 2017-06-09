((URL, icon, App) => {
    App.init = init
    function init(center) {
        App.map = new google.maps.Map($('map'), {
            center,
            zoom: 16
          })
        App.marker = new google.maps.Marker({
            map: App.map,
            position: center,
            draggable: true
          })
        App.marker.addListener('click', () => {
            confirm('add inspector?') && save()
          })
        App.marker.addListener('dragend', () => {
            sync()
          })
        sync()
      }

    function sync() {
        let url = `${ URL }?lat=${ App.marker.position.lat() }&lng=${ App.marker.position.lng() }`
        for(let k in App.params)
          url += `&${ k }=${ App.params[ k ] }`
        return fetch(url)
                .then(x => x.json())
                .then(resolve)
                .catch(fail)
      }

    function save() {
        let body = App.marker.position.toJSON()
        return fetch(URL, {
                  method: 'POST',
                  body: JSON.stringify(body)
                })
                .then(x => x.json())
                .then(resolve)
                .catch(fail)
      }

    function resolve({ err, result }) {
        if (Array.isArray(result)) {
          clear();
          result.forEach(spawn)
        } else if (result) {
          spawn(result)
        } else {
          fail(err)
        }
      }

    function spawn({ loc, updated }) {
        App.BORKS.push(new google.maps.Marker({
          icon,
          updated,
          map: App.map,
          position: { lat: loc[ 0 ],lng: loc[ 1 ] }
        }))
      }

    function clear() {
        App.BORKS.forEach(bork => bork.setMap(null))
        App.BORKS.length = 0
      }

    function fail(err) {
        $('message').textContent = err.message
        $('stack').textContent = err.stack
        $('modal').removeAttribute('style')
      }

  })(`https://localhost:3000/v2/borks`, {
    scale: .5,
    fillColor: 'tomato',
    strokeColor: 'crimson',
    fillOpacity: 1,
    strokeWeight: 2,
    path: `M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z`
  }, this.App||(this.App={
    BORKS: [],
    params: { d:30 },
    Pos: {
      geo(x) { return { lat: x.coords.latitude, lng: x.coords.longitude }},
      evt(x) { return x.latLng.toJSON() },
      pos(x) { return x.position.toJSON() },
      center(x) { return x.center.toJSON() },
    }}));

document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(pos => App.init(App.Pos.geo(pos)), err => App.init({
      lat: 32.097,
      lng: 34.790
    }), {
      timeout: 5000,
      maximumAge: 1000,
      enableHighAccuracy: true
    })
  });