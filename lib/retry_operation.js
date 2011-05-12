function RetryOperation(timeouts) {
  this.timeouts = timeouts;
  this.fn = null;
  this.err = [];
}
module.exports = RetryOperation;

RetryOperation.prototype.retry = function(err) {
  if (!err) {
    return true;
  }

  this.err.push(err);

  var self = this;
  var timeout = this.timeouts.shift();

  if (timeout === undefined) {
    return true;
  }

  setTimeout(function() {
    self.fn();
  }, timeout);

  return false;
};

RetryOperation.prototype.try = function(fn) {
  this.fn = fn;
  this.timeouts.shift();
  this.fn();
};

RetryOperation.prototype.errors = function(fn) {
  return this.err;
};

RetryOperation.prototype.mainError = function() {
  if (this.err.length === 0) {
    return null;
  }

  var errorMap = {};

  // count occurrences of errors
  for (var i = 0; i < this.err.length; i++) {
    var msg = this.err[i].message;
    var error = {msg: msg};

    if (!(msg in errorMap)) {
      error.occurrences = 1;
    } else {
      error.occurrences = errorMap[msg].occurrences + 1;
    }
    errorMap[msg] = error;
  }

  // return the one with most occurrences
  var mostOccurrences = 0;
  var result = {};
  for (var msg in errorMap) {
    if (errorMap[msg].occurrences > mostOccurrences) {
      mostOccurrences = errorMap[msg].occurrences;
      result = errorMap[msg];
    }
  }
  return result;
};