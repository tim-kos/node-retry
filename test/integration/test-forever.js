var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');

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

(function testInfiniteRetriesRetryForever() {
  var operation = retry.operation({
    retries: Infinity,
    minTimeout: 1,
    factor: 1
  });

  operation.attempt(function(numAttempt) {
    if (operation.retry(new Error('foo'))) {
      if (numAttempt === 20) {
        operation.stop();
        assert.equal(operation.errors().length, 1);
      }
      return;
    }

    assert.fail('stopped retrying after ' + numAttempt + ' attempts');
  });
})();
