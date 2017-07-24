require('dotenv-safe').load();

var services = require('./services');
var passes = require('./passes');


// End to end journeys

var normalize = (inputText) => {
    return services.extractEntities(inputText)
        .then(entities => {
            return passes.anonymize(inputText, entities);
        })
        .then(normalText => {
            return passes.neutralize(normalText);
        });
};

var normalizeNews = (url) => {
    return services.article(url)
        .then(rawText => {
            return normalize(rawText);
        });
};

export {normalize, normalizeNews};
