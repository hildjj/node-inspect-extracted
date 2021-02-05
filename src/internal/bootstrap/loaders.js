'use strict';

exports.NativeModule = {
  exists(name) {
    // TODO: hack
    return !name.startsWith('/');
  }
};
