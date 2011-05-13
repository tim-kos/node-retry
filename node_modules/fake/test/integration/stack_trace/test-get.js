var common = require('../../common');
var assert = common.assert;
var StackTrace = require(common.dir.lib + '/stack_trace');

(function testFakeStackTrace() {
  var trace = StackTrace.get();
  var firstFn = trace.first().getFunctionName();

  assert.strictEqual(firstFn, 'testFakeStackTrace');
})();
