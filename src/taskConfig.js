/**
 * Created by yohuang on 9/9/2014.
 */
(function () {
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
            testSuits: ['Heat Map Test Suit']
        },
        {
            name: WIDGETS.NETWORK,
            path: 'mojo/js/source/netviz/VisNetwork.js',
            buildTargets: ['js-bundles'],
            testSuits: ['Netviz Test Suit']
        },
        {
            name: WIDGETS.GRAPH_MATRIX,
            path: 'mojo/js/source/gm/VisGraphMatrix.js',
            buildTargets: ['js-bundles'],
            testSuits: ['Graph Matrix Test Suit']
        }
    ];
})();