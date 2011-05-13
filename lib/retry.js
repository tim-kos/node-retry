var RetryOperation = require('./retry_operation');

exports.operation = function(options) {
  // @TODO Check if options is an array, if so don't pass it through the function
  var timeouts = this.timeouts(options);
console.warn('timeouts:');
console.warn(timeouts);
  var operation = new RetryOperation(timeouts);
  return operation;
};

exports.timeouts = function(options) {
  var opts = {
    // @TODO Default should be 10
    times: 3,
    // @TODO Default should be 2
    factor: 3,
    minTimeout: 1 * 1000,
    // @TODO Default should be Infinity
    maxTimeout: 60 * 1000,
    randomize: true
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  // Move into private function
  function createTimeout(num) {
    // @TODO Must be a value in between / including 1...2 !
    var random = opts.randomize ? Math.floor(Math.random() * 2 + 1) : 1;
    // @TODO better variable name would be timeout
    var result = 0;

    // @TODO Make sure that first retry is always timeout === minTimeout
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
