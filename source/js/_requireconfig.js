requirejs({
    'baseUrl': './js/',
    'noGlobal': true,
    'paths': {
        'jquery'     : '../../bower_components/jquery/dist/jquery',
        'jsb'        : '../../bower_components/jsb/jsb',
        'nicescroll' : '../../bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.min',
        'fabric'     : '../../bower_components/fabric.js/dist/fabric',
        'ColorPicker': '../../bower_components/tinyColorPicker/jqColorPicker.min',
        'select2'    : '../../bower_components/select2/dist/js/select2.full.min'
    },
    // shim: {
    //     'jsb': {
    //         exports: 'jsb',
    //         deps: ['jquery']
    //     },
    //     'jquery-ui': {
    //         exports: 'jquery-ui',
    //         deps: ['jquery']
    //     },
    //     'nicescroll': {
    //         exports: 'nicescroll',
    //         deps: ['jquery']
    //     },
    //     'ColorPicker': {
    //         exports: 'ColorPicker',
    //         deps: ['jquery']
    //     }
    // },
    'include': [
        'app',
        'Detect',
        'CustomScroll',
        'Custom'
    ]
});
