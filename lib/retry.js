var RetryOperation = require('./retry_operation');

exports.operation = function(options) {
  var timeouts = (options instanceof Array)
    ? options
    : this.timeouts(options);

  var operation = new RetryOperation(timeouts);
  return operation;
};

exports.timeouts = function(options) {
  var opts = {
    times: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];
  for (var i = 0; i < opts.times; i++) {
    timeouts.push(this._createTimeout(i, opts));
  }
  return timeouts;
};

exports._createTimeout = function(attempt, opts) {
  if (attempt === 0 && !opts.randomize) {
    return opts.minTimeout;
  }

  var random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
}
