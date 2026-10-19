var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');

(function testOperationTimeoutReceivesAttempts() {
  var operation = retry.operation([1]);
  var timedOutAttempts = [];

  operation.attempt(function() {}, {
    timeout: 1,
    cb: function(attempts) {
      timedOutAttempts.push(attempts);
      operation.retry(new Error('timeout'));
    }
  });

  process.on('exit', function() {
    assert.deepStrictEqual(timedOutAttempts, [1, 2]);
  });
})();

(function testOperationTimeoutIsUnrefed() {
  var operation = retry.operation({unref: true});

  operation.attempt(function() {}, {
    timeout: 60 * 1000,
    cb: function() {}
  });

  assert.strictEqual(operation._timeout.hasRef(), false);
  operation.stop();
})();
