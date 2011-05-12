var RetryOperation = require('./retry_operation');
exports.operation = function(options) {
  var timeouts = this.timeouts(options);
console.warn('timeouts:');
console.warn(timeouts);
  var operation = new RetryOperation(timeouts);
  return operation;
};

exports.timeouts = function(options) {
  var opts = {
    times: 3,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 10 * 1000,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  function createTimeout(num) {
    var random = opts.randomize ? Math.floor(Math.random() * 2 + 1) : 1;
    var result = 0;
    if (num !== 0) {
      result = Math.min(
        random * opts.minTimeout * Math.pow(opts.factor, num - 1),
        opts.maxTimeout
      );
    }
    return result;
  }

  var timeouts = [];
  for (var i = 0; i < opts.times; i++) {
    var timeout = createTimeout(i);
    timeouts.push(timeout);
  }
  return timeouts;
};