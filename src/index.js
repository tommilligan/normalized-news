var axios = require('axios');
var Promise = require('bluebird');
var ner = require('ner');
var cheerio = require('cheerio');
var Gender = require('gender-neutral');

require('dotenv-safe').load();

var gn = new Gender();

// External services

var connectionDefaults = {
    port: process.env.NORMNEWS_NER_SERVICE_PORT,
    host: process.env.NORMNEWS_NER_SERVICE_HOST
};

var extractEntities = (inputText, connection = connectionDefaults) => {
    return new Promise((resolve, reject) => {
        ner.get(connection, inputText, (ex, results) => {
            if (ex) {
                ex.message = 'Could not reach NER service; ' + ex.message;
                reject(ex);
            } else {
                resolve(results.entities);
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
            .catch(ex => {
                ex.message = 'Could not get article; ' + ex.message;
                reject(ex);
            });
    });
};

// Text manipulation functions

/**
 * Replace named identities in the input text
 * 
 * @param {string} inputText 
 * @param {object} entities object of the form {PERSON: ['Foo Bar'], ORGANISATION: [], LOCATION: ['Vulcan']}
 */
var anonymize = (inputText, entities) => {
    var toReplace = ['PERSON', 'LOCATION', 'ORGANIZATION'];
    return new Promise((resolve) => {
        var normalizedText = (' ' + inputText).slice(1);
        toReplace.map(namedEntityType => {
            var foundEntities = entities[namedEntityType];
            if (foundEntities) {
                foundEntities.map(foundEntity => {
                    normalizedText = normalizedText.replace(new RegExp(foundEntity), namedEntityType);
                });
            }
        });
        resolve(normalizedText);
    });
};

var normalize = (inputText) => {
    return extractEntities(inputText)
        .then(entities => {
            return anonymize(inputText, entities);
        })
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

export {normalize, anonymize, normalizeNews, article, extractEntities};
