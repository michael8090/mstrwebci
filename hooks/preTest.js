/**
 * Created by yohuang on 9/3/2014.
 */
(function () {
    var CI = require('mstrwebci');

    CI.updateView()
        .then(CI.getModifiedFiles)
        .then(CI.build)
        .then(function (files) {
            console.log('start validating...');
            return CI.validate(files);
        })
        .then(function() {
            console.log('Test completed! You\'re ready to push the codes now.');
        })
        .fail(function(msg) {
            console.log('Validating failed. Please resolve and the problems and retry: ' + msg);
        })
        .done(function () {
            //debug only, to stop the git
            setTimeout(function () {
                process.exit(1);
            }, 100);
        });


    //exec('git diff --name-only --cached', function(e, stdout) {
    //    var files = stdout.split('\n');
    //    CI.build(files)
    //        .then(function () {
    //            console.log('start validating...');
    //            return CI.validate(files);
    //        })
    //        .then(function() {
    //            console.log('Test completed! You\'re ready to push the codes now.');
    //        })
    //        .fail(function(msg) {
    //            console.log('Validating failed. Please resolve and the problems and retry: ' + msg);
    //        })
    //        .done(function () {
    //            //debug only, to stop the git
    //            setTimeout(function () {
    //                process.exit(1);
    //            }, 100);
    //        });
    //});
})();