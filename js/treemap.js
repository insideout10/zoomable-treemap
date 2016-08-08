
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
    treemapObj.navigationHeight = 50;
    var navigation = treemapObj.selection.append('div')
        .attr('id', 'treemap-navigation')
        .style('width', '100%')
        .style('height', treemapObj.navigationHeight + 'px');

    // Add breadcumbs text and buttons
    navigation.append('span')
        .attr('id', 'treemap-navigation-breadcumbs');
    navigation.append('span')
        .attr('id', 'treemap-navigation-up')
        .text(' ___up')
        .on('click', function(){
            treemapObj.upOneLevel();
        });
    navigation.append('span').text('home')
        .attr('id', 'treemap-navigation-home') 
        .text(' ___home')
        .on('click', function(){
            treemapObj.upToTopLevel();
        });

    // Add tiles container
    treemapObj.tilesContainerHeight = treemapObj.config.height - treemapObj.navigationHeight;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-tiles-container')
        .style('width', '100%')
        .style('height', treemapObj.tilesContainerHeight + 'px')
        .style('position', 'relative');
};


Treemap.prototype.updateTreemap = function(node){
    
    // Reference to current obj
    var treemapObj = this;
    
    // Store the node being displayed
    treemapObj.currentNode = node;
        
    var layoutSize = [treemapObj.config.width, treemapObj.tilesContainerHeight];
    treemapObj.layout = d3.treemap()
        .size( layoutSize );

    var nodeCopy = node.copy();
    layoutNode = treemapObj.layout(nodeCopy);
    console.log(layoutNode);

    treemapObj.selection.selectAll('.node').remove();
    treemapObj.selection.select('#treemap-tiles-container').selectAll('.node')
        .data(layoutNode.children)
        .enter()
        .append('div')
        .attr('class', 'node')
        .style('position', 'absolute')
        .style('top', function(d){
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

Treemap.prototype.upOneLevel = function(){
    
    // display parent node
    this.updateTreemap(this.currentNode.parent);
};

Treemap.prototype.upToTopLevel = function(){
    
    // display root node
    this.updateTreemap(this.data);
};

module.exports = Treemap;


