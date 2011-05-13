var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testInOrder() {
  var A = {}, B = {};
  fake.stub(object, 'a', null, A);
  fake.stub(object, 'b', null, B);

  fake.verify();

  assert.strictEqual(object.a(), A);
  assert.strictEqual(object.b(), B);

  fake.reset();
})();

(function testOutOfOrder() {
  var A = {}, B = {};
  fake.stub(object, 'a', null, A);
  fake.stub(object, 'b', null, B);

  fake.verify();

  assert.strictEqual(object.b(), B);
  assert.strictEqual(object.a(), A);

  fake.reset();
})();

(function testPriority() {
  fake.stub(object, 'b', null, 1);
  fake.expectAnytime(object, 'b', null, 2);
  fake.expect(object, 'b', null, 3);

  assert.equal(object.b(), 3);
  assert.equal(object.b(), 2);
  assert.equal(object.b(), 1);

  fake.reset();
})();

(function testStubVsAnytimeScoring() {
  fake.expectAnytime(object, 'c', null, 1);
  fake.stub(object, 'c', ['a'], 2);

  assert.equal(object.c('a'), 2);
  assert.equal(object.c(), 1);
})();

(function testStubsCanBeCalledOnlyOnce() {
  var R = {};
  fake.stub(object, 'd', null, R);

  assert.strictEqual(object.d(), R);
  assert.throws(function() {
    assert.strictEqual(object.d(), R);
  }, /unexpected call/i);
})();
