var path = require('path');
var util = require('util');
var fs = require('fs');

var str = require('./str');
var scores = require('./expectation/scores');

function Expectation(properties) {
  this._trace = null;
  this._fulfilled = false;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Expectation;

Expectation.requireAll = function() {
  var dir = __dirname + '/expectation';

  return fs
    .readdirSync(dir)
    .filter(function(file) {
      return file.match(/_expectation\.js$/);
    })
    .map(function(file) {
      return require(dir + '/' + file);
    });
};

Expectation.prototype.canBeUsedMultipleTimes = function() {
  return false;
};

Expectation.getType = function() {
  return this.mapClassToMethod(this.name);
};

Expectation.mapClassToMethod = function(className) {
  var methodName = className;

  methodName = methodName.replace(/Expectation$/, '');
  methodName = methodName.substr(0, 1).toLowerCase() + methodName.substr(1);

  return methodName;
};

Expectation.prototype.getType = function() {
  return Expectation.mapClassToMethod(this.constructor.name);
};

Expectation.prototype.isType = function(type) {
  return this.getType() === type;
};

Expectation.prototype.score = function() {
  return scores[this.getType()] || 0;
};

Expectation.prototype.getError = function(fakeCall, expectedCall) {
  var diff = this.diff(fakeCall, expectedCall);
  if (!diff) {
    return;
  }

  var template =
    '%s expectation from line %s in "%s" not met:\n' +
    '\n' +
    'Reason: %s\n' +
    'Expected: %s\n' +
    'Got: %s\n';

  var message = str.sprintf(
    template,
    this.getType(),
    this.getOriginLine(),
    this.getOriginFile(),
    diff.reason,
    diff.expected,
    diff.got
  );

  return fakeCall.createErrorObject(message);
};

Expectation.prototype.isFulfilled = function() {
  return this._fulfilled;
};

Expectation.prototype.hasPotential = function() {
  return !this._fulfilled;
};

Expectation.prototype.fulfill = function(fakeCall) {
  this._fulfilled = true;
};

Expectation.prototype.getOriginLine = function() {
  return this._trace.first().getLineNumber();
};

Expectation.prototype.getOriginFile = function() {
  return path.basename(this.getOriginPath());
};

Expectation.prototype.getOriginPath = function() {
  return this._trace.first().getFileName();
};
