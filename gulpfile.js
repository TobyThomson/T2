var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var pipeline = require('readable-stream').pipeline;
var merge = require('merge-stream');

function cleanup () {
    return pipeline(
        gulp.src('bundle/*', {read: false}),
        clean()
    );
}

function build () {
    cleanup();

    var index = pipeline(
        gulp.src('index.html'),
        gulp.dest('bundle/')
    );

    var js = pipeline(
        gulp.src('js/*'),
        uglify(),
        concat('bundle.min.js'),
        gulp.dest('bundle')
    );

    var css = pipeline(
        gulp.src('css/*'),
        cssmin(),
        concat('bundle.min.css'),
        gulp.dest('bundle')
    );

    return merge(index, js, css);
}

// TODO: Add Cypress testing here
function test (cb) {
    cb();
}

// TODO: Add server start and firefox open here
function inspect (cb) {
    build();
    cb();
}

exports.inspect = inspect;
exports.default = gulp.series(build, test);