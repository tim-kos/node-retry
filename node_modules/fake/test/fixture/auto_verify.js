var common = require('../common');
var assert = common.assert;
var fake = common.fake;

(function testCallbackThatNeverGetsCalled() {
  var fake = fake.create();
  var callback = fake.callback();
  fake.expect(callback);
})();
