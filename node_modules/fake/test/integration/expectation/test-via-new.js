var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testWrongFunction() {
  var MyClass = fake.class('MyClass');
  var fn = fake.function('other_fn');

  fake.expect('new', MyClass);

  assert.throws(function() {
    fn();
  }, /new MyClass/);

  fake.reset();
})();
