var common = exports;
var path = require('path');
var fake = require('..');

common.assert = require('assert');
common.fake = fake;
common.dir = {
  fixture: path.join(__dirname, '/fixture'),
  lib: path.join(__dirname, '../lib'),
};
