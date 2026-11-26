var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');
var RetryOperation = require(common.dir.lib + '/retry_operation');

function checkDelays(operation, expectedDelays) {
  var originalSetTimeout = global.setTimeout;
  var originalClearTimeout = global.clearTimeout;
  var timers = [];
  var attempts = [];
  global.setTimeout = function(callback, delay) {
    var timer = {callback: callback, delay: delay};
    timers.push(timer);
    return timer;
  };
  global.clearTimeout = function() {};

  try {
    operation.attempt(function(attempt) { attempts.push(attempt); });
    for (var i = 0; i < 4; i++) {
      assert.strictEqual(operation.retry(new Error('foo')), true);
      timers[i].callback();
    }
    operation.stop();
  } finally {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  }

  assert.deepStrictEqual(timers.map(function(timer) { return timer.delay; }), expectedDelays);
  assert.deepStrictEqual(attempts, [1, 2, 3, 4, 5]);
}

[undefined, false, 1, 'true', true].forEach(function(mode) {
  var options = {forever: true};
  if (mode !== undefined) {
    options.consistentOperationTimeouts = mode;
  }
  var expectedDelays = mode === true ? [1, 2, 2, 2] : [1, 2, [2], [2]];
  checkDelays(new RetryOperation([1, 2], options), expectedDelays);

  options.retries = 2;
  options.minTimeout = 1;
  options.factor = 2;
  checkDelays(retry.operation(options), expectedDelays);
});

(function testLegacyBooleanForeverSignature() {
  checkDelays(new RetryOperation([1, 2], true), [1, 2, [2], [2]]);
})();
