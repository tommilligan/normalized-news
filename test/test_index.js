var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {normalize, anonymize, normalizeNews} from '../src/index';

describe('index.js', function(){
    it('pass', function(){
        expect(true).to.be.true;
    });
    describe('anonymize', function(){
        it('should replace named entities', function(){
            var text = 'John Smith went to Tesco to buy carrots for dinner.';
            var expected = 'PERSON went to ORGANIZATION to buy carrots for dinner.';
            return expect(anonymize(text)).to.eventually.equal(expected);
        });
    });
    describe('normalize', function(){
        it('should replace named entities and neutralize pronouns', function(){
            var text = 'She said that John Smith\'s company had decided to sue.';
            var expected = 'They said that PERSON\'s company had decided to sue.';
            return expect(normalize(text)).to.eventually.equal(expected);
        });
    });
    describe('normalizeNews functions', function(){
        it('work on a known BBC news article', function(){
            this.timeout(5000);
            var text = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'Six million men and women';
            var testFunction = () => {
                return normalizeNews(text)
                    .then(article => {
                        return article.slice(0, 25);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
    });
});
