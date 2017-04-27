'use strict';

class PubSub {
  constructor() {
    this.cache = Object.create(null)
  }

  on(topic, cb, ctx) {
    const subs = this.cache[ topic ] || (this.cache[ topic ] = new Map)
    if (subs.has(cb))
      throw new Error('listener already in use')
     else
      subs.set(cb, ctx)
    return this
  }

  once(topic, cb, ctx) {
    const listener = (...args) => (cb.apply(ctx, args), this.off(topic, listener));
    return this.on(topic, listener)
  }

  off(topic, cb) {
    if (topic in this.cache)
      this.cache[ topic ].delete(cb)
    else if ('function' === typeof topic)
      for (let key in this.cache)
        this.cache[ key ].delete(topic)
    return this;
  }

  emit(topic, ...args) {
    if (topic in this.cache)
      for (let [ cb, ctx ] of this.cache[ topic ])
        cb.apply(ctx, args);
    return this
  }
}

module.exports = new PubSub