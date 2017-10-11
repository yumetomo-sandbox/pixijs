var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var webserver = require('gulp-webserver');

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

gulp.task('webserver', function () {
    gulp.src('./../app/views/pages/') // 公開したい静的ファイルを配置したディレクトリを指定する
        .pipe(webserver({
            host: 'localhost',
            port: 9000,
            livereload: true
        }));
});
