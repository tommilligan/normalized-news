var axios = require('axios');
var Promise = require('bluebird');

var ner = require('ner');
var cheerio = require('cheerio');

var extractEntities = (inputText) => {
    return new Promise((resolve, reject) => {
        ner.get({
            port:8080,
            host:'localhost'
        }, inputText, (err, res) => {
            if (err) {
                console.error('Could not reach NER service');
                reject(err);
            } else {
                resolve(res.entities);
            }
        });
    });
};

var normalize = (inputText) => {
    return extractEntities(inputText)
        .then(entities => {
            var normalizedText = (' ' + inputText).slice(1);
            var toReplace = ['PERSON', 'LOCATION', 'ORGANIZATION'];
            toReplace.map(namedEntityType => {
                var foundEntities = entities[namedEntityType];
                if (foundEntities) {
                    foundEntities.map(foundEntity => {
                        normalizedText = normalizedText.replace(new RegExp(foundEntity), namedEntityType);
                    });
                }
            });
            return normalizedText;
        });
};

var article = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                var $ = cheerio.load(response.data);
                var paragraphs = $('p').map((i, el) => {
                    return $(el).text();
                });
                var article = paragraphs.get().slice(11).join('\n\n');
                resolve(article);
            })
            .catch(error => {
                reject(error);
            });
    });
};

var normalizeNews = (url) => {
    return article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, normalizeNews};
