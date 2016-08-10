'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js');

var LayoutHelper = function(layoutSize, config){
    
    // TODO: defaults
    this.config = config;
    
    this.layout = d3.treemap()
        .size( layoutSize )
        //.tile(d3.treemapSlice)
        //.tile(d3.treemapBinary)
        .tile(d3.treemapSquarify)
        .padding(5);
        // TODO: configuration
};

// Adjust layout if a minimal tile size is required
LayoutHelper.prototype.getAdjustedLayout = function(node){
    
    // No adjustments required
    if(!this.config.minWidth || !this.config.minHeight){
        return this.layout(node.copy());   // copy node and descendants, so the laytout does not mess with original data (no side effects)
    }

    var numberOfTilesToBeAggregated = 2;
    var shrinkedNode = node.copy();
    var shrinkedNodeLayout;
    var tinyTiles;
    do {
        
        // Compute layout
        shrinkedNodeLayout = this.layout(shrinkedNode.copy());   // copy node and descendants, so the laytout does not mess with original data (no side effects)
        
        shrinkedNodeLayout.children.forEach(function(c){
            console.log(c.data.name, c.x1, c);
        });
        console.log('\n');
        
        // Check if there are tiles too small
        var tinyTiles = this.getTilesNotRespectingMinimalSize(shrinkedNodeLayout);
        
        if(tinyTiles.length > 0){
            // Adjust tiles
            var shrinkedNode = this.aggregateNSmallestTiles(node.copy(), tinyTiles, numberOfTilesToBeAggregated);
            shrinkedNodeLayout = this.layout(shrinkedNode.copy());
            numberOfTilesToBeAggregated++;
        } else {
            return shrinkedNodeLayout;
        }
        
        ////////////////
        if(numberOfTilesToBeAggregated == 4)
            tinyTiles = []
        ////////////////
    } while( tinyTiles.length > 0 && numberOfTilesToBeAggregated < node.children.length );

    return shrinkedNodeLayout;
    
};

// Get tiles not respecting the minimal desired size
LayoutHelper.prototype.getTilesNotRespectingMinimalSize = function(node){
    
    /*node.children.forEach(function(c){
        console.log(c.data.name);
    });
    console.log('\n');*/
    
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
}

// Fuse the two smallest tiles which are smaller than the required size
LayoutHelper.prototype.aggregateNSmallestTiles = function(node, tinyTiles, numberOfTilesToBeAggregated){
    
    
    /*node.children.forEach(function(c){
        console.log(c.data.name);
    });*/
    
    
    // keep a reference to current obj
    var layoutHelper = this;

    // sort tinyTiles by area
    tinyTiles.sort(function(a, b){
        //return layoutHelper.tileArea(a) - layoutHelper.tileArea(b);
        return a.value - b.value;
    });
    var tilesToBeAggregated = tinyTiles.slice(0, numberOfTilesToBeAggregated);
    //console.log(tinyTiles, tilesToBeAggregated, '\n'); 
    
    var newTile = {
        data     : {
            name     : 'ALTRO'
        },
        parent   : node,
        children : [],
        value    : 0,
    };
    //console.log('AGGREGATIN', node, tilesToBeAggregated, numberOfTilesToBeAggregated);
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

