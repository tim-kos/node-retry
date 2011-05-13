// @TODO refactor to use node-microtest
var common = require('../../common');
var assert = common.assert;
var fake = common.fake.create();

var OBJECT = {some: 'object'};
var METHOD = 'some method';
var TIMES = 99;
var WITH_ARGS = ['some', 'args'];
var AND_RETURN = {some: 'return value'};
var FUNCTION = function someFunction() {};

var hadError = false;

// object, method, times, withArgs, andReturn
try {
  var params = fake._mangleParams([OBJECT, METHOD, TIMES, WITH_ARGS, AND_RETURN]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.times, TIMES);
  assert.strictEqual(params.withArgs, WITH_ARGS);
  assert.strictEqual(params.andReturn, AND_RETURN);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// object, method, withArgs, andReturn
try {
  var params = fake._mangleParams([OBJECT, METHOD, WITH_ARGS, AND_RETURN]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.times, 1);
  assert.strictEqual(params.withArgs, WITH_ARGS);
  assert.strictEqual(params.andReturn, AND_RETURN);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// object, method, null, andReturn
try {
  var params = fake._mangleParams([OBJECT, METHOD, null, AND_RETURN]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.times, 1);
  assert.strictEqual(params.withArgs, null);
  assert.strictEqual(params.andReturn, AND_RETURN);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// object, method, times
try {
  var params = fake._mangleParams([OBJECT, METHOD, TIMES]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.times, TIMES);
  assert.strictEqual(params.withArgs, undefined);
  assert.strictEqual(params.andReturn, undefined);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// object, method, function
try {
  var params = fake._mangleParams([OBJECT, METHOD, FUNCTION]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.andHandle, FUNCTION);
  assert.strictEqual(params.withArgs, undefined);
  assert.strictEqual(params.andReturn, undefined);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// object, method, withArgs, function
try {
  var params = fake._mangleParams([OBJECT, METHOD, WITH_ARGS, FUNCTION]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.method, METHOD);
  assert.strictEqual(params.withArgs, WITH_ARGS);
  assert.strictEqual(params.andHandle, FUNCTION);
  assert.strictEqual(params.andReturn, undefined);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// 'new', method, times, withArgs, andReturn
try {
  var params = fake._mangleParams(['new', OBJECT, TIMES, WITH_ARGS, AND_RETURN]);

  assert.strictEqual(params.object, OBJECT);
  assert.strictEqual(params.viaNew, true);
  assert.strictEqual(params.times, TIMES);
  assert.strictEqual(params.withArgs, WITH_ARGS);
  assert.strictEqual(params.andReturn, AND_RETURN);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

// fakeFn, times, withArgs, andReturn
try {
  var params = fake._mangleParams([FUNCTION, TIMES, WITH_ARGS, AND_RETURN]);

  assert.strictEqual(params.object, FUNCTION);
  assert.strictEqual(params.method, null);
  assert.strictEqual(params.times, TIMES);
  assert.strictEqual(params.withArgs, WITH_ARGS);
  assert.strictEqual(params.andReturn, AND_RETURN);
} catch (e) {
  hadError = true;
  console.error(e.stack);
}

if (hadError) {
  process.reallyExit(1);
}
