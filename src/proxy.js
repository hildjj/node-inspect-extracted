'use strict';

const ALL_PROXIES = new WeakMap();

function makeProxy(target, handler) {
  const p = new Proxy(target, handler);
  ALL_PROXIES.set(p, [target, handler]);
  return p;
}

function getProxyDetails(obj, getFullProxy = false) {
  const deets = ALL_PROXIES.get(obj);
  if (!deets) {
    return undefined;
  }
  if (getFullProxy) {
    return deets;
  }
  return deets[0];
}

class Prxy {
  constructor(target, handler) {
    // eslint-disable-next-line no-constructor-return
    return makeProxy(target, handler);
  }
}

module.exports = {
  makeProxy,
  getProxyDetails,
  Proxy: Prxy
};
