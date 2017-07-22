var nn = require('./lib/index.js');
var url = 'http://www.bbc.co.uk/news/business-40658774';
nn.normalizeNews(url)
    .then(function(ntext){
        console.log(ntext);
    });

