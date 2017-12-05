var gulp         = require('gulp');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var runSequence  = require('run-sequence');
var clean        = require('gulp-clean');

var autoprefixerOptions = {
  browsers: ['last 2 versions']
};
var processors = [
  autoprefixer(autoprefixerOptions),
];
// Source/destinations.
var input = 'sass/style.scss';
var output = 'css';
var bowerComponents = 'node_modules/@bower_components';
var drupalLibraries = '../../../libraries';
var drupalTheme = './';
var bootstrapLibrary = 'bootstrap';

gulp.task('prod', ['bower', 'assets'], function () {
  return gulp
    .src(input)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(output))
    .pipe(gulp.dest(drupalTheme + output));
});

gulp.task('dev', ['bower', 'assets'], function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output))
    .pipe(gulp.dest(drupalTheme + output));
});

gulp.task('watch', function () {
  return gulp
    .watch(input, ['dev'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('assets', function(callback) {
  runSequence(
    ['clean-images', 'clean-javascript'],
    ['images', 'javascript'],
    callback
  );
});

gulp.task('bower', function(callback) {
  runSequence(
    ['clean-drupal-css', 'clean-drupal-libraries', 'clean-drupal-bootstrap'],
    ['bootstrap', 'jquery', 'dropzone', 'imagesloaded', 'jquery-colorbox', 'masonry', 'matchHeight'],
    callback
  );
});

// Move around some files from the bower folder into proper destinations.
gulp.task('bootstrap', function() {
  return gulp.src(bowerComponents + '/bootstrap-sass/**/*.*', { base: bowerComponents + '/bootstrap-sass' })
    .pipe(gulp.dest(bootstrapLibrary))
    .pipe(gulp.dest(drupalTheme + bootstrapLibrary));
});
gulp.task('dropzone', function() {
  return gulp.src(bowerComponents + '/dropzone/**/*.*', { base: bowerComponents })
    .pipe(gulp.dest(drupalLibraries));
});
gulp.task('imagesloaded', function() {
  return gulp.src(bowerComponents + '/imagesloaded/**/*.*', { base: bowerComponents })
    .pipe(gulp.dest(drupalLibraries));
});
gulp.task('jquery-colorbox', function() {
  return gulp.src(bowerComponents + '/jquery-colorbox/**/*.*', { base: bowerComponents + '/jquery-colorbox' })
    .pipe(gulp.dest(drupalLibraries + '/colorbox'));
});
gulp.task('masonry', function() {
  return gulp.src(bowerComponents + '/masonry/**/*.*', { base: bowerComponents })
    .pipe(gulp.dest(drupalLibraries));
});
gulp.task('matchHeight', function() {
  return gulp.src(bowerComponents + '/matchHeight/**/*.*', { base: bowerComponents })
    .pipe(gulp.dest(drupalLibraries));
});
gulp.task('jquery', function() {
  return gulp.src(bowerComponents + '/jquery/**/*.*', { base: bowerComponents });
});

// Move assets.
gulp.task('images', function() {
  return gulp.src('images/**/*.*')
    .pipe(gulp.dest(drupalTheme + 'images'));
});
gulp.task('javascript', function() {
  return gulp.src('js/**/*.*')
    .pipe(gulp.dest(drupalTheme + 'js'));
});

gulp.task('clean-drupal-css', function() {
  return gulp.src(drupalTheme + output + '/style.css', {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-drupal-libraries', function() {
  return gulp.src(drupalLibraries, {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-drupal-bootstrap', function() {
  return gulp.src(drupalTheme + bootstrapLibrary, {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-images', function() {
  return gulp.src(drupalTheme + bootstrapLibrary, {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-javascript', function() {
  return gulp.src(drupalTheme + bootstrapLibrary, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('default', ['prod']);
