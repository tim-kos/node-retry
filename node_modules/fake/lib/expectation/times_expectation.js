var oop = require('../oop');
var Expectation = require('../expectation');

function TimesExpectation(properties) {
  this._min = 0;
  this._max = 0;
  this._calls = 0;

  Expectation.call(this, properties);
}
oop.inherits(TimesExpectation, Expectation);
module.exports = TimesExpectation;

TimesExpectation.create = function(trace, min, max) {
  if (!min && min !== 0) {
    min = 1;
  }

  max = max || min;

  return new TimesExpectation({
    _trace: trace,
    _min: min,
    _max: max,
  });
};

TimesExpectation.prototype.fulfill = function(fakeCall) {
  this._calls++;
};

TimesExpectation.prototype.isFulfilled = function() {
  return (this._calls >= this._min) && (this._calls <= this._max);
};

TimesExpectation.prototype.hasPotential = function() {
  return (this._calls < this._max);
};

TimesExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var got = this._calls + 1;
  var expected = {min: this._min, max: this._max};

  if (got > expected.max) {
    var times = expected.min;
    if (expected.min !== expected.max) {
      times = expected.min + ' - ' + expected.max;
    }

    return {
      reason: 'Function was called too often',
      expected: times + ' call' + (times === 1 ? '' : 's'),
      got: got + ' call' + (got === 1 ? '' : 's'),
    };
  }
};
