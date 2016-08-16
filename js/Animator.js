'use strict';

var d3 = require('./../node_modules/d3/build/d3.min.js')

var Animator = function(config){
    
    // Store config as ana attribute
    this.config = config;
};

Animator.prototype.expandNode = function(selection, element, onEndCallback){
    
    var tile              = d3.select(element).data()[0];    // we need both the HTML element and the data associated with it
    var padding           = this.config.tiles.padding;
    var animationDuration = this.config.animationDuration;
    
    // Fade out all tiles but the clicked one
    selection.selectAll('.tile')
        .transition()
        .style('opacity', function(f){
            if(tile == f){
                return 1.0;
            } else {
                return 0.0;
            }
        })
        .duration(animationDuration);

    // Expand clicked tile to occupy all space
    d3.select(element).transition()
        .style('z-index', '100')
        .style('top', padding + 'px')
        .style('left', padding + 'px')
        .style('width', element.parentNode.clientWidth + 'px')
        .style('height', element.parentNode.clientHeight + 'px')
        .duration(animationDuration)
        .transition()
        .style('opacity', 0.0)
        .remove()
        .duration(animationDuration)
        .on('end', onEndCallback);
    
};

Animator.prototype.shrinkNode = function(){
    
};

module.exports = Animator;