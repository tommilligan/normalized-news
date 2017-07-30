var nn = require('./lib/index');
nn.normalizeNews('http://www.bbc.co.uk/news/uk-scotland-glasgow-west-40764353')
    .then(text => {
        console.log(text);
    });
