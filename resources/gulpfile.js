var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');

// sass
gulp.task('sass', function () {
  gulp.src( 'sass/**/*.scss' )
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
        cascade: false
    }))
    .pipe(gulp.dest( '../app/webroot/css' ));
});

// watch
gulp.task('watch', () => {
    return watch(['sass/**/*.scss'], () => {
        return gulp.start(['sass']);
    });
});
