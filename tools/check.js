#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { spawn } = require('child_process');
const util = require('util');

const LAST_EXTRACT_FILE = path.join(__dirname, 'lastExtract.js');
const lastExtract = require(LAST_EXTRACT_FILE);

const args = process.argv.slice(2);
const update = args.includes('--update') || args.includes('-u');
const diff = args.includes('--diff') || args.includes('-d');

function c(str, color) {
  const [fg, reset] = util.inspect.colors[color];
  return `\u001b[${fg}m${str}\u001b[${reset}m`;
}

function exec(bin, opts = {}) {
  opts = {
    args: [],
    encoding: 'utf8',
    env: {},
    ...opts
  };
  return new Promise((resolve, reject) => {
    opts.env = {
      ...process.env,
      ...opts.env
    };
    // console.log(`SPAWN: (${opts.cwd || process.cwd()})`, bin, ...opts.args)
    const args = opts.args || [];
    delete opts.args;
    const c = spawn(bin, args, {
      stdio: 'pipe',
      ...opts
    });
    const bufs = [];
    c.on('error', reject);
    c.on('close', (code) => {
      const buf = Buffer.concat(bufs);
      const str = buf.toString(opts.encoding);
      if (code !== 0) {
        const err = new Error(`process fail, code ${code}`);
        err.buf = buf;
        err.str = str;
        err.code = code;
        reject(err);
      } else {
        resolve(str);
      }
    });
    if (opts.stdio !== 'inherit') {
      c.stdout.on('data', (b) => bufs.push(b));
      c.stderr.on('data', (b) => bufs.push(b));

      if (opts.stdin != null) {
        c.stdin.write(opts.stdin);
      }
      c.stdin.end();
    }
  });
}

function checkFileHash(filename) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const inp = fs.createReadStream(filename);
    const p = inp.pipe(hash).setEncoding('hex');
    p.on('data', resolve);
    p.on('error', reject);
  });
}

async function checkAll() {
  // const lastTime = new Date(lastExtract.time);
  lastExtract.time = new Date().toISOString();

  let fail = false;
  const nodeRoot = path.resolve(__dirname, '..', '..', 'node');
  for (const f of lastExtract.files) {
    if (diff) {
      if (f.local) {
        try {
          await exec('git', {
            args: ['--no-pager', 'diff', f.commit, '--', f.name],
            cwd: nodeRoot,
            stdio: 'inherit'
          });
        } catch (err) {
          if (!err.code) {
            console.log(c(err, 'red'));
          }
        }
      }
    } else {
      const name = path.resolve(nodeRoot, f.name);
      const hash = await checkFileHash(name);
      if (hash !== f.sha256) {
        if (update) {
          f.sha256 = hash;
          const s = await fsp.stat(name);
          f.mtime = s.mtime.toISOString();
          f.commit = await exec('git', {
            args: [
              'log', '-n1', '--pretty=format:%H', '--', f.name,
            ],
            cwd: nodeRoot
          });
        } else {
          fail = true;
          console.error(`Hash mismatch for ${name}, now: "${hash}"`);
        }
      }
    }
  }
  return fail;
}

checkAll().then(async (fail) => {
  if (fail) {
    process.exit(1);
  } else if (update) {
    await fsp.writeFile(
      LAST_EXTRACT_FILE,
      `\
/* eslint-disable max-len */
'use strict';

// This file is generated from \`node tools/check.js -u\`
// DO NOT MODIFY BY HAND
module.exports = ${util.inspect(lastExtract, {
    depth: Infinity,
    compact: false
  })};
`);
  }
}, (e) => {
  console.log(e);
  process.exit(1);
});
