const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const runSequence  = require('run-sequence');

const pattenlab = './patternlab/source/';
const style_sass = pattenlab + 'sass/style.scss';
const style_css = pattenlab;
const node_modules = 'node_modules';
const bootstrapLibrary = 'bootstrap';

gulp.task('prod', ['node'], function () {
  return gulp
    .src(style_sass)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(pattenlab));
});

gulp.task('dev', ['node'], function () {
  return gulp
    .src(style_sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(style_css));
});

gulp.task('watch', function () {
  return gulp
    .watch(input, ['prod'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('node', function(callback) {
  runSequence(
    ['bootstrap'],
    callback
  );
});

gulp.task('bootstrap', function() {
  return gulp.src(node_modules + '/bootstrap-sass/assets/**/*.*', { base: node_modules + '/bootstrap-sass' })
    .pipe(gulp.dest(pattenlab + 'sass/'+ bootstrapLibrary));
});

gulp.task('default', ['prod']);
