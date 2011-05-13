var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');

(function testDefaultValues() {
  var operation = retry.operation();
  assert.equal(operation._timeouts.length, 10);
  assert.equal(operation._timeouts[0], 1000);
})();

(function testPassedTimeoutsAreUsed() {
  var operation = retry.operation();
  timeouts = [1000, 2000, 3000];
  operation = retry.operation(timeouts);
  assert.deepEqual(timeouts, operation._timeouts);
})();

(function testTimeoutsAreWithinBoundaries() {
  var minTimeout = 1000;
  var maxTimeout = 10000;
  var operation = retry.operation({
    minTimeout: minTimeout,
    maxTimeout: maxTimeout
  });
  for (var i = 0; i < operation._timeouts; i++) {
    assert.ok(operation._timeouts[i] >= minTimeout);
    assert.ok(operation._timeouts[i] <= maxTimeout);
  }
})();

(function testTimeoutsAreIncremental() {
  var operation = retry.operation();
  var lastTimeout = operation._timeouts[0];
  for (var i = 0; i < operation._timeouts; i++) {
    assert.ok(operation._timeouts[i] > lastTimeout);
    lastTimeout = operation._timeouts[i];
  }
})();