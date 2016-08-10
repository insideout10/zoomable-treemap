'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js');

var LayoutHelper = function(layoutSize, config){
    
    // TODO: defaults
    this.config = config;
    
    this.layout = d3.treemap()
        .size( layoutSize )
        //.tile(d3.treemapSlice)
        .tile(d3.treemapBinary)
        //.tile(d3.treemapSquarify)
        .padding(5);
        // TODO: configuration
};

// Adjust layout if a minimal tile size is required
LayoutHelper.prototype.getAdjustedLayout = function(node){
    
    // No adjustments required
    if(!this.config.minWidth || !this.config.minHeight){
        return this.layout(node.copy());   // copy node and descendants, so the laytout does not mess with original data (no side effects)
    }
    
    var shrinkedNode, shrinkedNodeLayout;
    var numberOfTilesToBeAggregated = 2;
    do {
        shrinkedNode       = node.copy();   // copy node and descendants, so the laytout does not mess with original data (no side effects)
        shrinkedNodeLayout = this.layout(shrinkedNode);
        
        // Check if there are tiles too small
        var tinyTiles = this.getTilesNotRespectingMinimalSize(shrinkedNodeLayout);
        
        if(tinyTiles.length > 0){
            // Adjust tiles
            shrinkedNode = this.aggregateNSmallestNodes(node, tinyTiles, numberOfTilesToBeAggregated);
            numberOfTilesToBeAggregated++;
        } else {
            return shrinkedNodeLayout;
        }
        
    } while( tinyTiles.length > 0 && numberOfTilesToBeAggregated < node.children.length );

    return shrinkedNodeLayout;
    
};

// Check if all tiles respect the minimal desired size
LayoutHelper.prototype.getTilesNotRespectingMinimalSize = function(node){
    
    var minimalWidth  = this.config.minWidth;
    var minimalHeight = this.config.minHeight;
    var nodesWhichAreTooSmall = [];
    
    for(var i=0; i<node.children.length; i++){
        var tile = node.children[i];
        var tileWidth  = tile.x1 - tile.x0;
        var tileHeight = tile.y1 - tile.y0;
        if( tileWidth < minimalWidth || tileHeight < minimalHeight ){
            nodesWhichAreTooSmall.push(tile);
        }
    }
    return nodesWhichAreTooSmall;
}

// Fuse the two smallest tiles which are smaller than the required size
LayoutHelper.prototype.aggregateNSmallestNodes = function(node, tinyTiles, numberOfTilesToBeAggregated){

    console.log('AGGREGATING', node, tinyTiles, numberOfTilesToBeAggregated);
    return node;
};

// Aggregate the two smallest tiles to respect minimal tile size
LayoutHelper.prototype.aggregateTwoSmallestTiles = function(){
    
    
    
}

module.exports = LayoutHelper;

