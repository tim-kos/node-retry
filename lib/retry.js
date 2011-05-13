var RetryOperation = require('./retry_operation');

exports.operation = function(options) {
  var timeouts = options instanceof Array 
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
    maxTimeout: null,
    randomize: true
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  var timeouts = [];
  for (var i = 0; i < opts.times; i++) {
    timeouts.push(this._createTimeout(i, opts));
  }
  return timeouts;
};

exports._createTimeout = function(attempt, opts) {
  if (attempt === 0) {
    return opts.minTimeout;
  }

  var random = opts.randomize ? this._random(1, 2, 8) : 1;

  var minTimeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt - 1));
  if (opts.maxTimeout) {
    return Math.min(minTimeout, opts.maxTimeout);
  }
  return minTimeout;
}

exports._random = function(minVal, maxVal, floatVal) {
  var randVal = minVal + Math.random() * (maxVal - minVal);
  return typeof floatVal === 'undefined'
          ? Math.round(randVal)
          : randVal.toFixed(floatVal);
}