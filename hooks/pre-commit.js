/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var fs = require('fs'),
        path = require('path'),
        exec = require('child_process').exec,
        builder = require('./builder');

    console.log('in pre-commit hook.');

    exec('git diff --name-only --cached', function(e, stdout) {
        builder.build(stdout.split('\n'));

        //debug only, to stop the git
        setTimeout(function() {
            process.exit(1);
        }, 100);
    });
})();