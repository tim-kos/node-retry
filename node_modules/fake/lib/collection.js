var util = require('util');

function Collection(properties) {
  this._items = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Collection;

Collection.toFn = function(args) {
  args = Array.prototype.slice.call(args);
  var filter = args.shift();

  if (typeof filter === 'function') {
    return filter;
  }

  return function(item) {
    if (!filter) {
      return !!item;
    }

    if (!(filter in item)) {
      throw new Error('Item has no property or method named: ' + filter);
    }

    var subArgs = Array.prototype.slice.call(arguments, 1)
    subArgs = args.concat(subArgs);

    var val = item[filter];
    if (typeof val === 'function') {
      return val.apply(item, subArgs);
    }

    return val;
  };
};

Collection.prototype.__defineGetter__('length', function() {
  return this._items.length;
});

Collection.prototype.getItems = function() {
  return this._items;
};

Collection.prototype.add = function(item) {
  this._items.push(item);
};

Collection.prototype.concat = function(collection) {
  var combined = new Collection();
  combined._items = this._items.concat(collection.getItems());
  return combined;
};

Collection.prototype.remove = function(item) {
  var index = this._items.indexOf(item);
  if (index === -1) {
    return;
  }

  this._items.splice(index, 1);
  return item;
};

Collection.prototype.each = function(fn) {
  method = Collection.toFn(arguments);

  this._items.forEach(method);

  return this;
};

Collection.prototype.has = function(item) {
  return this._items.indexOf(item) > -1;
};

Collection.prototype.filter = function(method /*, args */  ) {
  method = Collection.toFn(arguments);

  var results = new Collection();
  this._items.forEach(function(item) {
    if (method(item)) {
      results.add(item);
    }
  });

  return results;
};

Collection.prototype.where = function(method /*, args */  ) {
  var args = Array.prototype.slice.call(arguments);
  var val = args.pop();

  method = Collection.toFn(arguments);

  var results = new Collection();
  this._items.forEach(function(item) {
    if (method(item) === val) {
      results.add(item);
    }
  });

  return results;
};

Collection.prototype.not = function(method /*, args */  ) {
  method = Collection.toFn(arguments);

  var not = function(item) {
    return !method(item);
  };

  return this.filter(not);
};

Collection.prototype.sum = function(method) {
  method = Collection.toFn(arguments);

  var sum = 0;
  this._items.forEach(function(item) {
    sum += method(item);
  });

  return sum;
};

Collection.prototype.first = function(method /*, args */  ) {
  if (arguments.length === 0) {
    return this._items[0];
  }

  method = Collection.toFn(arguments);
  return this.filter(method).first();
};

Collection.prototype.last = function(method /*, args */  ) {
  if (arguments.length === 0) {
    return this._items[this._items.length - 1];
  }

  method = Collection.toFn(arguments);
  return this.filter(method).last();
};

Collection.prototype.map = function() {
  method = Collection.toFn(arguments);

  var results = new Collection();
  this._items.forEach(function(item) {
    results.add(method(item));
  });

  return results;
};

Collection.prototype.copy = function() {
  var copy = new Collection();
  copy._items = [].concat(this._items);
  return copy;
};

Collection.prototype.sortAsc = function() {
  method = Collection.toFn(arguments);

  var results = new Collection();
  results = this.copy();
  results._items.sort(function(a, b) {
    var valA = method(a);
    var valB = method(b);

    if (valA === valB) {
      return 0;
    }

    return (valA > valB)
      ? 1
      : -1;
  });

  return results;
};

Collection.prototype.sortDesc = function() {
  return this
    .sortAsc.apply(this, arguments)
    .reverse();
};

Collection.prototype.reverse = function() {
  this._items.reverse();
  return this;
};

Collection.prototype.isEmpty = function() {
  return this._items.length === 0;
};

Collection.prototype.inspect = function() {
  return '<Collection with ' + this.length + ' items: ' + util.inspect(this._items) + '>';
};

Collection.prototype.every = function() {
  method = Collection.toFn(arguments);

  for (var i = 0; i < this._items.length; i++) {
    var item = this._items[i];
    if (!method(item)) {
      return false;
    }
  }

  return true;
};

Collection.prototype.some = function() {
  method = Collection.toFn(arguments);

  for (var i = 0; i < this._items.length; i++) {
    var item = this._items[i];
    if (method(item)) {
      return true;
    }
  }

  return false;
};
