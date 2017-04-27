'use strict';

let flag = true, configurable = flag, enumerable = flag, writable = flag;

module.exports = {
  get ok() { return (flag=true), this },
  get not() { return (flag=false), this },
  get conf() { return (configurable=flag), this.ok },
  get enum() { return (enumerable=flag), this.ok },
  get flex() { return (writable=flag), this.ok },

  property(o, name, desc) {
      this.ok.conf.enum.flex
      return Object.defineProperty(o, name, desc);
    },
  alias(src, name, alias=name, trg=src, desc) {
      if (desc = Object.getOwnPropertyDescriptor(src, name))
        return Object.defineProperty(trg, alias, desc);
    },
  value(o, name, value) {
      return this.property(o, name, { configurable, enumerable, writable, value })
    },
  accessor(o, name, get, set) {
      return this.property(o, name, { configurable, enumerable, get, set })
    },
  method(o, name, x) {
      return this.not.enum.value(o, name, x)
    },
  getter(o, name, x) {
      return this.not.enum.accessor(o, name, x)
    }
}
