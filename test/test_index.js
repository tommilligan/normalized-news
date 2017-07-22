var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {normalize, normalizeNews} from '../src/index';

describe('index.js', function(){
    it('pass', function(){
        expect(true).to.be.true;
    });
    describe('normalize', function(){
        it('work on a text string', function(){
            var text = 'John Smith went to Tesco to buy carrots for dinner.';
            var expected = 'PERSON went to ORGANIZATION to buy carrots for dinner.';
            return expect(normalize(text)).to.eventually.equal(expected);
        });
    });
    describe('normalizeNews functions', function(){
        it('work on a known BBC news article', function(){
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
