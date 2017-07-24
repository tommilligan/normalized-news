var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {extractEntities, article} from '../src/services';
import {normalizeNews} from '../src/index';

var invalidHostname = 'not.a.valid.hostname';

describe('integrate_index.js', function(){
    describe('remote data functions', function(){
        it('article will fail for an invalid url', function(){
            this.timeout(5000);
            var url = `http://${invalidHostname}/news/business-40658774`;
            return expect(article(url)).to.eventually.be.rejectedWith('Could not get article');
        });
        it('article will pass for an valid url', function(){
            this.timeout(5000);
            var url = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'Six million men and women';
            var testFunction = () => {
                return article(url)
                    .then(article => {
                        return article.slice(0, 25);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
        it('extractEntities will fail if the NER service is unavailable', function(){
            this.timeout(5000);
            var text = 'John Smith went to Tesco and bought spam';
            var connection = {port: 80, host: invalidHostname};
            return expect(extractEntities(text, connection)).to.eventually.be.rejectedWith('Could not reach NER service');
        });
        it('extractEntities will pass if the NER service is available', function(){
            this.timeout(5000);
            var text = 'John Smith went to Tesco and bought spam';
            var expected = {
                DATE:[],
                LOCATION:[],
                MONEY: [],
                ORGANIZATION: ['Tesco'],
                PERCENT: [],
                PERSON: ['John Smith'],
                TIME: []
            };
            return expect(extractEntities(text)).to.eventually.deep.equal(expected);
        });
    });
    describe('normalizeNews function', function(){
        it('works on a known BBC news article', function(){
            this.timeout(5000);
            var text = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'de in the Commons by the ORGANIZATION for Work and Pensions, PERSON.\n\nThey said the government had d';
            var testFunction = () => {
                return normalizeNews(text)
                    .then(article => {
                        return article.slice(350, 450);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
    });
});
