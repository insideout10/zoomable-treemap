
'use strict';

// Main data structure
var treemapConfig = {
    
    // Dataset address (will be loaded via AJAX)
    datasetURL        : "complete.json",
    
    // CSS selector for the DOM element in which the treemap will be
    containerSelector : '#treemap-container',
    
    // animations' duration in msec
    animationDuration : 350,
    
    // tile options
    tiles: {
        
        // Minimal size for each tile. If tiles can be small, leave undefined.
        minWidth         : 150,
        minHeight        : 105,
        
        // Minimal height for each tile when in mobile portrait. If tiles can be small, leave undefined.
        minHeightMobile  : 80,
        
        // CSS selector for the DOM element containing the Handlebars tile template
        templateSelector : '#treemap-tile-template',
        
        // padding
        padding          : 5,
        
        // 'other' tile text label
        otherLabel       : 'Altro...'
    },
    
    // Data preparation callback. Will be called on every tile before treemap startup.
    // Here you can modify each tile's data in place.
    dataPreparationCallback : function(d){
        //d.data.myCalculation = ...;
    },
    
    // How to sort tiles
    sortCallback      : function(a, b){
        return null;                 // random
        //return b.value - a.value;  // descending
        //return a.value - b.value;  // ascending
    },
    
    // Modify aggregated tile ("other...") just after it is built
    tileAggregationCallback : function(d){
        //d.data.name  = "Another name";
        //d.data.color = "#ef2";
    },
    
    // What happens when a tile with no children is clicked
    tileClickedCallback : function(d){
        window.open(d.data.info.Url);
    },
    
    // breadcumbs options
    breadCumbs        : {
        height    : '50px',
        separator : ' | '
    },
};

// Wait for document to load
document.addEventListener( 'DOMContentLoaded', function () {
    // launch treemap with custom config
    var treemap = new Treemap(treemapConfig);
}, false );
