var axios = require('axios');
var Promise = require('bluebird');
var ner = require('ner');
var cheerio = require('cheerio');
var Gender = require('gender-neutral');

require('dotenv-safe').load();

var gn = new Gender();

// External services

var extractEntities = (inputText) => {
    return new Promise((resolve, reject) => {
        var connection = {
            port: process.env.NORMNEWS_NER_SERVICE_PORT,
            host: process.env.NORMNEWS_NER_SERVICE_HOST
        };
        ner.get(connection, inputText, (err, res) => {
            if (err) {
                console.error(`Could not reach NER service; ${connection}`);
                reject(err);
            } else {
                resolve(res.entities);
            }
        });
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

// Text manipulation functions

var anonymize = (inputText) => {
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

var normalize = (inputText) => {
    return anonymize(inputText)
        .then(normalText => {
            return gn.neutralize(normalText);
        });
};



var normalizeNews = (url) => {
    return article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, anonymize, normalizeNews};
