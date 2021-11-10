var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var pipeline = require('readable-stream').pipeline;
var merge = require('merge-stream');

function cleanup (cb) {
    return pipeline(
        gulp.src('bundle/*', {read: false}),
        clean()
    );

    cb();
}

// TODO: Add bundling feature here
function build (cb) {
    cleanup(cb);

    var first = pipeline(
        gulp.src('index.html'),
        gulp.dest('bundle/')
    );

    var second = pipeline(
        gulp.src('js/*'),
        uglify(),
        concat('bundle.js'),
        gulp.dest('bundle')
    );

    return merge(second);

    cb();
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