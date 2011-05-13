var ExpectedCall = require('./expected_call');
var Collection = require('./collection');
var FakeFunction = require('./fake_function');
var FakeCall = require('./fake_call');
var FakeObject = require('./fake_object');
var StackTrace = require('./stack_trace');
var util = require('util');

module.exports = Fake;

function Fake(properties) {
  this._anytime = new Collection();
  this._next = new Collection();
  this._stub = new Collection();

  this._functions = new Collection();
  this._calls = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}

Fake._instances = [];

Fake.create = function() {
  var fake = new this();
  this._instances.push(fake);
  return fake;
};

Fake._autoVerify = function() {
  this._instances.forEach(function(fake) {
    fake.verify();
  });
}
process.on('exit', Fake._autoVerify.bind(Fake));

Fake.prototype.expect = function(/* object, method, times, withArgs, andReturn */) {
  var params = this._mangleParams(arguments);
  return this._expect(this._next, params, arguments.callee);
};

Fake.prototype.expectAnytime = function(/* object, method, times, withArgs, andReturn */) {
  var params = this._mangleParams(arguments);
  return this._expect(this._anytime, params, arguments.callee);
};

Fake.prototype.stub = function(/* object, method, times, withArgs, andReturn */) {
  var params = this._mangleParams(arguments);
  return this._expect(this._stub, params, arguments.callee);
};

Fake.prototype._mangleParams = function(args) {
  args = Array.prototype.slice.call(args);
  var params = {};

  params.object = args.shift();
  if (params.object === 'new') {
    params.object = args.shift();
    params.viaNew = true;
  } else if (typeof params.object === 'function') {
    params.method = null;
  } else {
    params.method = args.shift();
  }

  if (typeof args[0] === 'number') {
    params.times = args.shift();
  } else {
    params.times = 1;
  }

  if (typeof args[0] === 'function') {
    params.andHandle = args.shift();
  }

  params.withArgs = args.shift();

  if (typeof args[0] === 'function') {
    params.andHandle = args.shift();
    return params;
  }

  params.andReturn = args.shift();

  return params;
};

Fake.prototype._expect = function(list, params, traceOrigin) {
  var fakeFunction = this.fakeFunction(params.object, params.method);

  var trace = StackTrace.get(traceOrigin);
  var expectedCall = ExpectedCall.create();

  expectedCall.callee(trace, fakeFunction);
  expectedCall.times(trace, params.times);

  if (params.viaNew) {
    expectedCall.viaNew(trace);
  }

  if (params.withArgs) {
    expectedCall.withArgs.apply(expectedCall, [trace].concat(params.withArgs));
  }

  if (params.andHandle) {
    expectedCall.andHandle(params.andHandle);
  } else if (params.andReturn) {
    expectedCall.andReturn(params.andReturn);
  }

  list.add(expectedCall);

  if (!params.object && !params.method) {
    return fakeFunction.getDelegator();
  }

  return expectedCall;
};

Fake.prototype.callback = function(name) {
  return this
    .fakeFunction(null, null, name)
    .getDelegator();
};

Fake.prototype.class = function(name) {
  return this.callback(name);
};

Fake.prototype.function = function(name) {
  return this.callback(name);
};

Fake.prototype.object = function(name) {
  return FakeObject.create(name);
};

Fake.prototype.value = function(name) {
  return FakeObject.create(name);
};

Fake.prototype.fakeFunction = function(object, method, name) {
  var fn = (object && method)
    ? object[method]
    : object;

  var fakeFunction = this._functions.first('isDelegator', fn);
  if (fakeFunction) {
    return fakeFunction;
  }

  var fakeFunctionObject = this._functions.first('isDelegator', object);
  if (fakeFunctionObject) {
    name = name || fakeFunctionObject.getName() + '#' + method;
  }

  fakeFunction = FakeFunction.create(object, method, name);
  this._functions.add(fakeFunction);

  var self = this;
  fakeFunction.setDelegate(function(fakeCall) {
    return self._handleFakeCall(fakeCall);
  });

  return fakeFunction;
};

Fake.prototype.verify = function() {
  var all = this._anytime.concat(this._next);
  var unsatisifed = all.not('isSatisfied');

  if (!unsatisifed.length) {
    return;
  }

  var fakeFunction = FakeFunction.create(this, 'verify');
  var fakeCall = FakeCall.create(fakeFunction, this, []);
  var firstError = unsatisifed.first().getError(fakeCall);

  throw firstError;
};

Fake.prototype.reset = function() {
  this._next = new Collection();
  this._anytime = new Collection();
  this._stub = new Collection();

  this._functions.each('restore');
};

Fake.prototype._handleFakeCall = function(fakeCall) {
  var expectedCall = this._next
    .filter('hasPotential')
    .first();

  if (!expectedCall) {
    expectedCall = this._next
      .filter('calleeOfFakeCall', fakeCall)
      .last();
  }

  if (!expectedCall) {
    var error = fakeCall.createErrorObject(
      'Unexpected call "' + fakeCall.getSignature() + '"' +
      ', no calls were expected.'
    );
  } else {
    var error = expectedCall.getError(fakeCall);
  }

  if (!error) {
    return expectedCall.fulfill(fakeCall);
  }

  var unorderedCall = this._getBestUnorderedCall(fakeCall);
  if (unorderedCall) {
    return unorderedCall.fulfill(fakeCall);
  }

  throw error;
};

Fake.prototype._getBestUnorderedCall = function(fakeCall) {
  var calls = this._stub.concat(this._anytime)
    .filter('hasPotential')
    .not('getError', fakeCall)
    .sortDesc('score', fakeCall);

  return calls.first();
};
