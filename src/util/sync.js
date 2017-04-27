// const HOST = 'localhost'
const HOST = '95.85.60.200'

const URL = `http://${ HOST }:3000/v1/borks`,
      method = 'POST',
      headers = { 'Content-Type':'application/json' },
      json = x => x.json();

function add({ type='inspector', name=type, lng, lat }) {
  return fetch(URL, { method, headers, body: JSON.stringify({ type, name, lng, lat }) })
            .then(json)
}

function list({ type, ago=120, lng=0, lat=0, radius=1000 }) {
  let url = `${ URL }?lng=${ lng }&lat=${ lat }&radius=${ radius }&ago=${ +ago }`
  type && (url+=`&type=${ type }`)
  return fetch(url)
            .then(json)
}

module.exports = {  add, list }