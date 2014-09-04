/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    require('./setupEnv');
    var path = require('path'),
        exec = require('child_process').exec;

    var projectRoot = global.projectRoot,
        buildCmd = path.resolve(projectRoot, 'BIWebApp/build/build');

    function getHandler(callback) {
        callback = callback || function() {};
        return function(e, stdout, stderr) {
            if (e) {
                console.log(e);
            }
            console.log(stdout);
            callback(e, stdout, stderr);
        };
    }

    exports.buildClean = function(callback) {
        exec(buildCmd + ' clean', getHandler(callback));
    };
    exports.buildDeploy = function (callback) {
        exec(buildCmd + ' deploy', getHandler(callback));
    };
    exports.buildJsBundles = function (callback) {
        exec(buildCmd + ' js-bundles', getHandler(callback));
    };
    exports.buildUpdateDroid = function (callback) {
        exec(buildCmd + ' update-droid', getHandler(callback));
    };
})();