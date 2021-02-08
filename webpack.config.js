'use strict';

const path = require('path');

module.exports = {
  entry: './src/inspect.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'inspect.js',
    library: 'util',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  // devtool: 'source-map'
};
