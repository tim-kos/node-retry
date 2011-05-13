var oop = require('./oop');
var Collection = require('./collection');

function StackTrace(properties) {
  Collection.call(this, properties);
}
oop.inherits(StackTrace, Collection);
module.exports = StackTrace;

StackTrace.get = function(belowFn) {
  var dummyObject = {};
  Error.captureStackTrace(dummyObject, belowFn || StackTrace.get);

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;

  return new StackTrace({_items: v8StackTrace});
};
