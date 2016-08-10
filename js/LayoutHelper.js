'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js');

var LayoutHelper = function(layoutSize){
    
    this.layout = d3.treemap()
        .size( layoutSize )
        //.tile(d3.treemapSlice)
        .tile(d3.treemapBinary)
        //.tile(d3.treemapSquarify)
        .padding(5);
        // TODO: configuration
};

// Check if all tiles respect a minimal size
LayoutHelper.prototype.isMinimalTileSizeRespected = function(node, minimalWidth, minimalHeight){
    
    for(var i=0; i<node.children.length; i++){
        var tile = node.children[i];
        var tileWidth  = tile.x1 - tile.x0;
        var tileHeight = tile.y1 - tile.y0;
        if( tileWidth < minimalWidth || tileHeight < minimalHeight ){
            return false;
        }
    }
    return true;
};

// Aggregate the two smallest tiles to respect minimal tile size
LayoutHelper.prototype.aggregateTwoSmallestTiles = function(){
    
    
    
}

module.exports = LayoutHelper;

