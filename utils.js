var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');

// use git rev-parse to find the .git directory
exports.findGitRoot = function (callback) {
    exec('git rev-parse --show-toplevel', function (err, stderr) {
        if (err) {
            return callback(err);
        }

        callback(null, stderr.trim());
    });
};

// traverse from this module's directory upwards until you find
// the project root, which is the first directory
// *not* named node_modules
exports.findPackageRoot = function (base) {
    base = base || __dirname;
    var dir = path.resolve(base, '..');

    if (path.basename(dir) !== 'node_modules') {
        return dir;
    }

    return exports.findPackageRoot(dir);
};

exports.forEachHookFile = function (dest, callback) {
    var sourceDir = path.join(__dirname, 'hooks'),
        destDir = dest,
        hooks = fs.readdirSync(sourceDir);
    hooks.forEach(function (h) {
        callback(path.join(destDir, h), path.join(sourceDir, h));
    });
};

exports.findPackageJson = function () {
    return path.join(exports.findPackageRoot(), 'package.json');
};

exports.findProjectRoot = function () {
    var isRoot = function (p) {
        return fs.readdirSync(p).indexOf('BIWebApp') !== -1;
    };
    var p = path.resolve('.'),
        projectRoot;
    while (!isRoot(p)) {
        var parentPath = path.resolve(p, '..');
        if (p === parentPath) {
            break;
        }
        p = parentPath;
    }
    if (isRoot(p)) {
        projectRoot = p;
    }
    return projectRoot;
};
