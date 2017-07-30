import * as _ from 'lodash';

var services = require('./services');
var Gender = require('gender-neutral');

var gn = new Gender();

import logger from './logger';
import {provideCodenames} from './codenames';

// Manipulation functions to pass over text

/**
 * Replace named identities in the input text (does not require NER service)
 * 
 * @param {string} inputText 
 * @param {object} entities - named entities to replace in text
 * @param {string[]} entities.PERSON
 * @param {string[]} entities.LOCATION
 * @param {string[]} entities.ORGANISATION
 */
var anonymize = (inputText) => {
    logger.debug('Anonymizing text');
    return services.extractEntities(inputText)
        .then(entities => {
            var normalizedText = _.clone(inputText);
            var codenamePairs = provideCodenames(entities);
            codenamePairs.map(codenamePair => {
                normalizedText = normalizedText.replace(new RegExp(codenamePair.entity, 'g'), codenamePair.codename);
            });
            return normalizedText;
        });
};

/**
 * Thin wrapper for gender-neutral
 * 
 * @param {string} inputText 
 */
var neutralize = (inputText) => {
    logger.debug('Neutralizing text');
    return gn.neutralize(inputText);
};

export {neutralize, anonymize};
