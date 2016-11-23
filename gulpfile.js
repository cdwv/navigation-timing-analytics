/**
 * Created by riven on 23.11.2016.
 */

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build-dist', ['build-browserify-example', 'build-uglify']);

gulp.task('build-browserify-example', function(){
    gulp.src('example/browserify_src.js')
        .pipe(browserify())
        .pipe(rename('browserify_compiled.js'))
        .pipe(gulp.dest('./example'))
});

gulp.task('build-uglify', function () {
    gulp.src('./navigation-timing-analytics.js')
        .pipe(uglify())
        .pipe(rename('navigation-timing-analytics.min.js'))
        .pipe(gulp.dest('./'))
});