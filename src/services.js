var axios = require('axios');
var Promise = require('bluebird');
var ner = require('ner');
var cheerio = require('cheerio');

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

export {article, extractEntities};
