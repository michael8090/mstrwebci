#!/usr/bin/env node

/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var fs = require('fs');
    var path = require('path');
    var utils = require('./utils');

    var projectRoot = utils.findPackageRoot();

    installHook();

    function installHook() {
        utils.findGitRoot(function (err, root) {
            if (err) {
                console.error('This project doesn\'t appear to be a git repository. To enable the pre-commit hook, run `git init` followed by `npm run precommit-hook install`.');
            } else {
                var destDir = path.join(root, '.git', 'hooks');
                if (!fs.existsSync(destDir)) {
                    console.log('Creating .git/hooks...');
                    fs.mkdirSync(destDir);
                }
                utils.forEachHookFile(destDir, function(dest, src) {
                    console.log('Creating ' + dest + '...');
                    fs.writeFileSync(dest, fs.readFileSync(src));
                    fs.chmodSync(dest, '755');
                });
            }
        });
    }
})();