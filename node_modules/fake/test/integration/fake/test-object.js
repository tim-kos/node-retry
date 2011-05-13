var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testCallbackNotFired() {
  var A = fake.object('A');
  var B = fake.object('B');

  fake.expect(A, 'foo');
  fake.expect(B, 'bar');

  assert.throws(function() {
    B.bar();
  }, /A#foo[\s\S]*B#bar/i);

  fake.reset();
})();
