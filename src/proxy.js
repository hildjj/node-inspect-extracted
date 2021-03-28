'use strict';

const ALL_PROXIES = new WeakMap();

class Prxy {
  constructor(target, handler) {
    const p = new Proxy(target, handler);
    ALL_PROXIES.set(p, [target, handler]);
    // eslint-disable-next-line no-constructor-return
    return p;
  }
  static getProxyDetails(obj, getFullProxy = true) {
    const deets = ALL_PROXIES.get(obj);
    if (!deets) {
      return undefined;
    }
    if (getFullProxy) {
      return deets;
    }
    return deets[0];
  }
}

module.exports = {
  getProxyDetails: Prxy.getProxyDetails.bind(Prxy),
  Proxy: Prxy
};
