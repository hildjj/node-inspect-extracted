'use strict';

const pkg = require('../package.json');
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');

const inp = fs.createReadStream(pkg.lastExtract.file);
inp.pipe(hash).setEncoding('hex').on('data', (d) => {
  if (d !== pkg.lastExtract.sha256) {
    console.log('Hash mismatch, now:', d);
    process.exit(1);
  }
});
