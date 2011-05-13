var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testMatchArgOne() {
  var arg = {any: 'value'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .withArg(1, arg);

  callback(arg);
})();

(function testMismatchArgOne() {
  var arg = {any: 'value'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .withArg(1, arg);

  assert.throws(function() {
    callback();
  });
  fake.reset();
})();
