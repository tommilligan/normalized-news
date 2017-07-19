const ner = require('ner');

var body = `John Smith walked to the McDonalds in Antarctica to buy dinner.`
if (process.argv[2]) {
	body = process.argv[2]
}

normalize = (rawText) => {
	ner.get({
		port:8080,
		host:'localhost'
	}, rawText, (err, res) => {
		if (err) {
			console.error(err)
		} else {
			console.log(rawText)
			console.log(res.entities);
			// Find and replace entities
			var normalizedText = (' ' + rawText).slice(1);
			const toReplace = ['PERSON', 'LOCATION', 'ORGANIZATION'];
			toReplace.map(namedEntityType => {
				var foundEntities = res.entities[namedEntityType];
				if (foundEntities) {
					foundEntities.map(foundEntity => {
						normalizedText = normalizedText.replace(new RegExp(foundEntity), namedEntityType);
					})
				}
			})
			console.log(normalizedText)
		}
	});
}

normalize(body);
