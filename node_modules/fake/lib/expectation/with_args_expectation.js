var oop = require('../oop');
var util = require('util');
var Expectation = require('../expectation');

function WithArgsExpectation(properties) {
  this._args = null;

  Expectation.call(this, properties);
}
oop.inherits(WithArgsExpectation, Expectation);
module.exports = WithArgsExpectation;

WithArgsExpectation.create = function(trace) {
  var args = Array.prototype.slice.call(arguments, 1);

  return new WithArgsExpectation({
    _trace: trace,
    _args: args,
  });
};

WithArgsExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var expected = this._args;
  var got = fakeCall.getArgs();

  if (expected.length !== got.length) {
    return {
      reason: 'Unexpected argument count',
      expected: expected.length + ' argument' + (expected.length === 1 ? '' : 's'),
      got: got.length + ' argument' + (got.length === 1 ? '' : 's'),
    };
  }

  for (var i = 0; i < expected.length; i++) {
    if (expected[i] !== got[i]) {
      return {
        reason: 'Unexpected argument #' + (i + 1),
        expected: util.inspect(expected[i]),
        got: util.inspect(got[i]),
      };
    }
  }
};

WithArgsExpectation.prototype.inspect = function() {
  return args = this._args
    .map(util.inspect)
    .join(', ');
};
