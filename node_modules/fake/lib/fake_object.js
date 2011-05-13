function FakeObject(properties) {
  this._name = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = FakeObject;

FakeObject.create = function(name) {
  return new FakeObject({_name: name});
};

FakeObject.prototype.getName = function() {
  return this._name;
};
