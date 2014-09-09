/**
 * Created by yohuang on 9/9/2014.
 */
(function () {
    var http = require('http'),
        Q = require('q'),
        getDependentTasks = require('./dependencyParser').getDependentTasks,
        httpBase = 'http://localhost:8090';
    exports.validate = function(files) {
        var promises = [],
            tasks = getDependentTasks(files);
        console.log('in validator.');
        console.log(tasks);
        tasks.forEach(function (task) {
            console.log('sending request...' + task.name);
            var deferred = Q.defer(),
                req = http.request(httpBase + '?testSuit=' + task.testSuits.join('+'), function (response) {
                    console.log('get response');
                    var statusCode = response.statusCode;
                    if (statusCode !== 200) {
                        console.log('error in http request!');
                        deferred.reject(statusCode);
                    } else {
                        deferred.resolve(statusCode);
                    }
                });
            req.on('error', function (e) {
                deferred.reject(e);
            });
            req.end();
            promises.push(deferred.promise);
        });
        return Q.all(promises);
    };
})();