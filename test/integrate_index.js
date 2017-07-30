var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {normalizeNews, normalize} from '../src/index';

describe('integrate_index.js', function(){
    describe('normalizeNews function', function(){
        it('should replace named entities and neutralize pronouns', function(){
            var text = 'She said that John Smith\'s company had decided to sue.';
            var expected = 'They said that Person-A\'s company had decided to sue.';
            return expect(normalize(text)).to.eventually.equal(expected);
        });
    });
    describe('normalizeNews function', function(){
        it('works on a known BBC news article', function(){
            this.timeout(5000);
            var text = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'de in the Commons by the Organization-Aquamarine for Work and Pensions, Person-A.\n\nThey said the governmen';
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
