#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const { inspect } = require('../src/inspect');

const root = path.resolve(__dirname, '..');
const buf = Buffer.alloc(200);
let retVal = 0;

function c(str, color) {
  const [fg, reset] = inspect.colors[color];
  return `\u001b[${fg}m${str}\u001b[${reset}m`;
}

// This is all sync so that the output isn't garbled together.
// The "parallel" directory is just copied from the Node
// file structure.
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const bare = path.join(dir, f);
    const fn = path.join(root, dir, f);
    const m = f.match(/^test-(.*)\.js$/);
    if (m) {
      console.log(c(m[1], 'cyan'));
      // read the first 200 bytes and look for
      // "// Flags: --expose-internals"
      const fd = fs.openSync(fn);
      const bytes = fs.readSync(fd, buf, 0, buf.length);
      fs.closeSync(fd);
      const head = buf.toString('utf8', 0, bytes);
      const flags = head.match(/^\s*\/\/\s*Flags:\s*(.*)$/m);
      let args = [fn];
      if (flags) {
        args = flags[1].split(/\s+/).concat(args);
      }
      const res = child_process.spawnSync('node', args, {
        stdio: 'inherit'
      });
      if (res.error) {
        console.log(c(res.error, 'red'));
        retVal = 1;
      } else if (res.signal) {
        console.log(
          c(`${bare} killed by signal ${res.signal}`, 'red'));
        retVal = 1;
      } else if (res.status !== 0) {
        console.log(
          c(`${bare} returned ${res.status}`, 'red'));
        retVal = 1;
      }
    } else if (fs.statSync(fn).isDirectory()) {
      walk(bare);
    }
  }
}

walk('test');

if (retVal === 0) {
  console.log(c('--- PASS ---', 'green'), new Date().toISOString());
} else {
  console.log(c('--- FAIL ---', 'red'), new Date().toISOString());
}
process.exit(retVal);
