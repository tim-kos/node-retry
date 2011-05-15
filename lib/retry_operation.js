function RetryOperation(timeouts) {
  this._timeouts = timeouts;
  this._fn = null;
  this._errors = [];
}
module.exports = RetryOperation;

RetryOperation.prototype.retry = function(err) {
  if (!err) {
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    return false;
  }

  setTimeout(function() {
    this._fn();
  }.bind(this), timeout);

  return true;
};

RetryOperation.prototype.try = function(fn) {
  this._fn = fn;
  this._fn();
};

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count > mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};
