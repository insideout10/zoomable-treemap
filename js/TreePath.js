'use strict';

var TreePath = function(tree){
    this.tree = tree;
    this.upToRoot();
};

TreePath.prototype.currentNode = function(){
    var lastIndex = this.path.length - 1;
    return this.path[lastIndex];
};

TreePath.prototype.downTo = function(node){
    this.path.push(node);
};

TreePath.prototype.upOneLevel = function(){
    var lastIndex = this.path.length - 1;
    if(lastIndex > 0){
        this.path = this.path.slice(0, lastIndex);
    }
};

TreePath.prototype.upToRoot = function(){
    this.path = [this.tree];
};

module.exports = TreePath;