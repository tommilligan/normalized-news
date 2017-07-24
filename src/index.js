require('dotenv-safe').load();

var Promise = require('bluebird');
var Gender = require('gender-neutral');

var services = require('./services');

var gn = new Gender();

// Text manipulation functions

/**
 * Replace named identities in the input text (does not require NER service)
 * 
 * @param {string} inputText 
 * @param {object} entities - named entities to replace in text
 * @param {string[]} entities.PERSON
 * @param {string[]} entities.LOCATION
 * @param {string[]} entities.ORGANISATION
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

/**
 * Thin wrapper for gender-neutral
 * 
 * @param {string} inputText 
 */
var neutralize = (inputText) => {
    return gn.neutralize(inputText);
};


// End to end journeys

var normalize = (inputText) => {
    return services.extractEntities(inputText)
        .then(entities => {
            return anonymize(inputText, entities);
        })
        .then(normalText => {
            return neutralize(normalText);
        });
};

var normalizeNews = (url) => {
    return services.article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, neutralize, anonymize, normalizeNews};
