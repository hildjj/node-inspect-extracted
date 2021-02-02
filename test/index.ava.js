'use strict'

const test = require('ava')
const inspect = require('../')

test('load', t => {
  t.is(typeof inspect, 'function')
}) 
