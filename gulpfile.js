const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const runSequence  = require('run-sequence');

const pattenlab = './patternlab/source/';
const style_sass = './sass/style.scss';
const style_css = pattenlab + 'css';
const node_modules = 'node_modules';
const bootstrap = 'bootstrap';

gulp.task('prod', ['node'], function () {
  return gulp
    .src(style_sass)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(style_css));
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
    .watch('./**/*.scss', ['prod'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('node', function(callback) {
  runSequence(
    ['bootstrap', 'bootstrap-js', 'jquery', 'bootstrap-fonts', 'awesome', 'awesome-fonts'],
    callback
  );
});

gulp.task('bootstrap', function() {
  return gulp.src(node_modules + '/bootstrap-sass/assets/stylesheets/**/*.*', { base: node_modules + '/bootstrap-sass/assets/stylesheets' })
    .pipe(gulp.dest('./sass/'+ bootstrap));
});

gulp.task('bootstrap-js', function() {
  return gulp.src(node_modules + '/bootstrap-sass/assets/javascripts/bootstrap.js', { base: node_modules + '/bootstrap-sass/assets/javascripts' })
    .pipe(gulp.dest(pattenlab + 'js'));
});

gulp.task('jquery', function() {
  return gulp.src(node_modules + '/jquery/dist/jquery.js', { base: node_modules + '/jquery/dist' })
    .pipe(gulp.dest(pattenlab + 'js'));
});

gulp.task('bootstrap-fonts', function() {
  return gulp.src(node_modules + '/bootstrap-sass/assets/fonts/**/*.*', { base: node_modules + '/bootstrap-sass/assets/fonts' })
    .pipe(gulp.dest(pattenlab + 'fonts'));
});

gulp.task('awesome', function() {
  return gulp.src(node_modules + '/font-awesome/css/font-awesome.min.css', { base: node_modules + '/font-awesome/css' })
    .pipe(gulp.dest(pattenlab + 'css'));
});

gulp.task('awesome-fonts', function() {
  return gulp.src(node_modules + '/font-awesome/fonts/**/*.*', { base: node_modules + '/font-awesome/fonts' })
    .pipe(gulp.dest(pattenlab + 'fonts'));
});

gulp.task('default', ['prod']);