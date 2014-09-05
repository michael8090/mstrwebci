/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    require('./setupEnv');
    var path = require('path'),
        exec = require('child_process').exec,
        Q = require('q');

    var projectRoot = global.projectRoot,
        buildCmd = path.resolve(projectRoot, 'BIWebApp/build/build');

    function getHandler(deferred) {
        return function(e, stdout, stderr) {
            if (e) {
                deferred.reject(new Error(e));
            } else {
                deferred.resolve(stdout);
            }
        };
    }

    function getPromiseAfterCmd(param) {
        var deferred = Q.defer();
        exec(buildCmd + ' ' + param, getHandler(deferred));
        return deferred.promise;
    }

    exports.buildClean = function() {
        return getPromiseAfterCmd('clean');
    };
    exports.buildDeploy = function (callback) {
        return getPromiseAfterCmd('deploy');
    };
    exports.buildJsBundles = function (callback) {
        return getPromiseAfterCmd('js-bundles');
    };
    exports.buildUpdateDroid = function (callback) {
        return getPromiseAfterCmd('update-droid');
    };
})();