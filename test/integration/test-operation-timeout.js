var common = require('../common');
var assert = common.assert;
var retry = require(common.dir.lib + '/retry');
var RetryOperation = require(common.dir.lib + '/retry_operation');
var execFileSync = require('child_process').execFileSync;

function withTimers(fn) {
  var originalSetTimeout = global.setTimeout;
  var originalClearTimeout = global.clearTimeout;
  var timers = [];

  global.setTimeout = function(callback, delay) {
    var timer = {
      callback: callback,
      delay: delay,
      unrefCalls: 0,
      unref: function() { this.unrefCalls++; }
    };
    timers.push(timer);
    return timer;
  };
  global.clearTimeout = function(timer) { timer.cleared = true; };

  try {
    fn(timers);
  } finally {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  }
}

var factories = [
  function(options) { return retry.operation(options); },
  function(options) { return new RetryOperation([1], options); }
];

factories.forEach(function(createOperation) {
  [undefined, false, 1, 'true', true].forEach(function(mode) {
    [false, true].forEach(function(unref) {
      withTimers(function(timers) {
        var options = {retries: 1, minTimeout: 1, unref: unref};
        if (mode !== undefined) {
          options.consistentOperationTimeouts = mode;
        }
        var operation = createOperation(options);
        var attempts = [];
        var timeoutArguments = [];
        var timeoutReceivers = [];
        var retryResults = [];

        operation.attempt(function(attempt) {
          attempts.push(attempt);
        }, {
          timeout: 10,
          cb: function() {
            timeoutArguments.push(Array.prototype.slice.call(arguments));
            timeoutReceivers.push(this);
            retryResults.push(operation.retry(new Error('timeout')));
          }
        });

        assert.strictEqual(timers[0].delay, 10);
        timers[0].callback();
        assert.strictEqual(timers[0].cleared, true);
        assert.strictEqual(timers[1].delay, 1);
        timers[1].callback();
        assert.strictEqual(timers[2].delay, 10);
        timers[2].callback();

        assert.deepStrictEqual(attempts, [1, 2]);
        assert.deepStrictEqual(timeoutArguments, mode === true ? [[1], [2]] : [[], [2]]);
        assert.deepStrictEqual(timeoutReceivers, [operation, operation]);
        assert.deepStrictEqual(retryResults, [true, false]);
        assert.strictEqual(timers.length, 3);
        assert.deepStrictEqual(timers.map(function(timer) {
          return timer.unrefCalls;
        }), unref ? [mode === true ? 1 : 0, 1, 1] : [0, 0, 0]);
      });
    });
  });
});

(function testFirstTimeoutProcessLifetime() {
  [undefined, false, 1, 'true', true].forEach(function(mode) {
    [false, true].forEach(function(unref) {
      var options = {unref: unref};
      if (mode !== undefined) {
        options.consistentOperationTimeouts = mode;
      }
      [false, true].forEach(function(directConstructor) {
        var createOperation = directConstructor ?
          'new (require(' + JSON.stringify(common.dir.lib + '/retry_operation') + '))([1], ' + JSON.stringify(options) + ')' :
            'require(' + JSON.stringify(common.dir.lib + '/retry') + ').operation(' + JSON.stringify(options) + ')';
        var script = createOperation + '.attempt(function() {}, {' +
          'timeout: 20, cb: function() { console.log("timeout"); }});';
        var output = execFileSync(process.execPath, ['-e', script], {
          encoding: 'utf8',
          timeout: 5000
        });
        assert.strictEqual(output, mode === true && unref ? '' : 'timeout\n');
      });
    });
  });
})();
