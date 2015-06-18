# zoomable-treemap
![](./img/agid.png)

![](./img/io10.jpg)

![](./img/osi.png)

Treemap script as published on the italian open data portal - [dati.gov.it](http://www.dati.gov.it). Written with [D3.js](http://d3js.org/) starting from [this version](http://bost.ocks.org/mike/treemap/) by [Mike Bostock](http://bost.ocks.org/mike/).


To install it on your computer open terminal and type commands:
```
cd <path to your local web server>

git clone https://github.com/insideout10/zoomable-treemap.git
```
You can now open `localhost/zoomable-treemap/` in your browser. The data visualized come from the classic flare.json, but you can give the treemap any JSON organized in this way:

```
json di prova
```

To insert the treemap in a page, load D3 and treemap.js in page, then build a div with attributes `id="treemap-container"` and `data-file="<json file address>"`. Below we report the `index.html` with useful comments.
