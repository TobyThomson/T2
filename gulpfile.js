const { series } = require('gulp');


// TODO: Add bundling feature here
function build (cb) {
    cb();
}

// TODO: Add Cypress testing here
function test (cb) {
    cb();
}

// TODO: Add server start and firefox open here
function inspect (cb) {
    cb();
}

exports.inspect = inspect;
exports.default = series(build, test);