var oop = require('../oop');
var Expectation = require('../expectation');

function CalleeExpectation(properties) {
  this._fakeFunction = null;

  Expectation.call(this, properties);
}
oop.inherits(CalleeExpectation, Expectation);
module.exports = CalleeExpectation;

CalleeExpectation.create = function(trace, fakeFunction) {
  return new CalleeExpectation({
    _trace: trace,
    _fakeFunction: fakeFunction,
  });
};

CalleeExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var expected = this._fakeFunction;
  var got = fakeCall;

  if (expected !== got.getFakeFunction()) {
    return {
      reason: 'Expected a different call',
      expected: expectedCall.getSignature(),
      got: got.getSignature()
    };
  }
};

CalleeExpectation.prototype.getFunctionName = function() {
  return this._fakeFunction.getName();
};

CalleeExpectation.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

// This expectation is fulfilled by default, so it doesn't keep a
// times(0, n) expectation from being recognized as fulfilled.
CalleeExpectation.prototype.isFulfilled = function() {
  return true;
};
