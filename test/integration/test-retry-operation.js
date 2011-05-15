var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var retry = require(common.dir.lib + '/retry');

(function testErrors() {
  var operation = retry.operation();

  var error = new Error('some error');
  var error2 = new Error('some other error');
  operation._errors.push(error);
  operation._errors.push(error2);

  assert.deepEqual(operation.errors(), [error, error2]);
})();

(function testMainError() {
  var operation = retry.operation();
  var error = new Error('some error');
  var error2 = new Error('some other error');

  operation._errors.push(error);
  operation._errors.push(error2);
  operation._errors.push(error);

  assert.strictEqual(operation.mainError(), error);
})();

(function testTry() {
  var operation = retry.operation();
  var fn = new Function();
  operation.try(fn);
  assert.strictEqual(fn, operation._fn);
})();

(function testRetry() {
  var times = 3;
  var error = new Error('some error');
  var fn2 = function(cb) {
    cb(error);
  }

  var operation = retry.operation([100, 200, 300]);
  var fn = function(outerCb) {
    operation.try(function() {
      fn2(function(err) {
        if (operation.retry(err)) {
          return;
        }

        outerCb(operation.mainError(), operation.errors());
      });
    });
  };

  fake
    .expect(operation, 'retry')
    .withArgs(error)
    .times(3);

  outerCb = function(mainError, errors) {
    console.warn(mainError);
    console.warn(errors);
  };
  fn(outerCb);
})();