var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var pipeline = require('readable-stream').pipeline;
var merge = require('merge-stream');

function cleanup () {
    return pipeline(
        gulp.src('bundle/*', {read: false}),
        clean()
    );
}

// TODO: Add CSS bundling feature here
function build () {
    cleanup();

    var index = pipeline(
        gulp.src('index.html'),
        gulp.dest('bundle/')
    );

    var js = pipeline(
        gulp.src('js/*'),
        uglify(),
        concat('bundle.js'),
        gulp.dest('bundle')
    );

    return merge(index, js);
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