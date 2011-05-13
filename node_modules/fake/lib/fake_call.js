var util = require('util');

function FakeCall(properties) {
  this._context = null;
  this._args = [];
  this._fakeFunction = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = FakeCall;

FakeCall.create = function(fakeFunction, context, args) {
  args = Array.prototype.slice.call(args);

  return new FakeCall({
    _fakeFunction: fakeFunction,
    _context: context,
    _args: args,
  });
};

FakeCall.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

FakeCall.prototype.getArg = function(index) {
  return this._args[index];
};

FakeCall.prototype.getArgs = function() {
  return this._args;
};

FakeCall.prototype.getContext = function() {
  return this._context;
};

FakeCall.prototype.getName = function() {
  var name = this._fakeFunction.getName();

  if (this.isNewCall()) {
    return 'new ' + name;
  }

  return name;
};

FakeCall.prototype.getSignature = function() {
  var args = this
    .getArgs()
    .map(util.inspect)
    .join(', ');

  return this.getName() + '(' + args + ')';
};

FakeCall.prototype.isNewCall = function() {
  var Constructor = this._fakeFunction.getDelegator();
  if (!Constructor) {
    return false;
  }

  var context = this._context;

  return context instanceof Constructor;
};

FakeCall.prototype.createErrorObject = function(msg) {
  var error = new Error(msg);
  Error.captureStackTrace(error, this._fakeFunction.getDelegator());
  return error;
};
