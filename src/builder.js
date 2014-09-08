/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    var path = require('path'),
        utils = require('./utils'),
        commander = require('./commander'),
        Q = require('q');

    var FE_EXT_NAMES = ['.js', '.css', '.scss'],
        BE_EXT_NAMES = ['.java'];

    var projectRoot = global.projectRoot;

    exports.build = function (files) {
        var deferred = Q.defer();
        if (!projectRoot) {
            var msg = 'Build failed. Cannot find the project root. Please make sure that this script is run under(or just above) BIWebApp.';
            console.log(msg);
            deferred.reject(msg);
            return deferred.promise;
        }
        var frontendFiles = [],
            backendFiles = [];
        files.forEach(function(f) {
            var extName = path.extname(f);
            if (FE_EXT_NAMES.indexOf(extName) !== -1) {
                frontendFiles.push(f);
            } else if (BE_EXT_NAMES.indexOf(extName) !== -1) {
                backendFiles.push(f);
            }
            console.log(f);
        });

        if (backendFiles.length) {
            console.log('building the whole project...');
            commander.buildClean()
                .then(commander.buildDeploy)
                .then(function () {
                    deferred.resolve('build completed.');
                })
                .fail(function (e) {
                    deferred.reject('build failed with exit code: ' + e.code);
                });
        } else if (frontendFiles.length) {
            console.log('building js bundles...');
            commander.buildJsBundles()
                .then(function () {
                    deferred.resolve('build completed.');
                })
                .fail(function (e) {
                    deferred.reject('build failed with exit code: ' + e.code);
                });
        }
        return deferred.promise;
    };
})();