var gulp = require('gulp');
var ts = require('gulp-typescript');
var ts2dart = require('./');

gulp.task('test', function() {
    gulp.src('test.ts')
        .pipe(ts2dart.transpile())
        .pipe(ts2dart.format())
        .pipe(gulp.dest('result'));
});
