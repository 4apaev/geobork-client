const { diff } = require('./date')

exports.info = `<h3>add entity</h3>
<input name=name type=text placeholder="entity name"/>
<div class=btn-group>
  <button class="btn btn-ok" value=inspector>inspector</button>
  <button class="btn btn-ok" value=park>park</button>
  <button class="btn btn-ok" value=vet>vet</button>
</div>`

exports.updated = ({ type, name, updated }) => `<h3>${ name||type }</h3>
<i>last seen </i>
<b> ${ diff(updated) }</b>`

exports.aside = ({ radius, minutes, hours, days }) => `<div class=field>
  <label class=block for=type>filter by type</label>
  <select name=type>
    <option>inspector</option>
    <option>park</option>
    <option>vet</option>
  </select>
</div>
<div class=field>
  ${ block({  name: 'radius',  max: 2000, value: radius }) }
  ${ block({  name: 'minutes',  max: 60, value: minutes }) }
  ${ block({  name: 'hours',  max: 24, value: hours }) }
  ${ block({  name: 'days',  max: 100, value: days }) }
</div>`


function block({ name, max, value=max }) {
  return `<label class=block for=${ name }>set ${ name }</label>
<input name=${ name } type=number min=0 max=${ max } value=${ value }>`
}