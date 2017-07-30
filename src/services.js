var axios = require('axios');
var Promise = require('bluebird');
var cheerio = require('cheerio');

import logger from './logger';

// External services
var extractEntities = (inputText) => {
    logger.debug('Connecting to nervous-efficient-rebel for entity extraction');
    return axios({
        method: 'post',
        url: `http://${process.env.NERVOUS_EFFICIENT_REBEL_HOST}:${process.env.NERVOUS_EFFICIENT_REBEL_PORT}/`,
        data: {payload: inputText},
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            var entities = response.data;
            logger.silly('Extracted entities %j', entities);
            return entities;
        })
        .catch(error => {
            logger.error('Error with nervous-efficient-rebel service');
            logger.info(error);
            throw error;
        });
};

var article = (url) => {
    logger.debug('Retrieving news article');
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
                var article = paragraphs.get().join('\n\n');
                logger.silly('Retrieved article, %d characters', article.length);
                resolve(article);
            })
            .catch(ex => {
                logger.error('Could not get news article');
                logger.info(ex);
                reject(ex);
            });
    });
};

export {article, extractEntities};
