
'use strict';

var $ = require('jquery');
var Treemap = require('./Treemap');

// Main data structure
var treemapConfig = {
    containerSelector : '#treemap-container',
    width             : '100%',
    height            : '300px',
    templateSelector  : '#treemap-tile-template',
    breadCumbs        : {
        height    : '50px',
        separator : ' | '
    }
};

$(document).ready( function() {
    var treemap = new Treemap(treemapConfig);
});
