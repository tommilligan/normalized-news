var axios = require('axios');
var cheerio = require('cheerio');
import * as _ from 'lodash';

import logger from './logger';


// External services
var extractEntities = (inputText) => {
    var nervousEfficientRebelUrl = process.env.NERVOUS_EFFICIENT_REBEL_URL;
    logger('Connecting to nervous-efficient-rebel at %s', nervousEfficientRebelUrl);
    // Expected to be a stanford-ner-docker instance
    // See https://github.com/lawinsider/stanford-ner-docker
    return axios({
        method: 'get',
        url: nervousEfficientRebelUrl,
        params: {
            query: inputText
        }
    })
        .then(response => {
            var entities = response.data;
            logger('Extracted entities %j', entities);
            return entities;
        })
        .catch(error => {
            logger('Error with nervous-efficient-rebel service');
            throw error;
        });
};

var article = (url) => {
    logger('Retrieving news article');
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                // scrape webpage
                var $ = cheerio.load(response.data);
                // select plaintext pieces
                var paragraphs = $('p')
                    // remove non plaintext paragraphs
                    .not('.twite__title')
                    .not('.twite__channel-text')
                    .not('.twite__copy-text')
                    .not('.twite__new-window')
                    .not('.top-stories-promo-story__summary')
                    // select text content
                    .map((i, el) => {
                        return $(el).text();
                    });
                // join plaintext together
                var article = paragraphs.get().filter(paragraph => {
                    return _.trim(paragraph) !== '';
                }).join('\n\n');
                logger('Retrieved article, %d characters', article.length);
                resolve(article);
            })
            .catch(ex => {
                logger('Could not get news article');
                logger(ex);
                reject(ex);
            });
    });
};

export {article, extractEntities};
