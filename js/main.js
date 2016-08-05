jQuery = $ = require('./jquery.min');
d3 = require('./d3.min');
Handlebars = require('handlebars');
require('./treemap');

var source = $('#tile_template').html();
var tpl = Handlebars.compile(source);
var obj = {
  titolo: 'ciao titolo',
  descrittore: 'bla blas vlaaaaaaaaaa aaaaa aaa aa aa a .'
};

$('body').append( tpl(obj) );
