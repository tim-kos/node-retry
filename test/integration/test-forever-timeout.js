var common = require('../common');
var assert = common.assert;
var RetryOperation = require(common.dir.lib + '/retry_operation');

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
