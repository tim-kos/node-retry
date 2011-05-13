var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testAndReturn() {
  var val = {any: 'object 1'};

  var callback = fake.callback();

  fake
    .expect(callback)
    .andReturn(val);

  var r = callback();
  assert.strictEqual(r, val);
})();
