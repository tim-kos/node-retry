var common = require('../../common');
var assert = common.assert;

var exec = require('child_process').exec;
var cmd = process.argv[0] + ' ' + common.dir.fixture + '/auto_verify.js';

exec(cmd, function(err, stdout, stderr) {
  assert.ok(err);
  stderr.match(/expectation/i);
});
