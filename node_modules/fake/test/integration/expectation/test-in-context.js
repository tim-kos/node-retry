var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testOutOfContext() {
  var expectedContext = {any: 'expected context'};
  var unexpectedContext = {any: 'unexpected context'};
  var callback = fake.callback();

  fake
    .expect(callback)
    .inContext(expectedContext);

  assert.throws(function() {
    callback.call(unexpectedContext);
  }, /context/i);

  fake.reset();
})();

(function testInContext() {
  var context = {};
  var callback = fake.callback();

  fake
    .expect(callback)
    .inContext(context);

  callback.call(context);
})();
