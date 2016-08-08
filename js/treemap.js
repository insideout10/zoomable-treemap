
var $ = require('jquery');
var d3 = require('d3');
var Handlebars = require('handlebars');

var Treemap = function(config){
    
    // Reference to current obj
    var treemapObj = this;
    
    // Save config as class attribute
    treemapObj.config = config;

    // Find container element and extract dataset name
    var datasetName = $(config.containerSelector).data('file');

    // Load template
    var tileTplSource = $(config.templateSelector).html();
    treemapObj.tileTpl = Handlebars.compile(tileTplSource);

    // Load data and then draw the treemap
    d3.json(datasetName, function(error, json){
        if (error) {
            console.error(error);
        } else {
            treemapObj.data = d3.hierarchy(json);
            treemapObj.data.sum(function(d){
                return 1;
            });
            treemapObj.initTreemap();
            treemapObj.updateTreemap(treemapObj.data);
        }
    });
};

Treemap.prototype.initTreemap = function(){
    
    // Reference to current obj
    var treemapObj = this;
        
    // Create main <div> and resize it
    treemapObj.selection = d3.select( treemapObj.config.containerSelector )
        .style('width', treemapObj.config.width)
        .style('height', treemapObj.config.height);

    // Save width and height in pixels
    treemapObj.config.width = parseInt( treemapObj.selection.style('width'), 10 );
    treemapObj.config.height = parseInt( treemapObj.selection.style('height'), 10 );
    
    // Add breadcumbs / navigation bar
    treemapObj.breadcumbsHeight = 50;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-breadcumbs')
        .style('width', '100%')
        .style('height', treemapObj.breadcumbsHeight + 'px');

    // Add tiles container
    treemapObj.tilesContainerHeight = treemapObj.config.height - treemapObj.breadcumbsHeight;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-tiles-container')
        .style('width', '100%')
        .style('height', treemapObj.tilesContainerHeight + 'px')
        .style('position', 'relative');
};
    
Treemap.prototype.updateTreemap = function(node){
    
    // Reference to current obj
    var treemapObj = this;
        
    var layoutSize = [treemapObj.config.width, treemapObj.tilesContainerHeight];
    treemapObj.layout = d3.treemap()
        .size( layoutSize );

    layoutNode = treemapObj.layout(node);
    console.log(layoutNode);

    treemapObj.selection.selectAll('.node').remove();
    treemapObj.selection.select('#treemap-tiles-container').selectAll('.node')
        .data(layoutNode.children)
        .enter()
        .append('div')
        .attr('class', 'node')
        .style('position', 'absolute')
        .style('top', function(d){
            console.log(d.y0, d.x0, d.x1 - d.x0, d.y1 - d.y0);
            return d.y0 + 'px';
        })
        .style('left', function(d){
            return d.x0 + 'px';
        })
        .style('width', function(d){
            return (d.x1 - d.x0) + 'px';
        })
        .style('height', function(d){
            return (d.y1 - d.y0) + 'px';
        })
        .style('background-color', function(d, i){
            console.log(d3);
            return d3.schemeCategory20[i%20];
        })
        .html(function(d){
            return d.data.name;
        })
        .on('click', function(d){
            if(d.children){
                treemapObj.updateTreemap(d);
            } else {
                alert('leaf');
            }
        });
};
    
module.exports = Treemap;


