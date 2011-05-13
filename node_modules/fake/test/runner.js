// Experimental, might not end up using this
var exec = require('child_process').exec;

var start = +new Date;
exec('find -E '+__dirname+' -regex ".+/test-.+\.js"', function(err, stdout) {
  if (err) {
    throw err;
  }

  var tests = stdout
    .split('\n')
    .filter(function(file) {
      return !!file;
    });

  var errors = 0;

  tests.forEach(function(file) {
    var relative = file.substr(__dirname.length+1);
    console.log('node test/'+relative);
    try {
      require(file);
    } catch (e) {
      console.log('\n' + e + '\n');
      errors++;
    }
  });

  var duration = +new Date - start;

  console.log('');
  console.log(
    'Executed ' + tests.length + ' tests with ' + errors + ' errors ' +
    'in '+duration+' ms'
  );

  if (errors) {
    process.exit(1);
  }
})
