var dns = require('dns');
var retry = require('../lib/retry');

function faultTolerantResolve(address, cb) {
  var opts = {
    retries: 5,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: 2 * 1000,
    randomize: true
  };
  var operation = retry.operation(opts);

  operation.attempt(function(currentAttempt) {
    dns.resolve(address, function(err, addresses) {
      if(err && err.code === 'ENOTFOUND' && currentAttempt === 2) {
        operation.stop();
        return cb(operation.mainError(), operation.errors(), addresses)
      }

      if (operation.retry(err)) {
        return;
      }

      cb(operation.mainError(), operation.errors(), addresses);
    });
  });
}

faultTolerantResolve('nodejs0.org', function(err, errors, addresses) {
  console.warn('err:');
  console.log(err);

  console.warn('addresses:');
  console.log(addresses);
});
