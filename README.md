# zoomable-treemap
![](./img/agid.png)

![](./img/io10.jpg)

![](./img/osi.png)

## Introduction
Treemap script as published on the italian open data portal - [dati.gov.it](http://www.dati.gov.it). Written with [D3.js](http://d3js.org/) starting from [this version](http://bost.ocks.org/mike/treemap/) by [Mike Bostock](http://bost.ocks.org/mike/).

## See it in your webserver

To install it on your server open terminal and type commands:
```
cd <path to your local web server>

git clone https://github.com/insideout10/zoomable-treemap.git
```
You can now open `localhost/zoomable-treemap/` in your browser.

![](./img/screenshot.png)

## Use it in your website

The data visualized come from the classic [flare.json](https://gist.github.com/mbostock/1093025#file-flare-json), but you can give the treemap any JSON organized in this way:

```
{
 "name": "flare",
 "children": [
  {
   "name": "analytics",
   "children": [
    {
     "name": "cluster",
     "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 6714}
      ...
```
You can provide a color and Url to a node in the tree with an `info` object:

```
{
   "name": "analytics",
   "info":{
    "Url": "http://...",
    "color": "#3d5"
   },
   ...

```

To insert the treemap in a HTML page, load `jquery.js`, `d3.js` and `treemap.js` code, then build a div with attributes `id="treemap-container"` and `data-file="<json file address>"`. Below we report the `index.html` you can find in this repo, with useful comments.
