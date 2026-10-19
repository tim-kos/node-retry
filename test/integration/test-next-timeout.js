var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');

(function testNextTimeout() {
  var operation = retry.operation([1, 2]);
  var nextTimeouts = [];
  assert.strictEqual(operation.nextTimeout(), null);

  operation.attempt(function() {
    operation.retry(new Error('foo'));
    nextTimeouts.push(operation.nextTimeout());
  });

  process.on('exit', function() {
    assert.deepStrictEqual(nextTimeouts, [1, 2, null]);
  });
})();

(function testNextTimeoutWhenRetryingForever() {
  var operation = retry.operation({retries: 1, minTimeout: 1, forever: true});
  var nextTimeouts = [];

  operation.attempt(function(attempt) {
    operation.retry(new Error('foo'));
    nextTimeouts.push(operation.nextTimeout());
    if (attempt === 3) {
      operation.stop();
      nextTimeouts.push(operation.nextTimeout());
    }
  });

  process.on('exit', function() {
    assert.deepStrictEqual(nextTimeouts, [1, 1, 1, null]);
  });
})();
