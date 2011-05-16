# retry

Abstraction for exponential and custom retry strategies for failed operations.

## Installation

    npm install mysql

## Current Status

This module has been tested and is ready to be used.

## Tutorial

The example below will retry a potentially failing `dns.resolve` operation
`10` times using an exponential backoff strategy. With the default settings, this
means the last attempt is made after `34 minutes and 7 seconds`.

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

      cb(operation.mainError(), addresses);
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
  retries: 5,
  factor: 3,
  minTimeout: 1 * 1000,
  maxTimeout: 60 * 1000,
  randomize: true,
});
```

## API

### retry.operation([options])

Creates a new `RetryOperation` object. See the `retry.timeouts()` function
below for available `options`.

### retry.timeouts([options])

Returns an array of timeouts. All time `options` and return values are in
milliseconds. If `options` is an array, a copy of that array is returned.

`options` is a JS object that can contain any of the following keys:

* `retries`: The maximum amount of times to retry the operation. Default is `10`.
* `factor`: The exponential factor to use. Default is `2`.
* `minTimeout`: The amount of time before starting the first retry. Default is `1000`.
* `maxTimeout`: The maximum amount of time between two retries. Default is `Infinity`.
* `randomize`: Randomizes the timeouts by multiplying with a factor between `1` to `2`. Default is `false`.

The formula used to calculate the individual timeouts is:

```
var Math.min(random * minTimeout * Math.pow(factor, attempt), maxTimeout);
```

Have a look at [this article][article] for a better explanation of approach.

If you want to tune your `factor` / `times` settings to attempt the last retry
after a certain amount of time, you can use wolfram alpha. For example in order
to tune for `10` attempts in `5 minutes`, you can use this query:

[http://www.wolframalpha.com/input/?i=Sum%5Bx^k%2C+{k%2C+0%2C+9}%5D+%3D+5+*+60]()

[article]: http://dthain.blogspot.com/2009/02/exponential-backoff-in-distributed.html

### new RetryOperation(timeouts)

Creates a new `RetryOperation` where `timeouts` is an array where each value is
a timeout given in milliseconds.

#### retryOperation.errors()

Returns an array of all errors that have been passed to
`retryOperation.retry()` so far.

#### retryOperation.mainError()

A reference to the error object that occured most frequently. Errors are
compared using the `error.message` property.

If multiple error messages occured the same amount of time, the last error
object with that message is returned.

If no errors occured so far, the value is `null`.

#### retryOperation.try(fn)

Defines the function `fn` that is to be retried and executes it for the first
time right away.

#### retryOperation.retry(error)

Returns `false` when no `error` value is given, or the maximum amount of retries
has been reached.

Otherwise it returns `true`, and retries the operation after the timeout for
the current attempt number.

## License

retry is licensed under the MIT license.
