'use strict';

// The main use case is browsers, and I rarely test on Windows, so all of the
// Windows-specific stuff is removed.

const {
  StringPrototypeCharCodeAt,
  StringPrototypeIncludes,
  StringPrototypeReplace,
} = require('../primordials');
const URL = require('../url');
const {
  CHAR_FORWARD_SLASH,
} = require('./constants');
const path = require('../path');

const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;

function encodePathChars(filepath) {
  if (StringPrototypeIncludes(filepath, '%'))
    filepath = StringPrototypeReplace(filepath, percentRegEx, '%25');
  // In posix, backslash is a valid character in paths:
  if (StringPrototypeIncludes(filepath, '\\'))
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

  let resolved = path.resolve(filepath);
  // path.resolve strips trailing slashes so we must add them back
  const filePathLast = StringPrototypeCharCodeAt(filepath,
                                                 filepath.length - 1);
  if ((filePathLast === CHAR_FORWARD_SLASH) &&
      resolved[resolved.length - 1] !== path.sep)
    resolved += '/';
  outURL.pathname = encodePathChars(resolved);

  return outURL;
}

module.exports = {
  pathToFileURL,
  URL,
};
