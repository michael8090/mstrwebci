/**
 * Created by yohuang on 9/9/2014.
 */
(function () {
    var http = require('http'),
        Q = require('q'),
        util = require('util'),
        getDependentTasks = require('./dependencyParser').getDependentTasks,
        serverConfig = require('./../taskConfig.json').server,
        httpBase = 'http://' + serverConfig.ip + ':' + serverConfig.port;
    exports.validate = function(files) {
        var tasks = getDependentTasks(files),
            testCases = [];
        console.log('sending requests for the tasks:');
        tasks.forEach(function (t) {
            console.log(t.name + ': ');
            t.testCases.forEach(function (c) {
                console.log('\t' + c);
                if (testCases.indexOf(c) === -1) {
                    testCases.push(c);
                }
            });
        });
        console.log('');

//        console.log('sending request for tests: \n' + testCases.join('\n') + '...');

        var deferred = Q.defer(),
            reqUrl = httpBase + '?testCases=' + testCases.join('+'),
            req = http.request(reqUrl, function (response) {
                var statusCode = response.statusCode,
                    status = http.STATUS_CODES[statusCode];
                if (status !== 'OK') {
                    console.log('error in http request!');
                    deferred.reject(statusCode);
                }
                console.log('Tests are running on server');
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    if (chunk === 'Running') {
                        util.print('.');
                    } else if (chunk === 'OK') {
                        console.log('\nTests are passed!');
                        deferred.resolve(chunk);
                    } else {
                        console.log('\nTest failed.');
                        deferred.reject(chunk);
                    }
                });
            });
//        console.log('Url: ' + reqUrl);
        req.on('error', function (e) {
            deferred.reject(e);
        });
        req.end();
        return deferred.promise;
    };
})();