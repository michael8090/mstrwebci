/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var exec = require('child_process').exec,
        CI = require('mstrwebci');

    console.log('in pre-commit hook.');

    exec('git diff --name-only --cached', function(e, stdout) {
        var files = stdout.split('\n');
        CI.build(files)
            .then(function () {
                console.log('start validating...');
                return CI.validate(files);
            }).then(function() {
                console.log('Test completed! You\'re ready to push the codes now.');
                //debug only, to stop the git
                setTimeout(function () {
                    process.exit(1);
                }, 100);
            });
    });
})();