var oop = require('../oop');
var util = require('util');
var Expectation = require('../expectation');

function WithArgExpectation(properties) {
  this._number = null;
  this._value = null;

  Expectation.call(this, properties);
}
oop.inherits(WithArgExpectation, Expectation);
module.exports = WithArgExpectation;

WithArgExpectation.prototype.canBeUsedMultipleTimes = function() {
  return true;
};

WithArgExpectation.create = function(trace, number, value) {
  return new WithArgExpectation({
    _trace: trace,
    _number: number,
    _value: value,
  });
};

WithArgExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var expected = this._value;
  var got = fakeCall.getArg(this._number - 1);

  if (got === expected) {
    return;
  }

  return {
    reason: 'Unexpected value',
    expected: util.inspect(expected),
    got: util.inspect(got)
  };
};
