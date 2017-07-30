var Promise = require('bluebird');
var Gender = require('gender-neutral');

var gn = new Gender();

// Manipulation functions to pass over text

var entitiesToReplace = ['PERSON', 'LOCATION', 'ORGANIZATION'];
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
    return new Promise((resolve) => {
        var normalizedText = (' ' + inputText).slice(1);
        entitiesToReplace.map(namedEntityType => {
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

export {neutralize, anonymize};
