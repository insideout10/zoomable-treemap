# zoomable-treemap
![](./img/agid.png)

![](./img/io10.jpg)

![](./img/osi.png)

## Introduction
Zoomable Treemap is a javascript library to visualise and discover hierarchical data. Treemaps are a form of visualization where the area of each rectangle is proportional to its value. Originally developed by [Mike Bostock](http://bost.ocks.org/mike/) the [treemap](http://bost.ocks.org/mike/treemap/) uses [D3.js](http://d3js.org/).
This version extends the original library allowing to use the treemap as a navigation device for web and mobile users. This version of the treemap has been designed for the Italian Open Data catalogue - [dati.gov.it](http://www.dati.gov.it).

## Installing

To install the treemap on your website open the terminal and type the following commands:
```
cd <path to your local web server>

git clone https://github.com/insideout10/zoomable-treemap.git
```
You can now open `localhost/zoomable-treemap/` in your browser.

![](./img/screenshot.png)

## Using it on your website

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

```
<!DOCTYPE html>
<html>
    <head>
        <title>dati.gov.it - Zoomable treemap</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link href='http://fonts.googleapis.com/css?family=Titillium+Web' rel='stylesheet' type='text/css'>
        
        <link rel="stylesheet" href="treemap.css">
    </head>
    <body>
        
        <!-- Insert div for the treemap -->
        <div id="treemap-container" data-file="flare.json"></div>
        
        <!-- Insert necessary Javascript code -->
        <script src="js/d3.min.js"></script>
        <script src="js/jquery.min.js"></script>
        <script src="js/treemap.js"></script>
    </body>
</html>
```
## License

This software is released under [BSD license](http://opensource.org/licenses/BSD-3-Clause). Copyright (c) 2010-2015, Michael Bostock. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Michael Bostock may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
