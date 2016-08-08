
var TreePath = require('./TreePath');
var $        = require('./../node_modules/jquery/dist/jquery.min.js');
var d3       = require('./../node_modules/d3/build/d3.min.js');
var Handlebars = require('./../node_modules/handlebars/dist/handlebars.min.js'); 

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
    
    // Use TreePath object to keep track of navigation
    treemapObj.treePath = new TreePath(treemapObj.data);
        
    // Create main <div> and resize it
    treemapObj.selection = d3.select( treemapObj.config.containerSelector )
        .style('width', treemapObj.config.width)
        .style('height', treemapObj.config.height);

    // Save width and height in pixels
    treemapObj.config.width = parseInt( treemapObj.selection.style('width'), 10 );
    treemapObj.config.height = parseInt( treemapObj.selection.style('height'), 10 );
    
    // Add breadcumbs / navigation bar
    treemapObj.navigationHeight = parseInt( treemapObj.config.breadCumbs.height.replace('px', ''), 10 );
    treemapObj.navigation = treemapObj.selection.append('div')
        .attr('id', 'treemap-navigation')
        .style('width', '100%')
        .style('height', treemapObj.navigationHeight + 'px');

    // Add breadcumbs text and buttons
    treemapObj.breadCumbs = treemapObj.navigation.append('span')
        .attr('id', 'treemap-navigation-breadcumbs')
        .style('cursor', 'pointer')
        .on('click', function(){
            treemapObj.upOneLevel();
        });;
    treemapObj.navigation.append('span')
        .attr('id', 'treemap-navigation-up')
        .text(' ___up')
        .style('cursor', 'pointer')
        .on('click', function(){
            treemapObj.upOneLevel();
        });
    treemapObj.navigation.append('span').text('home')
        .attr('id', 'treemap-navigation-home') 
        .text(' ___home')
        .style('cursor', 'pointer')
        .on('click', function(){
            treemapObj.upToRoot();
        });

    // Add tiles container
    treemapObj.tilesContainerHeight = treemapObj.config.height - treemapObj.navigationHeight;
    treemapObj.selection.append('div')
        .attr('id', 'treemap-tiles-container')
        .style('width', '100%')
        .style('height', treemapObj.tilesContainerHeight + 'px')
        .style('position', 'relative');
};

Treemap.prototype.updateTreemap = function(){
    
    // Reference to current obj
    var treemapObj = this;
    
    // Update breadCumbs
    treemapObj.updateBreadCrumbs();
        
    var layoutSize = [treemapObj.config.width, treemapObj.tilesContainerHeight];
    treemapObj.layout = d3.treemap()
        .size( layoutSize );

    var currentNode = treemapObj.treePath.currentNode()
    var nodeCopy    = currentNode.copy();
    layoutNode = treemapObj.layout(nodeCopy);

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
        .style('cursor', 'pointer')
        .html(function(d){
            var tplObj = {
                'titolo'                 : d.data.name,
                'descrittore'            : d.data.name + d.data.name,
                'numero-elementi-interni': d.value
            };
            return treemapObj.tileTpl(tplObj);
        })
        .on('click', function(d){
            if(d.children){
                treemapObj.downTo(d);
            } else {
                alert('leaf');
            }
        });
};

Treemap.prototype.updateBreadCrumbs = function(){
    
    var separator = this.config.breadCumbs.separator;
    var breadCumbsTxt = '';
    
    var ancestors = this.treePath.path;
    if(ancestors){
        ancestors.forEach(function(a){
            breadCumbsTxt = breadCumbsTxt + a.data.name + separator;
        });
    }
    
    this.breadCumbs.text(breadCumbsTxt);
};

Treemap.prototype.downTo = function(node){
    
    // update path
    this.treePath.downTo(node);
    
    // display subNode
    this.updateTreemap();
};

Treemap.prototype.upOneLevel = function(){
    
    // update path
    this.treePath.upOneLevel();
    
    // display parent node
    this.updateTreemap();
};

Treemap.prototype.upToRoot = function(){
    
    // update path
    this.treePath.upToRoot();
    
    // display root node
    this.updateTreemap();
};

module.exports = Treemap;


