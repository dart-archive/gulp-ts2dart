var spawn = require('gulp-spawn');
var through = require('through2');
var ts2dart = require('ts2dart');
var which = require('which');

exports = {
    transpile: function() {
      return through.obj(function (file, enc, done) {
        file.contents = new Buffer(ts2dart.translateFiles([file.path]));
        file.path = file.path.replace(/.ts$/, '.dart');
        done(null, file);
    })},

    format: function() {
        return spawn({cmd: which.sync('dartfmt')});
    }
};
