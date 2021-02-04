'use strict';

const {
  hideStackFrames,
  codes: {
    ERR_INVALID_ARG_TYPE
  },
} = require('./errors');

exports.validateObject = hideStackFrames(
  (value, name, { nullable = false } = {}) => {
    if ((!nullable && value === null) ||
        Array.isArray(value) ||
        typeof value !== 'object') {
      throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
    }
  });
