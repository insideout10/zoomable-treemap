'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js');

var LayoutHelper = function(layoutSize, config){

    this.config = config;
    
    // Tile ratio
    if(config.minHeight && config.minWidth){
        this.config.ratio = config.minWidth / config.minHeight;
    } else {
        this.config.ratio = 1.618034;   // golden ratio
    }
    
    // Padding
    this.config.padding = config.padding || 0;
    
    this.layout = d3.treemap()
        .size( layoutSize )
        //.tile(d3.treemapSlice)    // mobile only
        //.tile(d3.treemapBinary)
        .tile(d3.treemapSquarify.ratio(this.config.ratio))
        .padding(this.config.padding);
};

// Adjust layout if a minimal tile size is required
LayoutHelper.prototype.getAdjustedLayout = function(node){
    
    // No adjustments required
    if(!this.config.minWidth || !this.config.minHeight){
        return this.layout(node.copy());   // copy node and descendants, so the laytout does not mess with original data (no side effects)
    }

    var tilesSortedBySize = node.children.slice();
    tilesSortedBySize.sort(function(a, b){
        //return layoutHelper.tileArea(a) - layoutHelper.tileArea(b);
        return a.value - b.value;
    });
    
    var numberOfTilesToBeAggregated = 1;
    do {
        
        // Aggregate n smallest tiles and try to layout the rest
        var shrinkedNode       = this.aggregateNSmallestTiles(node.copy(), tilesSortedBySize, numberOfTilesToBeAggregated); // copy node and descendants, so the laytout does not mess with original data (no side effects)
        var shrinkedNodeLayout = this.layout(shrinkedNode.copy());
        
        // Is minimal size respected?
        if(this.everyTileIsRespectingMinimalSize(shrinkedNodeLayout)){
            // ... yes, return laytou
            return shrinkedNodeLayout;
        } else {
            // ... no, we must aggregate more tiles
            numberOfTilesToBeAggregated++;
        }    
   
    } while( numberOfTilesToBeAggregated < node.children.length );

    return shrinkedNodeLayout;
    
};

// Returns true if every tile is respecting minimal size, false otherwise
LayoutHelper.prototype.everyTileIsRespectingMinimalSize = function(node){
    
    var minimalWidth  = this.config.minWidth;
    var minimalHeight = this.config.minHeight;
    
    for(var i=0; i<node.children.length; i++){
        var tile = node.children[i];
        var tileWidth  = tile.x1 - tile.x0;
        var tileHeight = tile.y1 - tile.y0;
        if( tileWidth < minimalWidth || tileHeight < minimalHeight ){
            return false;
        }
    };
    return true;
}

// Get tiles not respecting the minimal desired size
/*LayoutHelper.prototype.getTilesNotRespectingMinimalSize = function(node){
    
    var minimalWidth  = this.config.minWidth;
    var minimalHeight = this.config.minHeight;
    var nodesWhichAreTooSmall = [];
    
    node.children.forEach(function(tile){
        var tileWidth  = tile.x1 - tile.x0;
        var tileHeight = tile.y1 - tile.y0;
        if( tileWidth < minimalWidth || tileHeight < minimalHeight ){
            nodesWhichAreTooSmall.push(tile);
        }
    });
    return nodesWhichAreTooSmall;
}*/

// Fuse the two smallest tiles which are smaller than the required size
LayoutHelper.prototype.aggregateNSmallestTiles = function(node, tilesSortedBySize, numberOfTilesToBeAggregated){
    
    if(numberOfTilesToBeAggregated < 2){
        return node;
    }
    
    // keep a reference to current obj
    var layoutHelper = this;
    
    // Which tiles are to be aggregated? The n smallest
    var tilesToBeAggregated = tilesSortedBySize.slice(0, numberOfTilesToBeAggregated); 
    
    // build new tile for aggregate the smallest ones
    var newTile = {
        data     : {
            name     : 'ALTRO'
        },
        parent   : node,
        children : [],
        value    : 1,
    };
    
    var indexesOfTilesToBeAggregated = [];
    tilesToBeAggregated.forEach(function(t){
        node.children.forEach(function(c, i){
            if(c.data == t.data){
                newTile.children.push(c);
                newTile.value += c.value;
                indexesOfTilesToBeAggregated.push(i);
            }
        });
    });
    
    node.children = node.children.filter(function(c, i){
        return indexesOfTilesToBeAggregated.indexOf(i) == -1;
    });
    
    node.children.push(newTile);
    return node;
};

LayoutHelper.prototype.tileArea = function(tile){
    return (tile.x1 - tile.x0)*(tile.y1 - tile.y0);
}

module.exports = LayoutHelper;
