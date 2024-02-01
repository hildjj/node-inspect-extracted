'use strict';

const {
  ArrayIsArray,
} = require('../primordials');

const {
  hideStackFrames,
  codes: {
    ERR_INVALID_ARG_TYPE,
  },
} = require('./errors');

const kValidateObjectNone = 0;
const kValidateObjectAllowNullable = 1 << 0;
const kValidateObjectAllowArray = 1 << 1;
const kValidateObjectAllowFunction = 1 << 2;

/**
 * @callback validateObject
 * @param {*} value
 * @param {string} name
 * @param {number} [options]
 */

/** @type {validateObject} */
const validateObject = hideStackFrames(
  (value, name, options = kValidateObjectNone) => {
    if (options === kValidateObjectNone) {
      if (value === null || ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      if (typeof value !== 'object') {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }
    } else {
      const throwOnNullable = (kValidateObjectAllowNullable & options) === 0;

      if (throwOnNullable && value === null) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      const throwOnArray = (kValidateObjectAllowArray & options) === 0;

      if (throwOnArray && ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }

      const throwOnFunction = (kValidateObjectAllowFunction & options) === 0;
      const typeofValue = typeof value;

      if (typeofValue !== 'object' && (throwOnFunction || typeofValue !== 'function')) {
        throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
      }
    }
  });

function validateString(value, name) {
  if (typeof value !== 'string')
    throw new ERR_INVALID_ARG_TYPE(name, 'string', value);
}

module.exports = {
  kValidateObjectNone,
  kValidateObjectAllowNullable,
  kValidateObjectAllowArray,
  kValidateObjectAllowFunction,
  validateObject,
  validateString,
};
