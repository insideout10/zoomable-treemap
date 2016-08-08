var gulp = require('gulp');

// REQUIRING GULP PLUGINS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');


gulp.task('default', function(){

});

gulp.task('watch', ['browserSync'], function(){
  gulp.watch('scss/**/*.sass', ['sass', browserSync.reload]);
  gulp.watch(['js/**/*.js'], ['browserify', browserSync.reload]);
  gulp.watch('./index.html', browserSync.reload);
});

// Browser Sync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// sass
gulp.task('sass', function(){
  del('css/style.css');
  return gulp.src('scss/style.sass')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 20 versions', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
		  }))
    .pipe(gulp.dest('css/'));
});

gulp.task('browserify', function(done) {
    // Single entry point to browserify
    del('treemapBundle.js');
    gulp.src('js/main.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(rename('treemapBundle.js'))
        .pipe(gulp.dest('./'))
        .on('end', done);   // must wait for bundle.js to be wrote before calling browserSync
});
