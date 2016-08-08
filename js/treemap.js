
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
            //treemapObj.updateTreemap(treemapObj.data);
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
    var breadcumbsHeight = 50;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-breadcumbs')
        .style('width', '100%')
        .style('height', breadcumbsHeight + 'px');

    // Add tiles container
    var tilesContainerHeight = treemapObj.config.height - breadcumbsHeight;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-tiles-container')
        .style('width', '100%')
        .style('height', tilesContainerHeight + 'px');
};
    
Treemap.prototype.updateTreemap = function(node){
        
    treemap.layout = d3.treemap()
        .size( [treemap.width, treemap.height] );

    layoutNode = treemap.layout(node);
    console.log(layoutNode);

    treemap.selection.selectAll('.node').remove();
    treemap.selection.selectAll('.node')
        .data(layoutNode.children)
        .enter()
        .append('div')
        .attr('class', 'node')
        .html(function(d){
            return d.data.name;
        })
        .on('click', function(d){
            if(d.children){
                updateTreemap(d);
            } else {
                alert('leaf');
            }
        });
};
    
module.exports = Treemap;


