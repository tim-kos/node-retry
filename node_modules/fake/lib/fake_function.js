var FakeCall = require('./fake_call');
var FakeObject = require('./fake_object');

function FakeFunction(properties) {
  this._name = null;
  this._object = null;
  this._method = null;
  this._originalHandler = null;
  this._delegate = null;
  this._delegator = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = FakeFunction;

FakeFunction.create = function(object, method, name) {
  return new FakeFunction({
    _object: object || null,
    _method: method || null,
    _name: name || null,
  });
};

FakeFunction.prototype.setDelegate = function(delegate) {
  this._delegate = delegate;

  var self = this;
  this._delegator = function fakeFunction() {
    var fakeCall = FakeCall.create(self, this, arguments);
    return delegate(fakeCall);
  };

  Object.defineProperty(this._delegator, 'toString', {
    value: function() {
      return self.getName();
    },
    enumerable: false,
  });

  if (!this._object) {
    return;
  }

  this._originalHandler = this._object[this._method];
  this._object[this._method] = this._delegator;
};

FakeFunction.prototype.getDelegator = function() {
  return this._delegator;
};

FakeFunction.prototype.isDelegator = function(delegator) {
  return this._delegator === delegator;
};

FakeFunction.prototype.restore = function() {
  if (!this._object) {
    return;
  }

  this._object[this._method] = this._originalHandler;
};

FakeFunction.prototype.getName = function() {
  if (this._name) {
    return this._name;
  }

  if (!this._object) {
    return '<anonymous>';
  }

  var name = '';
  name += this._getObjectName() + '#';
  name += this._method;

  return name;
};

FakeFunction.prototype._getObjectName = function() {
  if (this._object instanceof FakeObject || this._object instanceof FakeFunction) {
    return this._object.getName();
  }

  return this._object.constructor.name;
};
