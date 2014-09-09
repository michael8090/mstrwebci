/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    require('./setupEnv');
    var path = require('path'),
        exec = require('child_process').exec,
        Q = require('q');

    var projectRoot = global.projectRoot,
        buildRoot = path.resolve(projectRoot, 'BIWebApp/build'),
        buildCmd = path.resolve(buildRoot, 'build');

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

    function getPromiseAfterCmd(param) {
        var deferred = Q.defer();
        console.log('executing the command: ' + param);
        exec(buildCmd + ' ' + param, getHandler(deferred));
        return deferred.promise;
    }

    exports.buildClean = function() {
        return getPromiseAfterCmd('clean');
    };
    exports.buildDeploy = function () {
        return getPromiseAfterCmd('deploy');
    };
    exports.buildJsBundles = function () {
        return getPromiseAfterCmd('js-bundles');
    };
    exports.buildUpdateDroid = function () {
        return getPromiseAfterCmd('update-droid');
    };
})();