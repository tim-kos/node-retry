var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');

(function testDefaultValues() {
  var operation = retry.operation();

  assert.equal(operation._timeouts.length, 10);
  assert.equal(operation._timeouts[0], 1000);
  assert.ok(operation._timeouts[1], 2000);
  assert.ok(operation._timeouts[2], 4000);
})();

(function testDefaultValuesWithRandomize() {
  var minTimeout = 5000;
  var operation = retry.operation({
    minTimeout: minTimeout,
    randomize: true
  });

  assert.equal(operation._timeouts.length, 10);
  assert.ok(operation._timeouts[0] > minTimeout);
  assert.ok(operation._timeouts[1] > operation._timeouts[0]);
  assert.ok(operation._timeouts[2] > operation._timeouts[1]);
})();

(function testPassedTimeoutsAreUsed() {
  var timeouts = [1000, 2000, 3000];
  var operation = retry.operation(timeouts);
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
