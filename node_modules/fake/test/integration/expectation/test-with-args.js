var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testRightArgs() {
  var arg = {any: 'value'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .withArgs(arg);

  callback(arg);
})();

(function testWrongArgCount() {
  var arg = {any: 'value 1'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .withArgs();

  assert.throws(function() {
    callback(arg);
  }, /unexpected argument count/i);

  fake.reset();
})();

(function testWrongArg() {
  var arg = {any: 'value 1'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .withArgs(arg);

  assert.throws(function() {
    var otherArg = {any: 'value 2'};
    callback(otherArg);
  }, /unexpected argument #1/i);

  fake.reset();
})();
