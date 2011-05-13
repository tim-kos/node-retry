var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var fake = fake.create();

(function testHandle() {
  var input = {any: 'object 1'};
  var output = {any: 'object 2'};
  var context = {any: 'object 3'};

  var callback = fake.callback();

  fake
    .expect(callback)
    .andHandle(function(val) {
      assert.strictEqual(this, context);
      assert.strictEqual(val, input);
      return output;
    });

  var r = callback.call(context, input);
  assert.strictEqual(r, output);
})();
