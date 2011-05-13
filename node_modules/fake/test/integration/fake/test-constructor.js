var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

var MyClass = fake.class();
(function testNewMyClass() {
  fake.expect('new', MyClass)

  // Should not verify initially
  assert.throws(function() {
    fake.verify();
  });

  var myClass = new MyClass();
  fake.verify();
})();

(function testNewMyClass() {
  fake.expect('new', MyClass)

  // Invoking the function without new should fail
  assert.throws(function() {
    MyClass();
  });

  // We don't want to satisfy this expecation, so let's reset out fake
  fake.reset();
})();
