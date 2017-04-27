{

  2: [function(require, module, exports) {
    module.exports = `
  Array  map      map      NodeList  NamedNodeMap  HTMLCollection
  Array  forEach  forEach  NodeList  NamedNodeMap  HTMLCollection
  Array  reduce   reduce   NodeList  NamedNodeMap  HTMLCollection
  Node  textContent    text    Node
  Node  parentElement  parent  Node
  Element  querySelector           find    Element
  Element  querySelectorAll        query   Element
  Element  nextElementSibling      next    Element
  Element  previousElementSibling  prev    Element
  Element  lastElementChild        last    Element
  Element  firstElementChild       first   Element
  Element  clientWidth             width   Element
  Element  clientHeight            height  Element
  Element  childElementCount       count   Element
  Element  outerHTML               HTML    Element
`.trim().split('\n').map(x => x.match(/\S+/g));
  }, {}],
  3: [function(require, module, exports) {
    'use strict';
    const RGX = /(\w+)\s?(.*)?/;
    const STORE = new WeakMap;
    module.exports = {
      on,
      off,
      once,
      STORE
    };

    function on(str, cb, ctx) {
      if ('string' !== typeof str)
        throw new TypeError(`"event" must be a string`);
      if ('function' !== typeof cb)
        throw new TypeError(`"cb" must be a function`);

      const [, name, selector] = str.match(RGX);
      const exec = e => false === cb.call(ctx, e, e.target) && (e.preventDefault(), e.stopPropagation());
      const handler = selector ? e => e.target.matches(selector) && exec(e) : exec;
      const off = () => this.removeEventListener(name, handler, false);
      STORE.has(this) || STORE.set(this, []);
      STORE.get(this).push({
        name,
        selector,
        cb,
        ctx,
        off
      });
      this.addEventListener(name, handler, false);
      return this;
    }

    function off(str, cb, ctx) {
      if (!STORE.has(this))
        return this;

      let type = typeof str,
        store = STORE.get(this),
        filters = [];
      if ('undefined' == type)
        return store.forEach(e => e.off()), STORE.delete(this), this;

      if ('function' == type)
        ctx = cb, cb = str;
      else if ('string' == type) {
        let [, name, selector] = str.match(RGX) || [];
        name && filters.push(e => e.name === name);
        selector && filters.push(e => e.selector === selector);
      }

      cb && filters.push(e => e.cb === cb);
      ctx && filters.push(e => e.ctx === ctx);

      for (let e, i = 0; e = store[i]; i++)
        filters.every(fn => fn(e = store[i])) && (e.off(), store.splice(i, 1), i--);
      store.length === 0 && STORE.delete(this);
      return this
    }

    function once(str, cb, ctx) {
      let func = e => (this.off(str, func), cb.call(ctx, e, e.target));
      return this.on(str, func)
    }

  }, {}],
  4: [function(require, module, exports) {
    const declare = require('declare');
    const {
      on,
      once,
      off,
      STORE
    } = require('./events');
    const {
      insert,
      append,
      prepend,
      before,
      after
    } = require('./insert');
    const aliases = require('./aliases');

    aliases.forEach(([src, name, alias, ...targets]) => {
      let ctor = self[src].prototype
      targets.forEach(trg => {
        declare.alias(ctor, name, alias, self[trg].prototype)
      })
    });

    exports.find = document.querySelector.bind(document)
    exports.query = document.querySelectorAll.bind(document)

    declare.getter(Element, 'STORE', () => STORE);
    declare.method(Element.prototype, 'on', on);
    declare.method(Element.prototype, 'once', once);
    declare.method(Element.prototype, 'off', off);

    declare.method(Element.prototype, 'insert', insert);
    declare.method(Element.prototype, 'append', append);
    declare.method(Element.prototype, 'prepend', prepend);
    declare.method(Element.prototype, 'after', after);
    declare.method(Element.prototype, 'before', before);

    declare.method(Element.prototype, 'empty', function empty(first) {
      while (first = this.firstChild)
        this.removeChild('function' === typeof first.off ? first.off() : first);
      return this;
    });

    declare.accessor(Element.prototype, 'html', function() {
      return this.innerHTML
    }, function(str) {
      return this.empty().append(str)
    });


  }, {
    "./aliases": 2,
    "./events": 3,
    "./insert": 5,
    "declare": 1
  }],
  5: [function(require, module, exports) {
    'use strict';
    exports.insert = function insert(x, position = 'beforeEnd') {
      this[x instanceof Element ? 'insertAdjacentElement' : 'insertAdjacentHTML'](position, x);
      return this
    };
    exports.append = function append(x) {
      return this.insert(x, 'beforeEnd')
    };
    exports.prepend = function prepend(x) {
      return this.insert(x, 'afterBegin')
    };
    exports.after = function after(x) {
      return this.insert(x, 'afterEnd')
    };
    exports.before = function before(x) {
      return this.insert(x, 'beforeBegin')
    };
  }, {}],
  6: [function(require, module, exports) {
    const Tmpls = require('./util/templates')
    const GM = require('./util/gmap')

    module.exports = class Bork {

      constructor(map, opts = {}) {
        Object.assign(this, opts)
        setTimeout(() => this.setMark(map), 0)
      }

      setMark(map) {
        let {
          icon,
          position,
          content
        } = this.removeMark();
        let mark = GM.mark({
          map,
          icon,
          position
        })

        if (this.type === 'inspector') {
          let tid, info = GM.info(content);
          const cb = () => info.getMap() ?
            info.setContent(this.content) :
            clearInterval(tid);

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

      get id() {
        return this._id
      }
      get lat() {
        return this.loc[0]
      }
      get lng() {
        return this.loc[1]
      }
      get position() {
        return {
          lat: this.lat,
          lng: this.lng
        }
      }
      get content() {
        return Tmpls.updated(this)
      }
      get icon() {
        return `/css/ico/${ this.type }.png`
      }

    }

  }, {
    "./util/gmap": 12,
    "./util/templates": 14
  }],
  7: [function(require, module, exports) {
    const Vent = require('./util/vent')
    const {
      calc
    } = require('./util/date')
    const {
      aside
    } = require('./util/templates')

    module.exports = class Ctrl {
      constructor(el) {
        this.el = el.on('change', this.setup, this)
        this.el.html = aside(this.query = {
          radius: 1500,
          minutes: 30,
          hours: 1,
          days: 7
        })
      }

      setup(e, {
        name,
        value
      }) {
        this.query[name] = value
        Vent.emit('change', this)
        return false;
      }

      get radius() {
        return this.query.radius
      }
      get type() {
        return this.query.type
      }
      get ago() {
        return calc(this.query)
      }

    }

  }, {
    "./util/date": 11,
    "./util/templates": 14,
    "./util/vent": 15
  }],
  8: [function(require, module, exports) {
    const GM = require('./util/gmap')

    module.exports = class Gmap {
      constructor(el) {
        this.map = new google.maps.Map(el, {
          zoom: 16
        })
      }

      createMark(opts = {}) {
        opts.map = this.map
        return GM.mark(opts)
      }

      createInfo(content) {
        return GM.info(content)
      }

      getLocation() {

        return new Promise((done, fail) => {
          navigator.geolocation.getCurrentPosition(pos => {
            done({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            })
          }, err => {
            log(err)
            done({
              lat: 32.095307399999996,
              lng: 34.79066839999996
            })
          }, {
            timeout: 5000
          })
        })
      }

      get el() {
        return this.map.getDiv()
      }
    }

  }, {
    "./util/gmap": 12
  }],
  9: [function(require, module, exports) {
    const Tmpls = require('./util/templates')
    const Sync = require('./util/sync')
    const Vent = require('./util/vent')

    const GMap = require('./GMap')
    const Bork = require('./Bork')

    module.exports = class Geo extends GMap {
      constructor(el) {
        super(el)
        this.borks = []

        this.getLocation().then(position => {
            this.map.setCenter(position)
            this.marker = this.createMark({
              position,
              draggable: true
            })

            this.map.addListener('dragend', () => {
              this.marker.setPosition(this.map.center)
            })

            this.marker.addListener('click', () => {
              this.createInfo(Tmpls.info).open(this.map, this.marker)
            })

            this.el.on('click button.btn.btn-ok', this.add, this)
            Vent.emit('ready')
          })
          .catch(err => {
            throw err
          })
      }

      add(e, trg) {
        let {
          lat,
          lng
        } = this
        let type = trg.value
        let name = trg.parent.prev.value.trim()

        return Sync.add({
            lat,
            lng,
            type,
            name
          })
          .then(x => this.parce(x))
      }

      parce({
        result
      }) {
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
        while (bork = this.borks.shift())
          bork.removeMark()
        return this
      }

      get lat() {
        return this.marker.position.lat()
      }
      get lng() {
        return this.marker.position.lng()
      }

    }

  }, {
    "./Bork": 6,
    "./GMap": 8,
    "./util/sync": 13,
    "./util/templates": 14,
    "./util/vent": 15
  }],
  10: [function(require, module, exports) {
    require('dom');

    const Geo = require('./Geo')
    const Ctrl = require('./Ctrl')
    const Sync = require('./util/sync')
    const Vent = require('./util/vent')

    function init(app = {}) {
      app.Geo = new Geo(document.getElementById('map'))
      app.Ctrl = new Ctrl(document.getElementById('ctrl'))

      app.fetch = () => {
        let {
          lat,
          lng
        } = app.Geo
        let {
          radius,
          type,
          ago
        } = app.Ctrl

        Sync.list({
            radius,
            type,
            ago,
            lat,
            lng
          })
          .then(x => app.Geo.parce(x))
      }

      Vent.on('change', app.fetch)
      Vent.once('ready', app.fetch)
    }

    module.exports = {
      init,
      Vent
    }
  }, {
    "./Ctrl": 7,
    "./Geo": 9,
    "./util/sync": 13,
    "./util/vent": 15,
    "dom": 4
  }],
  11: [function(require, module, exports) {
    'use strict';

    const Units = [{
      name: 'days',
      ms: 1000 * 60 * 60 * 24
    }, {
      name: 'hours',
      ms: 1000 * 60 * 60
    }, {
      name: 'minutes',
      ms: 1000 * 60
    }, {
      name: 'seconds',
      ms: 1000
    }];

    function calc(units) {
      return Units.reduce((buf, {
        ms,
        name
      }) => {
        if (name in units)
          buf += +units[name] * ms
        return buf
      }, 0)
    }

    function diff(a, b = Date.now(), buf = []) {
      for (let x, i = 0, tm = Math.abs(a - b); i < Units.length; i++) {
        let {
          ms,
          name
        } = Units[i]
        if (x = 0 | tm / ms) {
          x < 2 && (name = name.slice(0, -1))
          buf.push(`${ x } ${ name }`)
          tm -= x * ms
        }
      }
      let n = buf.length - 1
      n > 0 && (buf[n] = `and ${ buf[ n ] }`)
      return buf.join(' ')
    }

    exports.diff = diff
    exports.calc = calc
  }, {}],
  12: [function(require, module, exports) {
    'use strict';
    // Radius of the Earth in km
    const R = 6371e3;
    const Pi = Math.PI / 180
    const deg2rad = deg => deg * Pi

    const gmap = {
      deg2rad,

      mark(opts) {
        return new google.maps.Marker(opts)
      },

      info(content) {
        return new google.maps.InfoWindow({
          content
        })
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
          C = deg2rad(b.lng - a.lng),
          D = Math.sin(A) *
          Math.sin(B) +
          Math.cos(A) *
          Math.cos(B) *
          Math.cos(C)
        return Math.acos(D) * R;
      }
    }

    module.exports = gmap
  }, {}],
  13: [function(require, module, exports) {
    const HOST = 'localhost'
      // const HOST = '95.85.60.200'

    const URL = `http://${ HOST }:3000/v1/borks`,
      method = 'POST',
      headers = {
        'Content-Type': 'application/json'
      },
      json = x => x.json();

    function add({
      type = 'inspector',
      name = type,
      lng,
      lat
    }) {
      return fetch(URL, {
          method,
          headers,
          body: JSON.stringify({
            type,
            name,
            lng,
            lat
          })
        })
        .then(json)
    }

    function list({
      type,
      ago = 120,
      lng = 0,
      lat = 0,
      radius = 1000
    }) {
      let url = `${ URL }?lng=${ lng }&lat=${ lat }&radius=${ radius }&ago=${ +ago }`
      type && (url += `&type=${ type }`)
      return fetch(url)
        .then(json)
    }

    module.exports = {
      add,
      list
    }
  }, {}],
  14: [function(require, module, exports) {
    const {
      diff
    } = require('./date')

    exports.info = `<h3>add entity</h3>
<input name=name type=text placeholder="entity name"/>
<div class=btn-group>
  <button class="btn btn-ok" value=inspector>inspector</button>
  <button class="btn btn-ok" value=park>park</button>
  <button class="btn btn-ok" value=vet>vet</button>
</div>`

    exports.updated = ({
      type,
      name,
      updated
    }) => `<h3>${ name||type }</h3>
<i>last seen </i>
<b> ${ diff(updated) }</b>`

    exports.aside = ({
      radius,
      minutes,
      hours,
      days
    }) => `<div class=field>
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


    function block({
      name,
      max,
      value = max
    }) {
      return `<label class=block for=${ name }>set ${ name }</label>
<input name=${ name } type=number min=0 max=${ max } value=${ value }>`
    }
  }, {
    "./date": 11
  }],
  15: [function(require, module, exports) {
    'use strict';

    class Vent {
      constructor() {
        this.vents = []
      }

      on(e, cb, ctx) {
        this.vents.push({
          e,
          cb,
          ctx
        });
        return this;
      }

      once(e, cb, ctx) {
        let fn = (...argv) => {
          cb.call(ctx, ...argv), this.off(e, fn);
        };
        return this.on(e, fn);
      }

      emit(e, ...argv) {
        this.vents.forEach(x => e === x.e && x.cb.call(x.ctx, ...argv))
        return this;
      }

      off(e, cb) {
        if (!e || !this.vents.length)
          return this;

        if ('function' == typeof e) {
          cb = e
          e = null
        }

        let arr = []
        e && arr.push(x => x.e === e)
        cb && arr.push(x => x.cb === cb)

        for (let i = 0; i < this.vents.length; i++)
          arr.every(fn => fn(this.vents[i])) && this.vents.splice(i, 1) && i--;

        return this;
      }
    };

    module.exports = new Vent
  }, {}]
}