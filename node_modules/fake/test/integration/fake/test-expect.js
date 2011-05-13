var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testInOrder() {
  fake.expect(object, 'a');
  fake.expect(object, 'b');

  object.a();
  object.b();
})();

(function testOutOfOrder() {
  fake.expect(object, 'a');
  fake.expect(object, 'b');

  assert.throws(function() {
    object.b();
  }, /different call[\s\S]+expected: object#a\ngot: object#b/i);

  fake.reset();
})();

(function testNoCallsExpected() {
  fake.expect(object, 'a', 0);
  fake.stub(object, 'b', 0);

  assert.throws(function() {
    object.b();
  }, /no calls were expected/i);
})();
