'use strict';

const Units = [
  { name: 'days', ms: 1000*60*60*24 },
  { name: 'hours', ms: 1000*60*60 },
  { name: 'minutes', ms: 1000*60 },
  { name: 'seconds', ms: 1000 }
];

function calc(units) {
  return Units.reduce((buf, { ms, name }) => {
    if (name in units)
      buf += +units[ name ] * ms
    return buf
  }, 0)
}

function diff(a, b=Date.now(), buf=[]) {
  for(let x, i = 0, tm = Math.abs(a-b); i < Units.length; i++) {
    let { ms, name } = Units[ i ]
    if (x = 0|tm/ms) {
      x < 2 && (name=name.slice(0,-1))
      buf.push(`${ x } ${ name }`)
      tm -= x * ms
    }
  }
  let n = buf.length-1
  n > 0 && (buf[ n ] = `and ${ buf[ n ] }`)
  return buf.join(' ')
}

exports.diff = diff
exports.calc = calc