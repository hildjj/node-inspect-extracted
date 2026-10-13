'use strict';

const path = require('path');

const base = {
  entry: './src/inspect.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        // eslint-disable-next-line no-undef
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  // devtool: 'source-map'
};

// eslint-disable-next-line no-undef
const dist = path.resolve(__dirname, 'dist');

module.exports = [{
  ...base,
  output: {
    path: dist,
    filename: 'inspect.js',
    library: {
      type: 'umd',
      name: 'util',
    },
    globalObject: 'this',
  },
}, {
  ...base,
  experiments: {
    outputModule: true,
  },
  output: {
    path: dist,
    filename: 'inspect.mjs',
    library: {
      type: 'module',
    },
  },
}];
