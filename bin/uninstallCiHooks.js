#!/usr/bin/env node

/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var fs = require('fs'),
        path = require('path'),
        utils = require('./../src/utils');

    utils.findGitRoot(function (err, root) {
        if (err) {
            console.error('This project doesn\'t appear to be a git repository. Skipping the uninstall...');
        } else {
            var destDir = path.join(root, '.git', 'hooks');
            if (!fs.existsSync(destDir)) {
                console.log('The hooks are already empty. We\'re clean.');
                return;
            }
            utils.forEachHookFile(destDir, function(dest) {
                console.log('Removing + ' + dest + '...');
                fs.unlink(dest, function (e) {
                    if (e) {
                        console.log('Removing ' + dest + ' failed: ' + e);
                    }
                });
            });
        }
    });
})();