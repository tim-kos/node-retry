var util = require('util');
var oop = exports;

// Enhanced version of util.inherits that also inherits class methods
oop.inherits = function(childClass, parentClass) {
  util.inherits(childClass, parentClass);
  for (var key in parentClass) {
    childClass[key] = parentClass[key];
  }
};
