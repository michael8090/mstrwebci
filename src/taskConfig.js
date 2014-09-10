/**
 * Created by yohuang on 9/9/2014.
 */
(function () {
    //client
    var WIDGETS = exports.WIDGETS = {
        HEAT_MAP: 'heatmap',
        NETWORK: 'netviz',
        GRAPH_MATRIX: 'gm'
    };
    exports.tasks = [
        {
            name: WIDGETS.HEAT_MAP,
            path: 'mojo/js/source/heatmap/vi/VisHeatMap.js',
            buildTargets: ['js-bundles'],
            testCases: ['Baselines\\1004_Acceptance_Rendering_Heatmap.html']
        },
        {
            name: WIDGETS.NETWORK,
            path: 'mojo/js/source/netviz/VisNetwork.js',
            buildTargets: ['js-bundles'],
            testCases: ['Baselines\\1005_Acceptance_Rendering_Netviz.html']
        },
        {
            name: WIDGETS.GRAPH_MATRIX,
            path: 'mojo/js/source/gm/VisGraphMatrix.js',
            buildTargets: ['js-bundles'],
            testCases: [
                'Baselines\\1001_Acceptance_Rendering.html',
                'Baselines\\1002_Acceptance_Rendering.html',
                'Baselines\\1003_Acceptance_Rendering.html',
                'Baselines\\1007_TrendlineReferenceLine.html',
                'Baselines\\1006_CombinationDualAixs.html'
            ]
        }
    ];

    //server
    exports.server = {
        ip: 'localhost',
        port: 8090
    };
    exports.robotPath = 'D:\\abaRobot';
})();