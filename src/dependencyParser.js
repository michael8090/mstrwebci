/**
 * Created by yohuang on 9/9/2014.
 */
(function () {
    var fs = require('fs'),
        parseString = require('xml2js').parseString,
        path = require('path'),
        tasks = require('./../taskConfig').tasks;
    require('./setupEnv');

    var projectRoot = global.projectRoot,
        jsDepFilePath = path.resolve(projectRoot, 'BIWebApp/build/jsobjdeps.xml');
    if (!fs.existsSync(jsDepFilePath)) {
        throw (jsDepFilePath + ' is not found. Please run `build deploy` first.');
    }

    var dependencies = {};

    var cacheFilePath = path.resolve(projectRoot, 'BIWebApp/build/depCache.json');
    if (fs.existsSync(cacheFilePath) && fs.statSync(cacheFilePath).mtime >= fs.statSync(jsDepFilePath).mtime) {
        console.log('using cached dependency file: ' + path.resolve(cacheFilePath));
        dependencies = require(cacheFilePath);
    } else {
        var dependencyGraph;
        parseString(fs.readFileSync(jsDepFilePath), function (err, result) {
            if (err) {
                throw err;
            }
            dependencyGraph = result && result.dependencyAnalysis && result.dependencyAnalysis.jsFile;
        });

        var getClassName = function (c) {
                var className;
                if (c && c.declaresClass) {
                    c.declaresClass.some(function (dc) {
                        className = dc.$ && dc.$.name;
                        if (className) {
                            return true;
                        }
                    });
                }
                return className;
            },
            getDependency = function (className, output, callPath) {
                callPath = (callPath && callPath.slice()) || [className];
                var declaredClass;
                dependencyGraph.some(function(c) {
                    if (getClassName(c) === className) {
                        declaredClass = c;
                        return true;
                    }
                });
                if (!declaredClass) {
                    return ;
                }
                if (output.indexOf(declaredClass.$.path) === -1) {
                    output.push(declaredClass.$.path);
                }
                var childDeps = declaredClass.instantiatesClass || [];
                childDeps.forEach(function (c) {
                    var name = c && c.$ && c.$.name;
                    if (name) {
                        if (callPath.indexOf(name) === -1) {
                            callPath.push(name);
                            getDependency(name, output, callPath);
                        }/* else {
                         console.log('warning: get a loop in the dependency graph... ignore it: ' + name);
                         }*/
                    }
                });
            };

        tasks.forEach(function(t) {
            var name = t.name,
                fileName = t.path;
            var declaredClass;
            dependencyGraph.some(function(c) {
                if (c.$.path === fileName) {
                    declaredClass = c;
                    return true;
                }
            });
            var deps = dependencies[name] = [];
            getDependency(getClassName(declaredClass), deps);
        });

        fs.writeFile(cacheFilePath, JSON.stringify(dependencies));
    }

    exports.getDependentTasks = function (jsFiles) {
        var taskNames = [];
        var mergeTasks = function (fileName) {
            var key,
                pathContains = function (shortPath) {
                    return fileName.match(shortPath);
                };
            for (key in dependencies) {
                var deps = dependencies[key];
                if (deps.some(pathContains)) {
                    if (taskNames.indexOf(key) === -1) {
                        taskNames.push(key);
                    }
                }
            }
        };
        jsFiles.forEach(mergeTasks);
        return taskNames.map(function (name) {
            var task;
            tasks.some(function (t) {
                if (t.name === name) {
                    task = t;
                    return true;
                }
            });
            return task;
        });
    };

})();