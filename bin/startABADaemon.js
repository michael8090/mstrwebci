/**
 * Created by yohuang on 11/10/2014.
 */
var CI = require('../src/main'),
    schedule = require('node-schedule'),
    config = require('../src/taskConfig');
var rule = new schedule.RecurrenceRule();
rule.hour = 15;

schedule.scheduleJob(rule, function(){
    process.chdir(config.clearcaseViewPath);
    console.log('running the aba test as scheduled...');
    CI.updateView()
        .then(CI.getModifiedFiles)
        .then(CI.build)
        .then(CI.validate)
        .then(function () {
            console.log('passed.');
        })
        .fail(function () {
            console.log('failed');
        });
});