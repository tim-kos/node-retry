var oop = require('../oop');
var Expectation = require('../expectation');

function ViaNewExpectation(properties) {
  Expectation.call(this, properties);
}
oop.inherits(ViaNewExpectation, Expectation);
module.exports = ViaNewExpectation;

ViaNewExpectation.create = function(trace) {
  return new ViaNewExpectation({
    _trace: trace,
  });
};

ViaNewExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var expected = fakeCall.getFakeFunction().getDelegator();
  var got = fakeCall.getContext();

  if (!expected) {
    return;
  }

  if (!(got instanceof expected)) {
    return {
      reason: 'Constructor was called in wrong context',
      expected: 'this instanceof ' + expected.name,
      got: 'this instanceof ' + got.constructor.name,
    };
  }
};
