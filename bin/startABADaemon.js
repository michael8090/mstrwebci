#!/usr/bin/env node
/**
 * Created by yohuang on 11/10/2014.
 */
var CI = require('../src/main'),
    schedule = require('node-schedule'),
    config = require('../taskConfig.json');
var rule = new schedule.RecurrenceRule(),
    isRunning = false;
//rule.hour = 15;

schedule.scheduleJob(rule, function(){
    if (isRunning) {
        return ;
    }
    isRunning = true;
    try {
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
                console.log('failed.');
            })
            .done(function () {
                isRunning = false;
            });
    } catch (e) {
        console.log(e);
        isRunning = false;
    }
});