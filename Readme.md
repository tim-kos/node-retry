# retry

Abstraction for exponential and custom retry strategies for failed operations.

## Current Status

At this point I'm just writing the Readme to get a feel for the API. Once I
like it, I'll implement it.

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
backoff. See the API documentation below for all available settings.

``` javascript
var operation = retry.operation({
  time: 60 * 60 * 1000,
  factor: 3,
  minTimeout: 1 * 1000,
  maxTimeout: 60 * 1000,
  randomize: false,
});
```

## API

### retry.operation([options])

Shortcut for `new RetryOperation(options)`.

### new RetryOperation([options])

Creates a new instance of the `RetryOperation` class. All time related values
are given in milliseconds.

`options` is a JS object that can contain any of the following keys:

* `time`: The maximum amount of time for re-trying the operation. Defaults to `30 * 60 * 1000` (30 minutes).
* `times`: The maximum amount of times to retry the operation. Default is `10`.
* `factor`: The exponential factor to use. Default is calculated using the other properties. Setting `factor` and `time` together will throw an error.
* `minTimeout`: The minium amount of time between two retries. Usually only applies to the first retry. Default is `1000` (1 second).
* `maxTimeout`: The maximum amount of time between two retries. Default is `Infinity`.
* `randomize`: Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is `true`.

## retryOperation.try(fn)

Defines the function `fn` that is to be retried and executes it for the first
time right away.

## retryOperation.retry(error)

Returns `false` when no `error` value is given, or the maximum amount of retries
has been reached.

Otherwise it executes the operation again, and returns `true`. It also typecasts
the `error` value into an `Error` object as neccessary, and adds it to the
list of `retryOperation.errors`. This list is kept to determine the
`retryOperation.mainError`.
