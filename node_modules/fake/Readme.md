**Current Status:** This library is ready for experimental usage.

# Fake

Test one thing at a time, fake the rest.

## Tutorial

Set an expectation of a method call on an object:

``` javascript
var fake = require('fake').create();
var object = {};

fake.expect(object, 'method');

object.method();
```

If the last `object.method()` call is not present, an exception will be thrown.

## API

### fake.expect(object, method, [times, withArgs, andReturn | andHandle])

Set up an ordered expectation. Calling any other methods controlled by fake
before this expectation has been satisifed will throw an exception.

### fake.expectAnytime(object, method, [times, withArgs, andReturn | andHandle])

Set up an unordered expectation. This will only throw an error if this
expectation is not verified before the process exits.

### fake.stub(object, method, [times, withArgs, andReturn | andHandle])

Set up an optional expectation. This will never throw an error.

## Todo

* Report non-matching anytime expectations if they are the closest match
* Maybe rename the module to fake?
* Move stacktrace into own module
* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple fakes
* NodeModuleScene / BrowserScriptScene?
