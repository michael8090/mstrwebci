/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    require('./setupEnv');
    var path = require('path'),
        exec = require('child_process').exec,
        fs = require('fs'),
        Q = require('q');

    var projectRoot = global.projectRoot,
        buildRoot = path.resolve(projectRoot, 'BIWebApp/build'),
        buildCmd = path.resolve(buildRoot, 'build'),
        updateCmd = 'cleartool update ' + projectRoot;

    var walk = function (dir, done, filter) {
        var results = [];
        if (dir.match(/.git/)) {
            done(null, results);
        }
        fs.readdir(dir, function (err, list) {
            if (err) {
                return done(err);
            }
            var pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach(function (file) {
                file = dir + '/' + file;
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        }, filter);
                    } else {
                        if (filter(file, stat)) {
                            results.push(file);
                        }
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    };

    function getHandler(deferred) {
        return function(e, stdout/*, stderr*/) {
            console.log(stdout);

            if (e) {
                console.log(e);
                deferred.reject(e);
            } else {
                deferred.resolve(stdout);
            }
        };
    }

    function getPromiseAfterCmd(cmd) {
        var deferred = Q.defer();
        console.log('executing the command: ' + cmd);
        exec(cmd, {maxBuffer: 1024 * 1024 * 16}, getHandler(deferred));
        return deferred.promise;
    }

    exports.getModifiedFiles = function() {
        var startTime = global.lastCheckTime || -1;
        global.lastCheckTime = new Date();
        //TODO: read the updated files from the log file "*.updt" under the project root
        //we just read the file states to do it for now
        var deferred = Q.defer();
        walk(projectRoot, function (err, files) {
            if (err) {
                deferred.reject(err);
            } else {
                exports.getGitDiffFiles().then(function(gfs) {
                    files = files.concat(gfs);
                });
                deferred.resolve(files);
            }
        }, function (file, stat) {
            return stat.mtime > startTime;
        });
        return deferred.promise;
    };

    exports.getGitDiffFiles = function () {
        var deferred = Q.defer();
        exec('git diff --name-only --cached', function(e, stdout) {
            if (e) {
                deferred.reject(e);
            } else {
                deferred.resolve(stdout.split('\n'));
            }
        });
        return deferred.promise;
    };

    exports.updateView = function() {
        var deferred = Q.defer();
        console.log('executing the command: ' + updateCmd);
        exec(updateCmd, {maxBuffer: 1024 * 1024 * 16}, function(e, stdout/*, stderr*/) {
            console.log(stdout);

            if (e) {
                console.log(e);
                deferred.resolve(e);//always resolve the promise, ignore the errors inside it
            } else {
                deferred.resolve(stdout);
            }
        });
        return deferred.promise;
    };

    exports.buildClean = function() {
        return getPromiseAfterCmd(buildCmd + ' clean');
    };
    exports.buildDeploy = function () {
        return getPromiseAfterCmd(buildCmd + ' deploy');
    };
    exports.buildJsBundles = function () {
        return getPromiseAfterCmd(buildCmd + ' js-bundles');
    };
    exports.buildUpdateDroid = function () {
        return getPromiseAfterCmd(buildCmd + ' update-droid');
    };
})();