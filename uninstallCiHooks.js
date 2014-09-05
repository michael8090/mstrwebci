#!/usr/bin/env node

/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var fs = require('fs');
    var path = require('path');
    var utils = require('./utils');

    utils.findGitRoot(function (err, root) {
        if (err) {
            console.error('This project doesn\'t appear to be a git repository. To enable the pre-commit hook, run `git init` followed by `npm run precommit-hook install`.');
        } else {
            var destDir = path.join(root, '.git', 'hooks');
            if (!fs.existsSync(destDir)) {
                console.log('The hooks are already empty. We\'re clean.');
                return;
            }
            utils.forEachHookFile(destDir, function(dest) {
                console.log('Removing .git/hooks/pre-commit...');
                fs.unlink(dest, function (e) {
                    if (e) {
                        console.log('Removing ' + dest + ' failed: ' + e);
                    }
                });
            });
        }
    });
})();