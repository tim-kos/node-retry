var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testNewFakeVerifies() {
  fake.verify();
})();

(function testExpectationNotFullfilled() {
  fake.expectAnytime(object, 'someMethod');

  assert.throws(function() {
    fake.verify();
  }, /expected a different call/i);
})();

(function testExpectationFullfilled() {
  object.someMethod();
  fake.verify();
})();
