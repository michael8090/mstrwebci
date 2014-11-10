/**
 * Created by yohuang on 9/5/2014.
 */
(function () {
    exports.updateView = require('./commander').updateView;
    exports.getModifiedFiles = require('./commander').getModifiedFiles;
    exports.build = require('./builder').build;
    exports.validate = require('./validator').validate;
})();