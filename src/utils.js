(function () {
    var path = require('path'),
        exec = require('child_process').exec,
        fs = require('fs');

    function findInParentPath(currentPath, isFound) {
        var p = currentPath;
        while (!isFound(p)) {
            var parentPath = path.resolve(p, '..');
            if (p === parentPath) {
                break;
            }
            p = parentPath;
        }
        if (isFound(p)) {
            return p;
        }
    }

    function findPackageRoot() {
        return findInParentPath(__dirname, function (p) {
            return fs.readdirSync(p).indexOf('package.json') !== -1;
        });
    }

    // use git rev-parse to find the .git directory
    exports.findGitRoot = function (callback) {
        exec('git rev-parse --show-toplevel', function (err, stdout) {
            if (err) {
                return callback(err);
            }
            callback(null, stdout.trim());
        });
    };

    exports.forEachHookFile = function (dest, callback) {
        var sourceDir = path.join(findPackageRoot(), 'hooks'),
            destDir = dest,
            hooks = fs.readdirSync(sourceDir);
        hooks.forEach(function (h) {
            callback(path.join(destDir, h), path.join(sourceDir, h));
        });
    };

    exports.findProjectRoot = function () {
        var projectRoot = findInParentPath(process.cwd(), function (p) {
            return fs.readdirSync(p).indexOf('BIWebApp') !== -1;
        });
        if (projectRoot) {
            return projectRoot;
        }
        throw 'Cannot find the root of the BIWebApp Project. Aborting.';
    };
})();
