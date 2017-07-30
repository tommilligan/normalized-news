var axios = require('axios');
var Promise = require('bluebird');
var cheerio = require('cheerio');

// External services
var extractEntities = (inputText) => {
    return axios({
        method: 'post',
        url: `http://${process.env.NERVOUS_EFFICIENT_REBEL_HOST}:${process.env.NERVOUS_EFFICIENT_REBEL_PORT}/`,
        data: {payload: inputText},
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
};

var article = (url) => {
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
                    // select text content
                    .map((i, el) => {
                        return $(el).text();
                    });
                // join plaintext together
                var article = paragraphs.get().join('\n\n');
                resolve(article);
            })
            .catch(ex => {
                ex.message = 'Could not get article; ' + ex.message;
                reject(ex);
            });
    });
};

export {article, extractEntities};
