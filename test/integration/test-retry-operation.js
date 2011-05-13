var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var retry = require(common.dir.lib + '/retry');

var operation = retry.operation();
console.log(operation.timeouts);

// timeouts = [1000, 2000, 3000];
// operation = retry.operation(timeouts);
// assert.deepEqual(timeouts, operation.timeouts);

//fake.expect(object, 'method');
//object.method();