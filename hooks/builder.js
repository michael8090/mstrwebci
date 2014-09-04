/**
 * Created by yohuang on 9/4/2014.
 */
(function () {
    var path = require('path'),
        utils = require('./utils'),
        commander = require('./commander');

    var FE_EXT_NAMES = ['.js', '.css', '.scss'],
        BE_EXT_NAMES = ['.java'];

    var projectRoot = global.projectRoot;

    exports.build = function (files) {
        if (!projectRoot) {
            console.log('Build failed. Cannot find the project root. Please make sure that this script is run under(or just above) BIWebApp.');
            return;
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
            commander.buildClean(function() {
                commander.buildDeploy();
            });
        } else if (frontendFiles.length) {
            console.log('building js bundles...');
            commander.buildJsBundles();
        }
    };
})();