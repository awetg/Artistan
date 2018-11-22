const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');

// read .env
require('dotenv').config()

/**
 * Gulp Tasks
 */

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    // files: ['client/**/*.{html,js,scss}'],
    proxy: 'localhost:' + process.env.APP_PORT,  // local node app address
    port: 7000,  // use *different* port than above
    notify: true,
    open: false
  });
});

gulp.task('nodemon', function (cb) {
  let called = false;
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("client/styles/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("client/static/css"))
    .pipe(reload({stream:true}));
});

gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch("client/styles/*.scss", ['sass']);
  gulp.watch(['client/**/*.{html,js}'], reload);
});