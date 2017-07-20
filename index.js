var axios = require('axios');
var Promise = require("bluebird");

var ner = require('ner');
var cheerio = require('cheerio')

var extractEntities = (inputText) => {
	return new Promise((resolve, reject) => {
		ner.get({
			port:8080,
			host:'localhost'
		}, inputText, (err, res) => {
			if (err) {
				console.error("Could not reach NER service")
				reject(err);
			} else {
				resolve(res.entities);
			}
		})
	})
};

var normalize = (inputText) => {
	return extractEntities(inputText)
		.then(entities => {
			var normalizedText = (' ' + inputText).slice(1);
			var toReplace = ['PERSON', 'LOCATION', 'ORGANIZATION'];
			toReplace.map(namedEntityType => {
				var foundEntities = entities[namedEntityType];
				if (foundEntities) {
					foundEntities.map(foundEntity => {
						normalizedText = normalizedText.replace(new RegExp(foundEntity), namedEntityType);
					})
				}
			})
			return normalizedText
		});
};

var article = (url) => {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				var $ = cheerio.load(response.data)
				var paragraphs = $('p').map((i, el) => {
					return $(el).text()
				})
				var article = paragraphs.get().join('\n\n')
				resolve(article)
			})
			.catch(error => {
				reject(error)
			});
	});
};

var normalizeNews = (url) => {
	return article(url)
		.then(rawText => {
			return normalize(rawText)
		})
}

//normalize("John Smith went to Tesco to buy carrots for dinner.").then(normalizedText => console.log(normalizedText));
normalizeNews('http://www.bbc.co.uk/news/business-40658774').then(normalizedText => console.log(normalizedText));

