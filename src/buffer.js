'use strict';

class Buffer {
  hexSlice(start = 0, end) {
    return Array.prototype.map.call(
      this.slice(start, end),
      (x) => ('00' + x.toString(16)).slice(-2))
      .join('');
  }
}

exports.Buffer = Buffer;
