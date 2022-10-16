'use strict';

const {
  ArrayPrototypeJoin,
  ArrayPrototypeSlice,
  StringPrototypeCharCodeAt,
  StringPrototypeIncludes,
  StringPrototypeReplace,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
} = require('../primordials');

const {
  codes: {
    ERR_INVALID_ARG_VALUE
  },
} = require('./errors');

const {
  CHAR_BACKWARD_SLASH,
  CHAR_FORWARD_SLASH,
} = require('./constants');
const path = require('../path');

// The main use case is browsers, and I rarely test on Windows, so...
const isWindows = false;

// Doesn't work for Unicode domains.
function domainToASCII(d) {
  return d;
}

const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;

function encodePathChars(filepath) {
  if (StringPrototypeIncludes(filepath, '%'))
    filepath = StringPrototypeReplace(filepath, percentRegEx, '%25');
  // In posix, backslash is a valid character in paths:
  if (!isWindows && StringPrototypeIncludes(filepath, '\\'))
    filepath = StringPrototypeReplace(filepath, backslashRegEx, '%5C');
  if (StringPrototypeIncludes(filepath, '\n'))
    filepath = StringPrototypeReplace(filepath, newlineRegEx, '%0A');
  if (StringPrototypeIncludes(filepath, '\r'))
    filepath = StringPrototypeReplace(filepath, carriageReturnRegEx, '%0D');
  if (StringPrototypeIncludes(filepath, '\t'))
    filepath = StringPrototypeReplace(filepath, tabRegEx, '%09');
  return filepath;
}

function pathToFileURL(filepath) {
  const outURL = new URL('file://');
  if (isWindows && StringPrototypeStartsWith(filepath, '\\\\')) {
    // UNC path format: \\server\share\resource
    const paths = StringPrototypeSplit(filepath, '\\');
    if (paths.length <= 3) {
      throw new ERR_INVALID_ARG_VALUE(
        'filepath',
        filepath,
        'Missing UNC resource path'
      );
    }
    const hostname = paths[2];
    if (hostname.length === 0) {
      throw new ERR_INVALID_ARG_VALUE(
        'filepath',
        filepath,
        'Empty UNC servername'
      );
    }
    outURL.hostname = domainToASCII(hostname);
    outURL.pathname = encodePathChars(
      ArrayPrototypeJoin(ArrayPrototypeSlice(paths, 3), '/'));
  } else {
    let resolved = path.resolve(filepath);
    // path.resolve strips trailing slashes so we must add them back
    const filePathLast = StringPrototypeCharCodeAt(filepath,
                                                   filepath.length - 1);
    if ((filePathLast === CHAR_FORWARD_SLASH ||
         (isWindows && filePathLast === CHAR_BACKWARD_SLASH)) &&
        resolved[resolved.length - 1] !== path.sep)
      resolved += '/';
    outURL.pathname = encodePathChars(resolved);
  }
  return outURL;
}

module.exports = {
  pathToFileURL,
};
