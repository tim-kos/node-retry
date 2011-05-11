# retry

Abstraction for exponential and custom retry strategies for failed operations.

## Tutorial

The example below will retry a potentially failing `dns.resolve` operation
10 times using an exponential backoff strategy. With the default settings, this
works out to about ~17.03 minutes of retrying the operation.

``` javascript
var dns = require('dns');
var retry = require('retry');

function faultTolerantResolve(address, cb) {
  var operation = retry.operation();

  operation.try(function() {
    dns.resolve(address, function(err, addresses) {
      if (operation.retry(err)) {
        return;
      }

      cb(operation.mainError, addresses);
    });
  });
}

faultTolerantResolve('nodejs.org', function(err, addresses) {
  console.log(err, addresses);
});
```

Of course you can also configure the factors that go into the exponential
backoff:

``` javascript
var operation = retry.operation({
  times: 15,
  factor: 3,
  minTimeout: 1 * 1000,
  maxTimeout: 60 * 1000,
  randomize: false,
});
```
