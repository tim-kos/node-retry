console.log('disabled');
return;

var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testGetReferenceToLastArgs() {
  var args = fake
    .expectAnytime(object, 'someMethod')
    .times(0, Infinity)
    .getArgs();

  (function testInitialValueIsEmptyArray() {
    assert.strictEqual(args.length, 0);
  })();

  var a = {};
  (function testCallWithOneArg() {
    object.someMethod(a);
    assert.strictEqual(args.length, 1);
    assert.strictEqual(args[0], a);
  })();

  var b = {};
  (function testCallWithTwoArgs() {
    object.someMethod(a, b);
    assert.strictEqual(args.length, 2);
    assert.strictEqual(args[0], a);
    assert.strictEqual(args[1], b);
  })();

  (function testCallWithTwoArgsInDifferentOrder() {
    object.someMethod(b, a);
    assert.strictEqual(args[0], b);
    assert.strictEqual(args[1], a);
  })();

  (function testCallWithNoArguments() {
    object.someMethod();
    assert.strictEqual(args.length, 0);
  })();
})();
