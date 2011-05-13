var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testCallbackNotFired() {
  var cb = fake.expect();

  assert.throws(function() {
    fake.verify();
  }, /callee/i);

  cb();
})();
