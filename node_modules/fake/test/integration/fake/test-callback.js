var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

var callback = fake.callback();
(function testCallbackNotFired() {
  fake.expect(callback);

  assert.throws(function() {
    fake.verify();
  }, /callee/i);
})();

(function testCallbackFired() {
  callback();
  fake.verify();
})();

(function testNamedVsUnnamedCallback() {
  var named = fake.callback('my_callback');
  var unnamed = fake.callback();

  fake.expect(unnamed);

  assert.throws(function() {
    named();
  }, /anonymous[\s\S]*my_callback/);

  fake.reset();
})();
