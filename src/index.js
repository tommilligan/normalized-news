import logger from './logger';
import {anonymize, neutralize} from './passes';
import {article} from './services';

// End to end journeys

var normalize = (inputText) => {
    logger('Normalizing text');
    return anonymize(inputText)
        .then(anonText => {
            return neutralize(anonText);
        });
};

var normalizeNews = (url) => {
    logger('Normalizing news article');
    return article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, normalizeNews};
