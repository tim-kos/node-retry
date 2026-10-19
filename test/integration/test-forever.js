var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');
var RetryOperation = require(common.dir.lib + '/retry_operation');

(function testForeverUsesFirstTimeout() {
  var operation = retry.operation({
    retries: 0,
    minTimeout: 100,
    maxTimeout: 100,
    forever: true
  });

  operation.attempt(function(numAttempt) {
    console.log('>numAttempt', numAttempt);
    var err = new Error("foo");
    if (numAttempt == 10) {
      operation.stop();
    }

    if (operation.retry(err)) {
      return;
    }
  });
})();

(function testForeverRepeatsLastTimeout() {
  var operation = new RetryOperation([1, 2], {forever: true});
  var originalSetTimeout = global.setTimeout;
  var delays = [];
  global.setTimeout = function(fn, delay) {
    delays.push(delay);
    return originalSetTimeout(function() {}, 0);
  };

  operation.attempt(function() {});
  for (var i = 0; i < 4; i++) {
    operation.retry(new Error('foo'));
  }
  global.setTimeout = originalSetTimeout;

  assert.deepStrictEqual(delays, [1, 2, 2, 2]);
})();
