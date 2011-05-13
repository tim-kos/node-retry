var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testRightArgCountWins() {
  var callback = fake.callback();
  var expectedContext = {any: 'expected context'};
  var unexpectedContext = {any: 'unexpected context'};

  fake.expectAnytime(callback);

  var arg = {any: 'object 1'};
  fake
    .expectAnytime(callback)
    .withArgs(arg);

  fake.expectAnytime(callback);

  fake
    .expectAnytime(callback)
    .inContext(expectedContext);

  callback.call(unexpectedContext, arg);

  callback.call(expectedContext);

  callback.call(unexpectedContext);

  callback.call(unexpectedContext);
})();
