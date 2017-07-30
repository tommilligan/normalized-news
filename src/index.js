require('dotenv-safe').load();

import {anonymize, neutralize} from './passes';
import {article} from './services';

// End to end journeys

var normalize = (inputText) => {
    return anonymize(inputText)
        .then(anonText => {
            return neutralize(anonText);
        });
};

var normalizeNews = (url) => {
    return article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, normalizeNews};
