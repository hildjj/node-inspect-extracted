import util from './dist/inspect.mjs';

export default util;

export const {
  // The commented out things are not visible from normal node's util.
  // identicalSequenceRange,
  inspect,
  // inspectDefaultOptions,
  format,
  formatWithOptions,
  // getStringWidth,
  stripVTControlCharacters,
  // isZeroWidthCodePoint,
  stylizeWithColor,
  stylizeWithHTML,
  Proxy,
} = util;
