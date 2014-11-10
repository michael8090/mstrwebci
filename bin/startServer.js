#!/usr/bin/env node

/**
 * Created by yohuang on 9/10/2014.
 */
(function () {
    var http = require('http'),
        exec = require('child_process').exec,
        taskConfig = require('../taskConfig'),
        xml2js = require('xml2js'),
        fs = require('fs'),
        path = require('path'),
        URL = require('url'),
        cheerio = require('cheerio'),
        util = require('util');

    var robotPath = taskConfig.robotPath;
    if (!fs.existsSync(robotPath)) {
        throw ('Could not find the robot: ' + robotPath);
    }
    var robotConfigPath = path.resolve(robotPath, 'TestSuite.xml'),
        robotConfigBackupPath = robotConfigPath + '.backup',
        robotCmdPath = path.resolve(robotPath, 'run_local.bat'),
        robotOutputPath = path.resolve(robotPath, 'Output'),
        outputFilePath = path.join(robotOutputPath, 'output.html'),
        date = new Date(),
        dailyResultPath = taskConfig.dailyResultPath + '\\' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    if (!fs.existsSync(robotConfigBackupPath)) {
        fs.createReadStream(robotConfigPath).pipe(fs.createWriteStream(robotConfigBackupPath));
    }

    var robotConfig;
    xml2js.parseString(fs.readFileSync(robotConfigPath), function (err, result) {
        if (err) {
            throw err;
        }
        robotConfig = result;
    });

    var isRunningTest = false;

    var server = http.createServer(function (req, res) {
        console.log("request received from: " + req.connection.remoteAddress);
        if (isRunningTest) {
            res.writeHead(423);
            res.end('The server is busy with some other testing task.');
            console.log('Busy. Ignoring the request');
            return;
        }
        isRunningTest = true;

        var rejectAbaTest = function (msg) {
            console.log('Got an error when starting to run a test: ');
            console.log(msg);
            console.log('Rejecting the ABA test...');
            res.end('Failed: ' + JSON.stringify(msg));
        };
        res.writeHead(200, {'Content-Type': 'text/plain'});
        try {
            req.setEncoding('utf8');
//            console.log(req.url);
            var testCaseString = req.url.match(/\?testCases=(.*)/)[1] || '',
                testCases = testCaseString.trim().split('+').map(function (s) {
                    return s.replace(/\//g, '\\');//when sent from the client, \ is always transformed into /
                });
            robotConfig.WebTestSuite.WebTest = testCases.map(function (t) {
                return {
                    StandardFileName: [t]
                };
            });
            fs.writeFileSync(robotConfigPath, (new xml2js.Builder()).buildObject(robotConfig));
            console.log('Running test cases: \n' + testCases.join('\n'));
            exec(robotCmdPath, function (err) {
                isRunningTest = false;
                if (err) {
                    rejectAbaTest(err);
                    return ;
                }
                if (!fs.existsSync(outputFilePath)) {
                    rejectAbaTest('There is not output file: ' + outputFilePath);
                    return ;
                }
                if (fs.existsSync(dailyResultPath)) {
                    fs.mkdirSync(dailyResultPath);
                }
                exec('cp -fr' + robotOutputPath + ' ' + dailyResultPath, function (err, stdout, stderr) {
                    if (err) {
                        console.log('could not copy the results to the file path: ' + taskConfig.dailyResultPath);
                        console.log(stdout);
                        console.log(stderr);
                    } else {
                        console.log('copy done');
                    }
                });
                fs.readFile(outputFilePath, function (err, stdout) {
                    if (err) {
                        rejectAbaTest(err);
                        return;
                    }
                    var $ = cheerio.load(stdout),
                        result = $('#testSummary').find('div > table > tr > .detailTableContentFail'),
                        failedNumber = result.first().text();
                    if (failedNumber === undefined) {
                        rejectAbaTest('We cannot read the result from the output file: ' + outputFilePath);
                        return;
                    }
                    console.log('failedNumber: ' + failedNumber);

                    failedNumber = parseInt(failedNumber, 10);
                    if (failedNumber !== 0) {
                        rejectAbaTest('There are ' + failedNumber + ' cases failed in the requested tests.');
                        return ;
                    }
                    console.log('Tests are passed.');
                    res.end('OK');
                });
            });
            console.log('Running the tests...');
            var timer = setInterval(function () {
                if (!isRunningTest) {
                    clearInterval(timer);
                    return;
                }
                res.write('Running');
                util.print('.');
            }, 1000);
        } catch (e) {
            isRunningTest = false;
            rejectAbaTest(e);
        }
    });
    console.log('Server listening on port: ' + taskConfig.server.port);
    server.listen(taskConfig.server.port, '127.0.0.1');
})();
