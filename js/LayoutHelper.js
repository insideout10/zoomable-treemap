'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js');

var LayoutHelper = function(layoutSize, isMobilePortrait, config){

    this.config = config;
    
    // Padding
    this.config.padding = config.padding || 0;
    
    // Flattening factor. Regulates how much tiles are forced to be of the same dimensions
    this.config.flatteningFactor = config.flatteningFactor || 10;
    
    // Store if we are in vertical/mobile layout or not
    this.isMobilePortrait = isMobilePortrait;
    
    // Use different tiling methods for mobile portrait vs. all the rest
    var tilingAlgorithm;
    if(isMobilePortrait){
        // just cut treemap vertically
        tilingAlgorithm = d3.treemapSlice;
    } else {
        // Tile ratio
        var ratio = 1.618034;   // golden ratio by default
        if(config.minHeight && config.minWidth){
            ratio = config.minWidth / config.minHeight; // overwrite if necessary
        }
        tilingAlgorithm = d3.treemapSquarify.ratio(ratio);
    }
    
    // Prepare layout generator
    this.layout = d3.treemap()
        .size( layoutSize )
        .tile(tilingAlgorithm)
        .padding(this.config.padding);
};

// Adjust layout if a minimal tile size is required
LayoutHelper.prototype.getAdjustedLayout = function(node){
    
    // No adjustments required
    if(!this.config.minWidth || !this.config.minHeight || !this.config.minHeightMobile){
        return this.layout(node.copy());   // copy node and descendants, so the laytout does not mess with original data (no side effects)
    }

    var tilesSortedBySize = node.children.slice();
    tilesSortedBySize.sort(function(a, b){
        return a.value - b.value;
    });
    
    var numberOfTilesToBeAggregated = 1;
    do {
        
        // Aggregate n smallest tiles
        var shrinkedNode = this.aggregateNSmallestTiles(node.copy(), tilesSortedBySize, numberOfTilesToBeAggregated);
        
        // Recompute layout (tiles coordinates and size on screen)
        var shrinkedNodeLayout = this.layout(shrinkedNode.copy());
        
        // Is minimal tile size respected?
        if(this.everyTileIsRespectingMinimalSize(shrinkedNodeLayout)){
            // ... yes, return layout
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
    if(this.isMobilePortrait && this.config.minHeightMobile){
        minimalHeight = this.config.minHeightMobile;
    }
    
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

// Fuse the two smallest tiles which are smaller than the required size
LayoutHelper.prototype.aggregateNSmallestTiles = function(node, tilesSortedBySize, numberOfTilesToBeAggregated){
    
    // keep a reference to current obj
    var layoutHelper = this;
    
    // which tiles are to be aggregated? The n smallest
    var tilesToBeAggregated = tilesSortedBySize.slice(0, numberOfTilesToBeAggregated);
    
    // build new tile for aggregate the smallest ones
    var newTile = {
        data     : {
            name     : layoutHelper.config.otherLabel
        },
        parent   : node,
        children : [],
        value    : 0
    };
    
    // compress smallest tiles into one
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
    
    // Keep only non-aggregated tiles
    node.children = node.children.filter(function(c, i){
        return indexesOfTilesToBeAggregated.indexOf(i) == -1;
    });
    
    // The "other..." tile is forced to be of average value. The other tiles adapt.
    var valueAverage = node.value / (node.children.length + 1);
    var newNodeValue = node.value + valueAverage;
    var remainingSpace = newNodeValue - valueAverage;
    newTile.value    = valueAverage;
    
    // Add "other..." tile
    node.children.push(newTile);
    node.value = 0;
    node.children.forEach(function(c){
        var flatteningFactor = layoutHelper.config.flatteningFactor;
        var roundingMean = valueAverage*flatteningFactor;
        c.value = (c.value + roundingMean)/(flatteningFactor+1);
        node.value += c.value;
    });
    
    return node;
};

LayoutHelper.prototype.tileArea = function(tile){
    return (tile.x1 - tile.x0)*(tile.y1 - tile.y0);
}

// Make tiles more similar to each other in term of size. Necessary to avoid too much tile aggregation
/*LayoutHelper.prototype.flattenTilesValues = function(tile){
    
    // Read values from children
    var tileValues = [];
    var tileValuesSum = 0;
    tile.children.forEach(function(d){
        tileValues.push(d.value);
        tileValuesSum += d.value;
    });
    
    // Recompute all values to smoothen their differences
    var tileValuesAverage = (tileValuesSum*1.0) / tileValues.length;
    var flatteningFactor  = this.config.flatteningFactor;
    tile.value = 0;
    tile.children.forEach(function(d){
        var roundingMean = tileValuesAverage*flatteningFactor;
        d.value = (d.value + roundingMean)/(flatteningFactor+1);
        tile.value += d.value;
    });
    
    return tile;
};*/

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

module.exports = LayoutHelper;

