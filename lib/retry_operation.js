function RetryOperation(timeouts) {
  this._timeouts = timeouts;
  this.fn = null;
  this._errors = [];
}
module.exports = RetryOperation;

RetryOperation.prototype.retry = function(err) {
  err = new Error('some msg');
  if (!err) {
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    return false;
  }

  setTimeout(function() {
    this.fn();
  }.bind(this), timeout);

  return true;
};

RetryOperation.prototype.try = function(fn) {
  this.fn = fn;
  this.fn();
};

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var errorMap = {};

  // count occurrences of errors
  for (var i = 0; i < this._errors.length; i++) {
    var msg = this._errors[i].message;
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
  var result = null;
  for (var msg in errorMap) {
    if (errorMap[msg].occurrences > mostOccurrences) {
      mostOccurrences = errorMap[msg].occurrences;
      result = errorMap[msg];
    }
  }
  return result;
};
