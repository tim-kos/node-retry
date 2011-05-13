var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testTwoTimes() {
  var callback = fake.callback();

  fake
    .expect(callback)
    .times(2);

  // Fake should not verify without callback being called
  assert.throws(function() {
    fake.verify();
  }, /callee/i);

  // Fake should verify after two calls
  callback();
  callback();
  fake.verify();

  // Calling callback a third time should raise an error again
  assert.throws(function() {
    callback();
  }, /called too often/i);
})();

(function testZeroToTwoTimes() {
  var callback = fake.callback();

  fake
    .expect(callback)
    .times(0, 2);

  // Fake should verify right away, since this callback is optional
  fake.verify();

  // Same should be true after the next two callbacks
  callback();
  callback();
  fake.verify();

  // The third callback should cause trouble
  assert.throws(function() {
    callback();
  }, /called too often/i);
})();
