var chalk = require('chalk');
var gutil = require('gulp-util');
var spawn = require('gulp-spawn');
var through = require('through2');
var ts2dart = require('ts2dart');
var which = require('which');

exports.transpile = function() {
  var hadErrors = false;
  return through.obj(
      function(file, enc, done) {
        try {
          var transpiler = new ts2dart.Transpiler(/* failFast */ false, /* generateLibrary */ true);
          var src = transpiler.translateFile(file.path, file.relative);
          file.contents = new Buffer(src);
          file.path = file.path.replace(/.[tj]s$/, '.dart');
          done(null, file);
        } catch (e) {
          hadErrors = true;
          if (e.name === 'TS2DartError') {
            // Sort of expected, log only the message.
            gutil.log(chalk.red(e.message));
          } else {
            // Log the entire stack trace.
            gutil.log(chalk.red(e.stack));
          }
          done(null, null);
        }
      },
      function finished(done) {
        if (hadErrors) {
          gutil.log(chalk.red('ts2dart transpilation failed.'));
          throw new Error('ts2dart transpilation failed.');
        } else {
          gutil.log(chalk.green('ts2dart transpilation succeeded.'));
        }
        done();
      });
};

exports.format = function() {
  return spawn({cmd: which.sync('dartfmt')});
};
